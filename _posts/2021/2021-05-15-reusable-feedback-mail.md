---
title: "Reusable feedback mail"
categories:
  - Private
  - WEBCON BPS  
tags:
  - User Experience
excerpt:
    An example on how to create a feedback button which opens a mail and can be reused across all applications.
bpsVersion: 2021.1.2.101
---

# Overview
In this post I will explain an option how to create a reusable feedback button. A click on the button will open a prepopulated mail.

{% include figure image_path="/assets/images/posts/2021-05-15-reusable-feedback-mail/2021-04-20-22-13-39.png" alt="Clicking the feedback button opens the default mail program and prepopulates the mail." caption="Clicking the feedback button opens the default mail program and prepopulates the mail." %}

# Providing information for the user
There are quite a lot of options to provide information to the user. These  can be
- tooltips for fields
- step description
- task description
- tooltips for paths
- linked documentation
  
Explanations can be found in these knowledge base posts:
- [Intuitive application management – tooltips and task details](https://community.webcon.com/posts/post/intuitive-application-management-tooltips-and-task-details/135) 
- [Tooltips on the MODERN form](https://community.webcon.com/posts/post/tooltips-on-the-modern-form/60)

Regardless how useful provided information are, there will be cases when the user will have questions or encountered an error. So, we should make it easy for him to contact the correct person. In addition, we should make it easy for us and provide all information which we need to help him. I can't count the times were the feedback/support mails I received didn't contain the basic information like user, time and URL.

# Adding the feedback mail button
The feedback mail button is added as a menu button on the Global actions tab, so that it is available in all steps. It uses a default icon:
`/_layouts/15/images/webcon/attrSendEmail.png`
{% include figure image_path="/assets/images/posts/2021-05-15-reusable-feedback-mail/2021-04-20-22-16-33.png" alt="Feedback button uses a default icon." caption="Feedback button uses a default icon." %}

{: .notice--info}
**Info:** Since there aren't any other which requires the workflow to be saved, the button is available in view and edit mode.

{: .notice--info}
**Info:** The visibility of the icon depends on the selected theme.

The button itself executes a hyperlink action. We could create here a `mailto` link but instead of doing this in a lot of places, we will create a global business rule instead.
{% include figure image_path="/assets/images/posts/2021-05-15-reusable-feedback-mail/2021-04-20-22-19-10.png" alt="Hyperlink action definition." caption="Hyperlink action definition." %}

# Creating the business rule
The referenced business rule returns an URI using the `mailto:` protocol.

{: .notice--info}
**Info:** Information regarding the `mailto` protocol can be found [here](https://docs.microsoft.com/en-us/previous-versions/aa767737(v=vs.85))

The first part of the SQL command retrieves the recipient of the mail. The rule looks for the supervisor of the current process (1). If this doesn't exist, or doesn't have a mail address, it checks whether a custom application supervisor has been defined (2). If this isn't the case either it takes the application supervisor (3). If this one doesn't have a mail address, `Undefined` (4) is returned as the final fall back. 

{% include figure image_path="/assets/images/posts/2021-05-15-reusable-feedback-mail/2021-04-20-22-29-01.png" alt="First part of the feedback mail business rule." caption="First part of the feedback mail business rule." %}

The remaining part of the business rule populates the subject and body of the mail. Some hints:
- Line breaks are represented by `%0D`
- The `Instance link` uses a custom constant in which the BPS Portal URL is stored
- `Database ID` is a new system field in WEBCON BPS 2021. If you have an older version, you have to create constant which stores the value.
  
{% include figure image_path="/assets/images/posts/2021-05-15-reusable-feedback-mail/2021-04-20-22-31-42.png" alt="Second part of the feedback mail business rule" caption="Second part of the feedback mail business rule" %}


# Download of business rule definition
The business rule can be downloaded from [here](https://github.com/cosmoconsult/webconbps/blob/main/BusinessRules/FeedbackMail/feedbackmail.sql). It's a global business rule, which uses mostly global variables and not process variables at all. Therefore, it should be usable in every environment. 

{: .notice--warning}
**Remark:** Remember to change the BPS Portal URL constant and the database Id, if you have an older WEBCON BPS version.
 
 
# Enhancements
This is the simplest version of gathering and streamlining feedback. Slightly more advanced scenarios are to send the mail to a watched mailbox which starts a ticketing workflow or to start a 'ticketing' process directly. You could still use the script to gather the details and populate some fields of the ticking process. The biggest difference here is, that the user needs to have a license to start the ticketing process, which isn't the case when he only sends a mail.