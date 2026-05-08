import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertEmailLeadSchema } from "@shared/schema";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "daniel@tutto.one";
const FROM_EMAIL = "Tutto <notifications@tutto.one>";

const TUTTO_SYSTEM_PROMPT = `You are Daniel from Tutto, an AI consulting firm that helps businesses become machine-readable in an AI-first economy.

Your rules:
- NEVER exceed 500 characters in a reply. Keep it short and conversational.
- Use simple, everyday English. No jargon. Explain things like you're talking to a smart friend who isn't technical.
- Always be warm, helpful and direct.
- After answering a question, gently nudge toward booking a 15-minute intro call. Something like "Want to chat about how this applies to your business?" or "I could walk you through this on a quick call."
- You know about: AI readiness, machine-readable data, unified APIs, AI agents, document repositories, automation, data audits, knowledge mapping, and helping businesses prepare for AI.
- If someone asks something outside your expertise, briefly acknowledge it and redirect to what Tutto can help with.
- Never use bullet points or markdown formatting. Write in plain conversational sentences.
- NEVER include any URLs or links in your replies. No website addresses, no booking links, nothing. The user interface has buttons for booking calls — just suggest they use those buttons instead of providing a link.
- Tutto's services: Data Audit & Knowledge Mapping, AI Agent Architecture, Team Training & Change Management.

Key concepts explained simply:
- Machine-readable: Making your business info organized so AI tools can actually understand and use it, like turning a messy filing cabinet into a searchable database.
- Unified API: One single doorway to access all your company's data instead of having it scattered across dozens of different tools.
- AI Agent: A piece of software that can do tasks on its own, like a digital employee that follows rules you set up.
- Document repository: A central place where all your company knowledge lives, organized and searchable, not buried in random Google Docs.`;

async function sendNotificationEmail(subject: string, html: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array required" });
      }

      const chatMessages = messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        system: TUTTO_SYSTEM_PROMPT,
        messages: chatMessages,
      });

      const content = response.content[0];
      const text = content.type === "text" ? content.text : "";
      res.json({ reply: text });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to get response" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);

      await sendNotificationEmail(
        `New enquiry from ${data.name}`,
        `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f1ea;">
            <div style="background: #1a1a1a; border-radius: 10px; padding: 28px; margin-bottom: 24px;">
              <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">New Tutto Enquiry</p>
              <h2 style="color: #f6f1ea; font-size: 22px; margin: 0;">${data.name}</h2>
              <p style="color: rgba(246,241,234,0.5); font-size: 13px; margin: 4px 0 0;">${data.email}</p>
            </div>
            <div style="background: #fff; border-radius: 10px; padding: 24px; border: 1px solid #d8d0c5;">
              <p style="color: #a8a092; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 10px;">Message</p>
              <p style="color: #1a1a1a; font-size: 14px; line-height: 1.75; margin: 0; white-space: pre-line;">${data.message}</p>
            </div>
            <p style="color: #a8a092; font-size: 11px; margin: 20px 0 0; text-align: center;">Tutto · tutto.one</p>
          </div>
        `
      );

      res.json({ success: true, submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Contact submission error:", error);
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Get all contact submissions (for admin view - would add auth in production)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Email lead capture (SharePoint page)
  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertEmailLeadSchema.parse(req.body);
      const lead = await storage.createEmailLead(data);

      await sendNotificationEmail(
        `New lead: ${data.email}`,
        `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f1ea;">
            <div style="background: #1a1a1a; border-radius: 10px; padding: 28px; margin-bottom: 24px;">
              <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">New Lead Capture</p>
              <h2 style="color: #f6f1ea; font-size: 22px; margin: 0;">${data.email}</h2>
              ${data.name ? `<p style="color: rgba(246,241,234,0.5); font-size: 13px; margin: 4px 0 0;">${data.name}</p>` : ""}
            </div>
            ${data.company ? `
            <div style="background: #fff; border-radius: 10px; padding: 24px; border: 1px solid #d8d0c5;">
              <p style="color: #a8a092; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 10px;">Company</p>
              <p style="color: #1a1a1a; font-size: 14px; margin: 0;">${data.company}</p>
            </div>
            ` : ""}
            <p style="color: #a8a092; font-size: 11px; margin: 20px 0 0; text-align: center;">Tutto · tutto.one</p>
          </div>
        `
      );

      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Lead capture error:", error);
        res.status(500).json({ error: "Failed to capture lead" });
      }
    }
  });

  return httpServer;
}
