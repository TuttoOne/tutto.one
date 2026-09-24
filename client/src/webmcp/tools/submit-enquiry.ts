import { defineTool } from "@nekuda/webmcp-sdk";
import { toast } from "@/hooks/use-toast";

type SubmitEnquiryInput = {
  name: string;
  email: string;
  message: string;
};

export const submitEnquiry = defineTool({
  stableKey: "tutto.submit_enquiry",
  name: "submit_enquiry",
  title: "Send an enquiry to Tutto",
  description:
    "Send an enquiry to Tutto on the visitor's behalf, the same intake the forms on the Praxis and trainer pages use. Use this when the visitor wants Daniel to get in touch, asks to be contacted, or wants to apply to a programme. Requires their real name, email and a message describing what they want; ask them for these rather than inventing them. This delivers the message to Tutto immediately and cannot be unsent. Returns a confirmation.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The visitor's name, as they gave it.", minLength: 1 },
      email: { type: "string", description: "The visitor's email address.", format: "email" },
      message: {
        type: "string",
        description: "What the visitor wants: their question, context, or which programme they are asking about.",
        minLength: 1,
      },
    },
    required: ["name", "email", "message"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: false },
  async execute({ name, email, message }: SubmitEnquiryInput) {
    // The server schema stores these as plain strings, so mirror the validation
    // the site's own forms get from `required` / `type="email"` here.
    if (!name?.trim()) throw new Error("submit_enquiry needs the visitor's name");
    if (!message?.trim()) throw new Error("submit_enquiry needs a message describing what the visitor wants");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? "")) {
      throw new Error(`submit_enquiry needs a valid email address, got "${email}"`);
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
    });
    if (!res.ok) {
      const detail = (await res.text()) || res.statusText;
      throw new Error(`submit_enquiry failed: HTTP ${res.status} ${detail}`);
    }
    await res.json();

    toast({
      title: "Enquiry sent to Tutto",
      description: `Daniel will reply to ${email.trim()}.`,
    });

    return {
      status: "sent",
      sentTo: "Tutto (daniel@tutto.one)",
      replyTo: email.trim(),
      note: "The enquiry has been delivered and cannot be unsent. Offer book_intro_call if the visitor would rather talk sooner.",
    };
  },
});
