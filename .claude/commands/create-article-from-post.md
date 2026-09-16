Create a WEBCON community article and a LinkedIn post from an existing blog post.

## Arguments
$ARGUMENTS

The argument is the path to the blog post markdown file.

## Steps

### 1. Read the blog post

Read the markdown file at the given path. Note:
- Title and excerpt from the frontmatter
- The full Overview section
- Key features, implementation steps, and any notable caveats
- Whether a video is embedded (look for `{% include video id="..." %}`)
- bpsVersion from the frontmatter

### 2. Write the community article

The community article is published on community.webcon.com. It is short (50 to 100 words of actual content) and must be worded differently from the blog post overview so that search engines do not treat them as duplicate content.

#### Short description

Write 1-3 sentences as a teaser for the article preview. Use a conversational or questioning style to draw the reader in. Examples from past posts:
- "Do you have menu buttons which interact with item lists? Do you want to display them next to the item list? If you answered with Yes then you should take a look at this post."
- "Save a click and add a new row, and display it directly from the Single row edit dialog."

#### Article

The article has a fixed structure:

**Title:** `[external] [blog post title]`

**Fixed attribution header** (derive the date from the filename, formatted as "Month DD, YYYY"):
```
External content by Daniel Krüger; [date]; 
The original post has appeared on daniels-notes.de
```

**Body (50 to 100 words):**
- 2 to 4 short sentences.
- Start from the user's perspective: describe the situation or problem first.
- Then name what the solution provides. If there are three or more distinct capabilities, use a short list.
- Use different wording from the blog post overview. Vary sentence structure and vocabulary.

**Media placeholder** (always include this line as-is):
```
(Link to video or image from the overview)
```

**Closing sentence** pointing to the full post. Vary the phrasing. Examples:
- "If you are interested in this, you can find more information in this [blog post](BLOG_POST_LINK)."
- "You can read it up in this [blog post](BLOG_POST_LINK)."
- "If you want to help your users, you can find a solution here: [blog post](BLOG_POST_LINK)."

**Blog post URL format:** `https://daniels-notes.de/posts/YYYY/slug`
where YYYY is the year and slug is the filename without the leading date (e.g. `_posts/2026/2026-05-10-maintenance-page.md` → `https://daniels-notes.de/posts/2026/maintenance-page`).

Additional rules:
- Plain text with minimal markdown. No Jekyll includes or front matter.
- No em dashes. No emoticons.
- Lists use a plain hyphen bullet.
- Keep it factual and neutral in tone.
### 3. Write the LinkedIn post

The LinkedIn post is a short attention-grabbing text (80 to 150 words).

Structure:
- One opening sentence that names the topic and frames the value or the problem it solves.
- One or two sentences describing what the solution does or what options it gives.
- If there are concrete features worth listing, name them in a short numbered list (1. 2. 3.) rather than bullet lines, to avoid hyphens.
- A closing line that points to the blog post.
- If the post includes a video, add a separate line for the video link.

  Blog post: [BLOG_POST_LINK]
  Video: [VIDEO_LINK]

Rules that must be followed:
- No hyphens anywhere in the generated text, including list markers.
- No emoticons, emoji, or smiley faces.
- Plain ASCII only. No special Unicode punctuation (no en dash, em dash, curly quotes, ellipsis character).
- Simple, direct vocabulary. Short sentences.
- Mention WEBCON BPS by name at least once.
- Do not use the word "hashtag". If referencing a tag, write it normally (e.g. WEBCON, not hashtag#WEBCON).

### 4. Output

Print the following sections in order:

---
## Community article
[article text]

---
## LinkedIn post
[post text]

---
## Notes
List any placeholders the user still needs to fill in:
- BLOG_POST_LINK: confirm the derived URL (https://daniels-notes.de/posts/YYYY/slug) is correct
- VIDEO_LINK: the YouTube or lnkd.in URL (only if a video is referenced in the post)
- Any other items that could not be determined from the blog post alone
