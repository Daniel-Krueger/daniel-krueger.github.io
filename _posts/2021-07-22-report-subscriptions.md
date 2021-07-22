---
title: "Subscribing to reports"
categories:
  - Private
  - WEBCON BPS  
tags:
  - Application Template
  - Custom Action  
excerpt:
    Receive a report on a schedule by mail.
bpsVersion: 2021.1.2.136
---

# Overview
This post describes the application template `Report subscriptions`. It allows anyone to define a report which he wants to receive on a scheduled base by mail. The report itself is executed in the name of the user.

{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-05-21-28-30.png" alt="A weekly report has been received." caption="A weekly report has been received." %}

{: .notice--warning}
**Info:** In this post the word `Report` is not referencing the WEBCON BPS Object but is used in the meaning of receiving a snapshot of the BPS report by mail. 

# Using the app
## Creating a Report subscription
### Base information
The workflow `Report subscription` is used for setting up a subscription for a report/view. The base information are:
1. Recipient, this can be oneself or it can be someone else. 
2. Report address, the report or view which should be retrieved
3. Subject, will be used in the mail.
4. Days to keep, all `Report instances` which are older will be deleted.
   
{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-20-21-53-54.png" alt="All `Report instances` older than 30 days will be deleted." caption="All `Report instances` older than 30 days will be deleted." %}

### Defining the schedule
Three different schedules can be configured:

1. Weekly   
    If a subscription uses this schedule, the weekdays can be defined on which a report should be sent every week.
    {% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-16-23-07-40.png" alt="The report will be sent  on each day except Saturday und Sunday." caption="The report will be sent  on each day except Saturday und Sunday." %}
2. Bi-weekly   
    This is similar to the `Weekly` schedule. The only difference is that the report is only sent on each even or odd calendar week. There could be a problem with different calendar [weeks](#fun-with-calendar-weeks). It's not verified that this is a real problem, just in case the calendar week from the server is displayed in the form, so that the correct even/odd option can be selected. 
    {% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-16-23-08-19.png" alt="The report will be sent every odd calendar week." caption="The report will be sent every odd calendar week." %}
3. Monthly   
    If this schedule is used, fixed dates can be defined on which a report should be sent. If a report should be sent on the last day of each month, the number 31 should be used. During a month it's checked whether on the current date a report should be sent. On the last day of the month, it's also checked whether there are any later days are defined. In these cases, a report will be sent too. Example: It's the 28th February, so if 28, 29, 30 or 31 are defined in the subscription the report will be sent.      
    {% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-16-23-09-35.png" alt="The report will be sent on the defined days and the last day of each month. " caption="The report will be sent on the defined days and the last day of each month. " %}

### Activation and testing
Upon activation the recipient gains access to the subscription and a test mail is sent. The test mail is sent to verify that the report can be accessed.  

{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-16-21-55-02.png" alt="A test mail was sent upon activation." caption="A test mail was sent upon activation." %}

In addition, there's an option to create a `Report instance` on demand using the menu the menu button `Get report`.

{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-16-21-57-51.png" alt="A `Report instance` can be created on demand." caption="A `Report instance` can be created on demand." %}

## Receiving reports
The workflow `Report instance` is instantiated based on the schedule defined by a `Report subscription`. The workflow grants the recipient modify permissions, retrieves the current data and stores it as a part of the workflow instance. Afterwards the data is sent by mail to the recipient. 

{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-20-22-12-02.png" alt="The `Report instance` saves the retrieved data." caption="The `Report instance` saves the retrieved data." %}

The number of stored `Report instances` can be limited by `Days to keep` in the subscription.




# Application setup
## Importing the package
The package contains three business entities, make sure that you don't overwrite your ones during the import.

## Assign privileges
After importing the package, privileges have to be assigned on application and process level, so that the users can create their subscriptions. 

## Creating API application
A new API application should be [registered](https://developer.webcon.com/docs/registration-and-authentiaction/). 
It's important, that the flag [impersonation](https://developer.webcon.com/docs/registration-and-authentiaction/#impersonation-and-permissions) is ticked as well as the application are defined. Without these permissions, it's not possible to call the report API in the name of the recipient and send the result by mail. 

{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-15-21-30-59.png" alt="Impersonation must be ticked and the applications selected for which a `Report subscription` should be possible." caption="Impersonation must be ticked and the applications selected for which a `Report subscription` should be possible." %}

## Changing API client id and secret
The template doesn't contain a valid client id and secret. These must be updated with the newly created API application:
1. The report/view data is retrieved by a business rule.
2. The business rule uses a custom plugin which needs to be configured.
3. Update `App Client Id` and `App Client Secret`
{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-05-22-16-25.png" alt="Changing API client id and secret." caption="Changing API client id and secret." %}


# Remarks
## Custom business rule GetReportAsHtmlTable
The data is retrieved by a custom business rule `GetReportAsHtmlTable`. This retrieves the report data and transform it to a html table. The retrieved value can be stored in a field or directly embedded in a mail body. 

## Styling the table data
The html table retrieved by the business rule is styled inside the html field for the form and inside the mail. Depending on the mail client it may be necessary to make some changes.
{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-20-22-38-47.png" alt="Styling the html table containing the report data." caption="Styling the html table containing the report data." %}

The following is a sample of the generated html table. Each column uses the type of the field as a class attribute. 
```xml 

<table id="bps-reportDataTable">
    <thead>
        <tr>
            <td>Instance</td>
            <td class="SingleLine">Title</td>
            <td class="ChoiceList">Trigger</td>
            <td class="People">Author</td>
            <td class="SingleLine">Step</td>
        </tr>
    </thead>
    <tbody>
        <tr class="even">
            <td><a href="https://removed/db/1/app/22/element/9230">9230</a></td>
            <td class="SingleLine">Text</td>
            <td class="ChoiceList">Picker value</td>
            <td class="People">Picker value</td>
            <td class="SingleLine">343</td>
            
        </tr>
          <tr class="odd">
            <td><a href="https://removed/db/1/app/22/element/9230">9231</a></td>
            <td class="SingleLine">Text</td>
            <td class="ChoiceList">Picker value</td>
            <td class="People">Picker value</td>
            <td class="SingleLine">343</td>            
        </tr>
    </tbody>
</table>
```
## Images in a report
If the report data contains images, it could be that these are not correctly displayed in a mail client. In most cases the BPS Portal should require an authenticated user. If the user is not authenticated a dummy image will be displayed. 

## Enhancing the template
The application is a template, and you can make it your own. You could:
- Add other schedules
- Run schedules twice a day
- Add additional checks
- Add static mail addresses

and a lot of other things.

Example:
The API application impersonates the recipient which requires appropriate permissions. 
If the impersonation permissions are not defined correctly the recipient will not receive his report although he can access the URL. 
Currently the access is tested by receiving the data when a subscription is activated, which will fail if there are missing permissions.
An improvement would be to check whether the API application has impersonation privileges for the database and app of the provided URL.

## Limitations of the report API
Tested version: 2012.1.2.136
The call of the report API `/api/data/beta/db/{dbid}/applications/{appid}/reports/{reportid}` may fail with a general error.

Following you find a few reasons but there may be others:
1. The user does not have permissions for the (private) view / the view does not exist
2. Some fields/calculated fields will cause this error, when the report data is retrieved using the API
3. For some reason the default created columns cause an error, but a calculated field returning the value does work

If the error `InternalError: Object reference not set to an instance of an object.` is throws you can verify that the error is caused by the API by using the OpenAPI interface at [Portal_address]/api

[Examples of using REST API](https://community.webcon.com/community.webcon.com/public/posts/post/examples-of-using-rest-api/109#a3)

[REST API documentation](https://developer.webcon.com/docs/rest-api/)

## Fun with calendar weeks
Unfortunately, there is no single truth when it comes time. We have:
- time zones
- day light saving time adjustments,
- seven different option, which is the first day of the week
- different definitions, which is the first week of the year

{: .notice--info}
**More information:** [Week and weekday datepart arguments](https://docs.microsoft.com/en-us/sql/t-sql/functions/datepart-transact-sql?view=sql-server-ver15#week-and-weekday-datepart-arguments)

This results in the possibility, that the calendar week on the server, executing the subscription, may differ from your one. The template uses [iso_week](https://docs.microsoft.com/en-us/sql/t-sql/functions/datepart-transact-sql?view=sql-server-ver15#iso_week-datepart) to retrieve the calendar week.  
Just in case the server week is displayed.
This can be used to decide, whether the bi-weekly subscription should be sent starting with this week or the next. 
{% include figure image_path="/assets/images/posts/2021-07-22-report-subscriptions/2021-07-05-22-02-06.png" alt="Calendar week of the server is displayed in the subscription." caption="Calendar week of the server is displayed in the subscription." %}

If you want to receive your reports in each `even` week, but the server displays that the current week is `odd`, you need to select `odd`, so that you start receiving your mails this week.


# Download
If you would like the application template or only the compiled custom action, you can download it [here](https://github.com/Daniel-Krueger/webcon_reportSubscriptions/releases).

If you are only interested in the Custom Action, you can find the source code [here](https://github.com/Daniel-Krueger/webcon_reportSubscriptions).
