# Tutto - AI Consulting Chat-First Website

## Overview

Tutto is a chat-first consulting website for an AI consulting firm that helps businesses become "machine-readable" in an AI-first economy. The primary user experience is a conversational chat interface powered by a scripted state machine for guided flows, with Claude Haiku as a fallback for open-ended questions. Behind the chat layer sits a traditional website with pages for About, Services, Portfolio, Blog, and Contact — serving both as fallback navigation and for SEO purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with routes for Home, About, Services, Portfolio, Blog, Blog Posts, and Contact
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin) with CSS variables for theming. The design uses a warm, Claude-like color palette with Inter (sans) and Source Serif 4 (serif) fonts.
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives. Components live in `client/src/components/ui/`.
- **State Management**: TanStack React Query for server state; local React state for chat engine
- **Animations**: Framer Motion for chat message animations
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Chat System (Core Feature)
- **Scripted State Machine** (`client/src/lib/chat-data.ts`): Defines conversation flows as a record of steps with sequential messages and option buttons. This handles most interactions without any AI calls.
- **Chat Engine Hook** (`client/src/hooks/use-chat-engine.ts`): React hook that manages chat state, typing indicators, message sequencing with realistic delays, and option selection.
- **LLM Fallback** (`server/routes.ts`): When users type free-form text, messages are sent to `/api/chat` which calls Claude Haiku (claude-haiku-4-5) via the Anthropic SDK. The system prompt constrains responses to 500 characters, conversational tone, and nudges toward booking calls.
- **Chat Components**: `MessageBubble`, `InputBar`, `TypingIndicator` in `client/src/components/chat/`

### Backend Architecture
- **Runtime**: Node.js with Express, TypeScript compiled via tsx (dev) and esbuild (production)
- **Server Entry**: `server/index.ts` creates an HTTP server with JSON body parsing, request logging for `/api` routes, and error handling
- **Dev Mode**: Vite dev server is integrated as Express middleware (`server/vite.ts`) with HMR support
- **Production**: Static files served from `dist/public` with SPA fallback (`server/static.ts`)
- **Build Process**: `script/build.ts` runs Vite build for client, then esbuild for server, outputting to `dist/`

### API Routes
- `POST /api/chat` — Sends conversation messages to Claude Haiku (claude-haiku-4-5) and returns AI response. The system prompt enforces <500 char replies in plain English that guide users toward booking a consultation call. Conversation history is sent with each request for context.
- `POST /api/contact` — Saves contact form submissions to the database
- Additional conversation CRUD routes exist in `server/replit_integrations/chat/routes.ts` (get/create/delete conversations, send messages with AI response)

### Data Storage
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema** (`shared/schema.ts`): 
  - `contact_submissions` table: id (auto-increment), name, email, message, createdAt
  - Additional tables in `shared/models/chat.ts`: `conversations` (id, title, createdAt) and `messages` (id, conversationId, role, content, createdAt)
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Storage Layer** (`server/storage.ts`): `DatabaseStorage` class implementing `IStorage` interface for contact submissions

### Key Design Decisions
1. **Chat-first UX**: The homepage is entirely a chat interface rather than a traditional landing page. Traditional pages exist as fallback/SEO content.
2. **Hybrid chat approach**: Scripted flows handle common paths (cheaper, predictable), Claude Haiku handles open-ended questions (flexible but costs money).
3. **Monorepo structure**: Client, server, and shared code in one repo with shared TypeScript types via the `shared/` directory.
4. **SPA with Express backend**: Single-page app with API routes on the same server, rather than separate frontend/backend deployments.

## External Dependencies

### Third-Party Services
- **Anthropic Claude API**: Used for AI chat responses. Configured via `AI_INTEGRATIONS_ANTHROPIC_API_KEY` and `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` environment variables. Uses `claude-haiku-4-5` model.
- **Cal.com**: External booking link (`cal.com/tuttoone/15min`) referenced in chat responses for scheduling consultations.

### Database
- **PostgreSQL**: Required. Connection string provided via `DATABASE_URL` environment variable. Used with `pg` driver and Drizzle ORM.

### Key npm Packages
- `@anthropic-ai/sdk` — Anthropic API client
- `drizzle-orm` + `drizzle-zod` — ORM and schema validation
- `express` — HTTP server
- `wouter` — Client-side routing
- `@tanstack/react-query` — Server state management
- `framer-motion` — Animations
- `zod` — Runtime validation
- shadcn/ui ecosystem (Radix UI, class-variance-authority, tailwind-merge, clsx)

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic API base URL