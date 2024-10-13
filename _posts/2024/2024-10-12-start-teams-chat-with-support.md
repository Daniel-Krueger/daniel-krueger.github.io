---
regenerate: true
title: "Start Teams chat with support"
categories:
  - WEBCON BPS 
tags:  
  - JavaScript
  - Form rules
  - User Experience
  - Microsoft Teams
excerpt:
  Start a chat with the support team from a form.. :)
bpsVersion: 2023.1.3.202
---

# Overview
After my previous Teams posts [Start Teams chat with assigned users](/posts/2024/start-teams-chat-with-assigned-users) and [
Start Teams chat from user fields ](/posts/2024/start-teams-chat-from-user-fields) I was asked, whether we could add a button/icon to start the chat with the support. I really liked this idea and so I went ahead and put together a little solution for this. 

{% include figure image_path="/assets/images/posts/2024-10-12-start-teams-chat-with-support/2024-10-12-17-43-51.png" alt="Start a chat with the support team." caption="Start a chat with the support team." %}



# Implementation
## Overview
I think this solution will have a highly individual component how the support team should be defined. These are just a few questions which came to my mind:
- Is this a fixed support team?
- Should it be the process supervisor?
- Should it be the application supervisor?
- What should be done, if a custom application supervisor without a mail is defined?
- How should the case be handled, if this mail cannot be used to start a chat?
- Should there be a different support team per language?
- Do we have to take care of different countries?

Since there are so many questions, I will provide just the basics, and you will have to ament it to your needs.

The basis consists of:

1. Global business rule
2. Global form rule
3. HTML field


## Global business rule
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


## Global form rule

You can [download](#download) the JS for this form rule from the repository and paste it to the new form rule. Don't forget to switch the type to `JavaScript mode`.

``` 
Rule name: AddTeamsSupportCall
Edit mode: JavaScript mode
```

{% include figure image_path="/assets/images/posts/2024-10-12-start-teams-chat-with-support/2024-10-12-17-30-01.png" alt="A global form rule responsible for adding the Teams support link to the toolbar." caption="A global form rule responsible for adding the Teams support link to the toolbar." %}

## HTML field
This is the code for the HTML field, which
- invokes the created form rule,
- gets the recipients from the business rule
- and executes the logic to generate the button. 
- If no recipients are defined, no button will be added.

```html
<script>
InvokeRule(#{BRUX:1004:ID}#)
dkr.teamsSupport.recipients = '#{BRD:1005}#'
dkr.teamsSupport.hoverInformation = 'Do you need support?';
dkr.teamsSupport.message = 'Hi, <br/>I have a question with:<br/>';
dkr.teamsSupport.prepareTeamsSupport(1,10)
</script>
```


{% include figure image_path="/assets/images/posts/2024-10-12-start-teams-chat-with-support/2024-10-12-17-31-03.png" alt="The HTML field for adding the Teams support button to the toolbar." caption="The HTML field for adding the Teams support button to the toolbar." %}


While I hope that the property names / configuration parameters are self-explanatory, I will provide a short explanation:
- recipients<br/>
  This can be a semicolon separated list of users with whom a chat should be started.
- hoverInformation<br/>
  Will be displayed if the mouse cursor hovers above the icon.
- message <br/>
  The message which will be added to the chat. 
  
You can use a business rule with the [Text function](/posts/2024/translations#business-rule-function-text) to make the texts multilingual.

You can also define the same parameters, as in the [related post](/posts/2024/start-teams-chat-with-assigned-users#configuration-parameters).

Of course, this field needs to be displayed in the field matrix. My recommendation is to add this field to the top panel.

# Remark
## Using another logo
I thought, the default Teams logo is not self explaining in this case, therefore I've used a different one. If you want to use the Teams logo, you can simply change this line in the form rule. 

```js
dkr.teamsSupport.icon = "ms-Icon--UnknownCall" //"ms-Icon--TeamsLogo"
```

You can check out other icons [here](https://uifabricicons.azurewebsites.net/), but not all of them are available in WEBCON BPS.

## Why did I add the icon in the right toolbar
I've chosen this position, because I think it's the most fitting. I also thought about adding it outside of the toolbar to make it more visible. In the end I decided against it, because it would be conflicting with this post [Adding a help page](/posts/2024/adding-a-help-page).


# Download
You can find the full and a minified JS version [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/addTeamsSupportCall).

If you are interested in the fact, that there's a minified version at all, you can take a look at the post [Bandwidth usage](/posts/2023/bandwidth-usage).