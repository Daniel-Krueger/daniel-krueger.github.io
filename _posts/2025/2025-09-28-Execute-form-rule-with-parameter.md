---
title: "Execute form rule with parameters from JavaScript"
categories:
  - WEBCON BPS
  - Private 
tags:
 - Form rules
excerpt:
    "The Designer Studio doesn't offer the functionality to pass parameters to form rules in JavaScript mode. This post demonstrates a workaround"
bpsVersion: 2025.2.1.179
---

# Overview
A [question](https://community.webcon.com/forum/thread/7777) was raised in the community, whether it would be possible to pass parameters to form rules from JavaScript. While it's true that the Designer Studio doesn't offer a UI for this, it’s not impossible, we just need a workaround. :)


{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-41-48.png" alt="This form rule has parameters, and the values are passed via JavaScript" caption="This form rule has parameters, and the values are passed via JavaScript" %}
# Implementation
## Overview
It's the same as always, we need:
- One global form rule
- Two global business rules
- An HTML field

Ok, these rules don't need to be global, but these are reusable across processes. If you want, you can create these as process rules.

## Global form rule

You can [download](#download) the JS for this form rule from the repository and paste it to the new form rule. Don't forget to switch the type to `JavaScript mode`.

``` 
Rule name: ExecuteFormRuleWithParameters
Edit mode: JavaScript mode
Description: 
This allows the execution of a form rule with parameters. You need to pass the integer ids to this function.

// parameterValues is an array of objects with the following structure:
//[
// { id: 109, value: 'test' },
// { id: 109, value: 'test' }
//]
```
{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-06-05.png" alt="The global form rule." caption="The global form rule." %}

## Global business rules
You will have noticed that the function in the form rule expects ids for the form rule and the parameters. We have three different options on how to pass these:
1. Hard code these
2. Create constants and update the dev/test/prod values after transporting the process
3. Get the integer id from the database using its GUID

If you have access to the SQL server I would always go for option 3. In case of a multi-tenant WEBCONAPPS environment we would have to fall back to option 2 and you won't need the global business rules. The reason for this is that we need to get the data from tables which can't be accessed with the `<Current BPS database>` connection.

If you haven't run into this issue, you may need to create a new `MSSQL connection` so that you can access the required tables with a different user. 
{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-15-36.png" alt="MSSQL connection for elevated database access." caption="MSSQL connection for elevated database access." %}

What's left is to create two simple business rules to which the GUID will be passed

``` 
Rule name: GetBusinessRuleIdFromGuid
Parameter: BusinessRuleGUID
``` 

```sql
SELECT [BRD_ID] ,[BRD_Name]
FROM [dbo].[WFBusinessRuleDefinitions]
where BRD_GUID = '{BRP:55}'
``` 

{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-12-36.png" alt="GetBusinessRuleIdFromGuid definition" caption="GetBusinessRuleIdFromGuid definition" %}


``` 
Rule name: GetBusinessRuleParameterIdFromGuid
Parameter: ParameterGUID
``` 

```sql
select BRP_ID, BRP_Name
FROM  WFBusinessRuleParameters 
where BRP_GUID = '{BRP:111}'
``` 

{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-18-29.png" alt="GetBusinessRuleParameterIdFromGuid definition" caption="GetBusinessRuleParameterIdFromGuid definition" %}

# Usage
## Get the GUIDs
While we can get the GUID for the form rule, there's no such option for the parameter.

{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-24-37.png" alt="The GUID of the form rule." caption="The GUID of the form rule." %}

But that's not a problem, here's a little SQL query to get these:

```sql
select BRD_Name, BRD_ID, BRD_GUID,  BRP_Name,BRP_ID, BRP_Guid 
FROM [dbo].[WFBusinessRuleDefinitions] left join WFBusinessRuleParameters on BRD_ID = BRP_RuleID
where BRD_ID = 1453
```
{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-26-23.png" alt="The result of the SQL query" caption="The result of the SQL query" %}

## HTML field
In this example a text with the passed parameter values will be displayed, when the user clicks a button and you will need to amend this for your case. You will always need to:
1. Execute global form rule\
  The `InvokeRule` will load the global form rule, so that the function `dkr.executeFormRuleWithParameterValues` will be available
2. For each parameter you need to pass a new object `{ id: xyz, value:  GetPairName(G_CURUSER)},`
3. Get the ids for the business rule and parameters
  The business rules will be used to get the integer ids of the GUIDs, these can be assigned using a right click.

{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-57-00.png" alt="HTML field definition." caption="HTML field definition." %}

{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-36-23.png" alt="Result of the HTML field." caption="Result of the HTML field." %}

Here's the example I used. 
```html
<script>
InvokeRule(#{BRUX:1454:ID}#);
buttonClick = function (){
    let formRuleId = #{BRD:743:<xps><ps><p id="#BRP:55#" v="9b44254e-9c80-49ff-8017-d3684727c5a8" /></ps></xps>}#;
    let parameters = [
        { id: #{BRD:1455:<xps><ps><p id="#BRP:111#" v="06c94f52-ed86-46e5-b8c6-a65430c61133" /></ps></xps>}#, value:  GetPairName(G_CURUSER)},
        { id: #{BRD:1455:<xps><ps><p id="#BRP:111#" v="5472afba-1ccf-455a-97cb-877b1b814990" /></ps></xps>}#, value: G_BROWSER_LANGUAGE }
    ];
    result = dkr.executeFormRuleWithParameterValues(formRuleId,parameters);
    alert(result);
}
</script>
<button onclick="buttonClick()">Execute form rule</button>
```

# Hints
## Broken integrity check / usages tab
Since we need to get the integer ids of the form rule and parameter ourselves, the basic integrity checks are no longer working. If you remove a parameter from the form rule, you will not be warned. The same is true for the usages tab. 

Therefore, document where these parameters are used and create constants instead of passing the GUID as a string as in this simplified example.

## Elevated database access connection
Make sure that you configure the values for dev/test/production environments. If the business rule cannot be executed in an HTML field, the form cannot be rendered and will throw an error.

{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-11-38-59.png" alt="This error occurs, if the business rule execution fails in an HTML field." caption="This error occurs, if the business rule execution fails in an HTML field." %}

## From form rule mode to JavaScript
A form rule with edit mode `Form rule` is just a graphical representation which generates JavaScript in the background. You can view this with the `Show` button.

{% include figure image_path="/assets/images/posts/2025-09-28-Execute-form-rule-with-parameter/2025-09-28-10-53-35.png" alt="The generated JavaScript of the form rule." caption="The generated JavaScript of the form rule." %}

This is always my starting point to use some form rule function for which I don't know the JavaScript equivalent.

In this case the most important lines are:
```js
...
UxRule_FormRuleWithParameter_1453(
  ...
   { 'param_109' : 'test', 'param_110' : 'test', });
```

From here it was just a small step, to create the functions.

# Download
You can download the sources [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/formRuleWithParameters).
