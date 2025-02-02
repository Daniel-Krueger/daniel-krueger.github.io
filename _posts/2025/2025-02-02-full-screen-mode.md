---
title: "Full screen mode"
categories:
  - WEBCON BPS
  - Private 
tags:
 - JavaScript
 - User Experience
excerpt:
    "You don't see enough? Open the workflow instance in full screen mode."
bpsVersion: 2025.1.1.44
---

# Overview
Everyone who's transitioning to WEBCON BPS will realize, that it's somehow 'cleaner' but at cost of screen space. It's not easy to find a good solution for every combination as Michał explained in this user voice [WEBCON BPS 2025: Fluent 2 - density setting](https://community.webcon.com/forum/thread/6380/15) Instead of changing everything, I was wondering, whether it would be an alternative to display the form in full screen mode.

{% include video id="7oMfi1YqCBY?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

# Comparison of 2023 and 2025
The issue I mentioned is is even more evident if:
- The left navigation is visible
- You are working from the task view
- The info panel is open

In this combination the form has about 50% of the space left in a 1920x1080 resolution. If you are using vertical browser tabs, it's even less. Here's a direct comparison between WEBCON BPS 2023 and 2025 of the same workflow instance. You may not believe it, but both images show the content of a maximized browser tab.

{% include figure image_path="/assets/images/posts/2025-02-03-full-screen-mode/2025-02-02-18-59-10.png" alt="WEBCON BPS 2023" caption="WEBCON BPS 2023" %}

{% include figure image_path="/assets/images/posts/2025-02-03-full-screen-mode/2025-02-02-18-59-28.png" alt="WEBCON BPS 2025" caption="WEBCON BPS 2025" %}


# Implementation
## Overview
The implementation itself is as easy as it can get and uses my proven approach. This time we don't even need a global business rule.

1. Create a global form rule
2. Create/reuse an HTML field

## Global form rule

You can [download](#download) the JS for this form rule from the repository and paste it to the new form rule. Don't forget to switch the type to `JavaScript mode`.

``` 
Rule name: Fullscreen
Edit mode: JavaScript mode
```

{% include figure image_path="/assets/images/posts/2025-02-03-Fullscreen-mode/2025-02-02-12-45-05.png" alt="The global form rule for loading the full screen logic." caption="The global form rule for loading the full screen logic." %}

## HTML field
You can invoke the form rule from an existing HTML field or create a new one with the below lines. Of course, you need to choose your form rule. ;)
```html
<script>
InvokeRule(#{BRUX:1007:ID}#)
</script>
```

{% include figure image_path="/assets/images/posts/2025-02-03-Fullscreen-mode/2025-02-02-12-47-06.png" alt="Loading the full screen form rule logic." caption="Loading the full screen form rule logic." %}

# Remarks
## Paths are hidden
I've decided to hide the path panel, if one exists. The full screen mode is intended to focus on the content of the form and not to move it forward to the next step. There's also another reason, I have no idea how the system should work, if you are working from the tasks view, entered the full screen mode and complete a task:
- Should the full screen mode be exited automatically? I'm not sure that this can be achieved reliable.<br/>
- Should the next task be displayed in full screen mode? <br/>
- What should happen if there are no more tasks? <br/>

If you still want to display the paths, you can remove this code:
```js
if (pathPanel) {
    pathPanel.style.display = 'none';
}
```

## Translations
In the top of the form rule there are three default values which are set based on the language of the user. You can copy the case block and add the translations for your language.
```js
switch (G_BROWSER_LANGUAGE) {
    case 'de-DE':
        dkr.fullscreen.enterFullScreenTitle = "Vollbildmodus aktivieren"
        dkr.fullscreen.exitFullScreenTitle = "Zur Standardansicht zurückkehren"
        dkr.fullscreen.exitFullScreenLabel = "Vollbildmodus verlassen"        
        break;

    default:
        dkr.fullscreen.enterFullScreenTitle = "Show in full screen"
        dkr.fullscreen.exitFullScreenTitle = "Return to standard view"
        dkr.fullscreen.exitFullScreenLabel = "Leave full screen"
        break;
}
```

I wanted to use a global business rule to provide the [translations](/posts/2024/translations#business-rule-function-text). Unfortunately, it fails with some strange error. This error is only visible if you click on the `Show` button of the `Expression editor`. If the form rule is executed in the browser, you won't get any useful information.

{% include figure image_path="/assets/images/posts/2025-02-03-Fullscreen-mode/2025-02-02-12-33-28.png" alt="Global business rules cannot be used in form rules in 2025.1.1.44" caption="Global business rules cannot be used in form rules in 2025.1.1.44" %}


## Hotkey works outside of the process
While we cannot load a global JavaScript any script added via the form will live on in the browser.
That's the reason why the full screen functionality can be invoked for all workflow instances, even after leaving the one which added it.
You will be missing the icon but everything else will be working.

The script won't be available:
- If you use the refresh button of the browser
- Open another tab

## Preview form
Yes, the full screen mode works for the preview elements, but the content of the left and right panel won't be rendered side by side. The reason is quite simple.
The HTML is different. In case of the preview, the right panel elements (1) to the bottom panel (2).
{% include figure image_path="/assets/images/posts/2025-02-03-Fullscreen-mode/2025-02-02-12-06-10.png" alt="" caption="" %}

Since the elements are moved to the bottom panel, there's nothing we can do to display the form in the original layout.

# Download

You can find the full and a minified JS version [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/fullscreen).

If you are interested in the fact, that there's a minified version at all, you can take a look at the post [Bandwidth usage](/posts/2023/bandwidth-usage).
