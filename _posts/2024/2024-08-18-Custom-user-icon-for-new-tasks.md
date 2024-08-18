---
regenerate: true
title: "Custom user icon for new tasks"
categories:
  - WEBCON BPS 
tags:  
  - JavaScript
  - User Experience

excerpt:
  Returning from vacation and you have no idea, whether someone has even looked at their assigned tasks? Let's change the icon in the info panel.
bpsVersion: 2023.1.3.202
---

# Overview
Before I went on vacation, I assigned a few tasks. Some of those have a due date in the future, while others should have been completed during my vacation. When I was looking at those tasks, I didn't even know, whether the persons even have taken a look at those. This was the birth of the idea, to display whether the assigned person has at least opened the task (workflow instance).


{% include video id="yt42wQwXdAM?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


# Implementation
## Overview
The basic requirements are quite simple.
1. We need to distinguish whether a user viewed a task or not. Since WEBCON BPS already takes care of it, we only need to fetch the relevant data.
2. Change the icon of those tasks, which have not been viewed.


If you are a regular visitor of my blog, you will have a pretty good idea, what approach I will use.
1. Create a global business rule
2. Create a global form rule
3. ~~A HTML field in the form.~~ Execute the form rule on form load.
   
This time we cannot use a HTML field but need execute it during form load. The reason for this is timing of the DOM rendering. The info panel is not yet part of it when all form fields have been created. Of course, I could have used `setTimeout` with an appropriate delay, but this may differ for each form. Using the on load event allowed me to remove the timeout. In case this doesn't work in all cases, I didn't remove this option.

## Global business rule
WEBCON BPS already takes care of the problem, whether a user viewed a task or not. If the user didn't view it, the task panel will display it in the `New` tab.

{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-12-12-24.png" alt="WEBCON BPS distinguishes between `New` and `My` (viewed) tasks." caption="WEBCON BPS distinguishes between `New` and `My` (viewed) tasks." %}

This makes it quite easy for us, as we only need to create a business rule with a SQL command.

```
Rule name: GetNewTasksIds
Description: Return a comma separated list of those tasks ids, which haven't been displayed to a user.

```

```sql
SELECT STRING_AGG([TSK_ID],',')
FROM [dbo].[ActiveTasks]
where TSK_WFDID = {WFD_ID} and TSK_ElementWasDisplayed = 0
```

{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-18-42-11.png" alt="Global business rule to return the new / not displayed tasks." caption="Global business rule to return the new / not displayed tasks." %}

{: .notice--warning}
**Remark:** If you are using an older WEBCON BPS Version the table `ActiveTasks` may not exist in your database. Unfortunately, I don't remember the version in which the tasks table was split into active tasks and history tasks.

{: .notice--warning}
**Remark:** The function [STRING_AGG](https://learn.microsoft.com/en-us/sql/t-sql/functions/string-agg-transact-sql) was added to SQL Server 2017. The compatibility level of your database has to be at least 140 to use it.


## Global form rule
The second step is creating the form rule. I wanted to make it easy to use. Therefore, I wanted to use the business rule directly in the form rule, but at least in version 2023.1.3.202 this causes an error.
{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-11-59-42.png" alt="Using business rules directly in a JS form rule causes an error in 2023.1.3.202" caption="Using business rules directly in a JS form rule causes an error in 2023.1.3.202" %}

Therefore, I opted for adding parameters and call the `init` function using those parameters.
{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-12-41-30.png" alt="Form rule with parameters." caption="Form rule with parameters." %}

You can [download](#download) the JS of for this form rule from the repository. After pasting the content you need to add this line where you need to modify the parameters, to match yours.

``` js
dkr.changeUserIconForNewTasks.init(#{BRP:104}#,#{BRP:105}#)
```

I used these names and descriptions for the the rule and parameters.

```
Name: ChangeUserIconForNewTasks
Description: The JS logic to change the "assigned to" user icon, in case the task has not be viewed.
Parameter 1:
  Name: TaskIds
  Description: The ids of the tasks in a comma separated string. 
Parameter 2:
  Name: FormRenderingTime
  Description: Optional. Time in milliseconds which should be waited until the logic is execute. This may be necessary if the form takes a long time to render.
  
```

## Executing on page load
The last step is it to utilize the form and business rule during [on page load](https://docs.webcon.com/docs/2024R1/Studio/Workflow/Forms/Workflow_Behavior).

{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-12-49-17.png" alt="Executing the global form rule on page load." caption="Executing the global form rule on page load." %}


# JS explanation
## Different icon for new tasks
If you want to use a different icon, you can update this line in the code. WEBCON BPS utilizes the fabric icons, which can be viewed [here](https://uifabricicons.azurewebsites.net/).

```js
dkr.changeUserIconForNewTasks.newTaskIcon = "ms-Icon--D365TalentInsight"
```
## Attached events
The user button can click on the info button (1) to hide or show the info panel. If the panel is displayed the user may also be able to display the [statistics](https://docs.webcon.com/docs/2024R1/Portal/Form/#4-info-panel) (2). Whether this option is available depends on the form field matrix and the permissions of the users. 

If the user clicks on either action, the info panel with the assigned persons is removed from the DOM. This includes the changed icons.

{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-18-10-05.png" alt="Actions which may hide the assigned persons." caption="Actions which may hide the assigned persons." %}

We handle those cases by attaching an event to the info button (1) and the `Details` tab to execute the action, which changes the icon, again. But this is not all. If the info panel is hidden completely, the `Details` tab is removed including the attached event. Therefore, we need to add this event again whenever the info panel is displayed again.

There's a small delay between the click of the user and the updated DOM. This is the reason, why the functions are executed with a little delay. For example, the click on the info button will queue a timeout which will attach the click event and update the icons, if necessary.

```js
// Clicking on the info button adds or removes the 'Details' panel from the DOM. Therefore, we need to:
// 1. Add the click event to the Details 'button' 
// 2. Update the icons 
dkr.changeUserIconForNewTasks.infoButtonClick = function () {
    setTimeout(() => {
        dkr.changeUserIconForNewTasks.attachInfoPanelDetailsClick();
        dkr.changeUserIconForNewTasks.changeIcons();
    }, dkr.changeUserIconForNewTasks.DOMUpdateDelay);
}
```

The default value for the delay is 50 ms. This can be updated with the line

``` js
dkr.changeUserIconForNewTasks.DOMUpdateDelay = 50;
```

## Init function
This function accepts the comma separated list of task ids and an optional parameter to delay the execution in which the form rendering should have been completed.

``` js
dkr.changeUserIconForNewTasks.init = function (nonDisplayedTasks, formRenderingTime)
```

In this blog I called this function in the global form rule itself. An alternative would be to use a HTML field, create a rule without parameters, invoke the  form rule .and execute the init function.

{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-18-26-53.png" alt="Alternative option to call the init function." caption="Alternative option to call the init function." %}


# Data privacy and unions 
Living in Germany I'm relatively sensible to data privacy and who may see which information about colleagues and their working behavior. I'm not sure whether this could be an issue in this case. The solution makes it visible, whether a task has been viewed but not when.

If this has to be limited to specific users, you could either update the business rule or wrap the form rule in an `If`  condition to fulfil your specific requirements.



# Download
You can find the full and a minified JS version [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/changeUserIconForNewTasks).

If you are interested in the fact, that there's a minified version at all, you can take a look at the post [Bandwidth usage](/posts/2023/bandwidth-usage).