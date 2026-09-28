Create a LinkedIn newsletter article that summarises and previews a blog post.

## Arguments
$ARGUMENTS

The argument is the path to the blog post markdown file.

## Steps

### 1. Read the blog post

Read the markdown file at the given path. Note:
- Title and excerpt from the frontmatter
- The full Overview section
- Whether this is part of a series (look for a `# Series` section)
- Key sections, benefits, caveats, and takeaways
- Whether a video is embedded (look for `{% include video id="..." %}`)
- bpsVersion from the frontmatter

### 2. Write the LinkedIn newsletter article

The newsletter article is published as an issue in a LinkedIn newsletter. It gives readers enough context to understand whether the topic is relevant to them, and sends curious readers to the full blog post for the details.

**Target length:** 250 to 400 words of body content (excluding title).

#### Title

Write a short, descriptive title (max 10 words). It may differ from the blog post title. Avoid clickbait phrasing. No colons unless structurally necessary (e.g. "Series name: Subtitle").

#### Opening paragraph

One or two sentences. Frame the problem or situation the reader may recognise. Do not start by announcing what the article is about. Draw the reader into the topic.

#### Body

Cover the core content in 3 to 5 short sections or paragraphs. Each section should be skimmable:
- Use a short bold lead phrase if a section covers a distinct topic, followed by the explanation on the same or next line.
- If there are three or more discrete features or options worth comparing, group them in a short list. Use a plain hyphen bullet for list items.
- Mention concrete benefits or trade-offs where the blog post identifies them.
- If the post is part of a series, name the series and mention where this issue fits.

Keep sentences short. Use plain vocabulary. Do not pad with filler phrases ("In this article we will explore..."). Do not repeat the title verbatim in the body.

#### Closing

One or two sentences. Invite the reader to read the full post for implementation details, screenshots, or code. Include the blog post URL on its own line:

  [BLOG_POST_LINK]

If the post contains a video, add the video link on a separate line below the blog post link:

  [VIDEO_LINK]

**Blog post URL format:** `https://daniels-notes.de/posts/YYYY/slug`
where YYYY is the year and slug is the filename without the leading date prefix
(e.g. `_posts/2026/2026-06-14-user-defined-api-part-3.md` -> `https://daniels-notes.de/posts/2026/user-defined-api-part-3`).

General disclaimer:
Created with the help of AI from the original post. Investing the time in creating new content is more fulfilling than distributing it. :)

#### Style rules (must be followed)

- Plain ASCII only. No special Unicode punctuation: no en dash, em dash, curly quotes, or ellipsis character.
- No hyphens in mid-sentence. Hyphens are allowed only in compound adjectives and list bullets.
- No emoticons, emoji, or smiley faces.
- No hashtags.
- Mention WEBCON BPS by name at least once where applicable.
- Do not use the word "hashtag".
- Simple, direct vocabulary. Prefer active voice.
- No em dashes used as parenthetical separators.

### 3. Write the publish teaser

When publishing a newsletter issue on LinkedIn, a short text field appears with the placeholder "tell your network what this edition of your newsletter is about". Write this teaser.

- 1 to 2 sentences maximum.
- Name the concrete problem or benefit, not just the topic.
- Same style rules as the article: plain ASCII, no emoji, no hyphens mid-sentence, no hashtags.
- Do not start with "In this edition" or similar meta-phrases.

### 4. Output

Print the following sections in order:

---
## LinkedIn newsletter article

**Title:** [article title]

[article body]

---
## Publish teaser

[teaser text]

---
## Notes
List any placeholders the user still needs to fill in:
- BLOG_POST_LINK: confirm the derived URL is correct
- VIDEO_LINK: the YouTube or lnkd.in URL (only if a video is referenced in the post)
- Any other items that could not be determined from the blog post alone
