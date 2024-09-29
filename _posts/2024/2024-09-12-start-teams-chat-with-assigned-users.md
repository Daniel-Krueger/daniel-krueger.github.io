---
regenerate: true
title: "Start Teams chat with assigned users"
categories:
  - WEBCON BPS 
tags:  
  - JavaScript
  - Form rules
  - User Experience
  - Microsoft Teams
excerpt:
  Do you need to chat or call a task owner via Teams? Just click on it.
bpsVersion: 2023.1.3.202
---


# Update 2023-09-29
As far as I can tell starting chat's with messages are working now in the Desktop App too.



# Overview
Did you ever wanted to chat or call a person via Microsoft Teams to whom a task is assigned? At least I found myself in this situation a few times. Most of the time I had a look at the task first in WEBCON BPS. Now that I know, whether the user has at least [displayed the task](/posts/2024/custom-user-icon-for-new-tasks), I want to get in contact with the person. Adding this option directly to the form will save me a few seconds. This is not much, but the question is how many users will use this option? 


{% include video id="bNgKlfOAryU?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


# Implementation
## Overview
This functionality is based on [Custom user icon for new tasks](/posts/2024/custom-user-icon-for-new-tasks). Both modify the task element in the info panel and need to react on the same actions. The status panel may get hidden, or the statistics will be displayed.
The difference lies in the function modifying the task element. Therefore, I will focus on this in this post. If you are interested in explanations about the events, you will need to head over to the [other blog post](/posts/2024/custom-user-icon-for-new-tasks#attached-events).

For the implementation of change we only need:
1. A global form rule
2. An HTML field to execute the form rule.

This functionality makes use of the [GetLiteModel](/posts/2023/ux-form-rules-revised#getlitemodel) function of the [common function/utilities form rule](/posts/2023/ux-form-rules-revised). If you don't have it yet, you will need to create a form rule for this one too.


## Global form rule
You can [download](#download) the JS for this form rule from the repository and paste it to the new form rule. Don't forget to switch the type to `JavaScript mode`.

{% include figure image_path="/assets/images/posts/2024-09-12-start-teams-chat-with-assigned-users/2024-09-01-20-46-29.png" alt="A global form rule for the JavaScript adding the team task." caption="A global form rule for the JavaScript adding the team task." %}

While I was using parameters for the 'new tasks' solution, I decided against it this time. There are to many variations for this, which you will see in the next chapter.


## HTML field
I'm assuming that you already have the [common function/utilities form rule](/posts/2023/ux-form-rules-revised) prepared. If you have already a `GlobalRules` HTML field, you could add the `AddTeamsChatToTasks` lines to it after the common functions has been invoked. Otherwise, you need to create a new HTML field.


```html
<script>
InvokeRule(#{BRUX:714:ID}#);

InvokeRule(#{BRUX:957:ID}#);
dkr.addTeamsChatToTasks.useWebApp = #{ISMOBILE}#;
dkr.addTeamsChatToTasks.addUrlToMessage = true;
dkr.addTeamsChatToTasks.message = '#{WFD_Signature}# #{992}#';
dkr.addTeamsChatToTasks.init();

</script>

```
{% include figure image_path="/assets/images/posts/2024-09-12-start-teams-chat-with-assigned-users/2024-09-01-21-16-06.png" alt="The lines in the rectangle are executing the form rule with use case depending parameters." caption="The lines in the rectangle are executing the form rule with use case depending parameters." %}

The last step is to display the HTML field in the field matrix. My recommendation is to add this form rule to the top panel.
{% include figure image_path="/assets/images/posts/2024-09-12-start-teams-chat-with-assigned-users/2024-09-01-21-28-00.png" alt="HTML field is visible in the top panel." caption="HTML field is visible in the top panel." %}

## Configuration parameters
- UseWebApp<br/>
  If you are sure, that the Teams application is installed on all PCs and mobile phones you can set this to false. Otherwise, you can set it to false. If it is false, a new tab will be displayed so that the user can choose whether the Teams app should be used/installed or the web application should be used. 
- AddUrlToMessage<br/>
  Will add the URL of the current workflow instance to the message whit which the chat should be started.
- Message<br/>
  A custom message with which the new chat should be started. See [Starting the chat with a message](#starting-the-chat-with-a-message) for the limitations.

I have not come up with a good solution to prevent syntax errors, when you are using fields which may contain the character in which you wrapped the text.
For example I'm using single quotes here<br/>
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

# Why is this not a build-in functionality
I don't know the actual reasons, but I would guess these are at least:
- Not all customers are using Microsoft Teams.
- Tightly integrating a third-party product will require maintenance.
- You will get support tickets about things you cannot do anything about.

There's a reason why the [limitations](#limitations) have almost the same word count as the previous part.


# Limitations
## Starting the chat with a message
I've use [this documentation](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-link-teams#deep-link-to-start-a-new-chat) to understand how I can start a Teams chat via a link.

This was working fine until I wanted to add a message. The new Teams version [does not support the message parameter](https://answers.microsoft.com/en-us/msteams/forum/all/new-ms-teams-doesnt-consider-parameter-message/5e883e26-dedf-4de3-98e2-40a6d1b1c98d). Maybe it will be added in the future. 
As of today, 2024-09-01, the message parameter is working in the web app and the mobile app. But of course, they are treating the message differently. While the web application 'displays' the `<br/>` as a line break the mobile app treats it as plain text.

{: .notice--info}
**Info:** The issue seems to be resolved.

## External users
While looking for the reason why the message is not passed to the Teams desktop app, I came across this limitation:

>Note that the link will only open a chat if the users are in your tenant. For federated users it will only open if you previously had a chat window with them.<br/>
>[https://stackoverflow.com/questions/51995622/launch-teams-chat-with-particular-contact-using-msteams-uri-scheme](https://stackoverflow.com/questions/51995622/launch-teams-chat-with-particular-contact-using-msteams-uri-scheme)

I'm guessing that there may be issues, if you have external users in your tenant, but this is not something I was able to test in mine.



## Changing the task which should get a link
At the moment, I used the easy way to determine which tasks should receive a link. 
The below function is called for each task array and will add the task if it is not a group.

```js
dkr.addTeamsChatToTasks.addTaskArrayToTaskList = function (tasksArray) {    /* Array content example
    "directCoversTasks": [
            {
                "description": "",
                "deskDescription": null,
                "executorLogin": null,
                "executorName": null,
                "isCcEditTask": false,
                "isCcTask": false,
                "isCoveringTask": true,
                "isCurrentUserTask": false,
                "isFinished": false,
                "taskId": 6708,
                "toGroup": false,
                "userEmail": "abc@example.com",
                "userLogin": "upn@example.com",
                "userName": "Abc UPN"
            }
        ],
    */
    tasksArray.forEach(task => {
        // taskId should be always there anyway but 
        // - we don't want to assign a Teams icon to tasks which are assigned to groups
        // - or userlogin without a @ which wouldn't be a UPN required for teams.
        if (task.taskId != null && task.toGroup == false && task.userLogin.indexOf("@") > -1) {
            dkr.addTeamsChatToTasks.taskList[task.taskId] = task;
        }
    });
    });
}
```

This way I have a list of all those tasks and the UPN of the task owner. Teams expects the UPN while this can be same as the email, it can also be different.


In case you want or need to use the email you can replace `task.userLogin`  with `task.userEmail` in this line:<br/>

`<a href="${dkr.addTeamsChatToTasks.useWebApp ? "https://teams.microsoft.com" : "msteams:"}/l/chat/0/0?users=${task.userLogin}&message=${encodeURIComponent(message)}" ${dkr.addTeamsChatToTasks.useWebApp ? 'target="_blank"' :null}>`



Depending on your use case and the available information, you can either modify this line <br/>
`if (task.taskId != null && task.toGroup == false && task.userLogin.indexOf("@") > -1))` 
<br/>
or change the whole implementation. Instead of using the available information you could: 
- retrieve the existing tasks
- map those tasks to the CacheOrganizationStructure
- filter the relevant tasks
- use this information to build the `dkr.addTeamsChatToTasks.taskList` object.

I used a similar approach in my post [Custom user icon for new tasks](/posts/2024/custom-user-icon-for-new-tasks#global-business-rule).

## Active Directory Authentication
If you are using Active Directory for authentication you will need to change two things.
You need to
1. replace `task.userLogin`  with `task.userEmail` in this line:<br/>
  `<a href="${dkr.addTeamsChatToTasks.useWebApp ? "https://teams.microsoft.com" : "msteams:"}/l/chat/0/0?users=${task.userLogin}&message=${encodeURIComponent(message)}" ${dkr.addTeamsChatToTasks.useWebApp ? 'target="_blank"' :null}>`
<br/>

2. and change this line  <br/> 
  `if (task.taskId != null && task.toGroup == false && task.userLogin.indexOf("@") > -1))`<br/>
  to <br/>
  `if (task.taskId != null && task.toGroup == false))`
<br/>

This way the Teams icon and link should be created for all users using their email. As long as the UPN matches the email it should work out.

# Outlook
Originally, I wanted to provide a link for each user field, but when I tried to come up with ideas to solve:
- Displaying the icon 
- Multi value fields
- Fields which may contain groups
- Updating the fields when the tab is changed

I opted to add the functionality for the tasks. I haven't quite yet abandoned the idea, so there's a chance that I may come back to it.



# Download
You can find the full and a minified JS version [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/addTeamsChatToTasks).

If you are interested in the fact, that there's a minified version at all, you can take a look at the post [Bandwidth usage](/posts/2023/bandwidth-usage).