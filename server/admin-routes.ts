import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { z } from "zod";
import { randomBytes } from "crypto";
import { insertBlogPostSchema, updateBlogPostSchema } from "@shared/schema";

const JWT_SECRET = (() => {
  if (process.env.ADMIN_JWT_SECRET) return process.env.ADMIN_JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: ADMIN_JWT_SECRET environment variable is required in production. Set it and restart.");
    process.exit(1);
  }
  const devSecret = randomBytes(32).toString("hex");
  console.warn("[admin] ADMIN_JWT_SECRET not set — using ephemeral dev secret (tokens won't survive restarts)");
  return devSecret;
})();
const JWT_EXPIRY = "24h";
const COOKIE_NAME = "admin_token";
const APP_NAME = "Tutto Admin";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { admin: boolean };
    if (!payload.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function registerAdminRoutes(app: Express) {
  // Setup status
  app.get("/api/admin/setup-status", async (req, res) => {
    try {
      const config = await storage.getAdminConfig();
      res.json({
        isSetupComplete: config?.isSetupComplete ?? false,
        hasConfig: !!config,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get setup status" });
    }
  });

  // Setup: POST creates admin password and generates TOTP secret
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const config = await storage.getAdminConfig();
      if (config?.isSetupComplete) {
        return res.status(403).json({ error: "Setup already complete" });
      }

      const { password } = z.object({ password: z.string().min(8) }).parse(req.body);
      const passwordHash = await bcrypt.hash(password, 12);
      const secret = speakeasy.generateSecret({ name: APP_NAME, length: 20 });

      if (config) {
        await storage.updateAdminConfig(config.id, { passwordHash, totpSecret: secret.base32 });
      } else {
        const newConfig = await storage.createAdminConfig(passwordHash);
        await storage.updateAdminConfig(newConfig.id, { totpSecret: secret.base32 });
      }

      const otpauthUrl = secret.otpauth_url!;
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

      res.json({ qrCode: qrCodeDataUrl, secret: secret.base32 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      console.error("Setup error:", error);
      res.status(500).json({ error: "Setup failed" });
    }
  });

  // Setup confirm: verify TOTP and lock setup
  app.post("/api/admin/setup/confirm", async (req, res) => {
    try {
      const config = await storage.getAdminConfig();
      if (!config) {
        return res.status(400).json({ error: "Setup not started" });
      }
      if (config.isSetupComplete) {
        return res.status(403).json({ error: "Setup already complete" });
      }
      if (!config.totpSecret) {
        return res.status(400).json({ error: "TOTP not configured" });
      }

      const { token } = z.object({ token: z.string().length(6) }).parse(req.body);
      const verified = speakeasy.totp.verify({
        secret: config.totpSecret,
        encoding: "base32",
        token,
        window: 1,
      });

      if (!verified) {
        return res.status(400).json({ error: "Invalid TOTP code" });
      }

      await storage.updateAdminConfig(config.id, { isSetupComplete: true });
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid token format" });
      }
      console.error("Setup confirm error:", error);
      res.status(500).json({ error: "Confirmation failed" });
    }
  });

  // Login step 1: verify password
  app.post("/api/admin/login/password", async (req, res) => {
    try {
      const config = await storage.getAdminConfig();
      if (!config?.isSetupComplete) {
        return res.status(403).json({ error: "Admin not configured" });
      }

      const { password } = z.object({ password: z.string() }).parse(req.body);
      const valid = await bcrypt.compare(password, config.passwordHash);

      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Issue a short-lived temp token for the TOTP step
      const tempToken = jwt.sign({ step: "totp" }, JWT_SECRET, { expiresIn: "5m" });
      res.json({ tempToken });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request" });
      }
      console.error("Login password error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Login step 2: verify TOTP and issue JWT cookie
  app.post("/api/admin/login/totp", async (req, res) => {
    try {
      const config = await storage.getAdminConfig();
      if (!config?.isSetupComplete || !config.totpSecret) {
        return res.status(403).json({ error: "Admin not configured" });
      }

      const { token: totpCode, tempToken } = z.object({
        token: z.string().length(6),
        tempToken: z.string(),
      }).parse(req.body);

      // Verify temp token
      let payload: { step: string };
      try {
        payload = jwt.verify(tempToken, JWT_SECRET) as { step: string };
      } catch {
        return res.status(401).json({ error: "Session expired, please re-enter your password" });
      }
      if (payload.step !== "totp") {
        return res.status(401).json({ error: "Invalid session" });
      }

      const verified = speakeasy.totp.verify({
        secret: config.totpSecret,
        encoding: "base32",
        token: totpCode,
        window: 1,
      });

      if (!verified) {
        return res.status(401).json({ error: "Invalid authenticator code" });
      }

      const adminToken = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

      res.cookie(COOKIE_NAME, adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request" });
      }
      console.error("Login TOTP error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout
  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  // Check auth status
  app.get("/api/admin/me", requireAdmin, (req, res) => {
    res.json({ authenticated: true });
  });

  // ── Blog CRUD (protected) ────────────────────────────────────────

  app.get("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts(false);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      console.error("Create post error:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.put("/api/admin/blog/:slug", requireAdmin, async (req, res) => {
    try {
      const data = updateBlogPostSchema.parse(req.body);
      const post = await storage.updateBlogPost(String(req.params.slug), data);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      console.error("Update post error:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/admin/blog/:slug", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(String(req.params.slug));
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // ── Site content (protected) ────────────────────────────────────

  app.get("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    try {
      const content = await storage.getSiteContent(String(req.params.key));
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.put("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    try {
      const { value } = z.object({ value: z.string() }).parse(req.body);
      const content = await storage.upsertSiteContent(String(req.params.key), value);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data" });
      }
      console.error("Update site content error:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });
}
