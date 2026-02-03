export type MessageType = "text" | "options" | "system";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatOption {
  label: string;
  value: string;
  action?: () => void;
}

export interface FlowStep {
  id: string;
  messages: string[]; // Array of messages to send sequentially
  options?: ChatOption[];
  next?: string; // Default next step if no option selected (usually undefined for options)
}

export const CHAT_FLOWS: Record<string, FlowStep> = {
  start: {
    id: "start",
    messages: [
      "Hi, I'm Daniel from HumanITy.",
      "We help businesses become machine-readable in an AI-first economy.",
      "How can I help you today?"
    ],
    options: [
      { label: "Learn about AI Readiness", value: "readiness" },
      { label: "Run a quick diagnostic", value: "diagnostic_start" },
      { label: "Talk to HumanITy", value: "contact" }
    ]
  },
  readiness: {
    id: "readiness",
    messages: [
      "AI readiness isn't just about having the latest tools.",
      "It's about having structured, accessible data that machines can actually understand.",
      "Most companies are sitting on a goldmine of unstructured data that AI simply can't read."
    ],
    options: [
      { label: "Tell me more", value: "readiness_more" },
      { label: "Back to start", value: "start" }
    ]
  },
  readiness_more: {
    id: "readiness_more",
    messages: [
      "To be 'machine-readable', your internal knowledge needs to be documented, API-accessible, and logically structured.",
      "I help companies audit their information architecture to prepare for this transition."
    ],
    options: [
      { label: "How do we start?", value: "diagnostic_start" },
      { label: "I want to book a call", value: "contact" }
    ]
  },
  diagnostic_start: {
    id: "diagnostic_start",
    messages: [
      "Let's run a quick 3-question diagnostic to see where you stand.",
      "Question 1: Do you have a central documentation repository (like Notion, Confluence) that is actively maintained?"
    ],
    options: [
      { label: "Yes, it's our bible", value: "diag_q2_good" },
      { label: "Sort of, but it's messy", value: "diag_q2_ok" },
      { label: "No, knowledge is in heads", value: "diag_q2_bad" }
    ]
  },
  diag_q2_good: {
    id: "diag_q2_good",
    messages: ["That's a great start. Question 2: Is your customer data accessible via a unified API?"],
    options: [
      { label: "Yes", value: "diag_q3" },
      { label: "No, it's siloed", value: "diag_q3" }
    ]
  },
  diag_q2_ok: {
    id: "diag_q2_ok",
    messages: ["Common scenario. Question 2: Is your customer data accessible via a unified API?"],
    options: [
      { label: "Yes", value: "diag_q3" },
      { label: "No, it's siloed", value: "diag_q3" }
    ]
  },
  diag_q2_bad: {
    id: "diag_q2_bad",
    messages: ["I see. That's the first bottleneck we'd need to address. Question 2: Is your customer data accessible via a unified API?"],
    options: [
      { label: "Yes", value: "diag_q3" },
      { label: "No, it's siloed", value: "diag_q3" }
    ]
  },
  diag_q3: {
    id: "diag_q3",
    messages: ["Last question: Have you automated any core business processes with AI agents yet?"],
    options: [
      { label: "Yes, fully automated", value: "result_advanced" },
      { label: "Experimenting now", value: "result_intermediate" },
      { label: "Not yet", value: "result_beginner" }
    ]
  },
  result_advanced: {
    id: "result_advanced",
    messages: [
      "Impressive. You seem to be well on your way.",
      "At this stage, optimization and governance become the key challenges.",
      "I'd love to hear what you're building."
    ],
    options: [
      { label: "Book a chat", value: "contact" },
      { label: "Back to start", value: "start" }
    ]
  },
  result_intermediate: {
    id: "result_intermediate",
    messages: [
      "You're in the 'Messy Middle'. This is where most valuable work happens.",
      "Structuring your data now will pay massive dividends as you scale these experiments."
    ],
    options: [
      { label: "Get help with this", value: "contact" },
      { label: "Back to start", value: "start" }
    ]
  },
  result_beginner: {
    id: "result_beginner",
    messages: [
      "You have a blank canvas. That's actually an advantage.",
      "You can build 'AI-First' from day one without fighting decades of legacy debt.",
      "Start by documenting your core processes."
    ],
    options: [
      { label: "How can you help?", value: "services" },
      { label: "Back to start", value: "start" }
    ]
  },
  contact: {
    id: "contact",
    messages: [
      "I'm currently taking on a limited number of consulting engagements.",
      "You can book a 15-minute intro chat directly on my calendar.",
      "[Calendly Link Placeholder]"
    ],
    options: [
      { label: "Open Calendar", value: "open_calendar" },
      { label: "Maybe later", value: "start" }
    ]
  },
  services: {
    id: "services",
    messages: [
      "I offer three main services:",
      "1. **Data Audit**: Mapping your knowledge for AI consumption.",
      "2. **Agent Architecture**: Designing the workflows for your AI workforce.",
      "3. **Team Training**: Teaching your humans to manage machines."
    ],
    options: [
      { label: "Let's talk", value: "contact" },
      { label: "Back to start", value: "start" }
    ]
  }
};

export const BLOG_POSTS = [
  {
    slug: "why-machine-readable-matters",
    title: "Why 'Machine-Readable' is the New 'Mobile-Friendly'",
    excerpt: "In 2010, you needed a responsive site. In 2024, you need responsive data.",
    date: "Oct 12, 2024",
    readTime: "5 min read"
  },
  {
    slug: "the-messy-middle-of-automation",
    title: "The Messy Middle of Automation",
    excerpt: "Why 90% of AI pilots fail to scale beyond the founder's laptop.",
    date: "Sep 28, 2024",
    readTime: "4 min read"
  },
  {
    slug: "documentation-is-code",
    title: "Documentation is Code",
    excerpt: "Treating your company wiki like a production database.",
    date: "Sep 15, 2024",
    readTime: "6 min read"
  }
];
