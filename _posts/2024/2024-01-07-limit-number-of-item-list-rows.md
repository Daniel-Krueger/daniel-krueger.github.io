---
title: "Limit number of item list rows"
categories:
  - WEBCON BPS   
  - Private  
tags:    
  - CSS
  - Form rules
excerpt:
    Limit the number of rows which can be added to an item list.
bpsVersion: 2023.1.3.29
---

# Overview  
There was a question in the community on how to [limit the number of item list rows](https://community.webcon.com/forum/thread/4146). In the community. Even so I'm a little late, I thought this could be an interesting question for a short blog post. In my example I limited the total number of rows depending on a field. 


{% include video id="Y2GCQ2E_Emo?autoplay=1&loop=1&mute=1&rel=0&playlist=Y2GCQ2E_Emo" provider="youtube" %}

{: .notice--warning}
**Remark:**
In the first version of this post I forgot to hide the cloning button. I updated the HTML code but didn't update the video or screenshots. 


# Implementation
## General
The solution is quite simple:
1. An HTML field to hide the `Add` row button via CSS.
2. A form rule to hide / show the HTML field. 

## HTML field
The HTML field uses CSS to hide the `Add` button for the defined item list. 

{% include figure image_path="/assets/images/posts/2024-01-07-limit-number-of-item-list-rows/2024-01-07-20-13-38.png" alt="CSS definition of the HTML field." caption="CSS definition of the HTML field." %}


The below script will hide the `Add` row and the `Clone` button. You need to update the id of the item list.
```css
<style> 
#SubElems_#{WFCON:418}# .subelem-addRow 
{display:none}
#SubElems_#{WFCON:418}# .subelements-action-button__clone-row
{display:none}
</style>
```

The name of the HTML field is hidden and it is displayed in the form field matrix.
{% include figure image_path="/assets/images/posts/2024-01-07-limit-number-of-item-list-rows/2024-01-07-20-17-43.png" alt="The name of the HTML field is hidden." caption="The name of the HTML field is hidden." %}

{% include figure image_path="/assets/images/posts/2024-01-07-limit-number-of-item-list-rows/2024-01-07-20-19-02.png" alt="Display the field." caption="Display the field." %}

## Form rule
Add a process form rule which is used to hide or show the HTML field. The rule consist of:
1. A condition, in my case the total number of the item list rows is compared to a field.
2. Show the field, when the button should be hidden. Otherwise it should be hidden. 

The HTML field hides the button, therefore we need to show it, when the button should be hidden.
{% include figure image_path="/assets/images/posts/2024-01-07-limit-number-of-item-list-rows/2024-01-07-20-21-38.png" alt="Hide or show the HTML field based on the condition." caption="Hide or show the HTML field based on the condition." %}

The form rule itself is used in three places:
1. Behavior / OnPage load of the form. 
   {% include figure image_path="/assets/images/posts/2024-01-07-limit-number-of-item-list-rows/2024-01-07-20-28-01.png" alt="" caption="" %}
2. Callback of the item list in the advanced configuration.
   {% include figure image_path="/assets/images/posts/2024-01-07-limit-number-of-item-list-rows/2024-01-07-20-29-44.png" alt="" caption="" %}
3. The field responsible for the number of rows. 
   {% include figure image_path="/assets/images/posts/2024-01-07-limit-number-of-item-list-rows/2024-01-07-20-34-47.png" alt="" caption="" %}
