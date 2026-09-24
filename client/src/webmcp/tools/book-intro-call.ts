import { defineTool } from "@nekuda/webmcp-sdk";

/** The same booking link the chat engine and the home/contact CTAs use. */
const BOOKING_URL = "https://cal.com/tuttoone/15min";

export const bookIntroCall = defineTool({
  stableKey: "tutto.book_intro_call",
  name: "book_intro_call",
  title: "Open the intro call booking page",
  description:
    "Open Tutto's booking page for a free 15-minute intro call with Daniel. Use this when the visitor wants to talk to someone, book time, or asks how to get started. The visitor picks the slot and confirms on the booking page themselves. This tool only opens it, in the current tab. Returns the booking URL.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  annotations: { readOnlyHint: false },
  async execute() {
    // A popup is blocked when an agent calls this (no user gesture), so hand off
    // by navigating this tab — the visitor picks and confirms the slot on Cal.com.
    window.location.assign(BOOKING_URL);
    return {
      status: "booking_page_opened",
      bookingUrl: BOOKING_URL,
      note: "The visitor chooses a slot and confirms on the booking page. Nothing is booked until they do.",
    };
  },
});
