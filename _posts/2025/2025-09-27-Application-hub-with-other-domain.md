---
title: "Application hub with another domain"
categories:
  - WEBCON BPS
  - Private 
tags:
 - Installation
 - Governance
excerpt:
    "How to make a WEBCON application available on another domain"
bpsVersion: 2025.2.1.179
---

# Overview
WEBCON already published an article which explains the [application hub](https://community.webcon.com/posts/post/application-hub/544/3):
> WEBCON BPS is a comprehensive platform for business process automation, within which there may be a need to isolate a specific application for a particular group of users. This is where the Application Hub functionality comes in — a mechanism that allows any WEBCON BPS application to be made available under an independent URL, which is a subdomain of the main portal. This gives you full control over what end users see and how they log in, while maintaining the benefits of centralized platform administration.

So, why do I see the need to create another post? This is quite simple, the whole documentation mentions a subdomain:
- portal.mycompany.com is the URL of the whole WEBCON platform, with Absences, Invoices, Contracts, Complaint etc. applications
- contract.mycompany.com makes a contract application available
- support.mycompany.comm publishes the complaints application

I didn't like the implied limitation, that it needs to be a subdomain, due to the following facts:
- A wild card certificate is valid only for the same level\
  The `*.mycompany.com certificate` is valid for all the above hostnames but you couldn't use it for `contract.portal.mycompany.com` because contract is on another level.
- You may have `portal.mycompany-group.com` but with a dedicated business entity application which should be made available at `complaint.mycompany.com`
- I don't like limitations. :)

As it turns out, there's no technical limitation and the setup is quite easy.

{% include figure image_path="/assets/images/posts/2025-09-27-Application-hub-with-other-domain/2025-09-27-10-49-45.png" alt="The document control application is published on an unrelated domain" caption="The document control application is published on an unrelated domain" %}

# Setup
The first steps are the same as in the documentation:
1. Open System settings\Alternative application addresses
2. Add a new entry
3. Select the application
4. Enter the domain
5. Select the authentication providers

{% include figure image_path="/assets/images/posts/2025-09-27-Application-hub-with-other-domain/2025-09-27-10-52-19.png" alt="WEBCON setup for publishing the application on another URL." caption="WEBCON setup for publishing the application on another URL." %}

Next, we need to update the IIS. This deviates very slightly from the documentation.
- Add a binding for the new address
  ![](/assets/images/posts/2025-09-27-Application-hub-with-other-domain/2025-09-27-10-59-53.png)
- Activate `Require Server Name Indication` for *all* bindings. 
  This will allow you to choose different SSL certificates. Otherwise, one of the selected certificates would be applied for those sites which would obviously be wrong.
  ![](/assets/images/posts/2025-09-27-Application-hub-with-other-domain/2025-09-27-11-03-04.png)

You can now follow the rest of the documentation which basically means
- Add a DNS entry for the new address
- Depending on the authentication provider, you may need to update the Return URLs
- Take care of any other necessary infrastructure related specificities.


{: .notice--warning}
**Remark:** In the application hub the db id and application id is omitted from the URL. This will surely break some of my JavaScript modifications.
![](/assets/images/posts/2025-09-27-Application-hub-with-other-domain/2025-09-27-11-09-04.png)
