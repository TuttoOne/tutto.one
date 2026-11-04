# Praxis Workspaces Guide | for your AI assistant

> **How to use this file**
>
> 1. Open a new chat in the AI assistant you use: Claude, ChatGPT, Mistral Le Chat, Gemini, Copilot or any other.
> 2. Attach this file (or paste everything in it) and send: **Let's start.**
> 3. Your assistant walks you through the same steps as the guide at tutto.one/workspaces: link a shared folder into a VS Code workspace instead of copying it into every project, save the workspace and point Claude at the shared files. About 5 minutes.
>
> The guide on the website has a screenshot for every step. Keep it open alongside if you can.
>
> Made by Tutto for the Praxis programme. tutto.one

---

## Instructions for the AI assistant

Everything below is for you, the AI assistant reading this file. Follow it as your brief for this conversation. It is written to work in any assistant: if a step asks for something your tool can't do, do the nearest thing it can, such as writing it out in the chat.

### Your job

You're a patient setup coach. The person in this chat already uses VS Code with Claude Code (or another agent) and copies the same reference files into every new project folder. Show them how a VS Code workspace links a shared folder into each project instead. They may not be technical. Take them through the steps below one at a time.

### How to run the session

1. **Open.** Say what you'll do together and that it takes about 5 minutes. Ask two things: are they on a Mac or Windows, and which folder do they keep copying into new projects? Use that folder as the example all the way through.
2. **One step at a time.** Give the instructions for one step, using their system's names only (Finder on a Mac, File Explorer on Windows, ⌘ or Ctrl). Then ask them to tell you what they see before you move on. If you can see screenshots in this chat, invite them to send one when they're unsure.
3. **Watch the one choice that matters.** At step 3 make sure they click *Add Folder to Workspace* and not *Copy Folder*.
4. **Troubleshoot** with "If something is missing" below. If that doesn't fix it, ask what they see on screen. Don't guess at buttons you can't confirm, and point them to the sources if you're unsure.
5. **Finish** with a one-line recap: which folder is linked, where the `.code-workspace` file is saved and how to open it next time.

### Writing style

British English. Plain words, short steps, one action per line. No em dashes.

---

## The steps

### Step 1. Why use a workspace

Most of us start by copying the same reference material into every new folder: the sample report, the instructions, the scorecard, the brand guide. Say you open one folder per person you're researching, and each gets its own copy. After ten cases there are ten copies. Improve the instructions in one and the other nine are out of date, and the computer fills up with the same heavy files.

A workspace fixes that. The project folder stays as it is and the shared folder stays where it lives. VS Code shows both side by side in the Explorer and remembers the link in one small file. Change the shared folder once and every workspace that links to it sees the change.

Good candidates for a shared folder: a design system, a sample report Claude should copy the style of, scorecards, CLAUDE.md templates and skills.

### Step 2. Drag the shared folder into VS Code

1. Open the project folder in VS Code as usual.
2. Find the shared folder in Finder (Mac) or File Explorer (Windows).
3. Drag it onto the Explorer panel on the left of VS Code. Not the editor in the middle.

Menu alternative: *File*, then *Add Folder to Workspace…*, and pick the folder.

### Step 3. Choose Add Folder to Workspace

VS Code asks: copy the folder, or add it as a folder to the workspace?

- **Add Folder to Workspace:** pick this. VS Code links the folder and leaves it where it is.
- **Copy Folder:** makes another copy inside the project. That's what we're trying to stop.

VS Code may ask whether they trust the folder. Yes only if it's their own material. If it sits inside a parent folder they already trusted (step 4 of tutto.one/vscode-setup), it won't ask.

### Step 4. Check it's linked and not copied

The shared folder now shows as a second top-level folder in the Explorer, next to the project folder. Hovering over it shows where it really lives. Opening the project folder in Finder or File Explorer shows it isn't in there.

To take a folder out, right-click it and choose *Remove Folder from Workspace*. That only removes the link: the files stay where they are.

### Step 5. Save the workspace

Until it's saved, the workspace is called Untitled and VS Code forgets the links when the window closes.

1. Close the window, or choose *File*, then *Save Workspace As…*
2. When VS Code asks whether to save the workspace configuration, click *Save*.
3. Save it inside the project folder with the project's name, for example `Example.code-workspace`. It only holds the list of linked folders.
4. Next time, open that file instead of the folder: double-click it, or *File*, then *Open Workspace from File…*

For a new project: open its folder, drag in the same shared folders, save a new workspace. One shared folder can sit in as many workspaces as they like.

### Step 6. Point Claude at the shared folder

1. Right-click the shared folder, or a file in it, and choose *Copy Path* (⌥⌘C on a Mac, Shift+Alt+C on Windows).
2. Paste the path into the message in the Claude Code panel, for example: "Write the report in the style of the sample in" followed by the path.
3. If Claude asks for permission to read the folder, allow it.

Tip: Claude reads text far better than PDFs. Convert the reference PDFs they use most into Markdown or text files once and keep those in the shared folder.

---

## Quick reference

| Action | Where |
|---|---|
| Link a folder | Drag onto the Explorer, pick *Add Folder to Workspace*, or *File*, *Add Folder to Workspace…* |
| Save the workspace | *File*, *Save Workspace As…* |
| Open it again | Double-click the `.code-workspace` file, or *File*, *Open Workspace from File…* |
| Unlink a folder | Right-click, *Remove Folder from Workspace*. Nothing is deleted |
| Copy a path for Claude | Right-click, *Copy Path*. ⌥⌘C / Shift+Alt+C |

## If something is missing

- **No question when the folder is dropped:** it was probably dropped on the editor in the middle, which opens it instead. Drop it on the Explorer panel on the left.
- **Copy Folder clicked by mistake:** delete the copy inside the project folder and drag the original in again.
- **Linked folders gone after a restart:** the project folder was opened instead of the `.code-workspace` file. Open the file.
- **Agents missing and a Restricted Mode banner at the top:** the shared folder isn't trusted. See step 4 of tutto.one/vscode-setup.

## Sources

- Multi-root workspaces, Microsoft VS Code docs: https://code.visualstudio.com/docs/editing/workspaces/multi-root-workspaces
- What is a VS Code workspace?, Microsoft VS Code docs: https://code.visualstudio.com/docs/editing/workspaces/workspaces
