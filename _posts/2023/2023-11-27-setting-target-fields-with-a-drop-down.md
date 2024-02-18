---
title: "Setting target fields with a drop down"
categories:
  - WEBCON BPS   
  - CC LS  
tags:    
  - Item list
  - Form rules
  - Data sources
excerpt:
    Use case depending alternative for setting target columns in an item list via a drop down. This can drastically improve performance.
bpsVersion: 2023.1.2.99
---

# Overview  
I had the requirement to create a questionnaire. The questions come from a dictionary, and they are grouped by category and each one can have a small number of answers. The questionnaire is implemented via an item list. Depending on the selected answer other columns are set.
This is fairly easy using the `Target field` of `autocomplete` or `popup search fields`. You can read up on this in the [documentation](https://docs.webcon.com/docs/2023R2/Studio/Process/Attribute/Choice/Osobalubgrupa/#advanced-settings).

Even so this is easy, the user experience may drastically suffer, as you can see in this video. The `autocomplete` column takes 2x 330 ms to show the available answers. This is acceptable  for a few rows, but not for a two-digit number.


{% include video id="7Fqwfg8g66I?autoplay=1&loop=1&mute=1&rel=0&playlist=7Fqwfg8g66I" provider="youtube" %}



# Implementation
## General
This option is only suitable if:
- You have a limited number of options.
- The options can be determined when the form is loaded.


By default, the drop down choice field doesn't offer the `Targe field`.
{% include figure image_path="/assets/images/posts/2023-11-27-settings-target-field-with-a-drop-down/2023-11-27-21-15-26.png" alt="Drop down choice field doesn't have the option to set target fields." caption="Drop down choice field doesn't have the option to set target fields." %}

As you can see, we are limited to the id and name field. The name field is displayed but not the id. We can make use of this by preparing the id in such a way, that it contains the original id. In addition, the values of the target fields. Then we can use a form rule to set the target fields.


## Id field
The value of an id is always text, even if you use an integer value. It is stored in a text column. This allows us to modify the id *value* to our liking. 
In my case the default id would be the WFD_ID. Since I want to set other fields, I add these target values to the id.

{: .notice--warning}
**Remark:**
Even if you use an integer value as the id make sure to always use a text value when you are using this a `where` or `join` condition. Otherwise you may run into problems [Breaking change due to one’s own laziness](/posts/2023/updating-to-bps-2023#breaking-change-due-to-ones-own-laziness).


{% include figure image_path="/assets/images/posts/2023-11-27-settings-target-field-with-a-drop-down/2023-11-27-21-24-59.png" alt="Definition and result of the id" caption="Definition and result of the id" %}
```sql
select 
   Cast( WFD_ID as nvarchar(20))
   +'|' +Cast({WFCONCOL:2829} as nvarchar(1))
   +'|'+ Cast({WFCONCOL:2830} as nvarchar(1)) 
   +'|'+ isnull(Cast({WFCONCOL_ID:2832} as nvarchar(1)),0)
   +'|'+ isnull(Cast({WFCONCOL_ID:2831} as nvarchar(1)),0)    as Id
   as Id
```

{: .notice--warning}
**Remark:**
Make sure you don't return `null` values. If you use `+` and have a `null` value the whole string is `null`.

{: .notice--warning}
**Remark:**
Make sure that your values don't contain `;` or `#` these may lead to unexpected behavior. The `;` is used as a delimiter for multi value choice fields. The `#` delimits the the id from the display name of a choice field. Therefore you need to replace these characters if your values may contain these.

## Setting target fields
At this point we have:
- A drop down with an id.
- The id consists of the original id.
- and the values of the target fields.


Now we need to set the columns using the [Form rule to be executed on value change](https://docs.webcon.com/docs/2023R2/Studio/Process/Attribute/Basic/Itemlist/ColumnConfig/IL_Behavior)  option.
{% include figure image_path="/assets/images/posts/2023-11-27-settings-target-field-with-a-drop-down/2023-11-27-21-41-07.png" alt="Setting the values of the target fields." caption="Setting the values of the target fields." %}

1. The id concatenates the values using the `|` instead of `;` to prevent any issues. We have to revert this using the `String replace` function. Since a regular expression is used to for replacing, we need to escape the `|` using a `\`. The value of the second parameter is `\|`.\
2. Once we replaced the `|` delimiter with a `;` we can now use the `Get at index` function to get a specific value in the string.\
3. The above is used as a value to set the column using the `Set row value` function.




