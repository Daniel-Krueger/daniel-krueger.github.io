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
{% include figure image_path="/assets/images/posts/2021-03-01-html-5-video-play-control/2021-03-02-22-04-47.png" alt="The loaded script shows the offered options" caption="The loaded script shows the offered options" %}

# How to use it
## Creating the bookmark
Create a bookmark with the following line. There must not be any line breaks.
```
javascript:(function(){var scr = document.createElement('script');scr.type = "text/javascript";scr.src = "https://cdn.jsdelivr.net/gh/Daniel-Krueger/js_snippets@0.4-beta/video/html5_playcontrol.min.js";scr.async = true;document.getElementsByTagName('head')[0].appendChild(scr);})();
```
{% include figure image_path="/assets/images/posts/2021-03-01-html-5-video-play-control/2021-03-01-21-53-58.png" alt="Adding the load script as a bookmark/favorite" caption="Adding the load script as a bookmark/favorite" %}

## Using the bookmark
Browse to any html 5 video platform and click on the bookmark. There are three different outcomes:
1. If everything works fine an alert is shown with a short documentation, like the in the initial screenshot. 
2. If the website doesn't use html 5 videos the message an according messages is displayed:
   `No videos found; if there are videos here, they aren't html5 videos or they have been embedded. In the later case go to to original website hosting the video.`  
3. If no message appears, there was something wrong with the bookmark or the script is no longer accessible.

I've tested the script with https://www.youtube.com/ and https://web.microsoftstream.com/. Here's a matrix in which browser the bookmark has been executed during my tests.

Browser|Bookmark dialog| Bookmark bar|
---|:---:|:---:|
Chrome|x|x|
Edge|o|x|
FireFox|x|x|

{: .notice--warning}
**Remark:** This won't work for pages which embed videos. Go to the original video platform and execute the script there.

{: .notice--warning}
**Remark:** The selected action will be applied to **all** playing videos. If you press **s** the playing videos are stopped, if there are none, the once which have been **paused** via play control we be continued.


## Keyboard short cuts

Key | Action |
---------|----------|
 w | The playback rate will be set to 1 (default).|
 a | Current playback rate will be reduced by 0.25. |
 s | Toggles play/pause; if any video is playing they will be paused otherwise the last paused video will start to play|
 d | Current playback rate will be increased by 0.25.|
 y/z | Last paused videos will be wind 5 seconds backward|
 x | Will pause all playing videos and wind them 5 seconds backward |
 c | Last paused videos will be wind 5 seconds forward|



{: .notice--info}
**Info:** y/z use the same option to reflect both kinds of keyboard layout.

{: .notice--warning}
**Remark:** Pressing **c** on YouTube will show / hide captions. This also happens if you press **shift+c** or other combinations, so there's nothing which can be done here.

# Bookmark explanation
The script pasted as a bookmark URL loads a minified version of a JavaScript [file](https://github.com/Daniel-Krueger/js_snippets/blob/main/video/html5_playcontrol.js) from my GitHub repository. Since you cannot directly reference files from GitHub it's loaded via: https://www.jsdelivr.com/

The URL of the file contains a specified version @*. This specifies the [release](https://github.com/Daniel-Krueger/js_snippets/releases/tag/0.3-beta). 
../gh/Daniel-Krueger/js_snippets **@0.3-beta** /video/html5_playcontrol.min.js
Only this version of the file will be loaded. With this option you car rest without fears, that something bad will be added to the code in the future.