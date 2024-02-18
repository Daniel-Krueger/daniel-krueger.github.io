---
title: "Delete complex workflows"
categories:
  - WEBCON BPS   
  - Private  
tags: 
  - Best practice   
excerpt:
    This is a short overview, of the easiest way to delete a complex application I found.
bpsVersion: 2023.1.3.29
---



# Overview
This is a checklist on how to delete a complex application. Complex is not necessarily the best word, interwoven is a more appropriate one. For example:
- Two applications have own processes but also have a process relation to the other one.
- The processes interact with each other. A workflow in one process starts a sub workflow in another process, which in turn updates the first one.
- The processes have choose fields, which are used to connect other workflows/display data from them using `BPS internal views`.

{% include figure image_path="/assets/images/posts/2024-02-13-delete-processes/2024-02-13-19-58-23.png" alt="Process usage in a complex application." caption="Process usage in a complex application." %}

# Checklist
## 1. Delete data
The first step is to delete all workflow instances. The easiest way is to use the administration tools to use the function [Delete workflow instances from a process](https://docs.webcon.com/docs/2023R3/Studio/AdminTools/DeleteElementsFromProcess).

You will have to start with the lowest workflow, as you can not delete a workflow if it has a sub workflow. 
If you have a situation where a parent workflow has a sub workflow which again could start a parent workflow, then you need to take another approach to delete the workflow instances. For example you could create a [Delete selected workflows](/posts/2022/delete-selected-workflows) process.

## 2. Change BPS internal views
In case you are using `BPS internal views` in data tables, data rows or choose fields to display data from process in another, you will receive an error. At least if both processes are in the application you want to delete. The easiest way to work around this, is to change the BPS internal view to some other process which won't get deleted. It's not important that this would break the processes because the selected fields from the internal view no longer exist. You want to delete it anyway. :)

{% include figure image_path="/assets/images/posts/2024-02-13-delete-processes/2024-02-13-20-01-30.png" alt="Select a process which won't be deleted" caption="Select a process which won't be deleted" %}

In the past I deleted all fields, this takes far longer. Especially if they are used in turn in form rules, business rules or actions.



## 3. Delete presentation elements
The fastest way to delete the presentation elements, is to use the keyboard shortcuts in the designer studio.
Start with the Dashboards, continue with Reports and finally with the Start elements.
For each group:
1. Select the last element
2. Hit ctrl+del
3. Followed by left arrow key and enter

Repeat 2 and 3 until everything in the group is removed. Since you deleted the last element the previous one will automatically be selected.
{% include figure image_path="/assets/images/posts/2024-02-13-delete-processes/2024-02-13-20-05-04.png" alt="Start with deleting the last element." caption="Start with deleting the last element." %}

## 4. Move related processes
If you have multiple applications, which use related processes, move them all to a single application.

## 5. Delete the application
Last but not least, you can finally delete the application. At least you are a big step in the direction.

# Cleanup
After you deleted the application, you should do a little clean up:
- Delete BPS Internal views
- Check usage and delete
    - Constants
    - Global business rules
    - Global form rules
    - Connections
    - Data sources  
