// ─────────────────────────────────────────────────────────────────────────────
// Praxis handouts, rewritten as blog posts (17 Nov 2026).
//
// Each one starts life as a handout for a client cohort on /learn. The blog
// version keeps the teaching and takes out everything about the client: names,
// their cases and files, session dates and places. Before adding another,
// grep the content for client names, people's names and dates.
//
// Spread into BLOG_SEED_DATA in seed-blog.ts, so the same backtick rule applies:
// a literal backtick inside `content` must be written as \` .
// ─────────────────────────────────────────────────────────────────────────────

const HANDOUT_DATE = "Nov 17, 2026";

export const HANDOUT_POSTS = [
  {
    // From /sandbox-to-live, which is written for any team and has no client detail.
    slug: "from-sandbox-to-live",
    title: "From your sandbox to something customers use",
    excerpt: "Teams can build their own tools now. The question we hear in every company is how to do that without breaking the systems everyone already relies on. Build in one place and use in another, with someone who checks each tool before it moves across.",
    date: HANDOUT_DATE,
    readTime: "5 min read",
    introCard: null as string | null,
    published: true,
    content: `Your team can build its own tools now. The worry we hear in every company is how to do that without breaking the systems everyone already relies on. The answer is to build in one place and use in another, with someone who checks each tool before it moves across.

## The four places a tool lives

Two places to build and try things, then one check and the live system. A tool only ever moves left to right.

[VISUAL:four-places]

## The words we use, and IT's words

Engineers say development and production. Most of the people building tools now aren't engineers, so we use plain names. Keep this list for when you talk to IT or a supplier.

- **My sandbox** is what IT calls local development: folders on your computer where you try things with Claude.
- **Team sandbox** is a development or staging server: a shared copy the whole team can open, use and test, inside the company.
- **The check** is review, QA or release approval: someone who didn't build the tool looks at it and signs it off.
- **Live** is production: the version customers and colleagues rely on every day, with real information in it.

## What happens in each place

The further right, the more people depend on it, so the more care it gets.

- **In your sandbox** you use samples and the documents you're allowed to use. If it breaks you start again and nobody notices. The work is a folder on your computer and you look after it.
- **In the team sandbox** real documents can be used, and they stay inside the organisation. Nothing is public. If it breaks the team waits while it's fixed. The work is kept in a GitHub repository in your organisation's account, and each tool has one named owner.
- **Live** has real customers, real workflows and real information. If it breaks, customers notice. It runs the signed-off version from that same repository, and your IT team looks after it, or we do until you have someone.

## Where the team sandbox runs

As soon as a tool is for more than one person, it needs somewhere shared to run. There are two ways to do it, and the code lives in your GitHub organisation either way.

### A private server online

A server rented in Europe, only reachable with your team's logins, paid monthly. It works from home, other offices and on the road, and there's nothing to buy. Your documents sit with a hosting company, so it goes in your data records.

### A machine in the office

A box such as an NVIDIA DGX Spark or a Mac Studio, on your own network. It can run AI models itself and it's bought once. Sensitive documents never leave the building and the whole team shares one machine. You have hardware to buy and a cupboard to lock.

## The check before anything goes live

Five questions. A tool goes live when all five have a yes and someone has signed for it.

1. **Data.** What does it read, where does that go and who can see it? Does it match your AI charter?
2. **Security.** Logins for each person, no passwords or keys inside the code, and only the right people can change it.
3. **Connections.** If it touches an older system (accounts, stock, the CRM), it has been tested on a copy first and it reads before it ever writes.
4. **It does the job.** It passes its scorecard on real examples, checked by the people who'll use it.
5. **An owner and a way back.** One named person looks after it, and if something goes wrong we can switch back to the last good version in minutes.

## Who signs it off

If you have an IT team, they sign. We prepare the sign-off pack with your team (what the tool does, the five answers, the test results) so IT can review it quickly and say yes or ask for changes.

If you don't, I take responsibility for the sign-off. When a tool needs more than I can check, I bring in a specialist in security or data protection, or someone who knows your older systems inside out.

The person who signs is never someone who built the tool. They come to it fresh from outside the team and check what it does with real information before your customers see it.

## Step by step, from idea to live

Step 1 is what we do in the Praxis programme. Steps 2 to 6 are where you might want a hand.

[VISUAL:road-to-live]

## Why it's worth setting up

Building on laptops is where every team starts, and it works for one person. The moment a tool is shared without a team sandbox, it runs on one laptop and stops when that person is away. Copies get emailed round and nobody knows which one is right. A quick fix goes straight to the people using it, and IT finds out last and says no.

With a team sandbox and a check, everyone uses the same version from wherever they work. Every change has a name, a reason and a way back. Testing happens where customers can't see it, and IT gets a pack they can say yes to.

We set up the team sandbox with you, run the check and the move to live for each tool, find specialists when you need them and look after it monthly if you want. The first step is to pick the one tool your team most wants to share. We look at it together for an hour, and I come back with a quote for the team sandbox and its first sign-off. [Get in touch](/contact).`,
  },
  {
    // From /session-2. The firm in it, Fenwick & Rowe, is made up.
    slug: "define-good-before-you-hand-it-over",
    title: "Define good before you hand a job to AI",
    excerpt: "Before you hand a job to AI, you need to know what a good result looks like. Point Claude at the right file, write your brand down once, check a PDF, a workbook and a Word letter the way you'd check a new colleague's work, then turn what you checked into a scorecard.",
    date: HANDOUT_DATE,
    readTime: "6 min read",
    introCard: null as string | null,
    published: true,
    content: `Before you hand a job to AI, you need to know what a good result looks like. In session 2 of the Praxis programme we watch Claude make real files in VS Code (a PDF, a spreadsheet, a Word letter and a chart) and check each one the way you'd check a new colleague's work. You leave with a brand file Claude reads every time, and a scorecard for one job that repeats.

The working example is Fenwick & Rowe, a made-up advisory firm.

## Point Claude at the file

"Summarise the Q3 accounts" makes Claude guess which file you mean. Name the file and it reads that one, and it can tell you which page each number came from. In VS Code there are three ways to do it:

- **Type @ and the file name.** Start typing @q3 in the Claude box and pick the file from the list. It works for folders too: @sources/
- **Send the open file.** With a file open, press Option K on a Mac or Alt K on Windows. Select some lines first and it sends just those.
- **Copy the path.** Right-click any file, choose Copy Relative Path and paste it into your message.

Then give the folder a rules file, \`CLAUDE.md\`. Claude reads it at the start of every conversation in that folder, so the rules apply to every job without you typing them again. Fenwick & Rowe's says:

> Before you make any document, read brand/BRAND.md and follow it.
> Every number says the file and page it came from.
> Can't find it? Write [NOT IN SOURCE]. Not sure? Write [CHECK].
> Save finished files in output/. Never write over a file in sources/.
> Write like our past letters in brand/examples.

## Your brand, written down once

A design system sounds grand. For us it's one file, brand/BRAND.md, that says what your documents look like and how you write: colours as hex codes, fonts, where the logo goes, page layout, how charts look and your voice. Claude builds it from documents you already have, and every PDF, sheet and chart after that comes out in your colours.

> Look at the documents in @brand/examples/ and write brand/BRAND.md: our colours as hex codes, fonts, where the logo goes, page layout, how charts should look and how we write. Ask me about anything you can't tell from the files.

## Three files, and what good looks like

Claude can read and make PDFs, Excel workbooks and Word documents. A file that opens isn't the same as a file you'd send, so here's what we check before it goes anywhere.

### Read a PDF, make a PDF

> Read @sources/q3-accounts.pdf. Give me revenue, margin and cash, each with its page number. Then make a one-page summary following @brand/BRAND.md.

Good looks like: every number has a page and the page says that number, anything missing says [NOT IN SOURCE], and it fits on one page in your colours. Watch for numbers rounded differently from the accounts, and text cut off at the bottom.

### Build a workbook

> Turn @sources/q3-transactions.csv into a workbook: a tab per month, a summary tab with formulas, headers in our brand green.

Good looks like: click a total and you see a formula like =SUM, the total matches the accounts and a Notes tab says where the data came from. Watch for totals typed in as plain numbers, and #REF! or #VALUE! anywhere.

### Draft in your template

> Draft the Q3 client letter in @templates/client-letter.docx using the summary. Keep our styles. Put anything you're unsure of in a comment.

Good looks like: headings use the template's styles, it reads like your past letters and doubts sit in comments, out of the text. Watch for "I hope this finds you well" and bold or font sizes typed in by hand.

To make Excel and Word files, Claude writes a short script and asks to run it. Read what it says it will do, then say yes. Open every file before you trust it.

## The same chart, twice

Same data, same request, one with the brand file and a clear brief. The first try, "make a chart of the report hours", came back titled "Chart 1", in six colours, with an axis starting at 2 that made one bar look 24 times shorter than another when the real gap was about 3 times.

[VISUAL:same-chart-twice]

The second follows five rules:

- The title says what happened: "Report time down from 6.5 to 2.2 hours".
- Colours mean something: grey for before, green for after.
- Values sit on the bars, so nobody reads numbers off an axis.
- The axis starts at zero.
- A source line says where it's from, so anyone can check it.

> Make a bar chart of report hours by month from @output/run-log.xlsx. Follow @brand/BRAND.md. Title it with what the data shows, put the value on each bar, start the axis at zero and add a source line underneath. Save it as a PNG in output/.

## From examples to a scorecard

Everything we checked becomes a scorecard: the standard every piece of AI work on that job gets judged against. Each check is something a colleague could tick without asking you. Here's the one for Fenwick & Rowe's monthly client summary:

[VISUAL:scorecard]

"No invented facts" is always check number one.

> I do this job every [week / month]: [describe it]. Here's a good example I made: @[file]. Help me write 5 checks for a good result. Each check needs a way to test it and a clear pass. "No invented facts" is check 1.

Build your own with the [agent scorecard tool](/agent-scorecard), and use redacted or dummy files until your AI policy is agreed.`,
  },
  {
    // From /hsa-session-2, with the client, its course and its people taken out.
    slug: "getting-your-content-ready-for-ai",
    title: "Getting your training content ready for AI",
    excerpt: "Before AI can help you remap a course or match old material to a new curriculum, it needs to know what each part of a guide is. Three steps: from the guide as it is, to clean text, to tagged parts you can check.",
    date: HANDOUT_DATE,
    readTime: "3 min read",
    introCard: null as string | null,
    published: true,
    content: `Training teams keep asking the same thing: can AI help us move our old material onto a new curriculum? It can, but before it helps with the remap it needs to know what each part of a guide is. We do this with every content team we train, and it starts with the guides you already have.

## Three steps

[VISUAL:three-steps]

The guide as it is means the resource guide, learner guide and memo in Word. For the clean text, tables become plain lists and page furniture comes out. Each tagged part carries a label saying where it sits in the qualification, what it teaches and how much it's worth.

Once every part is tagged, the AI can match old units to new modules and you can check each match.

## The six tags

Two say where a part sits, two say what it teaches and two say what it's worth.

- **module:** the old and new code.
- **unit:** the topic or unit inside the module.
- **outcome:** what the learner can do after it, in the curriculum's words.
- **assessment:** the criteria it's assessed against, and how (multiple choice, activity, workplace).
- **credits:** from the curriculum document.
- **hours:** notional hours, usually 10 per credit.

Agree the final list as a team. If something in your guides doesn't fit a tag, write it down, because that's what you need to talk about.

## What a tagged part looks like

One label per part, then the guide's own words underneath, exactly as they are. A tag that isn't in the guide says MISSING. That's a good sign: it means the AI didn't guess. Every part also carries its source, the guide and the pages it came from, so anyone can go back and check.

[VISUAL:tagged-part]

## Three prompts, in order

Swap [X] for the section you're on.

> Summarise section [X] of the resource guide in about 150 words. After each point, quote the sentence from the guide it comes from.

> Split this guide into its units. Give each part these tags: module, unit, outcome, assessment, credits, hours, source page. Use only what is in the guide and the curriculum. If a tag isn't there, write MISSING.

> For every tag you filled in, show me the exact sentence in the guide or curriculum it came from, with the page number. Mark any tag you can't back up.

## Before you trust it

- Open the page it quotes and read the line yourself.
- Check credits and hours against the curriculum, every time.
- Keep learner names, ID numbers and marks out of it.
- Mark anything the AI drafted as AI-assisted. You stay responsible for it.

The next step is the remap itself: load the old and new curriculum and have the AI draft the crosswalk from your tagged parts, with every match pointing back to its source. If your team has a remap coming, [get in touch](/contact).`,
  },
  {
    // From /bi-session-4 (the folder, voice, scorecard and PDF parts), client cases taken out.
    slug: "write-it-down-once",
    title: "Write it down once, so it's right every time",
    excerpt: "The result is as good as what you put in the folder and what you write down once. One folder per job, a CLAUDE.md with your voice, scorecards from simple to measured, and PDFs turned into text before Claude works on them.",
    date: HANDOUT_DATE,
    readTime: "6 min read",
    introCard: null as string | null,
    published: true,
    content: `In every team we train, the first tools people build show the same thing. The result is as good as what you put in the folder and what you write down once.

A sample report does most of the work. Put all the documents for a job in one folder, add one past report as the example and ask Claude to copy the format and write in your style, and the first draft usually gets the style and the layout right. Then two things go wrong. Asking it to "check your work" still leaves small mistakes, because a general check isn't enough: the checks need writing down one by one. And when you ask it to add something, it often writes far more than you need. Both are fixed by writing things down.

## One folder per job

The case folder changes every time. The starting context and your design system stay in one place and get linked in, so you only keep one copy of each.

[VISUAL:one-folder-per-job]

Don't worry about getting the layout perfect. Use it, change it and tidy it with Claude when it gets messy.

## CLAUDE.md and your voice

Claude reads \`CLAUDE.md\` on its own before it does anything in that folder, in every new chat. Keep the name exactly, and copy it into each folder where you want the same rules.

Whatever you keep correcting by hand belongs in this file. If it writes too much, have it describe a short piece of your writing and turn that description into instructions for itself. It understands its own words best, so let it write them and you approve them.

> Read the short report in examples/. Describe how it's written: sentence length, how much detail, how it opens and closes. Then write instructions for yourself that make your writing as short as this, and add them to CLAUDE.md for me to approve.

> When you add anything to a report I've written, highlight it so I can see what's yours. Add this rule to CLAUDE.md.

When results start to get worse in a long chat, start a new one. It begins again from \`CLAUDE.md\` with a clean head. Every few months, give your old .md files back to Claude and ask it to make them shorter and easier to use. The tools change, so your files should too.

## Scorecards, from simple to measured

A scorecard is the job description you'd give a new hire, with the KPIs you'd judge them on. It's as small or as big as the job needs.

[VISUAL:scorecard-ladder]

A list is one to ten things a good draft has, and you check it yourself as you read. Checks with a number are for review work where a client will spot a gap: give it a threshold and a way to count. A table it fills in first (counting the documents, listing the key facts, flagging the holes) is what an agent runs on its own across several cases.

How hard you check depends on the report. On a long report, check the key issues and findings. On a short one, check every detail, because the client accepts fewer mistakes.

The best scorecards come from your own corrections. Give back the revised version and say why you changed it, the way you'd brief a subcontractor. You can dictate it.

> My corrected version is in output/final.docx. Compare it with your draft. I changed it because <say why>. Update SCORECARD.md so the next draft passes these checks without me making the same changes.

The [agent scorecard tool](/agent-scorecard) walks you through your first one.

## PDFs into text

PDFs are messy underneath, so Claude has to guess at what's in them and can leave things out. They're also heavy, and copying them into every case folder adds up fast. Have Claude convert each one to a text (.md) file once, then check the text against the original.

> Convert every PDF in sources/ to a .md file with the same name. Keep the tables as tables. Then compare each .md with its PDF and list anything missing: pages, tables, numbers, footnotes.

For work that has to be complete, like litigation, put the comparison in your scorecard so it runs every time.

## Link it, don't copy it

A workspace in VS Code lets each case see your starting-context folder without copying it. Open the case folder, drag starting-context/ into the side panel and choose Add Folder to Workspace. Save the workspace when you close. Change a file in starting-context/ and every case that links it sees the change. The [workspaces guide](/workspaces) has a screenshot for every step, and the [design system guide](/design-system) does the same for your brand.

Use redacted, dummy or public material until your AI policy is agreed.`,
  },
  {
    // From /hsa-session-4 (the architecture, paths, voice.md and settings parts), people and their work taken out.
    slug: "where-claude-looks-for-your-rules",
    title: "Where Claude looks for your rules",
    excerpt: "Rules sit at different levels, like a company handbook, a department's way of working and the brief for one job. The level you put a rule at decides which work it applies to. Here's the map, where each file lives and when a rule belongs in settings.",
    date: HANDOUT_DATE,
    readTime: "6 min read",
    introCard: null as string | null,
    published: true,
    content: `Once a team has used Claude for a few weeks, the same questions come up. Why did it follow this rule in one folder and not another? Why does a new chat still remember things? Where do I put a rule so I stop repeating it? This is the map I draw for them.

Rules sit at different levels, like a company handbook, a department's way of working and the brief for one job. The level you put a rule at decides which work it applies to.

[VISUAL:rule-levels]

## Two places, same account

**The Claude app** (claude.ai and the desktop app) has chats, projects, skills, artifacts and scheduled tasks. Your settings and skills there apply to all your chats in the app. It's a separate place from your folders in VS Code. A skill you make in the app can show up in VS Code when you're signed in to the same account (type /skills to see which ones). To be sure, keep a copy in your personal .claude folder.

**Claude in VS Code** works on the folder you open, and reads rules at three levels:

1. **You, in every folder.** The \`CLAUDE.md\` in the .claude folder in your user folder. How you like answers: short, in your language, ask before guessing. Only you see it.
2. **All the team's work.** A \`CLAUDE.md\` at the top of the team folder. The house rules: your format, trusted sources, no personal data. Shared with the team.
3. **One job.** A \`CLAUDE.md\` in each job folder: the question bank's format, "quote the source line" for a gap analysis, "score a draft against the rules" for a proofreader.

When you open a job folder, Claude reads your rules, then the team rules, then the job's rules.

Folders side by side don't see each other: the question bank folder doesn't see the proofreader's rules. A folder above does reach down, though. Put the team rules in the team folder once and every job folder inside it gets them.

If two files say different things, Claude may follow either one. Keep each rule in one place, at the highest level it's true for.

Claude doesn't make a \`CLAUDE.md\` for you. Type /init, or ask it: "make a CLAUDE.md for this folder from what we've agreed so far." After that it adds to it when you ask, so tell it when something's worth keeping.

Claude also keeps its own notes about each project as you work, in your personal .claude folder. That's why a new chat still remembers things. Type /memory to read or clear them.

## Where each file lives

On Windows your user folder is C:\\Users\\<your name>. On a Mac it's your home folder, shown as ~.

- **Your rules, every folder:** ~/.claude/CLAUDE.md
- **Your skills, every folder:** ~/.claude/skills/<name>/SKILL.md (type /name to use one)
- **Team rules:** CLAUDE.md at the top of the team folder
- **Team skills:** .claude/skills/<name>/SKILL.md inside the team folder
- **One job's rules:** CLAUDE.md in the job folder (open this folder in VS Code)
- **Settings, such as a web rule:** .claude/settings.json inside the team folder
- **Claude's own notes:** ~/.claude/projects/…/memory/

Folders that start with a dot are hidden. On Windows, in File Explorer choose View, Show, Hidden items. On a Mac, press Cmd + Shift + full stop in Finder. When you share the team folder, check the .claude folder goes with it, or your skills stay behind.

## CLAUDE.md is the one Claude reads by itself

\`CLAUDE.md\` is the only file Claude reads at the start of every chat. A voice.md, a style guide or a format file is read when \`CLAUDE.md\` points to it. Keep \`CLAUDE.md\` short and point to the rest.

There are two ways to point. Write @house-style.md and the file is loaded every time. Write "follow house-style.md when you write learner material" and Claude opens it when the job needs it. Skills work the second way: Claude uses one when the job matches, or straight away when you type its name after a slash.

> Make a CLAUDE.md for this folder from what we've agreed so far. Keep it under 40 lines. Include: keep answers short, a summary first and the detail only if I ask. Use our format skill for any learner material. Only use the documents in this folder unless I say otherwise, and if you need an outside source, use official ones and tell me each time. Never put personal data in a file. Point to other files instead of copying them in. Show me the file before you save it.

## A request in CLAUDE.md, a rule in settings

Claude reads \`CLAUDE.md\` and tries to follow it. Settings are rules the program enforces, so Claude can't talk its way round them.

[VISUAL:request-vs-rule]

You don't need to type the file. Ask Claude: "In this folder's .claude settings, make Claude ask me before any web search or web page." For a hard stop, change ask to deny. Use both together: the \`CLAUDE.md\` rule says which sources are good, and the setting makes sure you see each one.

## Sharing your rules, and keeping them tidy

A shared channel or drive is a good place to start: put the team folder (with its .claude folder) there, and each person copies it to their laptop. Copies drift, so agree one owner per file. When several of you edit the same rules, move to a private GitHub repository, where every change is saved with who, when and why.

Start a new chat for each new piece of work. It forgets the last conversation and goes back to your \`CLAUDE.md\`. Then put a reminder in your calendar for two or three months from now, and ask Claude to do the first pass of the tidy-up:

> Read every CLAUDE.md in these folders and list anything that clashes or is out of date.`,
  },
  {
    // From /hsa-session-5, with the client's board work and people taken out.
    slug: "share-it-schedule-it",
    title: "Share it, schedule it: the Claude app",
    excerpt: "Folders are for content you build up. The Claude app is for things you show people and things that repeat: artifacts you can share by link, projects that hold the files for one area, and scheduled tasks that do a job for you every week.",
    date: HANDOUT_DATE,
    readTime: "6 min read",
    introCard: null as string | null,
    published: true,
    content: `Most of the Praxis programme happens in folders, one job at a time. Then we step up a level into the Claude app, where you can turn work into a page others can open and set Claude to do a job for you every week.

## Which place for which job

[VISUAL:which-place]

If the Word and Excel add-ins aren't available to you, the app is also the easiest way to work on a spreadsheet: attach it to a chat.

## Artifacts: work you can open and share

An artifact is a page Claude builds next to the chat: a chart, a table, a calendar or a small tool. It opens in its own panel, you can keep changing it in the chat, and you can share it as a link. Use the word "artifact" in your request and Claude knows what you mean.

### A risk register for the board

As an artifact, a risk register becomes one page: what's most likely and most serious, who owns it and what happens next.

> Attached is our risk register. Make an artifact for the board.
> - A heat map of likelihood against impact, with each risk as a numbered dot.
> - The 5 highest risks with owner, next action and due date.
> - What changed since the last version, if the file shows it.
> Use only what is in the file. If a field is empty, show it as empty instead of filling it in. Keep it to one screen, in plain English for board members.

[VISUAL:risk-heat-map]

Then pick two dots and check them against the spreadsheet. Are they in the right square? Would a board member understand it without you in the room?

### A year plan you can change

A plan in a chat tells you there's a clash. As an artifact you can see where it happens, try a different number of intakes or an extra room, and watch the clashes move.

> Attached are our venues spreadsheet and an example timetable. Build an interactive artifact that plans next year.
> - One row per venue, one column per month, coloured by intake.
> - Any clash or over-booking in red, with a list underneath.
> - Controls to change the number of intakes and add a room, so I can see what changes.
> Use only the venues and capacities in the spreadsheet. Tell me any assumption you had to make.

## Sharing an artifact, and when not to

An artifact starts private. You choose who sees it, with the Share button at the top right.

- **Invite by email.** Choose view, comment or edit. They need a Claude account with that address, and editors can ask their own Claude to change it.
- **Share a link.** Set General access to Anyone with the link, then Copy link. Most artifacts open without a Claude account, so it works for people outside your organisation too.
- **Export or make a file.** Export gives you a web page, a Markdown file or a PDF. For someone without Claude, ask for a Word or PowerPoint version.
- **Keep it private.** A link can be forwarded. Don't share a link to anything board-confidential, any personal data or anything with salaries in it. Use the file instead.

## Projects: the app's version of a folder

In VS Code your rules live in a \`CLAUDE.md\`. In the app the same idea is a Project: you give it instructions and files once, and every chat inside it starts with them. A Board project could hold the risk register, last quarter's minutes and an instruction like "write for board members, one page, plain English, never guess a number". You stop attaching the same files every time.

## Scheduled tasks: a job Claude does every week

You write the job once and pick how often. Claude runs it and the result waits for you under Scheduled.

1. Open the Claude desktop app and choose Scheduled in the left sidebar.
2. Choose New task, then Create with Claude. Describe the job and how often. (In the newest version you can just ask for it in any chat.)
3. Answer Claude's questions, check the name, timing and instructions, then choose Schedule.
4. Under Scheduled you can see past runs, edit, pause, delete or run it now.

It runs even if your laptop is asleep, unless the job needs files that are only on your computer. Start with "Only when I click" and run it a few times before you put it on a timetable. Better still, do the job once in an ordinary chat first, and schedule it when the result is something you'd be happy to get every week.

> Every Monday at 7:00, search [the official sites for your sector] for anything published in the last 7 days about [your subject]: notices, rules, regulations and calls for comment. For each one give the date, title, link and one line on what it could mean for us. Only list items you found on those official sites. If there's nothing new, say "Nothing new this week" and stop.

Other good first jobs: before each board meeting, summarise what changed in the risk register. Every Friday, a short list of what's due next week. Monthly, a reminder to check your privacy setting and tidy your \`CLAUDE.md\` files. The [scheduled tasks guide](/claude-schedules) has every step with a drawing of each screen.

## The same rules apply

- Check two numbers in every chart against the spreadsheet before anyone else sees it.
- Open the link for every item the weekly check finds and read it yourself before you act on the summary.
- No personal data in a chat, a project or an artifact.
- Your name goes on the board paper, so you sign it off.`,
  },
  {
    // From /bi-specialist-tools, with the client's cases, people and proposal taken out.
    slug: "which-ai-for-which-specialist-job",
    title: "Which AI for which specialist job",
    excerpt: "Claude stays the everyday tool. For a few jobs another tool does better: finding where a picture appears, where a photo was taken, getting text out of scans and keeping sensitive documents in Europe or in the office.",
    date: HANDOUT_DATE,
    readTime: "6 min read",
    introCard: null as string | null,
    published: true,
    content: `Each of the big AI companies trained its models on different material, and each is better at different things. You don't need a subscription to all of them. For research and investigation teams, Claude stays the everyday tool, and for a few jobs another tool does better. Most of what's below is free, or works on a free account.

## The short version

[VISUAL:tool-map]

For specialist geolocation there's also Raven (the old GeoSpy), for vetted companies. It's only worth it if it becomes a weekly job.

## Find where a picture appears

A profile picture on a selling platform or a social network, and you want to know where else it's been used. Each search engine has its own index, so four engines find far more than one.

1. **Save it at full size.** Right-click and save. No screenshot.
2. **Google Lens.** In Chrome, right-click the picture and choose Search with Google. Crop to the face, then the background, then an object. Each crop gives different results.
3. **Yandex and Bing.** Upload the same file at yandex.com/images and bing.com/visualsearch. Yandex is strong on faces, Bing on social media copies.
4. **TinEye.** At tineye.com, sort the results by Oldest. The first time a picture appeared online is often the most useful thing you'll find: a stock photo, a stolen picture or the person's first account.
5. **Log each hit,** with the link and the date found, like any source.

Photos on social platforms usually have their hidden details (camera, date, GPS) removed. A photo someone sends you as an original file may still have them. Check it on your own computer, so the file stays with you. On a Mac, open it in Preview and choose Tools, Show Inspector. On Windows, right-click the file, Properties, Details.

## Where was this photo taken

Use the AI for the leads and a map for the proof. Ask ChatGPT and Gemini separately, for three candidates each with its clues. Where the two agree, start there. Then check on the map: Google Earth in 3D for the coastline and terrain, Street View or Mapillary from the ground, SunCalc for the shadows and time of day, PeakVisor for a skyline. The AI's guess never goes in the report. The photo and the map side by side, with the matching features marked, does.

> Where could this photo have been taken? First list every clue you can see: rock type, plants, colour of the water, the light and the sun, buildings, boats, anything written. Then give me your three best guesses, each with the clues that support it and how sure you are. I need places to check, so don't give me just one answer.

> I think this photo was taken at <place>. What should I look for in Google Earth or Street View to confirm it or rule it out? List the features in the photo that should match.

Use ChatGPT with thinking switched on. The AI tools sometimes refuse to locate a photo of a private person or their home. Upload only pictures you're allowed to share with that company, and check the training setting on any account you use for work.

## Faces: check before you search

There are search engines that look for a face rather than a picture, such as PimEyes and FaceCheck.ID. They work, and in Europe they're a legal risk for you.

A picture search finds copies of that one picture, and you can use it freely within your AI policy. A face search finds the person in other photos. That's biometric data, a special category under GDPR. The Italian data protection authority fined Clearview AI €20 million in 2022 for collecting faces of people in Italy.

Before anyone on the team uses a face search, agree when it's allowed, on what legal basis and who signs it off, and add that to your AI policy.

## Text out of scans and images

Get the text out once, check it against the original, then work from the text. Mistral and Gemini are best on stamps, tables and handwriting. Claude is fine for clean scans.

> Turn this scan into text. Keep the layout and the tables. Where you can't read a word or a number, write [unreadable] instead of guessing. At the end, list every place you weren't sure.

## Cloud, Europe or your own machine

Three levels, for three kinds of work. Decide which level a job needs before you start it, the same way you'd decide who on the team should see a file.

1. **Everyday: Claude.** Reports, proposals, translation, your instructions and scorecards, redacted case files, public sources and templates. Most of your work stays here.
2. **Stays in Europe: Mistral.** A specialist that only reads the sensitive documents, for a client who wants their data processed in the EU. You build the system with Claude.
3. **Never leaves the office: a machine of your own.** For a list of people with personal details, the office machine takes the names out and puts codes in, with no internet. The clean version, where no one can be identified, goes to Claude for the analysis and the chart. The key that turns the codes back into names stays on the office machine.

[VISUAL:names-stay-in-the-office]

If your team needs the second or third level set up, [get in touch](/contact).`,
  },
  {
    // From /bi-team-files, with the client's people, paths and timeline taken out.
    slug: "one-set-of-files-the-whole-team-uses",
    title: "One set of files the whole team uses",
    excerpt: "Each person starts their own instructions and scorecards. The ones that work belong in one team library, so anyone can run a job to the same standard and nothing is lost when someone leaves. Point to it from each case instead of copying it.",
    date: HANDOUT_DATE,
    readTime: "4 min read",
    introCard: null as string | null,
    published: true,
    content: `A few weeks into a programme, each person has started their own instructions and scorecards. Now the ones that work go in one place, so anyone can run a job to the same standard, and nothing is lost when someone leaves.

## One team library

Put a folder called team-library on the shared drive you already use (Google Drive or SharePoint) and sync it to everyone's computer. It holds how you do the work. Client documents stay in the case folders, and the library never holds them.

[VISUAL:team-library]

There's one folder under jobs/ for each job you repeat, such as report review, translation or interview reports. Each holds the standing brief, the scorecard and a log of what changed and why, plus a good past report as text, redacted.

Each job has one owner who looks after its files. Anyone can use them.

## Point to it, don't copy it

When you copy the files into each case, you end up with ten versions and nobody knows which is right.

[VISUAL:copy-vs-point]

There are two ways to point.

### Add it to your workspace

Open the case folder in VS Code, drag team-library into the side panel and choose Add Folder to Workspace. Save the workspace when you close. The [workspaces guide](/workspaces) has a screenshot for every step.

### One line in CLAUDE.md

In the case folder's \`CLAUDE.md\`, write @ and the full path to the library file. Claude reads it every time, as if it were in the folder. Get the path with right-click, Copy Path, because it's different on each computer.

> This case is a report review.
> Follow @/Users/<you>/Google Drive/team-library/jobs/report-review/INSTRUCTIONS.md
> Check every draft against @/Users/<you>/Google Drive/team-library/jobs/report-review/SCORECARD.md
> Write the way @/Users/<you>/Google Drive/team-library/VOICE.md describes.

The first time, Claude asks whether it may read files from outside the folder. Say yes.

Don't use a Mac alias or a Windows shortcut. Claude sees it as a small file of its own and can't see inside the folder it points to. That's the most likely reason it didn't work when you tried.

## Keep it up to date

The files only get better if your corrections go back into them. When you make the last small changes by hand in a final report, they need to go into the instructions so the next report has them too.

- **The owner makes the changes.** Anyone else adds a note to LOG.md or tells the owner.
- **Watch for conflict copies.** Two people editing the same file at once on a shared drive makes a second copy. Give both to Claude and ask it to merge them.
- **Tidy every couple of months.** Ask Claude to make the files shorter and easier to read.

> My final version is <paste the path>. Compare it with your draft and list what I changed. Then update INSTRUCTIONS.md in the team library so the next draft has these changes without me making them. Add a line to LOG.md with today's date, what changed and why.

## Before someone leaves

When a colleague who built instructions and prompts that work is moving on, their files go into the library before they leave, so the team keeps them.

> List every instructions file, prompt, scorecard and example I've made in this folder. For the ones another person could use, copy them into team-library/jobs/<job name>/ and write a short README.md: what the job is, how to start it and what to watch out for. Leave out anything with client names or personal details.

When several people start editing the library at once, the next step is a GitHub repository, which keeps every version and who changed what.`,
  },
  {
    // From /bi-github, with the client's organisation, tool names and people taken out.
    slug: "one-github-repository-or-several",
    title: "One GitHub repository or several?",
    excerpt: "When people start building tools they want to share, GitHub keeps every version and lets several people work on the same files. The first question is whether everything goes in one place or each tool gets its own. Start with one.",
    date: HANDOUT_DATE,
    readTime: "4 min read",
    introCard: null as string | null,
    published: true,
    content: `Once a few people in a team are building tools they want to share, GitHub keeps every version and lets several people work on the same files. The first question is whether everything goes in one place or each tool gets its own.

## Four words you'll need

That's all the vocabulary. Claude does the rest when you ask in plain words.

[VISUAL:four-words]

## One repository or several

Both work. They suit different stages.

[VISUAL:one-or-several]

## Start with one

A small team with tools that are a few weeks old is better off in one repository. Each tool gets a folder. A tool moves into its own repository when it needs to, and keeps its history when it does. Client documents stay on the shared drive, never on GitHub.

The organisation belongs to your company. If we help set it up, we join while we work together and leave when you're ready. Two of you are owners, so it never depends on one person.

## When a tool gets its own repository

If none of these is true, the tool stays a folder. If one is, ask Claude to move it out.

1. **Different people.** Only some of you should see it, or a freelancer needs it and nothing else.
2. **It runs on its own.** It becomes a website, a service or something on an office machine.
3. **It leaves the firm.** You hand it to a client or a partner.
4. **It's slowing everyone down.** Big files, or lots of changes nobody else needs.

> Move tools/<tool name> into its own repository in our organisation, with its history. Give it a CLAUDE.md that points to our library, then remove the folder here and say where it went in the README.

## Your account

Ten minutes each. Use your work email.

1. **Sign up at github.com** with your work email. The free plan is all you need.
2. **Add a passkey** under Settings, Password and authentication. It's your fingerprint or face, so no extra code to type.
3. **Send your username** to whoever owns the organisation. They add you and you accept the email.
4. **Sign in to VS Code with GitHub:** the person icon at the bottom left.

## Bring your project in

Put the repository in a plain folder such as Documents/GitHub. Not in Google Drive, OneDrive, Dropbox or iCloud: the sync and GitHub both write to the same hidden files and damage each other.

> Clone our team repository <name> into Documents/GitHub and open it.

> Copy my project from <paste the path> into tools/<tool name>/. Before you save anything, check it for client names, personal details, passwords, API keys and files over 50 MB, and show me what you found. Write a short README.md: what the tool does, how to start it and who looks after it. Then save and share with the message "Add <tool name>".

If Claude finds something, it goes on the shared drive or on the list of files GitHub ignores, and the tool reads it from there. Every day after that, say "get latest" when you start and "save and share: <what you changed>" when you're done. If two of you changed the same lines, Claude says so and suggests how to combine them. Read it, then say which version to keep.

When a tool in the repository is ready for people outside the team, it goes through a check before it goes live. That's in [From your sandbox to something customers use](/blog/from-sandbox-to-live).`,
  },
];
