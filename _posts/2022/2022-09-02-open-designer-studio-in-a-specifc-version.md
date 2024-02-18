---
title: "Open Designer Studio in a specific version"
categories:
  - WEBCON BPS 
  - Private 
tags:
  - Installation
excerpt:
    An easy option to create version specific Designer Studio shortcuts to target different environments.
bpsVersion: 2022.1.3.65
last_modified_at: 2022-09-10
---

# Overview  
This is a short post on how to create shortcuts using different versions of the `Designer Studio` to connect to BPS Portals.

{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-02-21-43-06.png" alt="Shortcuts to target different versions and BPS Portals" caption="Shortcuts to target different versions and BPS Portals" %}


# Shortcut creation


{: .notice--warning}
**Remark:** Maybe something has changed with WEBCON BPS 2022.1.3.65 or I haven't noticed it before, but after installing R3, the older versions have been deleted. Therefore I updated [Installing an older version](https://daniels-notes.de/posts/2022/open-designer-studio-in-a-specifc-version#installing-an-older-version).

The first thing to do is to create a copy of an existing shortcut. For this you can search for `Designer Studio` in the windows search bar, right click is and choose `Open the file location`. 

{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-02-21-54-25.png" alt="Open the file location of the default shortcut." caption="Open the file location of the default shortcut." %}

Afterwards you can copy it to the desktop and modify its properties. You can copy the following just amend the version and URL.

```
Target:
"%AppData%\..\Local\DesignerStudio\app-20221.3.47\WEBCON Designer Studio.exe" -protocol "webcon://https://CUSTOMURL/?Context=/db/1/app/1&parameters="

Start in:
%AppData%\..\Local\DesignerStudio\app-20221.3.47
```
{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-02-21-48-10.png" alt="The short cut definition." caption="The short cut definition." %}

Of course, the actual version depends on the one you are using. Different versions are installed side by side and won't be deleted if a newer version is installed. The below folder path will open the folder in the context of the current user.

```
%AppData%\..\Local\DesignerStudio
```

{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-02-22-01-14.png" alt="Multiple Designer Studio versions are installed." caption="Multiple Designer Studio versions are installed." %}

# Parameter `Protocol`
The `Context` query parameter is used to open a specific element in the Designer Studio. At least in WEBCON BPS 2022 R2 and R3 there are two ways to get its value.  
1. Open the developer tools of the browser and click on `Designer Studio`. This will display the value in the log. I don't know since which version this is displayed. I used the second approach most of the time.
{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-02-22-09-56.png" alt="Protocol value is displayed as a log information in the browser developer tools." caption="Protocol value is displayed as a log information in the browser developer tools." %}
2. Open the `Designer Studio` again and display the task manager. Right click a header, choose `Select colum` and add `Command line`. The column will display the whole command which was used to execute the process. You can also use this as the target.
{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-02-22-14-54.png" alt="Used protocol value can be seen in the task manager column `Command line` " caption="Used protocol value can be seen in the task manager column `Command line` " %}


{: .notice--info}
**Remark:** The second option will only work for the latest installed version.

{: .notice--warning}
**Warning:** If a shortcut doesn't work anymore after an update, the version in the short cut needs to be changed. If it still doesn't work the protocol value may be different. For example, the `Context` parameter has been added in WEBCON BPS 2022 R2 and my WEBCON BPS 2021 failed to start, if I remember correctly.

{: .notice--info}
**Remark:** If anyone has an idea what the `parameters` are used for, feel free to mention it or get in touch with me.


# Installing an older version
As a prerequiste, you should uninstall the `Designer Studio` via `Program and Features`. 

You can use the following URL to download the Designer Studio from BPS Portal.
```
URL: https://BPSPORTALURL/Addins/Studio/WEBCON_DesignerStudio_Installer.exe
```

{: .notice--info}
**Remark:** This applies at least to WEBCON BPS 2022 R2 and R3. I don't have an older version to verify it.

The other alternative would be to download the complete installation file, extract it and install `Designer Studio` from the subfolder `Studio`

{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-02-22-23-46.png" alt="Location of the Designer Studio inside the downloaded install.zip" caption="Location of the Designer Studio inside the downloaded install.zip" %}

After the installation, open the `Designer Studio` and connect to the target portal. This will download the DesignerStudio as a nuget package and place it in the packages folder.
{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-10-22-06-40.png" alt="Additionally downloaded file, which doesn't exist after the installation." caption="Additionally downloaded file, which doesn't exist after the installation." %}

Afterwards move / copy the whole Designer Studio directory to another folder. I opted for a dedicated folder c:\Install\DesignerStudio\Version

{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-10-22-10-28.png" alt="An own folder for each Designer Studio version." caption="An own folder for each Designer Studio version." %}

{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-10-22-09-41.png" alt="Copy the DesignerStudio folder content from AppData to your own." caption="Copy the DesignerStudio folder content from AppData to your own." %}

Once this is done, you can create the shortcuts like it is described in [Shortcut creation](https://daniels-notes.de/posts/2022/open-designer-studio-in-a-specifc-version#shortcut-creation). Just make sure to target the new folder.

{% include figure image_path="/assets/images/posts/2022-09-02-open-designer-studio-in-a-specifc-version/2022-09-10-22-12-29.png" alt="Shortcut targeting the new folder." caption="Shortcut targeting the new folder." %}


{: .notice--warning}
**Remark:** It's important to download the nuget package file. If this does not exist in the packages folder, the `Designer Studio` will use the latest installed version to connect to the portal. At least I was stuck with something like a `Version mismatch` error when I first installed 2022.1.2.31, followed by 2022.1.3.65 and only then opening Designer Studio Version 2022.1.2.31. I have some ideas why this happened but no evidence.

# SQL Mode
By default, all `Designer Studios` will use the REST services. If you still want to use the old communication mode, where the `Designer Studio` directly communicates with the database you need to add `--sql`. Of course, the current user will still need to have access to the database itself.
```
Target:
"C:\Program Files (x86)\WEBCON\WEBCON BPS Designer Studio\WEBCON Designer Studio.exe" --sql


```

{: .notice--info}
**Remark:** The folder path may be `Program Files (x86)` or `Program Files` this will depend on the version which was used to install WEBCON BPS the first time.