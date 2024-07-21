---
regenerate: true
title: "Conditional editing/deleting of item list rows"
categories:
  - WEBCON BPS 
tags:  
  - Item lists
excerpt:
    If you have an item list in which some rows shouldn't be deleted, this post is for you.
bpsVersion: 2023.1.3.118
---

# Overview
I've run into a few requirements over the years in which I needed to prevent that some item list rows should be edited, left alone being deleted. If this applies to all rows, this is straight forward, while it gets a bit tricky, if some should be deletable while others may be editable without being deletable. Unfortunately, my old solution doesn't work for this anymore and I needed to come up with a new one.

In this post I will describe the new solution in a simplified use case where an item list is used for starting sub workflows and the sub workflow id is stored in an item list column. I will also describe the old solution as it may inspire others.

{% include video id="Xksbm1rRkII?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}



{: .notice--warning}                                                 
**Remark:** I have to admit that I don't like the new solution, simply because I hate configuring forms on step level. That being said, maybe some upvotes could help this user voice: [Adding virtual column for clone/delete/edit action](https://community.webcon.com/forum/thread/2188?messageid=2188).


# New solution
## Conditional disable item list row editing/deleting
This makes use of the seldomly used [Acceptance](https://docs.webcon.com/docs/2023R3/Studio/Workflow/Step/Step_FormView/module_2_4_7_5_3_4) functionality of an item list. At least I can count the number of times I used it at one hand. It is the second tab of the configuration options only available when the form is configured on step level.
{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-20-48-14.png" alt="Acceptance is configure per step." caption="Acceptance is configure per step." %}

I won't go into further details about the configuration options, as they are pretty much self-explaining. So, I will just focus on the small part how to determine, whether a row should be editable. Since this configuration allows the current user to edit a row, when the user selected in a column, I'm using the Query SQL/CAML option to return the current user, if the row should be editable. I'm not sure whether it was intended to be used like this, but it is working. :)
{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-21-06-12.png" alt="Return the current user, if the row should be editable." caption="Return the current user, if the row should be editable." %}

```sql
select '{I:CURRENTUSER}' as Dummy
where '{SFD:137}' = ''
```
{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-21-07-31.png" alt="Row is not editable and cannot be deleted, if the workflow id column has a value." caption="Row is not editable and cannot be deleted, if the workflow id column has a value." %}

## Making cells editable
If the `Acceptance` configuration determines, that a row is not editable, it is not editable. It takes precedence over any field configurations. 

If you want to make a cell of a disabled row editable, you can work around this by using form rules in combination with JavaScript.

There's no build in function to mark a cell as editable or not. Here we need a form rule of type JavaScript (1) with three parameters (2):
1. Item list
2. Field, which should be enabled/disabled.
3. Enabled to define, whether the field should be editable or not.


{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-21-29-02.png" alt="" caption="" %}

The JavaScript will disable or enable the defined column in the current row of the provided item list.
```javascript
console.log(uxContext);
let itemList = #{BRP:98}#.id
let targetFieldName = #{BRP:99}#.fld
let enabled = #{BRP:100}#
let currentRowNumber = uxContext.getCurrentRowNumber()

// Enable/disable input, div and buttons; div and  buttons need to be disabled for picker fields
// we need to use attr or removeAttr because $.prop does not work
if (enabled == false)  {
  document.querySelector(`#SubElems_${itemList } tr[data-index='${currentRowNumber }'] td[data-key='${targetFieldName }'] input`).setAttribute("disabled","disabled");
  document.querySelector(`#SubElems_${itemList } tr[data-index='${currentRowNumber }'] td[data-key='${targetFieldName }'] .input-group-control__input`).classList.add("input-group-control__input--disabled")
} else{
  document.querySelector(`#SubElems_${itemList } tr[data-index='${currentRowNumber }'] td[data-key='${targetFieldName }']  input` ).removeAttribute("disabled");
  document.querySelector(`#SubElems_${itemList } tr[data-index='${currentRowNumber }'] td[data-key='${targetFieldName }']  .input-group-control__input` ).classList.remove("input-group-control__input--disabled")
}
```

We need another form rule, this time of type `Form rule` (1). It iterates through all existing rows (2) and calls the previous form rule (3) and passes the item list and column to enable. I'm using an if here, so that the JavaScript form rule is only executed for the disabled rows. 

{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-21-21-26-02.png" alt="" caption="" %}

{: .notice--info}
**Info:** You can make use of this form rule in other cases too. Instead of passing `True` you could use a function as a parameter which returns true or false.

{: .notice--warning}
**Remark:** As this is a workaround, it may cease to work in other version if the DOM changes, internal JS changes to the parameters or due to other factors. The querySelectors works for the mentioned version, you may need to update these for older / newer versions.


All that is left is to create a HTML field (1) which calls the form rule with the foreach row function and place this after the item list in the form. Of course, it needs to be visible in the field matrix. It's mandatory, that it's placed after the item list, otherwise the rows wouldn't be part of the DOM yet and the JavaScript function couldn’t modi-fy the elements.
{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-21-46-25.png" alt="The function is executed via an HTML fields which is rendered after the item list." caption="The function is executed via an HTML fields which is rendered after the item list." %}


{: .notice--warning}
**Remark:** I've no idea why this works even after the user clicked on a column header to change the sorting, but it does. At least in this version.

# Old solution

## Implementation
I'm using the same use case for this and the delete action should be hidden, if the column with the sub workflow id has a value.

The data row generates a styling targeting the delete action `.subelements-action-button__delete-row` of the current item list and row. The SQL uses the char function to generate the `{}` brackets to prevent that the values in between those are interpreted as variables.
```sql
select 
case when '{SFD:146}' <> '' then '<style>#SubElems_{WFCON:1028} tr[data-index=''{S:DET_LP}''] .subelements-action-button__delete-row'+char(123)+'display:none'+ char(125)+'</style>'
end as HideDelete
```

{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-20-31-59.png" alt="Data row definition to hide the delete action." caption="Data row definition to hide the delete action." %}

The column needs to be rendered, so that the CSS will be part of the page which in turn will hide the action. Therefore, it has to be visible in the field matrix but we can hide with CSS using an HTML field.

```html
<style>
#SubElems_#{WFCON:1028}# th[data-key='#{SFLD:144}#_#{DCN:144}#'],
#SubElems_#{WFCON:1028}# td[data-key='#{SFLD:144}#']  {
display:none
 }
</style>
```

{% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-20-36-41.png" alt="Hiding the 'hide delete' data row column." caption="Hiding the 'hide delete' data row column." %}
## Why it is broken
Unfortunately, my favorite solution has been broken because of three changes in the later WEBCON BPS versions.

1. Sorting of item lists <br/>
   The css will hide the action for the second row, regardless original row is now at a different position because of the user sorting.
   {% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-20-43-32.png" alt="" caption="" %}
1. Context menu for row actions in a small window. <br/>
   We cannot target the dialog with the row action, if it's opened from a context window.
   {% include figure image_path="/assets/images/posts/2024-07-21-conditional-allow-deleting-item-list-rows/2024-07-07-20-43-58.png" alt="" caption="" %}
2. In 2023.1.3.202 the `style` element is now longer [outputted as an HTML element](https://community.webcon.com/forum/thread/5247) in a data row. 

