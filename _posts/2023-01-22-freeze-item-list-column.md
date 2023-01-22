---
title: "Freeze item list column"
categories:
  - WEBCON BPS
  
tags:
  - JavaScript
  - User Experience
  - CSS
excerpt:
    This is a short post about how to freeze an item list column when scrolling right.
bpsVersion: 2022.1.3.65
---

# Overview  
In the [community](https://community.webcon.com/forum/thread/2603) there was a question whether it's possible to `freeze` an item list column. The desired effect is, that the column would be visible when scrolling to the right.  A little research suggested that in today's time it's possible with [pure CSS](https://stackoverflow.com/questions/45071085/freeze-first-row-and-first-column-of-table/65581857#65581857). I gave it a shot and created a reusable function for WEBCON BPS, which will freeze one column.



{% include figure image_path="/assets/images/posts/2023-01-22-freeze-item-list-column/2023-01-22_11h59_20.gif" alt="" caption="" %}

{: .notice--info}
**Remark:** If anyone can tell me how the CSS should be to freeze more than one column, please get in touch with me. :)

{: .notice--info}
**Tip:** You can also scroll left and right by holding the shift key and using the wheel on your mouse. 


# Setup 
Those who have followed my latest post will have an idea, what will follow, and you are right. Add a global form rule with JavaScript mode for example with the following name and description:
```
Name: FreezeItemListColumn 
Description:
Calling the function will add CSS styling to the form which will allow you to freeze a single column in a specific item list.

Example content of an HTML field:
<script>
InvokeRule(#{BRUX:604:ID}#);   // The ID of this form rule
ccls.freezeItemListColumns.addFreezing(#{WFCON:749}#,1); // The id of the item list and the column which should be frozen
ccls.freezeItemListColumns.addFreezing(#{WFCON:752}#,3); // The id of the item list and the column which should be frozen
</script>
``` 

The description contains an example of the HTML field which will not work. You need to use the ids of your environment. I will cover this later. Once you have implemented it once, you could update your description, so that you can easily copy & paste it in the future.

{% include figure image_path="/assets/images/posts/2023-01-22-freeze-item-list-column/2023-01-22-12-06-22.png" alt="Global form rule example" caption="Global form rule example" %}

The required JavaScript is uploaded to my GitHub repository linked in the [Download](/posts/2023/path-button-styling-revisited#download) chapter.

# Process implementation
Add an HTML field, preferably to the top panel. This way the styling will be available before any item list will be rendered.

{% include figure image_path="/assets/images/posts/2023-01-22-freeze-item-list-column/2023-01-22-12-09-52.png" alt="The HTML  field should be placed in the top panel" caption="The HTML  field should be placed in the top panel" %}

{: .notice--info}
**Remark:** Even so the field is called `HTML_ItemList2`, the field will generate the necessary styling for both item lists. 

You can copy the content of the HTML field from the description or use the one below. Just make sure, that you use your global form rule and the ids of your environment. The example adds freezing to different columns of two item lists. If you have more/less item lists, you can do this by adding/removing the `..addFreezing..` rows.

```JavaScript
<script>
InvokeRule(#{BRUX:604:ID}#);   // The ID of this form rule
ccls.freezeItemListColumns.addFreezing(#{WFCON:749}#,1); // The id of the item list and the column which should be frozen
ccls.freezeItemListColumns.addFreezing(#{WFCON:752}#,3); // The id of the item list and the column which should be frozen
</script>
```
{% include figure image_path="/assets/images/posts/2023-01-22-freeze-item-list-column/2023-01-22-12-11-40.png" alt="The content of the HTML field" caption="The content of the HTML field" %}


That's it, you now have the option. :)

# Explanations
## Color of frozen columns
The color of the frozen column is defined in the form rule. Since this can look different for each theme I opted for defining the color for each theme separately this time.
{% include figure image_path="/assets/images/posts/2023-01-22-freeze-item-list-column/2023-01-22-12-15-32.png" alt="Frozen column color is defined per theme" caption="Frozen column color is defined per theme" %}

You can get a list of all themes using the following SQL command:
```SQL
/* Needs to be executed using BPS_CONFIG*/
SELECT '"'+THE_GUID+'":"" // +"'+[THE_Name]
FROM [dbo].[Themes]
```

Of course, you could change it to the other approach, that you define one color for light and one for dark themes, which I used [here](https://daniels-notes.de/posts/2023/path-button-styling-revisited#switching-between-lightdark-theme-doesnt-work).

# Download
The JavaScript for the form rule can be found [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/freezeItemListColumn).


