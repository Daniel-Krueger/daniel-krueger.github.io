---
title: "Manuel mass editing"
categories:
  - Private 
tags:

excerpt:
    "If you need to repeat the same action multiple times you should learn browser shortcuts"

---

# Mass editing
I quite often encounter situations where I need to repeat a similar action in browser windows. A few examples are:
- Blocking specific articles in the ERP system
- Changing the user in a few items of a SharePoint list
- Reassigning some workflow instances in WEBCON BPS
- etc.
 
Let's use the following example. You need to delete a workflow instance which requires:
- Click on the workflow instance to load the form
- Wait until it's displayed
- Hit the delete button
- Confirm the deletion
- Wait until it's executed
- Return to the list and repeat

If you are only using your mouse, it will probably take up to 10 seconds, to delete a single instance with all the loading time and moving the mouse around. While this may sound fast, I get impatient when I see this during a screenshare and you will understand why, when watching the video.

{% include video id="DlQtGNSYsP4?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


In this video I demonstrated my approach in two ways for thirteen workflow instances:
- Changing a field for all instances which took about 35 seconds
- Deleting the instances, this took about 40 seconds

Depending on the case it takes 2-3 seconds for, executing the change manually for a single instance. You can do the math when it’s useful to automate this. Even using AI I doubt that someone can beat you even if you need to modify 100 elements on a random task.

{: .notice--info}
**Info:** The main reason for this post is, so that I can now send someone the link instead of explaining the progress every time. :)

# Used shortcuts
I wanted to show which keys I used on the keyboard with the displayed On-Screen keyboard, but it seems that I was too fast and not all of them have been captured.

Here's an overview of the shortcuts I use most often:
- `Ctrl + left` click to open the new tab
- `Ctrl + tab` to switch to the next tab
- `Ctrl + shift + tab` to go back to the previous tab
- `Ctrl + w` to close the current tab
  If I don’t need the result, for example of the saving, I use this instead of `ctrl + tab` as the browser will also display the next tab.
- `Tab` to move to the next control in the form
- Since we are talking about mass editing
  - `space` for ticking check boxes
  - If you need to fill out multiple drop downs, start from the bottom.
    If you go from top to bottom, the drop down often hide the next value. 
    If you instead start with the last row, you can click in the drop down above to continue. If you are using the keyboard to select the value you will be even faster.
    ![](/assets/images/posts/2025-09-27-Mass-editing-with-browser-shortcuts/2025-09-27-09-45-49.png)
- If you forgot to close the opened tasks, simply choose one of the context menu options.
  ![](/assets/images/posts/2025-09-27-Mass-editing-with-browser-shortcuts/2025-09-27-10-07-26.png)

