---
regenerate: true
title: "Start Teams chat from user fields"
categories:
  - WEBCON BPS 
tags:  
  - JavaScript
  - Form rules
  - User Experience
  - Microsoft Teams
excerpt:
  Do you need to call/chat with a person mentioned in a workflow? Just click on the field. :)
bpsVersion: 2023.1.3.202 2024.1.1.88
---

# Overview
In my [previous post](https://daniels-notes.de/posts/2024/start-teams-chat-with-assigned-users) I focused on starting a chat with an assigned person. At the end of the post, I mentioned:

>Originally, I wanted to provide a link for each user field, but when I tried to come up with ideas to solve:
> - Displaying the icon 
> - Multi value fields
> - Fields which may contain groups
> - Updating the fields when the tab is changed
>
> I opted to add the functionality for the tasks. I haven't quite yet abandoned the idea, so there's a chance that I may come back to it.

Now I'm back with a quite satisfying solution for the challenges. :)


{% include video id="SXWWhBTP9y0?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

How it works
- The label of a field will be replaced by a link.
- This link executes a function which gets the currently selected values from the field.
- This value is then passed to a business rule which returns the members of the chat.
- The return value is processed to create a new URL which is opened by the browser, which in turn starts the Team chat either in the app or the browser.


# Implementation
## Overview
Yes, this time it's again my basic approach to any JavaScript extensions I have used over the years.

We need:

1. Global business rule
2. Global form rule(s)
3. Global constant(s)
4. HTML fields


## Global business rule
This rule will except a semicolon separated string of BPS Ids. The result will either return:
- The mail, if the BPS Id contains a `\` and therefore is an active directory account and not a UPN which would have an `@`.
- Otherwise the BPS id of the user.
- The BPS ids or mail if the passed BPS id is that of a group.


```
Rule name: GetUserUPNs
Description:
Resolves the UPN (mail) of the users passed as the BPSIds parameter. Multiple values can be passed, but they should be passed with a semicolon as a parameter

Groups and users are supported:

Example:
S-1-5-21-000000000-*;someone@example.com;bpsGroup@bps.local;activeDirectory\account

Parameter: BPSIds
Description:
A semicolon separated list of the BPS ids.

```
You will need to modify the below SQL so that it uses your parameter.
```sql
/* Return the user UPNs */
select case 
   /* Always return the mail */
   when (0 = 1) then COS_Email
   /* Return mail in case of AD authentication */
   when (COS_BpsID like '%\%') then COS_Email
   else COS_BpsID
   end as TeamUPNToUser
from dbo.SplitToTable('{BRP:-2}',';') join CacheOrganizationStructure on item = COS_BpsID and COS_AccountType = 1

union
/* Resolve the users of groups and return their UPNs */
 select case 
   /* Always return the mail */
   when (0 = 1) then COS_Email
   /* Return mail in case of AD authentication */
   when (COS_BpsID like '%\%') then COS_Email
   else COS_BpsID
   end as TeamUPNToUser
from CacheOrganizationStructure join CacheOrganizationStructureGroupRelations on COSGR_UserID = COS_ID
where
COSGR_GroupID in (
	select COS_ID
	from dbo.SplitToTable('{BRP:-2}',';')  join CacheOrganizationStructure
	on item = COS_BpsID and COS_AccountType in (2,4)
)
```

{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-28-15-42-52.png" alt="GetUserUPN business rule" caption="GetUserUPN business rule" %}


{: .notice--info}
**Info:** If you want to always return the mail address you could either change `when (0 = 1) then COS_Email` to `when (1 = 1) then COS_Email` or just remove the case statement completely.

The `COS_AccountType` values are:
1. User
2. BpsGroup,
3. SpGroup,
4. AdGroup,
5. BpsSecurityGroup,
6. ApiApplication

I have never seen a `BpsSecurityGroup` and the `SPGroup` is obsolete anyway.
  
## Global form rules
### Logic form rule
You can [download](#download) the JS for this form rule from the repository and paste it to the new form rule. Don't forget to switch the type to `JavaScript mode`.

``` 
Rule name: AddTeamChatToFieldsLogic
Edit mode: JavaScript mode
```

{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-28-15-49-41.png" alt="A global form rule responsible for adding the Teams link to a label." caption="A global form rule responsible for adding the Teams link to a label" %}

### Execute field update form rule
I've created a second form rule. This has only a single JavaScript line, which calls the function from the previous script. This in turn will add the Teams links to the user fields. While this is not strictly necessary, it has three benefits:
- In case the call needs to be changed, I only need to change it ones.
- If I need to modify something additional, I can use the `Usage` tab to see all references and modify those.
- It can be executed by another form rule.


``` 
Rule name: AddTeamsChatToFieldsUpdateFields
Edit mode: JavaScript mode
Form rule body:
dkr.addTeamsChatToFields.updateFields();

```
{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-28-15-55-39.png" alt="An optional form rule, which triggers the creation of the Teams links" caption="An optional form rule, which triggers the creation of the Teams links" %}

## Global constants
### Business rule integer ids
I mentioned in the beginning, that the form rule will execute the business rule and needs to pass a value for the parameter. We can only execute a business rule if we know it's integer id. The same is true for the parameter. For this we will create two constants and store the values for the respective environment.
The easiest way to get the id of the parameter is, after saving the business rule, open the SQL command, and switch to advanced mode.
{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-28-16-21-59.png" alt="The advanced mode shows the parameter id which can be stored in the global constant." caption="The advanced mode shows the parameter id which can be stored in the global constant." %}


{: .notice--warning}
**Warning:** I wanted to make the screenshot as small as possible, the value should be stored in Dev, Test or Prod and not in shared!

### Business rule alternative
The global constants approach will be the easiest and most efficient way for most WEBCON customers. If you are running more than one Dev, Test and Prod environment you may decide to use a global business rule instead of a constant. This global business rule would expect the GUID of the rule or parameter and return its integer id. 
Since this creates additional calls to the database, it will be less efficient than global constant option, but it will be working across all environments.


{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-28-16-27-03.png" alt="Example business rule to which a business rule GUID is passed and which returns it's integer id." caption="Example business rule to which a business rule GUID is passed and which returns it's integer id." %}

SQL statement for getting the id of a business rule.
```sql
SELECT [BRD_ID]
  FROM [dbo].[WFBusinessRuleDefinitions]
  where BRD_GUID = '{BRP:-4}'
```

SQL statement for getting the id of a business rule parameter.

```sql
select BRP_ID
from WFBusinessRuleParameters
where BRP_Guid = '{BRP:-5}'
```

You can get the business rule parameter GUID using the below sql statement
```sql
select BRP_ID, BRP_Guid, BRP_Name
from WFBusinessRuleParameters join WFBusinessRuleDefinitions on BRP_RuleID = BRD_ID
where BRD_ID = 959 -- Business rule id
``` 

{: .notice--warning}
**Warning:** If you are using the global business rule option, you will need to setup a MSSQL connection with a user who can access the tables. The default `bps_user` has no permissions for this and you will get an error.
![The `Current database connection` data source throws an error when the tables should be read.](/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-29-08-27-17.png)

## HTML field(s)
### Configuration HTML field
The number of form fields will depend on your form layout. Whenever the user switches a tab, the existing fields will be 'deleted' and the ones of the new tab will be added. This means that the created links for the user fields will be gone and need to be recreated if the tab is displayed again. Therefore, we need an additional HTML field for each:
- Tab
- Collapsible/expandable group

In case you are hiding a single field with a form rule, you should create the optional global form rule, so that you can execute it too.

Due to this limitation, I would recommend, that you always create at least two HTML fields. The first one configures the JavaScript, and the second one executes the logic.

This is the code for the configuration HTML field. 

```html
<script>
InvokeRule(#{BRUX:961:ID}#);
dkr.addTeamsChatToFields.useWebApp = #{ISMOBILE}#;
dkr.addTeamsChatToFields.getUserUPNsBusinessRuleId = #{EGV:43}#;
dkr.addTeamsChatToFields.getUserUPNsBusinessRuleParameterId = #{EGV:44}#;
dkr.addTeamsChatToFields.userFields= ['#{FLD:1060}#','#{FLD:1062}#','#{FLD:1059}#','#{FLD:1061}#','#{FLD:1057}#']
</script>
```

{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-29-08-52-56.png" alt="The HTML field with the JavaScript configuration." caption="The HTML field with the JavaScript configuration." %}

While I hope that the property names / configuration parameters are self-explanatory I will provide a short explanation:
- getUserUPNsBusinessRuleId<br/>
  The id of the business rule. Here you can either use the global constant, or the business rule for getting the integer id via the global business rule. If you are using the latter option, it's up to you whether you create a constant for the GUID and pass this or pass the GUID directly. :)
  ![](/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-29-08-51-20.png)
- getUserUPNsBusinessRuleParameterId<br/>
  Instead of the id of the rule we need to provide that of the parameter.
- userFields <br/>
The fields for which the Teams link should be created. They need to be provided in an array format `['FirstField','SecondField']`. Make sure, that you use the `Objects` tab in the expression editor. 
  ![Use the `Objects` tab for setting up the fields and not the `Values` tab.](/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-29-08-47-41.png)

You can also define the same parameters, as in the [related post](/posts/2024/start-teams-chat-with-assigned-users#configuration-parameters).

Of course, this field needs to be displayed in the field matrix. My recommendation is to add this field to the top panel.

### Update fields HTML field
Now that the configuration field is setup correctly, copy it and replace its content, so that [form rule](#execute-field-update-form-rule) updating the fields is executed. 
{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-29-08-55-22.png" alt="The form field which triggers the field update." caption="The form field which triggers the field update." %}

{: .notice--info}
**Info:** If you copy the configuration field, you don't need to update the field matrix. ;)

## Triggering field updates in a form rule
I mentioned that there may be cases where a single field is hidden/displayed using a form rule. In this case you can simply update the existing form rule and [call the field update form rule](#execute-field-update-form-rule).

{% include figure image_path="/assets/images/posts/2024-09-29-start-teams-chat-from-user-fields/2024-09-29-09-22-44.png" alt="Triggering the field update from another form rule." caption="Triggering the field update from another form rule." %}


# Technical comments
## Why am I using HTML fields for the field updates
Instead of creating multiple HTML fields which trigger the field update I could have use mutation observers. I'm aware of them and used them for the post [Simplification of entering a missing comment](/posts/2023/simplification-of-missing-comment) and [Complete fields with errors](/posts/2023/complete-fields-with-errors) but I don't like them.
- They are complex to setup correctly:
  - Find the correct element to observe
  - Don't react on the updates caused by our JavaScript
  - Work within an SPA
- They would cause a lot of overhead on the client:
  - We need to watch the whole form element for a generic solution
  - Showing/Hiding unrelated elements would trigger our observer
  - Adding values would trigger our observer

Therefore, I opted for the additional form rule which can either be used in HTML fields or inside another form rule. It's only executed when it's needed plain and simple.

## UpdateFields function
The `updateFields` function will add the Teams link for each of the configured fields. I needed to add a timeout so that this function can be used as part of another form rule. If this parent form rule shows a field, it will not be immediately part of the DOM. The timeout will workaround this delay as we don't have an option to execute our logic after the field has been added. It will be executed every 10 ms for 4 tries. If it doesn't work for you, you can either extend the timeout or the maximum tries.

```js
dkr.addTeamsChatToFields.updateFields = function () {
    // We need to execute it in a timeout, in case this function is called inside a form rule which would show/hide fields.
    // In this case the fields are not yet part of the DOM and we need to try a few times.
    dkr.addTeamsChatToFields.userFields.forEach((elementId) => {
        setTimeout(dkr.addTeamsChatToFields.wrapInAnchor(elementId, 1, 4), 10)
    }
    );
}
// The max tries should only be triggered, if the field is part of a hidden tab/collapsed group.
dkr.addTeamsChatToFields.wrapInAnchor = function (elementId, counter, maxTries) {
```

Yes, there will be a little overhead as this will be executed until max tries is reached, for fields which won't be displayed at all, but:
- It should be far less overhead, than using a mutation observer
- Passing the fields which should be updated in the updateFields function<br/>
  I thought about it but decided against it. I didn't want to configure the fields in multiple places. Yes, it would be more efficient, but this time a 'single source of truth' has one. Of course, you are free to change this in your implementation. :)

## Why do we need to define the form fields at all?
Yes, the model would have allowed us to identify all fields of type `Person or group` as you can see:
```js
"AttChoose1_1060": {
                    "config": {
                        "type": "Picker",
                        "allowAddingCustomValue": false,
                        "allowMultiValue": false,
                        "enableFieldsOnModeChange": false,
                        "javaScriptOnModeChange": "",
                        "setsOtherFields": false,
                        "showLinkForSelectedElements": false,
                        "otherFields": [],
                        "usePeopleDataSource": true,
                        "autocompleteFirstResultsCount": 5,
                        "autocompleteMoreResultsCount": 100,
                        "autocompleteSearchChars": 3,
                        "shouldResolveValueWithHash": true
                    },
                    "type": "Picker"
                },
```

This would probably work for 90% of the cases, but I have seen cases, where we needed to use `standard` choose fields. Even so they are rare, I did not want to exclude them from this functionality. 
Besides this reason, you would also be able to configure something like this:
```js
// Don't render Teams links for guest users
if ('#{I:CURRENTUSER}#'.indexOf("OUR_DOMAIN") > -1)  {
  dkr.addTeamsChatToFields.userFields= ['#{FLD:1060}#','#{FLD:1062}#','#{FLD:1059}#','#{FLD:1061}#','#{FLD:1057}#']
}
```

# Download
You can find the full and a minified JS version [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/addTeamsChatToFields).

If you are interested in the fact, that there's a minified version at all, you can take a look at the post [Bandwidth usage](/posts/2023/bandwidth-usage).