Create a draft WEBCON BPS blog post from an existing implementation folder.

## Arguments
$ARGUMENTS

The arguments follow this format:
- **First:** the implementation folder path (quote it with double quotes if it contains spaces)
- **Rest:** optional notes, context, or guidance about the post — what to focus on, target audience, known caveats, links to related posts, etc.

## Steps

### 1. Parse the arguments
Extract the folder path (first token or first double-quoted string) and any additional notes.

### 2. Read the implementation
Read all code files from the folder: `.js`, `.css`, `.sql`, `.html`, `.ts`, `.cs`, and any `README.md`. Note the folder name — it becomes the default post slug (lowercased, words separated with hyphens).

### 3. Write the draft post
Save it to `_posts/<YYYY>/<YYYY-MM-DD>-<folder-slug>.md` using today's date.

#### Frontmatter
```yaml
---
title: "<descriptive title>"
categories:
  - WEBCON BPS
  
tags:
  - <relevant tags inferred from file types and content, e.g. JavaScript, CSS, SQL, Form rules, Item list, User Experience>
excerpt:
  "<1-2 sentence summary of what the feature does>"
bpsVersion: [PLACEHOLDER]
---
```
Available tags are:
Best practice
Business Central
Business Entity
Business rules
CSS
Custom Action
Dashboard
Data sources
Debugging
Designer Desk
Documentation
Excel
Fields
Form rules
Governance
Installation
Item list
JavaScript
Microsoft Teams
Paths
Power Platform
PowerShell
PowerShell Action
Reports
REST
SDK
SharePoint
Snippet
Sub workflow
Template
Time tracking
Translations
User Experience


#### Post body structure

**# Overview**
What the feature does and why someone would want it. Keep it conversational and first-person. Incorporate any notes passed as arguments here (audience, motivation, background). A TODO section should be added to add a video 
{% include video id="PLACEHOLDER?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}
or image ![]()

The overview should be short. The benefits should/use of the blog post should be explained though. An extended explanation should be moved to the #Implementation or 
#Usage chapter.

**# Implementation**
One `##` subsection per component found in the folder. Use these subsection names where applicable:

- `## Global business rule` — for `.sql` files
- `## Global form rule` — for `.js` / `.ts` files used as WEBCON BPS form rules
- `## HTML field` — for HTML configuration snippets that go into a WEBCON BPS HTML field
- `## Global CSS` — for `.css` files

For each component:
- If the the full code is less than 20 lines, Place the code in a fenced block with the correct language hint: ` ```sql `, ` ```js `, ` ```css `, ` ```html `
- If the code has a logical name/description, show it as a plain code block before the main block:
  ```
  Rule name: MyRuleName
  Description: What it does
  ```
- Add `<!-- TODO: Add screenshot of <what to show> -->` after each step where a screenshot would help (e.g., after "create this business rule", after "configure the form rule", after "paste the CSS")
- Use `.notice--warning` or `.notice--info` for caveats, prerequisites, or version constraints found in or implied by the code:
  ```
  {: .notice--warning}
  **Remark:** text here
  ```

**# Usage**
If the blog describes something which can be used, this description should go here.

**# Download**
```
You can find the files [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/<folder-name>).
```

#### Style conventions
- Conversational, first-person tone
- Internal links to other posts: `[link text](/posts/YYYY/slug-name)`
- Image includes: In standard md ![]() format.
- Refrain from using hypens (—)in mid sentences or emoticons. 
- Listing different options should be done with a short caption and an explanation in the next line. The caption should follow a <br/>.

### 4. After writing, list what still needs attention
Output a short follow-up checklist:
- Replace `[PLACEHOLDER]` in `bpsVersion` with the actual WEBCON BPS version
- Screenshots to add (name each one specifically)
- Any sections that need more context or that you couldn't fully draft from the code alone
