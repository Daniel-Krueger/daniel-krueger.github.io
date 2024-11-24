---
title: "Updated 'user experience improvements' for WEBCON BPS 2025"
categories:
  - WEBCON BPS
  - Private 
tags:
 - User Experience 
excerpt:
    "The most common 'user experience improvements' have been updated for WEBCON BPS 2025: Breadcrumb, Colorize paths, Missing comment handler, Modal dialog, Uniform save actions"
bpsVersion: 2023.1.3.289, 2025.1.1.23
---

# Overview
Whenever you leave the prepared paths you are always in for a surprise. This is true when walking in the woods but also in software development. As soon as I've seen a glimpse of the new UI of WEBCON BPS 2025 I realized, that I would have to check which of my [user experience](https://daniels-notes.de/tags/#user-experience) improvements would still be working. 

Since I don't have time to check and rework everything I ever did, I was focusing on the ones I assume are used the most. 
- [Breadcrumb](/posts/2023/breadcrumb)<br/>
- [Colorize paths](/posts/2023/path-button-styling-revisited)<br/>
- [Missing comment handler](/posts/2023/simplification-of-missing-comment)<br/>
- [Modal dialog](/posts/2022/modal-dialog)<br/>
- [Uniform save experience](/posts/2021/unified-save-experience)<br/>

Luckily, there have *only* been UI issues.

If you don't know at all, what these are you can take a look at the video in which I show case these in WEBCON BPS 2025:

{% include video id="ifYmGGSFoFU?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

# Implementation

You are probably in for a surprise, but you only need to update the global form rules, and you are good to go. At least if you are running 2023.1.3.x and maybe even 2023.1.2.x. But if you are running older versions and planning to update to a new version, you should take a look at this post to [UX form rules revised / 2023 R2 compatible](/posts/2023/ux-form-rules-revised).

You can find the updated form rules in the [webcon_snippets](https://github.com/Daniel-Krueger/webcon_snippets/tree/main) repository.  
![Mapping of the GitHub folders to global form rules](/assets/images/posts/2024-11-24-Updated-user-experience-improvements-for-WEBCON-BPS-2025/2024-11-24-18-41-29.png)

Even so the names should be self-explaining, here's an example for the modal dialog.
- Open the modal dialog folder <br/>
- Copy the content of `parentLogic.js` or `parentLogic.min.js` to the `ParentLogic` form rule<br/>
- Copy the content of `childLogic.js` or `childLogic.min.js` to the `ChilLogic` form rule<br/>


# Improvements

## Breadcrumb
I added two features which are immediately available when you update the form rule
- Links are finally rendered as links
- Ctrl+left click on the breadcrumb element will open it in a new tab without releasing the checkout of the current one. Left click on the element will display it in the current tab and release the checkout.
- The leave element also displays the signature and instance id on mouse over.


## Colorize paths
Executing a menu button with a hyperlink action caused the recreation of the path buttons -> they were no longer colored. I only realized this because this is the way the modal dialog is triggered.

I solved this issue and as a side effect another issue was resolved. Path, which had been hidden but have been displayed later using a form rule haven’t been colored. This is now fixed too.

## Modal dialog
A dedicated close button was added. Some people don't recognize the `X` icon as a close button.

# Remark 
## Breaking change vs outdated implementation
I thought about creating a new version dedicated for WEBCON BPS 2025 and make use of features which have been added to WEBCON BPS over the years, but I decided against it. 
I just want to update the form rule and not go into each process/field where it is used.


Even so I don't have the resources to test my features against older WEBCON BPS versions, I roughly verified that the same form rule is working for 2023.1.3.289 as well as 2025.1.1.23, without touching any processes. 


Here are two things I would do differently in a new version:
- Modal dialog<br/>
  Instead of passing the title of the dialog in a `JSON` format I would use a business rule with the text function to define a multilingual title.
- Colorize path<br/>
  With WEBCON BPS 2025 we can define a custom CSS per theme. Therefore I could just set the class  ccls_greyPathButton for a path button instead of ccls_greyPathButtonLightTheme or ccls_greyPathButtonDarkTheme. Even without this custom CSS per theme we could realized the same by using [nesting CSS rules}(/posts/2023/grid-for-form-tables#new-css-nesting-rule-approach-1)
  
Changing the implementation at this point would make it necessary to update more than just the form rule, therefore I'm currently stuck with these `technical debts` even so there wasn't necessarily a better solution when I created the first version. Speaking of `technical debts`, I realized while writing this post, that I made a big mistake in the way I implemented the [Layout change](/posts/2023/revised-layout-change). But this will require an own post.

{: .notice--warning}
**Remark:** I just noticed that the first versions of `Uniform save experience` and `Colorize paths` are already three years old :)


## Running an older version than 2023.1.3.289
If you are running an older version, you can still test the latest version, maybe it works. 
If it doesn't work, you can test one of these older versions:

- [Before WEBCON BPS 2025](https://github.com/Daniel-Krueger/webcon_snippets/tree/Before_WEBCON_BPS_2025)
- [Before WEBCON BPS 2023 R2](https://github.com/Daniel-Krueger/webcon_snippets/tree/Before_2023_R2)
