---
title: "Future 'proof' customizations (JS/CSS)"
categories:
  - WEBCON BPS
  - Private 
tags:
 - Governance
excerpt:
    "Oh, my customization is broken in the new version, where have I been using it?"
---


{: .notice--info}
**Remark:**  While this will be a really short blog post, it's important enough to get an own post.

After creating smaller and larger customization I finally realized how I could track the smaller ones. It just took a few years. :)

The larger customizations often have a global form rule or similar. If there's an error or a change it's easy to identify where they are used via the `Usages` tab.

![Where is the form rule used?](/assets/images/posts/2024-01-18-future-proof-customizations/2025-01-19-20-38-07.png)

But there's nothing similar for smaller modifications like the [Reduced item list size](/posts/2025/reduced-item-list-size). There's nothing global it's completely individual for a given process and yet it's the solution for this issue.
1. Create a global constant 
  ![Define the customization.](/assets/images/posts/2024-01-18-future-proof-customizations/2025-01-19-20-42-19.png)
2. Reference it in the HTML field
  ![Referenced constant](/assets/images/posts/2024-01-18-future-proof-customizations/2025-01-19-20-43-26.png)
3. Usages tab shows all references
  ![The usages tab will list all references](/assets/images/posts/2024-01-18-future-proof-customizations/2025-01-19-20-42-31.png)


This will make it really easy in the future to update any customization if something changes in a new WEBCON BPS version.



