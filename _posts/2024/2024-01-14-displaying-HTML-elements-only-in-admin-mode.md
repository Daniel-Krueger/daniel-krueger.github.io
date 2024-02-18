---
title: "Displaying HTML elements only in admin mode"
categories:
  - WEBCON BPS   
  - Private  
tags:    
  - CSS
excerpt:
    Display HTML elements like `Statistics` only in admin mode using CSS variables or form rules.
bpsVersion: 2023.1.3.29
---

# Overview  
I'm not a real HTML developer, so it was new to me that [CSS supports custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties#declaring_custom_properties). This opens a few options like displaying different HTML elements only in admin mode without form rules. For this use case I decided to display the [Statistics](https://docs.webcon.com/docs/2023R3/Studio/Workflow/Forms/Workflow_AttributeVis1/#4-standard-areas) tab only in admin mode.

{% include video id="nC8yvAtS9Fw?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}



# Implementation
## General

There are two version on how you could hide /show some elements in admin mode. 
1. CSS custom properties
2. Form rules  

I prefer the first version because it's only a single element I need to change. The second one requires two additional elements form rule and it's execution. There's probably a very minor performance improvement too. The CSS variant is likely to be more performant as the form rule option.   

## Using CSS custom properties 
This version uses only a HTML field without displaying the field name and showing it in the form field matrix. The HTML code of the field will hide or display the statistics tab.

{% include figure image_path="/assets/images/posts/2024-01-14-conditional-display-elements-using-css/2024-01-08-20-00-12.png" alt="Example of using CSS custom properties." caption="Example of using CSS custom properties." %}


```css
<style> 
:root{
--displayStatisticstrue : flex;
--displayStatisticsfalse : none;
}
.rightBar__header div:nth-child(even)
{display:var(--displayStatistics#{ISADMINMODE}# );}

</style>
```

Depending on the form mode `display:var(--displayStatistics#{ISADMINMODE}# );` will be replaced by either one:
- `display:var(--displayStatisticstrue );`
- `display:var(--displayStatisticsfalse );`

The `var(...)` part will resolve/replace the `displayStatistics`  by the
defined value `flex` or `none`.

{% include figure image_path="/assets/images/posts/2024-01-14-conditional-display-elements-using-css/2024-01-08-20-10-33.png" alt="The developer tools display the actual value which will be used for CSS." caption="The developer tools display the actual value which will be used for CSS." %}

## Using form rules
If you are not confident with using the first version, you can use this one.

We need again a HTML field but this time with a much simpler HTML code.
{% include figure image_path="/assets/images/posts/2024-01-14-conditional-display-elements-using-css/2024-01-08-20-18-49.png" alt="HTML field for hiding the statistics tab using a form rule." caption="HTML field for hiding the statistics tab using a form rule." %}
```css
<style> 
.rightBar__header div:nth-child(even)
{display:none;}
</style>
 ```

In addition to the HTML field we need to:
1. Create a form rule
   The HTML field will hide the statistics tab, so we need to hide the field only in admin mode.
   {% include figure image_path="/assets/images/posts/2024-01-14-conditional-display-elements-using-css/2024-01-08-20-19-46.png" alt="Form rule for hiding / showing the HTML field." caption="Form rule for hiding / showing the HTML field." %}
2. Add form rule to behavior tab
   {% include figure image_path="/assets/images/posts/2024-01-14-conditional-display-elements-using-css/2024-01-08-20-20-52.png" alt="Execute the form rule on page load." caption="Execute the form rule on page load." %} 

