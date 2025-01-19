---
title: "Reduced item list size (width)"
categories:
  - WEBCON BPS
  - Private 
tags:
 - User Experience 
 - Fields
excerpt:
    "Tired of scrolling to the right? This may be an alternative for you."
bpsVersion: 2025.1.1.23
---

# Overview
During the first WEBCON TAG in Germany this year I was asked, whether we could somehow improve working with a long item list. The question /requirements was,
- Can we hide the columns, but display them in the single row edit dialog?
- If we hide them, we need some alternative to show the most important information.

My answer immediate answer was that it should be possible, but it took a while until I could back to this topic. The release of WEBCON BPS 2025 played a major role in this delay. 
While implementing my idea I added one additional requirement: 
- The `Edit all rows` functionality should still be possible.

While the example may not be meaningful, I'm quite satisfied with the solution.


{% include video id="o5HX8l-muSo?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


# Implementation
## Overview
You might be surprised, but the solution uses pure CSS. Since the columns/important information will be different for each item list, there are no global constants, rules or whatever.


## Hide columns with CSS
As already mentioned, the requirements for hiding / showing the columns are handled with pure CSS. Of course, we may not hide columns of another item list therefore we need to:
- Make sure that the rules only apply to the columns of the item list. 
 `#SubElems_#{WFCON:1129}#`
- Hide the column header, but only if it's not in `Edit all` mode. The header has a special class in this case.
  `& th[data-key^="#{SFLD:160}#"]:not(.subelement-header-cell--edit-mode)`
- Hide the body cell, but only if it's not in `Edit all` mode. There's a special class in the read mode we can use.
  - WEBCON BPS 2023: `& td[data-key="#{SFLD:160}#"]:has(.form-control-readonly)`
  - WEBCON BPS 2025: `& td[data-key="#{SFLD:160}#"]:has(.input--read-only)`
- If we don't need the summary column in the single edit dialog we can hide it. We need to use the id also, otherwise it is not uniquely identified.
  `#SubelementsEditView ##{SFLD:159}#[data-id="#{DCN:159}#"]`



Below you can find the full CSS. After you copy this, you only need to replace the variables.
```css
<style>
/* hide the columns */
#SubElems_#{WFCON:1129}# {
   & th[data-key^="#{SFLD:160}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:160}#"]:has(.form-control-readonly) {display:none}
   & th[data-key^="#{SFLD:161}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:161}#"]:has(.form-control-readonly) {display:none}
   & th[data-key^="#{SFLD:150}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:150}#"]:has(.form-control-readonly) {display:none}
   & th[data-key^="#{SFLD:152}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:152}#"]:has(.form-control-readonly) {display:none}
   & th[data-key^="#{SFLD:156}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:156}#"]:has(.form-control-readonly) {display:none}
   & th[data-key^="#{SFLD:158}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:158}#"]:has(.form-control-readonly) {display:none}
   & th[data-key^="#{SFLD:153}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:153}#"]:has(.form-control-readonly) {display:none}
   & th[data-key^="#{SFLD:155}#"]:not(.subelement-header-cell--edit-mode),& td[data-key="#{SFLD:155}#"]:has(.form-control-readonly) {display:none}
}
/* hide the summary column in the single edit dialog */
#SubelementsEditView ##{SFLD:159}#[data-id="#{DCN:159}#"] {display:none}
</style>
```

![A HTML field rendering the CSS which is hiding the columns](/assets/images/posts/2024-12-07-reduced-item-list-size/2025-01-17-21-43-46.png)

{: .notice--info}
**Info:** I already mentioned it but the value inside the has() function depends on the WEBCON BPS version you are using. If you are thinking of using this it may be a good idea to store this value in a global constant, if you are not on 2025 yet. This way you only need to change one value after an update.


## Summarizing hidden columns
In most cases we probably can't simply hide columns, instead we may need to provide an alternative representation. For example, a summary in which we can also use some styling to highlight important information.

![Displaying the hidden information in a summary](/assets/images/posts/2024-12-07-reduced-item-list-size/2025-01-17-21-41-49.png)

This can be achieved using a data row column. In my case, I decided to display the information of the hidden rows in separate rows and highlight missing information in red. The choose fields contain multi language information, so I needed to get the value for the current user language.

For simplicity reasons I decided to hard code the column names in the SQL statement. In a real solution I would either use the `Text` function of a business rule for translation purposes or get the columns names from the translation table of the database.  


```
select string_agg(summary,'<br/>') as Summary
from (
select 1 as Sorting, concat(
   'Inspection necessary: '
  , ( case 
            when '{SN:170}'  = '' then '<span style="color:red">Not set</span>' 
           else dbo.ClearWFelemAdvLanguage('{SN:170}','{USERLAN}')
        end)
  ,' <br/>Date ({SDY:172}-{SDM:172}-{SDD:172})') as summary
union
select 2 as Sorting, concat(
   'Repair necessary: '
  , ( case 
            when '{SN:173}'  = '' then  '<span style="color:red">Not set</span>' 
           else dbo.ClearWFelemAdvLanguage('{SN:173}','{USERLAN}')
        end)
  ,' <br/>Date ({SDY:163}-{SDM:163}-{SDD:163})') as summary 
union
select 3 as Sorting, concat(
   'Repaired: '
  , ( case 
            when '{SN:165}'  = '' then  '<span style="color:red">Not set</span>' 
           else dbo.ClearWFelemAdvLanguage('{SN:165}','{USERLAN}')
        end)
  ,' <br/>Date ({SDY:167}-{SDM:167}-{SDD:167})') as summary
union
select 4 as Sorting, concat(
   'Handed over: '
  , ( case 
            when '{SN:169}'  = '' then  '<span style="color:red">Not set</span>'  
           else dbo.ClearWFelemAdvLanguage('{SN:169}','{USERLAN}')
        end)
  ,' <br/>Date ({SDY:171}-{SDM:171}-{SDD:171})') as summary
) as temp
```

![The 'Summary' is a data row column.](/assets/images/posts/2024-12-07-reduced-item-list-size/2025-01-17-21-42-53.png)

## Progress / status column
While I implemented the summary column I was wondering, whether we shouldn't add a progress/status column. This way the users can easily skip unimportant rows. 'Normal' item list may also benefit from this column.

![The progress bar shows, whether there's something to do.](/assets/images/posts/2024-12-07-reduced-item-list-size/2025-01-17-22-00-48.png)

This can easily been achieved using the standard functionality of a [data row colum](https://docs.webcon.com/docs/2025R1/Studio/Process/Attribute/Basic/Itemlist/BasicColumns/SelectColumn) and setting it to `Indicator`.

![Showing a progress column for an item list row.](/assets/images/posts/2024-12-07-reduced-item-list-size/2025-01-17-21-56-10.png)