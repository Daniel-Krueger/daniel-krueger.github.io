Review the currently open blog post from the perspective of a reader who is only partially technically savvy.

## Steps

### 1. Identify the post
Use the file currently open in the IDE. If no file is open, ask the user which post to review.

### 2. Read the post
Read the full file content.

### 3. Analyse the content
Review the post with two lenses:

**Lens A — Spelling & grammar**
Look for: typos, wrong words (by/be, live/life), missing or extra articles (a/an/the), misplaced commas, subject-verb agreement errors, and compound words written as two words (e.g. "straight forward" vs "straightforward"). Do NOT flag intentional errors inside quoted prompts — the post may explicitly note that prompts are uncorrected.

**Lens B — Rewriting issues**
Look for: unclear structure or buried key points, jargon or idioms that a non-technical reader would not understand, broken or dangling sentences, ambiguous phrasing, duplicate content, missing context that would help the reader understand a screenshot or step, and broken internal anchor links.

### 4. Present the findings
Output two separate numbered lists:

**Spelling & grammar mistakes**
For each item: the line reference, the current text (quoted), and the proposed fix inline. Keep it tight — one line per issue.

**Issues that would require rewriting**
For each item: the line reference, a one-sentence description of the problem, and a brief proposed alternative or direction. Do not write the full rewrite yet.

End with: *"Let me know which numbers you'd like me to fix. For rewriting issues, I can also offer multiple alternatives before applying anything."*

### 5. Wait for the user's selection
Do not apply any changes until the user responds. They may:
- List numbers to fix as-is (e.g. "fix 1, 3, 5")
- Ask for alternatives on specific rewriting items before deciding
- Skip certain items

### 6. For rewriting items where alternatives are requested
Present 2–3 concrete alternatives for that specific item. Wait for the user to pick one before applying.

### 7. Apply the approved changes
Apply all confirmed fixes in a single pass. For each fix use the Edit tool with the exact current text to avoid conflicts. After all edits are done, confirm with a short summary of what was changed.
