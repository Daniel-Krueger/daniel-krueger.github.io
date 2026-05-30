---
title: "User Defined API - Overview (Part 1)"
categories:
  - WEBCON BPS
  - Series
tags:
  - User Defined API
  - API Definition
  - UDA
excerpt:
  "User Defined APIs (API Definitions) are a feature I have greatly neglected. That will change."
bpsVersion: 2026.1.6.198
---

# Overview
While User Defined APIs have been available since 2025 R2, which had been released on 2025-05-05, I have ignored them. When reading about them I thought about them as an alternative to the Public API (https://hostname/api). I have to admit, this conclusion is plainly wrong and was a mistake on my side for two reasons:

- They can be executed by the user.<br/>
  There's no need to make the client credentials publicly available, which would be used for the public API.
- AI eats API Definitions for breakfast.

{% include figure image_path="/assets/images/posts/2026-05-30-user-defined-API-overview-part-1/2026-05-30-12-35-16.png" alt="AI eats API Definitions for breakfast." caption="AI eats API Definitions for breakfast." %}


There is already great documentation available:

- [Knowledge Base - User Defined API (API Definition)](https://community.webcon.com/posts/post/user-defined-api-api-definition/545/3)
- [Documentation - API Definition (General)](https://docs.webcon.com/docs/2025R2/Studio/Process/APIDefinition/)
  - [Running mode - Starting automation](https://docs.webcon.com/docs/2025R2/Studio/Process/APIDefinition/UDAAutomation)
  - [Running mode - Reading the data source](https://docs.webcon.com/docs/2025R2/Studio/Process/APIDefinition/UDADataSource)
  - [Running mode - Actions on a workflow instance](https://docs.webcon.com/docs/2025R2/Studio/Process/APIDefinition/UDAElement)

In this post I will provide a quick overview and will on topics which are common to every running mode.

{: .notice--info}
**Info:** The documentation and Designer Stuido use the name `API Definitions` in the community the term `User Defined API` was used. I will stick with the latter one and may also use the abbreviation UDA, which is used in the database.

# Differences between Public API and User Defined APIs
There are three big differences between the Public API and User Defined API. These are:
- Different authentication options
- UDAs have a specialized use case
- You can create custom documentation for UDAs

## Authentication
This is the one thing I've overlooked when I read the knowledge base post:

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-09-10-53.png" alt="It's just a new authentication method which makes a big impact, but let us highlight (bold font) the other aspects which are explained in detail later anyway." caption="It's just a new authentication method which makes a big impact, but let us highlight (bold font) the other aspects which are explained in detail later anyway." %}

Ok, if I would have taken a close look at the Designer Studio, I would have seen it again, but I didn't.

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-09-14-32.png" alt="Authentication methods for a UDA endpoint" caption="Authentication methods for a UDA endpoint" %}

I want to make clear why this makes a difference. You can use the UDA endpoint via JavaScript *without any additional authentication*. In the past I didn't use the Public API in forms as it uses OAuth authentication. This would require disclosing the client secret. This would be the same for the `API application authentication (OAuth2)` access option. But the other option will be executed in the context of the signed-in user. This will allow us to use a UDA endpoint from anywhere in the Portal where we can inject JavaScript:
- Forms
- Dashboards
- Everywhere, if you want to go down [this road](https://daniels-notes.de/posts/2023/global-js).

Cookie in this context means, that your user is used, even if you currently using the `Working on behalf` mode.
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-10-48-19.png" alt="" caption="" %}

## Specialized usage
The Public API is a matured all-purpose API for interacting with WEBCON from a third-party client. It will offer features which are not available in a UDA. The all-purpose approach is also the downside of it. You will need to understand how WEBCON works to use it. This is not the case with the UDA.

The UDA provides an abstraction layer and will make it easier for others to communicate with WEBCON. The below picture shows two bodies which update a workflow instance, and I doubt, that anyone would choose the Public API (1) option, if it's not necessary. 

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-08-42-11.png" alt="Two options for updating a workflow instance (1) is the body of a Public API call (2) is the body of a UDA call." caption="Two options for updating a workflow instance (1) is the body of a Public API call (2) is the body of a UDA call." %}

As you have seen, the UDA will provide you with an understandable body. While this is the same for all `Running modes`, the uses cases of them are different. 
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-08-47-31.png" alt="UDAs offer three different running modes" caption="UDAs offer three different running modes" %}

### Get data from the data source
Think of this as a data table which can be accessed via REST. This data table can then be filtered using input parameters.

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-08-57-54.png" alt="Running mode - Getting data from a data source" caption="Running mode - Getting data from a data source" %}
Even so it's simple as that, I will dedicate a separate blog post to it, because I have run into some issues and want to prevent you from running into them yourself. One important fact is that it returns a maximum of 1000 elements. While my first workaround worked for 95% of the cases, I encountered another edge case, but this and other information will be covered in the dedicated post.

### Actions on a workflow instance
This mode allows you to:
- Start a workflow instance
- Save it
- Execute a path
- Get a single instance

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-08-58-52.png" alt="Available options executing actions on a workflow instance" caption="Available options executing actions on a workflow instance" %}

Here the most important information I want to provide is that there's no `admin mode` or `force checkout` option. You can only modify the editable fields. I will cover other topics in the dedicated post.
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-10-50-41.png" alt="Field editing is restricted" caption="Field editing is restricted" %}

### Execute automation
This is like a `Cyclical action` which can be triggered via a REST request. The big difference here is that you can provide input parameters and get a response. Otherwise, it's limited to the same actions, as this one is also executed without the context of a workflow instance. This will offer a lot of options and improve the user experience and therefore it will get its own post. :)

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-09-05-30.png" alt="I've finally a use case for the `Break with error` and `End` operators." caption="I've finally a use case for the `Break with error` and `End` operators." %}

## Custom documentation
You can download an OpenAPI definition file for all UDAs endpoints in the process.

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-09-50-24.png" alt="You can download the OpenAPI defintion." caption="You can download the OpenAPI defintion." %}

This is a technical documentation of all endpoints saved in a JSON file. There may be WEBCON power users who open it and close it after a few seconds. After all it gets technical really fast and isn't easy to read.
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-09-53-30.png" alt="A saved Open API defintion" caption="A saved Open API defintion" %}

The mistake here is that you don't need to understand it, but AI will. OpenAPI (swagger) is an old documentation option which is known by all AI models. If you follow these basic guidelines, then the AI can derive a context from the provided information and will be able to help you a lot.
- Use speaking names<br/>
  `workflowInstanceId` instead of `id`
- Provide documentation<br/>
  Is it clear what something does from it's name/ will you know what something does in three months? If not, document it.
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-10-01-32.png" alt="The documentation of an input parameter of an UDA endpoint" caption="The documentation of an input parameter of an UDA endpoint" %}
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-10-04-20.png" alt="Well document endpoints are a treat for everyone but especially for AIs" caption="Well document endpoints are a treat for everyone but especially for AIs" %}

# Common inconveniences and pitfalls
With all the good options the UDA offer, there are of course inconveniences and pitfalls. It's no wonder:
- This was released one year ago
- I don't remember any user voice or question in the community.
- There are three distinct mentions in the change logs.

Based on this I would guess that the adoption of this feature probably hasn't been high. 

## Moving API definitions
API definitions with the running mode `Get data from the data source` or `Starting automation` don't run in context of a process / workflow instance. At the same time, they adhere to the privileges of the application which is necessary when calling the API using the current user. So, there's no option to define these on a global level, which would be better, but it would at least be helpful if we could move an endpoint to another process.

But there's a workaround, but it requires fiddling with the database. Thankfully WEBCON is really forgiving if you change something in the database. :)

If you create the SQL statement for generating the `UdaDefinitions` table, you will notice which other tables are referenced as foreign keys. In this version the notably tables are `Automations` and `WFBusinessRuleDefinitions`.

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-01-19.png" alt="Foreign key tables which also have DEFID column" caption="Foreign key tables which also have DEFID column" %}

When you want to move an UDA from one process you will need to update the DEFID value in the relevant records.
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-07-33.png" alt="You may need to update multiple record, if you want to move a UDA to another process" caption="You may need to update multiple record, if you want to move a UDA to another process" %}

Ensure that the updated automation / business rules themselves aren’t a parent element. Otherwise, you should update the dependent rows too. 

## Time and timezones are a never-ending issue in IT
{: .notice--warning}
**Remark:** This applies to version 20261.1.6.198 and before. It may have been fixed in later versions.

If you are working with time values then make sure that you apply workaround for your cases if necessary. It will depend on the settings of the client, WEBCON and database server. In the example below I'm sending data from a client with UTC+2 to WEBCON running in UTC+2 and database is also set to UTC+2 (W.Europe Standard Time)
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-20-57.png" alt="Databse time zone of the WEBCON environment" caption="Databse time zone of the WEBCON environment" %}

I'm sending the local time 20:27/8:27 pm (18:27:00Z) to the server which returns the same value without further processing. As you can see the local time is now 18:27/6:27 pm (16:27:00Z)

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-25-15.png" alt="The input value differs from the unprocessed input value " caption="The input value differs from the unprocessed input value " %}

If you take a look at the payload body and response, it's obvious, the time zone information has been removed.
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-28-35.png" alt="In this version WEBCON loses the time zone information" caption="In this version WEBCON loses the time zone information" %}

## Logging UDA vs public API
UDA logs are stored in the table `AdminUdaLogs` of the *content* database. The logs about the public APIs are stored in the table `AdminAPILogs` of the *configuration* database.

## Errors 
That's something which definitely needs to be improved. While I sometimes got a useful error message, I quite often encountered a 409 Conflict error. 

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-45-15.png" alt="Sometimes a generic 409 Conflict error is thrown" caption="Sometimes a generic 409 Conflict error is thrown" %}

While you have a dedicated log in the Designer Studio per API and see the error GUID, you are as likely to get any information as not.
{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-46-27.png" alt="The administration tool show no information about the error" caption="The administration tool show no information about the error" %}

In this case you need to head over to the table `AdminWFEventLogs`in the *configuration* database and search for the error there.

{% include figure image_path="/assets/images/posts/2026-05-17-user-defined-API-part-1/2026-05-30-11-48-43.png" alt="The AdminWFEventLogs table in the *configuration* database may contain additional information." caption="The AdminWFEventLogs table in the *configuration* database may contain additional information." %}

Sometimes the error messages themselves will provide useful information, and the administration tools will do so, too. If you don't get any information, it's likely that you will find those in the configuration database. I've also encountered one case where there haven't been any information, but this will be a topic in the `Get data from the data source` post.


