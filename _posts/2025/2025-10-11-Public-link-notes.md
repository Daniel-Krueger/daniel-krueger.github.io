---
title: "Public link notes"
categories:
  - COSMO CONSULT
  - WEBCON BPS
tags:
  - Governance
excerpt:
    "My learnings after using the public link / Single-use access license option"
bpsVersion: 2025.2.1.179
---

# Overview
WEBCON BPS 2023 introduced the option to make a workflow instance accessible for an external user using a link. This is extensively documented in this [post](https://community.webcon.com/posts/post/public-link/386/3).

Since there's already such extensive documentation, which has been updated over time, I want to provide a short overview of the features and my learnings.

Even so WEBCON renamed the license to 'Single-use access' I will use public link in this post. This term is a lot easier to write. :) 

# Basic information

- You need to activate this feature on process level
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-11-51-55.png)
- You can configure an email template on the system settings level
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-11-55-40.png)
- Instances can be shared with read or edit privileges
  - Can be created on demand by the user using the BPS Portal
  - By actions in these triggers:
    - On entry
    - On exit
    - On timer
    - On browser opening
    - Menu button
    - On path
    - Upon instance saving
- Tasks can be shared\
  Can only be created using actions in these triggers:
    - On entry
    - On exit
    - On path
    - Upon instance saving
- A link can be secured with a code, which will be sent to the mail address\
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-11-59-35.png)
- The users access the workflow instance with a temporary user account 
  - this type of user cannot 
    - delegate tasks 
    - or share tasks and instances with others.
  - They are also restricted from accessing certain options, including
    - administrative tools
    - History
    - deleting instances
    - or starting new ones.
- If a path transition is triggered the privileges are reduced to read, and the link will expire after 1 year by default. Obviously, I haven’t tested this. ;)
  
# Findings 
## Related to user experience

- While both options allow the editing of a workflow instance, only the task option does support executing paths.\
  In this example a path was made available as a quick path (right side). This path is not available in the left browser, even so it was opened with a link granting edit privileges.\
  {% include figure image_path="/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-07-34.png" alt="Quick path is not visible for a user with a shared link, even with edit privileges." caption="Quick path is not visible for a user with a shared link, even with edit privileges." %}
- You can upgrade the privilege level of an existing link from `read only` to `edit` using the UI but there's no action for it. Sending a new link will expire the old one, as far as I noticed.
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-42-47.png)
- Different errors depending on how access is removed
  - Due to expiration
    {% include figure image_path="/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-10-57.png" alt="User friendly error message, when the link expires." caption="User friendly error message, when the link expires." %}
  - Removing the shared link
    {% include figure image_path="/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-11-16.png" alt="I would have preferred a more user friendly message, especially for external users." caption="I would have preferred a more user friendly message, especially for external users." %}
- No access to related information, it's a temporary user\
  The upper part of the screenshot shows the `All attachments` tab, but this is empty for the temporary user
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-12-21.png)
- Interface language depends on the browser configuration
- The instance is checked out like in other situations
- If you want to have multilingual text in the mails, you need to use business rules with the `Text` function.
  {% include figure image_path="/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-16-32.png" alt="There’s no translation options for these mails." caption="There’s no translation options for these mails." %}
- The `Is embed default` theme is used
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-18-33.png)
- Some of my JavaScripts are likely to fail, because the internal WEBCON BPS endpoints are accessed without the `authKey` parameter.

## License consumption
- Separate counts for each environment
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-17-30.png)
- Consumption occurs when a link was used to edit an instance. Viewing did not increase the `Used` count.
- Ping pong with shared tasks
  - First task, license is consumed\
    https://hostname/SharedInstanceAuthCode/db/22/Index?authKey=Tjr2t1-4Zkqz892Pabzo4A        
  - Second task, no license is consumed, it's the same link\
    https://hostname/SharedInstanceAuthCode/db/22/Index?authKey=Tjr2t1-4Zkqz892Pabzo4A
  - A new credit is consumed each calendar month\
    It doesn't matter if it's a shared task or link. It's also not important if the link had been generated just a day before.
  
## Security
- No access to attachments of other workflows
- History cannot be accessed, the modified URL is ignored
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-45-35.png)
- Removing the element id from the URL triggers a user authentication
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-45-58.png)
- The temporary user account is unique for each share/link, even for the same workflow instance
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-48-57.png)
- We cannot grant any privileges to this shared user\
  The shared users account has a different syntax which is neither supported by the action nor can it be used in the UI to add privileges using the admin mode.\
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-13-04-18.png)
- Changes are displayed in history  
  ![](/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-44-16.png)

## Deployment mode/ e-mail redirection
The deployment mode configuration is also used for public links.

{% include figure image_path="/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-21-59.png" alt="Deployment mode aka mail redirection." caption="Deployment mode aka mail redirection." %}

{% include figure image_path="/assets/images/posts/2025-10-01-Public-link-notes/2025-09-27-12-39-31.png" alt="With active deployment mode even the public link mails are redirected." caption="With active deployment mode even the public link mails are redirected." %}
