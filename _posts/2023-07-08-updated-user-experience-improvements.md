---
title: "Updated 'user experience improvements'"
categories:
  - WEBCON BPS  
  - CC LS
tags:
  
excerpt:
    An overview about changes to 'user experience improvements' after moving to WEBCON BPS 2023.
bpsVersion: 2023.1.1.89, 2022.1.4.155
---

# Overview  
WEBCON BPS 2023 replaced jQuery with [cash](https://github.com/fabiospampinato/cash/blob/master/docs/migration_guide.md). This required changes in some form rules I used for "user experience" improvements. In addition, there was at least a change in the classes for the top toolbar.
I've finally come around to update the JavaScript of the listed improvements. I tested it against 2022.1.4.155 and 2023.1.1.89, so you shouldn't have a problem with these once you upgrade.
  
Besides the changes, I added small improvements to the current behavior.



# Save draft path as button / save button as path
In BPS 2023 the classes of the top toolbar button changed. 

Functional changes
- It's possible  different classes which would be valid for a WEBCON BPS version.
- The save draft path is now hidden in the `Available paths` button group
- The 'save' path button will check whether [Revised uniform path button styling](https://daniels-notes.de/posts/2023/path-button-styling-revisited) is available. If it is the light or dark theme class will be used. 


{: .notice--warning}
**Remark:** I thought about moving it to the new implementation using form fields, but it's used in to many applications. So, I didn't want to update them.

Original post: [Unified save experience](/posts/2021/unified-save-experience)\
Github location: [Save and save draft Folder](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/Save%20and%20save%20draft)

# Modal dialog
  
Functional changes:
- jQuery usage removed.
- The opened child dialog will reuse the current theme. May have been different if the embedded them is different from the user.
- Closing the dialog will release the checkout of the element. There may be entries in the developer tools console which are like "extend checkout" failed. I couldn't pin them down, but I assume that it's a timing issue. When the X is closed on the dialog, the child element releases the checkout. Afterwards the child informs the parent dialog, that it's released which in turn finally closes the dialog. Maybe the "extend checkout" is called during this timespan.
- In addition to [Adding a new entry to a dictionary](/posts/2022/modal-dialog#adding-a-new-entry-to-a-dictionary) it's also possible to update a cell in an item list row. 
  It uses the same approach but has a different function and the additional parameters `targetColumn, row`.
  ```js
  // internal function for setting the field, can be called from a custom function
  // can be used to populate a picker which uses the instance id as id of the picker value of an item list
  // if row is not provided or -1 the last row will be used.
  ccls.modal.dialog.closeFunctions.setInstanceIdForItemListColumn = function (parameters, targetItemList, targetColumn, row) {
  ccls.modal.dialog.closeFunctions.setGuidForItemListColumn = function (parameters, targetItemList, targetColumn, row) {
  ```



Original post: [Modal dialog v3](/posts/2022/modal-dialog)\
Github location: [ModalDialog Folder](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/ModalDialog)

# Breadcrumb

Functional changes:
- jQuery usage removed.
- The return url no longer contains the hostname and protocol if the user uses the breadcrumb for navigation.
- Navigation using the breadcrumb will release the checkout of the current element. 
- The title of the breadcrumb elements contains the instance id. The title is displayed on hover.
- The modal dialog was added to high in the DOM. It could happen, that there would be multiple dialogs stubs in the DOM including events for the buttons. Which could lead to multiple "Do you want to leave messages". At least I hope that this is fixed now.

Original post: [A breadcrumb for navigating workflow hierarchy ](/posts/2023/breadcrumb)\
Github location: [Breadcrumb folder](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/breadcrumb)


