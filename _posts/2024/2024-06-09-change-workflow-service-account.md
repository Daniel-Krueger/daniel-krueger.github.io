---
regenerate: true
title: "Change service account"
categories:
  - WEBCON BPS 
tags:  
excerpt:
    "Changing the service account can be done using 'Tools and application management'."
bpsVersion: 2022.1.4.127
---

# Overview
Even so changing the account is actually straight forward, I wasted to much time because I didn't click on the obvious second `Save` button.
I'm creating this post in case someone else is doing the same and encounters this error message after 'changing' the account.


{: .notice--warning}
**Error:** License Service connection error. Please configure license service connection (endpoint not found).



# Changing the account
Here are the necessary steps, after starting setup.exe and going to `Tool and application management`:
1. Select `Local service configuration`
2. Select `Change user`
3. Provide the user name and password \
  In my case we are using a local user. 
4. `Save` the user \
  This takes a while and it at least updates the global parameter `ServiceLogOnAccount` in the configuration database. It does not update the account of the windows service.
5. `Save` the changes \
  This was the the step I forgot. This will update the account of the windows service and something else.

{% include figure image_path="/assets/images/posts/2024-06-09-change-workflow-service-account/2024-06-09-12-10-27.png" alt="Changing the service account user." caption="Changing the service account user." %}

# What does not work
It is not sufficient to change the windows service account, even after updating the parameter `ServiceLogOnAccount`. 
I don't know it, but my best guess is, that the `ServiceConfig.xml` contains some related information and get's updated in step 5.