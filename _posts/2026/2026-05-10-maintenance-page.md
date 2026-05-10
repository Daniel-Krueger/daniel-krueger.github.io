---
title: "Displaying a maintenance page during WEBCON BPS updates"
categories:
  - WEBCON BPS  
tags:
  - Installation
  - Governance
  - User Experience
excerpt:
  "Serve a branded, multilingual maintenance page to BPS Portal users during planned downtime so they know when the system will be back and whom to contact."
bpsVersion: 2026.1.1.45
---

<!-- TODO: Add a short screen recording of the maintenance page in the browser showing the language switcher, estimated completion time, and contact info -->
{% include video id="PLACEHOLDER?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

# Overview

Whenever I update a WEBCON BPS environment, users who try to open the BPS Portal run into a generic IIS error. That’s not a great experience. A dedicated maintenance page is a simple way to communicate what is happening, when the system will be back, and who to contact for urgent matters, without touching BPS at all.

# Implementation
## General

The implementation consists of two parts:

1. A PowerShell setup script <br/>
  This creates the IIS sites and copies the bindings from the existing WEBCONBPS site.
2. A static HTML maintenance page <br/>
  Served by a separate IIS site. 

The files 

## IIS setup script

The PowerShell script needs to run once on the web server as Administrator. It reads the HTTPS binding from the existing WEBCON BPS IIS site (certificate hash, store, host header, IP address), creates a new IIS site at the configured maintenance port, assigns the same certificate, and sets `index.html` as the default document. The script accepts a few parameters for customization:

```
Script name: setup-maintenance-site.ps1

Parameters (all optional):
  -SourceWebsiteName      IIS site to copy the HTTPS binding from  (default: "WEBCONBPS")
  -MaintenanceWebsiteName Name for the new IIS site                (default: "MaintenancePage")
  -MaintenancePort        Idle port for the maintenance site        (default: 4443)
  -MaintenancePath        Physical path for the HTML files          (default: C:\inetpub\MaintenancePage)
```

Run with defaults:

```powershell
.\setup-maintenance-site.ps1
```

Or override individual settings:

```powershell
.\setup-maintenance-site.ps1 -SourceWebsiteName "MyWEBCONSite" -MaintenancePort 8443
```

Make sure to unblock the downloaded files from the properties dialog of the file.

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-17-38-02.png" alt="Unblock the downloaded files to prevent any issues." caption="Unblock the downloaded files to prevent any issues." %}

Otherwise you may run into an error when executing the PowerShell script.
{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-17-38-21.png" alt="An error which is thrown, if you want to execute the blocked file." caption="An error which is thrown, if you want to execute the blocked file." %}

This is a result when running the script without any parameters:
{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-18-42-22.png" alt="Script has been executed successfully." caption="Script has been executed successfully." %}

You can also verify the settings in the IIS.

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-17-48-59.png" alt="Maintenance page has been created." caption="Maintenance page has been created." %}

{: .notice--info}
**Tip:** Set this up right after your initial BPS environment deployment so the maintenance site is ready before you ever need it.

{: .notice--info}
**Remark** If you execute the script a second time, the script will remove any created elements and recreate them, except the created folder in the file system.


## Maintenance page (HTML)

After running the script, copy `index.html` (or `index.min.html`) into `MaintenancePath`. This isn't done automatically as you have to modify the content anyway.
{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-17-52-10.png" alt="Copy the index.html to the directory of the maintenance page" caption="Copy the index.html to the directory of the maintenance page" %}

At the bottom of the file you can configure:
1. Supported languages
2. Header<br/>
  This value is required.
3. A message for explaining the downtime<br/>
  This value is required.
4. Contact information<br/>
  It can be left empty.
5. A message for expected end of the downtime. <br/>
  I decided against an explicit time so that you can be vague. It can be left empty.

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-20-04-52.png" alt="The texts and languages of the maintenance page can be configured." caption="The texts and languages of the maintenance page can be configured." %}

While I said that some information is required, this only means that the page may look strange without these.

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-18-12-14.png" alt="How the page looks, if only the header is defined." caption="How the page looks, if only the header is defined." %}

# Usage

Activating the maintenance page is quite easy

1. Stop the main `WEBCONBPS` IIS website.
2. Change the `WEBCONBPS` HTTPS binding from port **443** → **444**.
3. Change the `MaintenancePage` HTTPS binding from port **4443** → **443**.
4. Ensure that the `MaintenancePage` is running and is not stopped from the last update.
4. Restart the main `WEBCONBP` IIS website.

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-19-06-32.png" alt="Switch the ports of the IIS sites." caption="Switch the ports of the IIS sites." %}
Users navigating to the default URL will now see the maintenance page.

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-18-16-42.png" alt="Maintenance page is now displayed for the default URL " caption="Maintenance page is now displayed for the default URL " %}

This will allow you to install any update, do other maintenance actions in the Portal (1) and also open the Designer Studio (2).

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-19-04-23.png" alt="Adding the port will allow you to still access the WEBCON BPS page via Browser (1) and Designer Studio (2)." caption="Adding the port will allow you to still access the WEBCON BPS page via Browser (1) and Designer Studio (2)." %}

When you are done you can just revert the steps.
1. Stop the main `WEBCONBPS` IIS website.
3. Change the `MaintenancePage` HTTPS binding from port **443** → **4443**.
2. Change the `WEBCONBPS` HTTPS binding from port **4443** → **443**.
4. Restart the main `WEBCONBP` IIS website.
5. Optionally, stop the `MaintenancePage`

This is a short checklist:
1. Update the completion time in the `index.html`.
2. Switch the ports, ensure both pages are running.
3. Install the WEBCON BPS update.
4. Do other maintenance.
5. Switch the ports again.

# Remarks
## Microsoft Entra authentication

If the WEBCON BPS environment uses Microsoft Entra ID (Azure AD) for authentication you will need to add a redirect URI with the alternative port (4443) **before** the maintenance window. Without it, you won't be able to login.

```
https://<your-bps-hostname>:<MaintenancePort>/signin-aad
```

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-18-30-55.png" alt="Adding the RedirectURI to the App Registration in Microsoft Entra" caption="Adding the RedirectURI to the App Registration in Microsoft Entra" %}

## Infrastructure considerations
Depending on your network setup, additional changes may be required alongside the IIS binding swap:

- Firewalls / NSGs <br/>
  The maintenance port (default `4443`) must be reachable from the internet if you want to access WEBCON BPS. The maintenance page would already be accessible after switching to port 443.<br/>
  The setup script will add a rule to allow inbound traffic 
  ![](/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-18-46-40.png)
- Reverse proxies / load balancers <br/>
  If BPS is fronted by a proxy, the port swap needs to happen at the right layer. Depending on your setup you may need to adjust the proxy upstream instead of (or in addition to) the IIS binding.
- SSL certificate <br/>
  We are only changing the port, we can simply reuse the same SSL certificate.

## Maintenance banner
Before entering the maintenance window you can show users an advance notification. There are two options in the WEBCON community:
- [Maintenance banner](https://community.webcon.com/forum/thread/6817?messageid=6817)
- [Schedule maintenance with notification on homepage](https://community.webcon.com/forum/thread/5925?messageid=5925)

This is an updated version for 2026 which can be added to the CSS:

```css
.top-menu__content--center-node:before {
content: "Planned maintenance 2026-05-14";
color: var(--colorStatusDangerStroke2);
font-size: var(--fontSize36);
} 
.top-menu__content--center-node {
    text-align: center;
}
```

Every user should take notice of it:
{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-19-45-53.png" alt="Displaying maintenance information with CSS." caption="Displaying maintenance information with CSS." %}

Especially if they don't use the browser in full screen mode.
{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-19-45-47.png" alt="It's really noticeable in a smaller browser window." caption="It's really noticeable in a smaller browser window." %}

## Verify the maintenance information
Of course, you can update the maintenance information and verify that maintenance page is correctly served when you use the maintenance port.

{% include figure image_path="/assets/images/posts/2026-05-10-maintenance-page/2026-05-10-19-02-24.png" alt="Ensure the correct display of the maintenance page before entering the maintenance windows using the port" caption="Ensure the correct display of the maintenance page before entering the maintenance windows using the port" %}

# Download

You can find the files [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/maintenancePage).


