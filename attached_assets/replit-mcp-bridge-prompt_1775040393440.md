# Replit Project Prompt

Build a single-page marketing/explainer site for a service called **"MCP Bridge"** by **Humanity³** (AI Consulting). The site explains what MCP (Model Context Protocol) is, why it matters for businesses, and showcases a real-world example: a SharePoint Bridge that lets Claude AI manage SharePoint and Power Automate through natural conversation.

## Design Direction

- Modern, clean, dark-mode-first design with a professional tech feel
- Brand colors: deep navy (#1B2A4A), electric blue (#2E86C1), white text, subtle gradients
- Monospace accents for technical elements, sans-serif (Inter or similar) for body
- Animated elements: subtle fade-ins on scroll, a terminal-style typing animation in the hero showing an example conversation
- Responsive — looks great on mobile and desktop
- No client names or sensitive info anywhere

## Page Structure

### Hero Section
Big headline: **"Give AI Direct Access to Your Business Tools"**
Subheadline: "MCP Bridge connects Claude, ChatGPT, and other AI assistants to the platforms your team already uses — SharePoint, Power Automate, Salesforce, databases, and more. No copy-pasting. No manual lookups. Just ask."

Include a terminal/chat mockup showing:
```
You: "Show me all active projects where budget exceeds $5,000"
Claude: [calls sp_items_query] Found 12 matching projects...
```

A subtle CTA button: "See How It Works" that scrolls down.

### What is MCP?
Explain MCP in plain language. Key points to cover:

- MCP (Model Context Protocol) is an open standard created by Anthropic and now backed by the Linux Foundation, OpenAI, Google DeepMind, and others
- Think of it as "USB-C for AI" — a universal plug that connects AI assistants to any external tool or data source
- Before MCP, every AI-to-tool integration was custom. MCP standardises this so one bridge works across Claude, ChatGPT, and other AI platforms
- There are already 500+ MCP servers covering platforms like Slack, Salesforce, GitHub, Google Drive, Jira, databases, and more
- MCP servers can be read-only (safe for browsing data) or read-write (for making changes with user approval)
- The AI assistant asks permission before taking write actions — you stay in control

Use a simple diagram/visual showing: AI Assistant ↔ MCP Protocol ↔ Your Business Tools (SharePoint, Salesforce, Databases, etc.)

### The Problem MCP Solves
Show a before/after comparison:

**Before MCP:**
- Copy data from SharePoint into a chat with AI
- AI gives advice but can't act on it
- Manually apply changes back in SharePoint
- AI gives outdated or incorrect answers about platform APIs
- Every integration is custom-built and breaks when APIs change

**After MCP:**
- Ask AI to query, create, or modify data directly
- AI pulls live documentation before answering technical questions
- Changes require your explicit approval
- One standard protocol — works across AI platforms
- New integrations take days, not months

### Real Example: SharePoint Bridge
This is the showcase section. Explain what the SharePoint MCP Bridge does specifically:

**"We built a bridge that lets AI talk directly to SharePoint and Power Automate."**

Show a grid/cards of capabilities:

**SharePoint Lists & Structure**
Create lists, add columns (text, number, lookup, calculated, person), set up entity relationships between lists, view full schemas

**Data Management**
Query items with filters and sorting, create/update/delete records, bulk-process data transformations

**Power Automate**
List flows, inspect definitions, view run history with error diagnostics, trigger manual flows

**Live Documentation**
AI searches current Microsoft docs before answering — no more outdated or incorrect guidance about SharePoint APIs and Power Automate connectors

Then show 3-4 example conversations in a chat-style UI:

1. "List all SharePoint lists on my site" → shows table of results
2. "Add a lookup column on Tasks pointing to the Clients list" → "Column 'Client' (lookup) added to Tasks list."
3. "Show me the last 10 failed Power Automate flow runs" → shows run history with error details
4. "What's the correct Graph API format for creating a calculated column?" → AI searches live docs, gives accurate current answer

### What Can We Connect?
Show a grid of logos/icons representing platforms MCP can bridge to. Categories:

- **Productivity:** SharePoint, Google Drive, Notion, Confluence
- **Project Management:** Jira, Linear, Asana, Monday.com
- **Communication:** Slack, Gmail, Microsoft Teams
- **Development:** GitHub, GitLab, Sentry, Supabase
- **Databases:** PostgreSQL, MongoDB, MySQL, Airtable
- **Finance:** Stripe, QuickBooks, Xero
- **CRM:** Salesforce, HubSpot
- **Custom:** Any platform with an API — we build custom MCP bridges

Include a note: "If it has an API, we can bridge it. The list grows every week."

### How Setup Works
Simple 3-step process with icons:

1. **We scope it** — Tell us which platforms you need connected and what actions matter. 30-minute call.
2. **We build it** — We configure authentication, deploy the bridge server, and test end-to-end. Typically 1-3 days.
3. **You connect** — Add the connector URL in Claude's settings. Start asking questions immediately. We provide a setup guide.

### Who Is This For?
Short section with 3-4 persona cards:

- **Operations teams** drowning in manual SharePoint/Excel data management
- **Agencies** managing client data across multiple platforms
- **Developers** tired of AI giving outdated API advice
- **Any team** that spends hours moving data between systems when AI could do it in seconds

### CTA / Contact
"Ready to connect your tools to AI?"
Contact form or email link to daniel@tutto.one
Mention: "First bridge setup includes a free consultation to scope your integration needs."

Branding: Humanity³ (AI Consulting) — humanity3.co.uk

### Footer
- Humanity³ branding
- "Built on the Model Context Protocol — an open standard by Anthropic, backed by the Linux Foundation"
- Link to modelcontextprotocol.io for the technically curious

## Technical Notes

- Use React or vanilla HTML/CSS/JS — whatever Replit handles best
- Smooth scroll between sections
- Intersection Observer for scroll animations
- The terminal/chat mockup in the hero should have a typing animation effect
- The example conversations section should feel like a real chat interface
- Make it feel premium — this is a consulting service, not a SaaS product
- No lorem ipsum — all copy should be real and polished
- Favicon: use a simple "H³" text or cube icon
