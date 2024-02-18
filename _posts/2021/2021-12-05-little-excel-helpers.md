---
title: "Little excel helpers for WEBCON BPS"
categories:
  - WEBCON BPS  
tags:
  - Snippet
excerpt:
    A description of a few helpers to speed up some SQL commands for WEBCON BPS.
bpsVersion: 2021.1.3.205
---

# Overview  
This post will explain two excel worksheets I created for speeding up the creation of SQL commands while preventing errors.
The other one is just a collection of template SQL commands for the most common cases.

{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-22-03-32.png" alt="Generated multilingual picker options" caption="Generated multilingual picker options" %}

# SQL command for fixed values used in a picker field
At some point in time WEBCON BPS introduced the fixed value list, I'm not a fan of it, as you can read [here](https://daniels-notes.de/posts/2021/series-expert-guide-part-6#decision-fields). I prefer a simple SQL command using constants as Ids (1). In addition, I always use multilingual labels (2) and provide a value for `Empty element display name` (3).

{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-11-25-22-36-17.png" alt="My favorite type of picker uses constants (1) and multilingual labels (2) with a value for `Empty element display name`, if it doesn't use workflow data" caption="My favorite type of picker uses constants (1) and multilingual labels (2) with a value for `Empty element display name`, if it doesn't use workflow data" %}

Depending on the number of options, it can take a few annoying minutes to set everything up correctly. I don't like repetitive work so I "misused" Excel for generating the necessary SQL command. I only need to provide the ids (1), in this case unsaved process constants, and labels for each option (2). 

{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-20-44-14.png" alt="Excel worksheet for providing ids (1) and labels (2) to create multilingual picker data" caption="Excel worksheet for providing ids (1) and labels (2) to create multilingual picker data" %}

{: .notice--info}
**Negative constant Ids:** Any new, unsaved elements get's a negative number, which 'increases' from -2 to -3. If you have the first one correct, you can just 'increment' it for the others. If you group the constants, you can simply use the same id, and right click on each in the designer, to select another one from the group. If you don't know what I'm talking you can read up on it [here](https://daniels-notes.de/posts/2021/series-expert-guide-part-5#getting-translations-via-business-rules).


Afterwards you can copy the complete SQL command form A19 (3) into the expression editor, remove the highlighted double quotes, which Excel adds automatically due to the line breaks characters in the cell. Depending on the situation the values of the constants need to be updated with the correct ones.
{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-11-25-22-45-34.png" alt="Copy generated command from Excel (1) to the expression editor, remove the double quotes and optionally fix the constant ids." caption="Copy generated command from Excel (1) to the expression editor, remove the double quotes and optionally fix the constant ids." %}

The only thing left to do is to open the xml configuration (1) and copy the content of A21 (2) into it and remove the leading and trailing double quote again. 

{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-20-49-19.png" alt="Copy the advanced configuration from the Excel cell A21 and remove the leading and trailing quotes" caption="Copy the advanced configuration from the Excel cell A21 and remove the leading and trailing quotes" %}

The advanced configuration has default values for `Empty element display names`, as well as activated multilingual labels.
{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-22-19-33.png" alt="The copied configuration has default values for `Empty element display names`" caption="The copied configuration has default values for `Empty element display names`" %}

The logic can be found in the downloadable excel file in worksheet "Choice field".

{: .notice--info}
**Question:** If anyone knows how to get rid of the leading and trailing double quotes I would like to know it. 

# Creating multilingual icon html tags
This helper simplifies creating SQL commands rendering `Office UI Fabric Icons` with multilingual labels. As with the picker helper above, it will hurt more adding multilingual labels later, than doing it right from the start.
{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-20-58-01.png" alt="An `Office UI Fabric icon` is rendered with multilingual labels" caption="An `Office UI Fabric icon` is rendered with multilingual labels" %}

If you are in the need of something like this, for example if the traffic light indicator is not sufficient, you can use the work sheet 'Multilingual icon'. You only need to select an icon (1), decide whether you want to render the icon title as a 'label' (2) and define the multilingual labels.

{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-22-21-49.png" alt="The SQL command is prepared by choosing an icon (1), opting for a rendered text (2) and providing the translations " caption="The SQL command is prepared by choosing an icon (1), opting for a rendered text (2) and providing the translations (3)." %}

Afterwards you can simply the cell value from A16 (1) to the SQL command and remove the trailing / leading double quotes.

{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-21-15-10.png" alt="Copy cell A16 to SQL command, in this case it's a calculated formula." caption="Copy cell A16 to SQL command, in this case it's a calculated formula." %}

This is intended to be used in a case statement. If you want to use this as a simple column value, you need to provide a name `... end as ColumnName`
{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-21-17-39.png" alt="Nesting multiple icons in an outer case statement" caption="Nesting multiple icons in an outer case statement" %}

{: .notice--warning}
**Remark:** The `<i>` must be closed by a separate tag `<i></i>` using `<i/>` will cause unintended css side effects.

{: .notice--info}
**Remark:** If you want to 'replace'  the default indicator with icons, you should define a few global classes and use these. Coloring is not handled by the excel helper. You could add it of course.\
{% include figure image_path="/assets/images/posts/2021-12-05-little-excel-helpers/2021-12-05-21-29-14.png" alt="" caption="" %}

Sample classes for an extended traffic light indicator.
```css
.overDue-Icon::before{
content:"\E7BA";
font-size:large;
font-weight:bold;
color:red;
}
.immediatlyDue-Icon::before{
content:"\E919";
font-size:large;
font-weight:bold;
color:orange;
}
.soonDue-Icon::before{
content:"\F0D0";
font-size:large;
font-weight:bold;
color:orange;
}
.enoughTime-Icon::before{
content:"\EA17";
font-size:large;
font-weight:bold;
color:blue;
}
.finished-Icon::before{
content:"\E73E";
font-size:large;
font-weight:bold;
color:green;
}
````

If you want to uses these classes in a report, you should take a look [here](https://community.webcon.com/forum/thread/45?messageid=45) and scroll down.

# SQL Command templates
The worksheet `SQL Command templates` contains just what you can expect. A selection of typical SQL commands which only need to be adjusted for the specific use case. If you are wondering, why I'm explicitly filtering the `WFD_COMID`, which is the business entity id, there's a simple answer. I once didn't think of it which led to some unexpected results. Having this in the template, I will see it, and can decide whether I need it. The same applies to DET_WFCONID, which is more likely to cause problems. Everything will be fine when you start with one item list, after you added a second once, everything will break down.


# Download
The excel file can be downloaded from this [repository](https://github.com/Daniel-Krueger/webcon_helpers/tree/main/excel_helpers).\
[Direct download](https://github.com/Daniel-Krueger/webcon_helpers/raw/main/excel_helpers/WEBCON%20BPS%20Helpers.xlsx)

