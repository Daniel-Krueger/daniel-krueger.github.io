---
regenerate: true
title: "Info panel extensions"
categories:
  - WEBCON BPS 
tags:  
  - JavaScript
  - Form rules
  - User Experience
  - Microsoft Teams
excerpt:
  "Additional information:  Has the user viewed the task, start a Teams chat, hover over a group to view it's members."
bpsVersion: 2023.1.3.289
---

# Overview
Since WEBCON BPS 2023 R1 it is possible to [Assigning tasks to groups](https://community.webcon.com/posts/post/assigning-tasks-to-groups/387/3) instead of assigning the tasks to the members directly. This has the benefit that any added group member can see the existing tasks.

This was not the case when the tasks have been assigned directly to the group members before. While this is a great improvement, it also has a little drawback. Others may not necessarily know who's part of the group. Therefore, I was asked, whether we could show who's a member of a group, when the mouse is over the group name. Based on my past experiences I replied with "Yes" without thinking about it at all. Luckily, it was actually really easy, at least for me. I 'just' needed to put different stuff together and I also signed up for the GitHub Copilot trial to test it a bit.

{% include video id="VCy1utjGQY8?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


# Implementation
## Overview
I already created two features which modified the details tab of the info panel:
1. [Custom user icon for new tasks](/posts/2024/custom-user-icon-for-new-tasks), 
2. [Start Teams chat with assigned users](/posts/2024/start-teams-chat-with-assigned-users)

  
Instead of creating a third one I decided to merge those and the new functionality together into one with. The functionalities can then be selected for a given process. 

Therefore, I will also merge the implementation / configuration details here. I will skip most of the explanations for the 'Start Teams chat' and 'Custom user icon' feature. You can refer to the old posts for these.

We need: 

1. Global business rules
  If you don't intend to a specific functionality, you can skip the creation of the necessary business rule.
2. Global form rule
3. HTML field
4. Global css
 
{: .notice--warning}
**Remark:** The global business rule for the 'New task' has changed slightly because I wanted it to align to the other business rule. If you already have this one in your system you need to update it.

## Global business rule
### Custom user icon
WEBCON BPS already takes care of the problem, whether a user viewed a task or not. If the user didn't view it, the task panel will display it in the `New` tab.

{% include figure image_path="/assets/images/posts/2024-08-18-Custom-user-icon-for-new-tasks/2024-08-18-12-12-24.png" alt="WEBCON BPS distinguishes between `New` and `My` (viewed) tasks." caption="WEBCON BPS distinguishes between `New` and `My` (viewed) tasks." %}

This makes it quite easy for us, as we only need to create a business rule with a SQL command.

```
Rule name: GetNewTasksIds
Description: Return a comma separated list of those tasks ids, which haven't been displayed to a user.
```

```sql
SELECT '[' + isnull(STRING_AGG([TSK_ID],','),'') +']'
FROM [dbo].[ActiveTasks]
where TSK_WFDID = {WFD_ID} and TSK_ElementWasDisplayed = 0
```

{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-10-15-19-07.png" alt="Global business rule to return the new / not displayed tasks." caption="Global business rule to return the new / not displayed tasks." %}

{: .notice--warning}
**Remark:** If you are using an older WEBCON BPS Version the table `ActiveTasks` may not exist in your database. Unfortunately, I don't remember the version in which the tasks table was split into active tasks and history tasks.

{: .notice--warning}
**Remark:** The function [STRING_AGG](https://learn.microsoft.com/en-us/sql/t-sql/functions/string-agg-transact-sql) was added to SQL Server 2017. The compatibility level of your database must be at least 140 to use it.
### Support call recipients

This rule returns the recipients of the message. The provided rule will return the recipients in the following priority:
- Process supervisor<br/>
  ![You can define a dedicated process supervisor](/assets/images/posts/2024-10-12-start-teams-chat-with-support/2024-10-12-17-22-46.png)
- Custom application supervisor or the BPS user<br/>
  ![Application supervisor definition](/assets/images/posts/2024-10-12-start-teams-chat-with-support/2024-10-12-17-23-35.png)
- The fallback support team.


I've created the following global business rule with the provided SQL command.

```
Rule name: GetSupportCallRecipients
Description: Returns either: Process supervisor, application supervisor or default support team.

``` 

```sql
select isnull(ISNULL(ProcessSupervisor,ApplicationSupervisor),Fallback) as Recipients
from 
( select
	(
                  select case when DEF_Supervisor = '' then null else dbo.ClearWFElemId(DEF_Supervisor) end
   	  from WFDefinitions where DEF_ID = {DEF_ID}
	) ProcessSupervisor
	,(
   	  select 
                    case when APP_IsCustomSupervisor = 1 then (case when APP_CustomSupervisorMail = '' then null else APP_CustomSupervisorMail end)
                            else (case when APP_Supervisor = '' then null else dbo.ClearWFElemId(APP_Supervisor) end)
                     end 
	  from WFApplications where APP_ID = {APP_ID}
	) ApplicationSupervisor
	, 'support1@example.com;support2@example.com' Fallback
) support
```

{% include figure image_path="/assets/images/posts/2024-10-12-start-teams-chat-with-support/2024-10-12-17-28-44.png" alt="Returns the support team for the current form context." caption="Returns the support team for the current form context." %}

### Group members
A prerequisite for displaying the users of a group on mouse over is, that we return the users. We will be using a global business rule for this, which will return all groups and their members which have an active task. If there's no task for a group the business rule will return an empty.

```
Rule name: GetUsersOfGroupTask
Description: 
Return a JSON array with an object of type 

[
    {
        "GroupId": "dyz@bps.local",
        "TaskId": 2659,
        "Users": [
            {
                "Id": "user@example.com",
                "Id": "Some one"
            }
        ]
    }
]

```

```sql
select isnull((
	select TSK_ID as TaskId, groups.COS_BpsID as GroupId, 
		(select users.COS_BpsID as Id, users.COS_Displayname as Name
		 from CacheOrganizationStructure users 
		 join CacheOrganizationStructureGroupRelations on users.COS_ID = COSGR_UserID
		 where COSGR_GroupID = groups.COS_ID
		 for json path) as Users
	from CacheOrganizationStructure groups join	ActiveTasks on
		TSK_WFDID = {WFD_ID} and groups.COS_BpsID = TSK_User
		and TSK_ToGroup = 1 and TSK_IsDeleted = 0
	for json path
	),'[]') as Result
  ```

{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-10-15-21-47.png" alt="Global business rule to return the members of groups." caption="Global business rule to return the members of groups." %}

{: .notice--warning}
**Remark:** If you are using an older WEBCON BPS Version the table `ActiveTasks` may not exist in your database. Unfortunately, I don't remember the version in which the tasks table was split into active tasks and history tasks.


## Global form rule
You can [download](#download) the JS for this form rule from the repository and paste it to the new form rule. Don't forget to switch the type to `JavaScript mode`.

``` 
Rule name: InfoPanelDetailsModification
Edit mode: JavaScript mode
Description: 
Contains different functions which need to be activated by setting the respective property via an HTML field:
- Custom user icon for tasks, which haven't been displayed
- Start Teams chat with assigned users
- Display members of a group to which a task is assigned
```

{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-10-15-23-16.png" alt="The global form rule for handling all changes to the details tab of the info panel." caption="The global form rule for handling all changes to the details tab of the info panel." %}

## HTML field
The form rule we created here requires the [common function/utilities form rule](/posts/2023/ux-form-rules-revised). If this is not yet available please create it before you continue.  

If you have already a `GlobalRules` HTML field, you could add the invocation of the `InfoPanelDetailsModification` to it, after the common functions has been invoked. Otherwise, you need to create a new HTML field.

The provided code shows all settings for all features.  
```html
<script>
InvokeRule(#{BRUX:714:ID}#);
InvokeRule(#{BRUX:1008:ID}#);
dkr.infoPanelDetailsModification.useNewTaskIcon = true;
dkr.infoPanelDetailsModification.changeUserIconForNewTasks.taskIds = [#{BRD:943}#]

dkr.infoPanelDetailsModification.useStartTeamsChatFromTasks = true;
dkr.infoPanelDetailsModification.addTeamsChatToTasks.useWebApp = #{ISMOBILE}#;
dkr.infoPanelDetailsModification.addTeamsChatToTasks.addUrlToMessage = true;
dkr.infoPanelDetailsModification.addTeamsChatToTasks.message = 'Question regarding #{WFD_Signature}# ';

dkr.infoPanelDetailsModification.useGroupTaskHover = true;
dkr.infoPanelDetailsModification.groupTaskHover.groupMembers = #{BRD:1009}#;
dkr.infoPanelDetailsModification.init();
</script>
```
{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-05-14-50-52.png" alt="Form rule with all enabled features." caption="Form rule with all enabled features." %}

If you are only interested in one of the features, for example displaying the members of the groups, it may look like this instead. 
```html
<script>
InvokeRule(#{BRUX:714:ID}#);
InvokeRule(#{BRUX:1008:ID}#);
dkr.infoPanelDetailsModification.useGroupTaskHover = true;
dkr.infoPanelDetailsModification.groupTaskHover.groupMembers = #{BRD:1009}#;
dkr.infoPanelDetailsModification.init();
</script>
```



### JavaScript properties explanation
#### Custom user icon for new tasks

- dkr.infoPanelDetailsModification.useNewTaskIcon<br/>
  Defines whether the task icon will be changed, for those tasks, which haven't been viewed by a user. If this is not set, the other property will be ignored.
- dkr.infoPanelDetailsModification.changeUserIconForNewTasks.taskIds  
  If `useNewTaskIcon` is true, it's required to set this property. It expects an array of those task ids which have not been viewed. This is returned by the [business rule](#custom-user-icon).

{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-05-14-59-34.png" alt="" caption="" %}

You can also change the icon in the JavaScript of the form rule:
```js
dkr.infoPanelDetailsModification.changeUserIconForNewTasks.newTaskIcon = "ms-Icon--D365TalentInsight"
```

#### Start teams chat with assigned users

- dkr.infoPanelDetailsModification.useStartTeamsChatFromTasks<br/>
  This defines whether the Teams link will be added. If this is not set, you don't need to set the other properties.
- dkr.infoPanelDetailsModification.addTeamsChatToTasks.message = null;
  Message which should be passed to teams. This value will be encoded.
- dkr.infoPanelDetailsModification.addTeamsChatToTasks.addUrlToMessage = false;
  Will add the current URL to the message, even if the message is null.
- dkr.infoPanelDetailsModification.addTeamsChatToTasks.useWebApp = false;
  If true, the msteams protocol won't be used this will open a new tab in the browser.
  This will allow the user to select whether the desktop app or the web app should be used.

  A custom message with which the new chat should be started. See [Starting the chat with a message](#starting-the-chat-with-a-message) for the limitations.

I have not come up with a good solution to prevent syntax errors, when you are using fields which may contain the character in which you wrapped the text.
For example, I'm using single quotes here<br/>
```js
dkr.addTeamsChatToTasks.message = '#{WFD_Signature}# #{992}#'
```

If the field also contains a single quote, a syntax error will be thrown:
```js
dkr.addTeamsChatToTasks.message = 'Some signature I'm a text with a single quote'
```

You can use one of the following options to mark a text in JavaScript
- `'Text'`
- `"Text"`
- `` `Text` ``
  
#### Show group members on hover
Here's a short explanation of the available properties:
- dkr.infoPanelDetailsModification.useGroupTaskHover<br/>
  This defines whether the hover effect should for groups should be added. If this is not set, you don't need to set the other property.
- dkr.infoPanelDetailsModification.groupTaskHover.groupMembers<br/>
  You need to assign the result of the [group members business rule](#group-members).

### Global css
The styling of the group hover is handled via the global CSS. This will allow you to modify it for your dark/light themes.

The different styling is achieved by specifying the GUID of the theme. The easiest way is to open the developer tools and take a look at the class attribute oif the body. You will notice that this value corresponds with the value in the CSS:

{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-10-16-07-03.png" alt="The class of the body is used to specify the styling for the theme." caption="The class of the body is used to specify the styling for the theme." %}


```css
.dkr-group-hover-info {
    position: absolute;
    position-area:y-start;
    padding: 5px;
    z-index: 1000;
    width: 100%;
}
body.theme-860305cd-602f-42c4-9999-e1825639c59c {
& .dkr-group-hover-info {
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(204, 204, 204); 
  }
}     

body.theme-a24dcfc2-2b14-4de8-8af3-7952a0a2cf61 {
 & .dkr-group-hover-info {
    background-color: rgb(40, 40, 40);
    border: 1px solid rgb(219, 220, 224);    
  }
}
```

# GitHub Copilot
I have yet to make extensive use of GitHub Copilot and I'm still in the learning curve to really make use of it, but so far, I'm positively surprised how my request are interpreted and the generated code.

This is one of the successful examples. I have taken an existing function, which I wanted to modify for "displaying the group members when hovering above the group name". I marked this function, the data structure, and GitHub Copilot did make a a correct code suggestion. As I already mentioned I was really surprised by it.

{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-05-12-59-33.png" alt="Context of the prompt for GitHub Copilot" caption="Context of the prompt for GitHub Copilot" %}

{% include figure image_path="/assets/images/posts/2024-11-10-info-panel-extensions/2024-11-05-12-59-47.png" alt="Code suggestion of GitHub Copilot" caption="Code suggestion of GitHub Copilot" %}


# Download
You can find the full and a minified JS version [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/infoPanelDetailsModification).

If you are interested in the fact, that there's a minified version at all, you can take a look at the post [Bandwidth usage](/posts/2023/bandwidth-usage).
