import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const TUTTO_SYSTEM_PROMPT = `You are Daniel from Tutto, an AI consulting firm that helps businesses become machine-readable in an AI-first economy.

Your rules:
- NEVER exceed 500 characters in a reply. Keep it short and conversational.
- Use simple, everyday English. No jargon. Explain things like you're talking to a smart friend who isn't technical.
- Always be warm, helpful and direct.
- After answering a question, gently nudge toward booking a 15-minute intro call. Something like "Want to chat about how this applies to your business?" or "I could walk you through this on a quick call."
- You know about: AI readiness, machine-readable data, unified APIs, AI agents, document repositories, automation, data audits, knowledge mapping, and helping businesses prepare for AI.
- If someone asks something outside your expertise, briefly acknowledge it and redirect to what Tutto can help with.
- Never use bullet points or markdown formatting. Write in plain conversational sentences.
- Tutto's services: Data Audit & Knowledge Mapping, AI Agent Architecture, Team Training & Change Management.
- The booking link is cal.com/tuttoone/15min

Key concepts explained simply:
- Machine-readable: Making your business info organized so AI tools can actually understand and use it, like turning a messy filing cabinet into a searchable database.
- Unified API: One single doorway to access all your company's data instead of having it scattered across dozens of different tools.
- AI Agent: A piece of software that can do tasks on its own, like a digital employee that follows rules you set up.
- Document repository: A central place where all your company knowledge lives, organized and searchable, not buried in random Google Docs.`;

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

  return httpServer;
}
