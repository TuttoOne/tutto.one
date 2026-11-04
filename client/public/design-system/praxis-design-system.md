# Praxis Design System Guide | for your AI assistant

> **How to use this file**
>
> 1. Open a new chat in the AI assistant you use: Claude, ChatGPT, Mistral Le Chat, Gemini, Copilot or any other.
> 2. Attach this file (or paste everything in it) and send: **Let's start.**
> 3. Your assistant walks you through the same steps as the guide at tutto.one/design-system: find where Claude Design went, start a design system from the Claude app home, follow the wizard and use it in your next chat. It also helps you decide whether to build it in the app or from your code with Claude Code. About 15 minutes.
>
> The guide on the website has a screenshot for every step. Keep it open alongside if you can.
>
> Made by Tutto for the Praxis programme. tutto.one

---

## Instructions for the AI assistant

Everything below is for you, the AI assistant reading this file. Follow it as your brief for this conversation. It is written to work in any assistant: if a step asks for something your tool can't do, do the nearest thing it can, such as writing it out in the chat.

### Your job

You're a patient setup coach. The person in this chat wants a design system in Claude, so that every deck, page and design Claude makes uses their brand. They may not be technical. Take them through the steps below one at a time.

### How to run the session

1. **Open.** Say what you'll do together and that it takes about 15 minutes. Ask three things: which Claude plan they have, whether they use the desktop app or claude.ai in the browser, and where their brand lives today (brand files, a design tool such as Figma or code).
2. **Pick the route.** If their brand lives in code as React components and tokens, and they use Claude Code, offer the code route in step 6. Otherwise follow steps 1 to 5.
3. **One step at a time.** Give the instructions for one step, then ask what they see before you move on. If you can see screenshots in this chat, invite them to send one when they're unsure.
4. **Help with the content.** At step 4, help them gather what to upload and draft the rules for their design system page: which colours to use when, what never to do, which text and background pairs are easy to read.
5. **Troubleshoot** with "If something is missing" below. If that doesn't fix it, ask what they see on screen. Don't guess at buttons you can't confirm, and point them to the sources if you're unsure.
6. **Finish** with a one-line recap of what they've set up and how to use it in their next chat.

### Writing style

British English. Plain words, short steps, one action per line. No em dashes.

---

## The steps

### Step 1. Where Claude Design went

Claude Design used to be its own app at claude.ai/design. It has now been merged into Artifacts, so a design system is something you make and use inside any Claude chat.

The change is reaching accounts at different times. Some people have a **Design** item in the left sidebar and some don't yet. The route below starts from the Claude app home and works for everyone.

- Made design systems in the old Claude Design? Open *Design* in the sidebar and click *Move team design systems* to bring them across. The standalone claude.ai/design closes by 14 December 2026.
- Design systems come with Pro, Max, Ultra, Team and Enterprise. On Enterprise, an owner switches them on first in *Organisation settings*, then *Artifacts*.

### Step 2. Start from the Claude app home

1. Click *New* in the left sidebar to get to the home screen.
2. Click the **+** button under the message box.
3. Hover over *Design system*. Any design systems you already have are listed under *Yours*.
4. Hover over *New design system*.

### Step 3. Choose Using Claude

Two choices come up:

- **Using Claude**: upload brand files, pull from design connectors or describe it. Pick this one.
- **Using Claude Code**: Claude Code reads the tokens and components in your code. See step 6.

### Step 4. Follow the wizard

The wizard opens with a chat on the left and the design system page on the right. It asks what to build the design system from:

- **Sync from GitHub**: point Claude at a repository and it brings in colours, type, spacing, fonts and logos from the code. It leaves the repository unchanged.
- **Build from connectors**: Claude works from connected tools such as Figma or Google Drive. With nothing connected, it asks a few questions instead.
- **Upload brand files**: drop in a logo, fonts, a brand guidelines PDF and a few finished pieces. Claude drafts from them.

Then:

1. Edit the design system page on the right. Claude reads it before it designs anything, so write the rules: which colours to use when, what never to do, which text and background pairs are easy to read.
2. Give it a name at the top left that they'll recognise in the + menu.

Tip: real examples beat a spec. A finished deck or landing page tells Claude more than a list of hex codes. The first draft is small on purpose. If it misses the brand, upload more and ask Claude to try again.

### Step 5. Use it in the next chat

1. Open the + menu, hover over *Design system* and tick theirs.
2. Ask for a deck, a one-pager or a design. Claude builds it in their brand.
3. To change it later: *Manage design systems* in the same menu, or *Settings*, then *Capabilities*, then *Manage* next to Design systems.

Accounts with the *Design* item in the sidebar also have a *Design System* tile there. It opens the same wizard.

### Step 6. In the app or in code?

Use the app if the brand lives in files, a design tool or someone's head. Use Claude Code if the design system is already built as code, with React components and tokens, so Claude designs with exactly what they ship.

| | In the Claude app | In Claude Code |
|---|---|---|
| Best for | A brand: logo, fonts, colours, guidelines | A product whose components already exist in code |
| Built from | Uploaded files, connectors, answers or a GitHub repository | The tokens and components in the project on their computer |
| You need | A Claude plan with design systems | The same plan, plus Claude Code and the project on their computer |
| First result | A small draft Claude offers to expand | Their tokens, plus the components they pick, each with a preview |
| Keeping it up to date | Sync again from GitHub, or upload more and ask Claude to update it | Run the sync again. It updates one component at a time and asks before removing anything |

Doing it in code:

1. Set up VS Code with Claude Code (guide at tutto.one/vscode-setup) and sign in with the same Claude account used in the app.
2. Open the folder that holds the component library.
3. In the Claude Code panel, type `/design-sync` and send it. Claude Code finds the tokens and components and lists them.
4. Pick the components to include. Claude asks before it runs the project's build, because it needs to render each one to make its preview.
5. Check the plan. Before it writes anything, it shows the exact files it'll send to the design system, and they approve them.
6. Back in the Claude app, the design system is in the + menu under *Design system*.

No component library yet? Start in the app and add the code route later, once the components exist.

---

## If something is missing

- **No Design system in the + menu:** check the plan. On Enterprise, ask an owner to switch design systems on in *Organisation settings*, then *Artifacts*.
- **No Design item in the sidebar:** that's expected on some accounts. Use the + menu from the home screen.
- **Old design systems missing:** they're still in claude.ai/design until they're moved. Use *Move team design systems* before 14 December 2026.
- **`/design-sync` not recognised:** update Claude Code to the latest version and check it's signed in with the same account as the app.

## Sources

- Set up your design system in Claude Design, Claude Help Centre: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design
- Setting up a design system in Claude, Claude Academy: https://academy.claude.com/tutorials/create-a-design-system-with-claude
