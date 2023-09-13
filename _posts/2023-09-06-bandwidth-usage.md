---
title: "Bandwidth usage"
categories:
  - WEBCON BPS    
tags:    
  - Form rules
excerpt:
    This post attempts to raise the awareness of how you can reduce the bandwidth consumption.
bpsVersion: 2023.1.2.44, 2022.1.4.155
---

# Overview  
This time it's not about a new idea on improving the user experience. Instead, we are going down a 'dark' road. It's about how WEBCON BPS is getting the data to render the forms and why you should take this into account. 

In one worst case scenario opening 10 previews transferred almost 10 MB. 

{% include figure image_path="/assets/images/posts/2023-09-06-bandwidth-usage/2023-09-05-21-41-23.png" alt="Bandwidth consumption after opening 10 previews" caption="Bandwidth consumption after opening 10 previews" %}


This was a single user, what will happen 
- If you have 100 users doing this?
- If they are connected via internet/vpn?
- If they have a poor connection?

{: .notice--info}
**Remark:**
This post applies at least to 2022.1.4.155 and 2023.1.2.44.

{: .notice--info}
**Remark:**
In our case this caused a racing conditions. At some point a JavaScript function was executing and wanted to use a G_ variable. Unfortunately, it was gone and not yet recreated. This probably happened because the JavaScript function from the previous element was executed while in parallel the G_ variable were removed because a new element was not yet loaded.

# Background information
Every time, we display a workflow instance WEBCON BPS retrieves a model. It contains everything necessary to render the instance. This includes information about the process, field configuration, field data, form rule and more.
The model is retrieved each time you click on refresh, open the preview or switch to a different task. 

This model was available as window.initialModel up to WEBCON BPS 2023 R2. As of this version is it [no longer available](https://community.webcon.com/forum/thread/3515). The alternative is to retrieve the model using an internal endpoint. The drawback is obviously that the model is retrieved twice. It could be more depending on the way you are implementing it.


# Options to reduce the Bandwidth
## Unnecessary fields
IF you have fields which are not needed in a step, hide them in the field matrix. Alternatively, you can use the `Visibility restriction on form`. Only use form rule for this if it's really necessary.

{% include figure image_path="/assets/images/posts/2023-09-06-bandwidth-usage/2023-09-05-22-09-16.png" alt="Hide a field in the visibility restriction." caption="Hide a field in the visibility restriction." %}

The reason for this is simple. A single visible text field, without a value, adds about 2200 characters or 2.17 kB to each the response.
{% include figure image_path="/assets/images/posts/2023-09-06-bandwidth-usage/2023-09-05-22-08-15.png" alt="Incomplete list data added to a response for a single textfield" caption="Incomplete list data added to a response for a single textfield" %}

## Form rules
### Delete/consolidate global form rules
The response has a `jsToRegister` property. This contains _all_ global form rules. This will also be true, if your process _doesn't use any_ global form rule.

{: .notice--info}
**Remark:**
This is at least true for Form rules of type JavaScript. I haven't verified this for those of type `Form rule`.

### Minify JavaScript
Those of you, who are creating JavaScript form rules will probably have heard of minification. Even so this adds extra steps to the development, this will be worth it.

The first example below uses full (pretty) JavaScript form rules and returns a response of **186 kB**. This is do the fact that all form rules are part of the response, although I was only using my 'User experience' form rules listed at the end of this post.
{% include figure image_path="/assets/images/posts/2023-09-06-bandwidth-usage/2023-09-05-22-18-06.png" alt="Full/pretty JavaScript form rules return 186kB." caption="Full/pretty JavaScript form rules return 186kB." %}

After minimizing the 'User experience' form rules the response was reduced to **151 kB**. 
{% include figure image_path="/assets/images/posts/2023-09-06-bandwidth-usage/2023-09-05-22-24-28.png" alt="Minified JavaScript form rules returns 151 kB." caption="Minified JavaScript form rules returns 151 kB." %}

I'm using VS Code in combination with a git repository to create the form rules. The minification is done via the Extension [MinifyAll](https://marketplace.visualstudio.com/items?itemName=josee9988.minifyall). I'm using this instead the Minify extension because:
- I wanted to keep my console.log lines as
- Keep my debugger statements 
- Use a return statement outside a function.
  Since the form rules are wrapped in a function, this will work just fine. Of course, the minification plugin doesn't know this and would throw an error.

At least I wasn't able to configure it with the Minify extension.
This is my configuration:

```
"MinifyAll.terserMinifyOptions": {  

        "mangle": true,
        "compress": {
            "drop_console": false,
            "dead_code": false,
            "keep_fnames": false,
            "keep_classnames": false
            ,"drop_debugger":false
        },
        "parse":{            
            "bare_returns" : true,
        },
    },
    "MinifyAll.openMinifiedDocument": false,
    "MinifyAll.minifyOnSaveToNewFile": true,
    "MinifyAll.PrefixOfNewMinifiedFiles": ".min"
```
### Using internal endpoints
Whenever we are using the internal endpoints, we are aware of the fact, that these may change without any information.
This fact in combination to the consumed bandwidth, makes you wonder whether there's a better approach. As always, the answer is 'It depends'. Maybe you are just needing a single/few information? In this case your best alternative could be to create a business rule, which retrieves this information and use it in an HTML field. Here's an example:\
[HTML field definition of a breadcrumb](https://daniels-notes.de/posts/2023/breadcrumb#html-field-definition)

# User voices
I've added these user voices, which would help to reduce the Bandwidth consumption even more:\
[Removing default values; Reducing HTTP response size part 1](https://community.webcon.com/forum/thread/3527/15)
[Transfer only referenced form rules; Reducing HTTP response size part 2](https://community.webcon.com/forum/thread/3548/15)
[Minimize form rules ; Reducing HTTP response size part 3](https://community.webcon.com/forum/thread/3552/15)

# Outlook / Breaking changes
Using this information, I will change the form rules for:\
[Complete fields with errors ](https://daniels-notes.de/posts/2023/complete-fields-with-errors)\
[Simplification of entering a missing comment ](https://daniels-notes.de/posts/2023/simplification-of-missing-comment)\
[A breadcrumb for navigating workflow hierarchy ](https://daniels-notes.de/posts/2023/breadcrumb)\
[Revised uniform path button styling ](https://daniels-notes.de/posts/2023/path-button-styling-revisited)\
[Modal dialog v3 ](https://daniels-notes.de/posts/2022/modal-dialog)\
[Unified save experience ](https://daniels-notes.de/posts/2021/unified-save-experience)

In addition, I will continue focusing on WEBCON BPS 2023 R2. The new form rules may work with older version, but I won't be able to verify this.
Therefore, I created a branch in my GitHub repository which will be used as an [archive](
https://github.com/Daniel-Krueger/webcon_snippets/tree/Before_2023_R2).

