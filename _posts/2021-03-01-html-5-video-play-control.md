---
title: "Html 5 Video play control without extension"
categories:
  - Private
  - GitHub
tags:
  - JavaScript
excerpt:
   Loading a html5 video play control without extensions 
---


# Introduction
I'm currently watching a [looong](/posts/2021/summary-power-platfrom-webcon-bps) workshop and installed an extension for faster playback yesterday. Today I noticed this user voice: [Allow watching a video at a different speed](https://sharepoint.uservoice.com/forums/329214-sites-and-collaboration/suggestions/42082936-allow-watching-a-video-at-a-different-speed). 

This got me thinking:
1. The extension is nice, but it's a bit lacking.
2. Using the option to execute JavaScript from a bookmark could come in handy.

Which led to a little video play control. Clicking on the bookmark (1) will load the script which in turn creates an alert (2).

![The loaded script shows the offered options](/assets/images/posts/2021-03-01-html5video-play-control/2021-03-01-21-55-41.png)

# How to use it
## Creating the bookmark
Create a bookmark with the following line. There must not be any line breaks.
```
javascript:(function(){var scr = document.createElement('script');scr.type = "text/javascript";scr.src = "https://cdn.jsdelivr.net/gh/Daniel-Krueger/js_snippets/video/html5_playcontrol.min.js";scr.async = true;document.getElementsByTagName('head')[0].appendChild(scr);})();
```
![Adding the load script as a bookmark/favorite](/assets/images/posts/2021-03-01-html5video-play-control/2021-03-01-21-53-58.png)

## Using the bookmark
Browse to any html 5 video platform and click on the bookmark. There are three different outcomes:
1. If everything works fine an alert is shown with a short documentation, like the in the initial screenshot. 
2. If the website doesn't use html 5 videos the message `No videos found; Play control not loaded` will be displayed. 
3. If no message appears, there was something wrong with loading the script.

I've tested the script with https://www.youtube.com/ and https://web.microsoftstream.com/ and with FireFox, Chrome, Edge. 

{: .notice--info}
**Info:** While Chrome and FireFox can execute the script from the bookmarks dialog this does apply to Edge. In Edge it only works if it's called from the bookmark bar. This works for Chrome and FireFox, too.

{: .notice--warning}
**Remark:** Don't use this on a page with multiple videos. 

## Keyboard short cuts

Key | Action |
---------|----------|
 w | The playback rate will be set to 1 (default).|
 a | Current Playback rate will be reduced by 0.25. |
 s | Toggles play/pause, on the first click after load it pauses the video.|
 d | Current Playback rate will be increased by 0.25.|
 x | Will pause the video and wind it 5 seconds backward |

# Bookmark explanation
The script pasted as a bookmark URL loads a minified version of a JavaScript [file](https://github.com/Daniel-Krueger/js_snippets/blob/main/video/html5_playcontrol.js) from my GitHub repository. Since you cannot directly reference files from GitHub it's loaded via https://www.jsdelivr.com/