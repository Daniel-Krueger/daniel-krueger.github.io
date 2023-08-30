---
title: "Password field"
categories:
  - WEBCON BPS    
tags:    
  - Business rules
  - Debugging
  - SDK
excerpt:
    I've created a plugin for using a single line of text field as a password field. The value is encrypted on the server before it's stored in the database. The focus is less on encryption than preventing an accidental leaking of the value.
bpsVersion: 2023.1.2.44, 2022.1.4.155
---

# Overview  
There are a [bunch of reason](https://community.webcon.com/forum/thread/75?messageid=75) why WEBCON BPS doesn't have an 'encrypted field'.
Nevertheless, I was forced to store a password in a dictionary. Having a plain text password isn't something I wanted to have in a productive environment. For this I created this plugin. The focus is on preventing aa accidental leaking of the password. For example, by screensharing, taking a screenshot, wrong process privileges, SQL queries and so on. 

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/Password.gif" alt="Entering, verifying, viewing the password." caption="Entering, verifying, viewing the password." %}


{: .notice--warning}
**Remark:**
I'm not trained in securing information.

{: .notice--warning}
**Remark:**
Anyone with access to the Designer Studio will be able to decrypt the value.

{: .notice--warning}
**Remark:**
You can use it on your sandbox to check out the functionality. You should review the code and create your own version for productive use.


# Implementation
## Upload the plugin
Download the appropriate .zip from the release, which is linked in [Download](#download) chapter.
Creating/updating a plugin is easy:
1. Navigate to `Plugin packages`
2. Click on `New package`
3. Select the appropriate .zip file.

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-29-20-16-53.png" alt="Uploading a new a plugin" caption="Uploading a new a plugin" %}
  
## Field configuration
The first step is to create a new `single line of text field` and select `PasswordFormFieldExtensionJS` of the plugin as `Customization of form field control`.
{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-28-22-23-13.png" alt="Selecting the form field extension" caption="Selecting the form field extension" %}

Afterwards you have to configure the customization. The minimum configuration is the key, **which has to be 24 characters** long. In my case I stored it in a constant.

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-28-22-28-19.png" alt="Configuring the customization" caption="Configuring the customization" %}

If you want to provide translation for the default message you have to:
1. Select the language.
2. Click on plus sign.
3. A new column for the language will be added, and you can enter the translation.
  

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-28-22-30-46.png" alt="Adding translations" caption="Adding translations" %}


{: .notice--info}
**Info:**
You can use the  `%1` placeholder in `Minimum characters error`, which will replaced with the `Minimum characters` value.

## Business rule for decrypting
The password can be decrypted using a business rule.
1. Select `SDK Execution`
2. Choose `DecryptPassword` from the plugin.
3. Reuse the key used for encrypting the password.\
You can use the usual options. In my example I use the field.
    
{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-28-22-32-54.png" alt="Configure the decryption." caption="Configure the decryption." %}

# Usage
## Entering a password
You can copy & paste the password/string you want to encrypt into the field. The entered data will be masked as *.

Upon saving the instance the provided password is encrypted and stored in a JSON.

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-30-21-17-15.png" alt="The entered password is encrypted and stored in a JSON." caption="The entered password is encrypted and stored in a JSON." %}

## Decrypting the password vie business rule
As usual the business rule can be used in a form rule, automation, action etc.
{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-28-22-36-01.png" alt="Using the business rule in a form rule." caption="Using the business rule in a form rule." %}

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-28-22-37-35.png" alt="Business rule used in a condition." caption="Business rule used in a condition." %}

{: .notice--info}
**Info:**
A new password must be saved, before it can be decrypted with the business rule.

# Explanations
## BPS 2022 and BPS 2023 versions?
There are two separate projects in the VS solution, because BPS 2023 moved to asynchronous method implementation. All plugins need to be rebuilt for BPS 2023. 

I reused the same GUIDs for the plugin extensions. It may be possible to simply upload the BPS 2023 package after an an upgrade, but this is not tested.

## Is this secure?
I can't tell, I used the [AES class example](https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.aes?view=net-7.0).  Anyone who has access to the key will be able to decrypt the value.
In addition to the location where the key is stored, it will be part of the plugin logs. 

I thought about storing the key outside of WEBCON BPS, but rejected it because of multi server environments. After all, my focus is not to create a secure environment but preventing an accidental leaking of the password.

If you are more concerned about this, feel free to use this as a base to build a more secure solution. In case you are using a constant, you could pass the GUID of the constant and retrieve its value from the database. This way the key wouldn't be part of the plugin log. Or you could utilize the [KeePass API](https://keepass.info/help/v2_dev/scr_index.html).

# Development
## VS 2022 and FormFieldExtensionJS
This was something which costs me hours. 
In the end I was able to solve it by:
1. Installing Visual Studio 2022 with `Desktop development C++`.\
Not sure whether this was necessary once I found a working Node.js version.
2. Install [Node.js 12.22.12](https://nodejs.org/en/download/releases)
3. Following Option 1 from [Environment setup and configuration](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-module).\
  ```
  npm install -g windows-build-tools
  ```\
If it doesn't work, you can take a look at the linked page. There is also Option 2.

In the end the following global modules have been installed:

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-29-20-06-58.png" alt="Global node modules" caption="Global node modules" %}


Afterwards I was able to install the node modules in the FormFieldExtensionJS directory.
```
npm install
```

## Developing the form field extension
### WEBCON BPS Tools don't pick up the FormFieldExtension
I couldn't use the `WEBCON BPS Tools`, even when there was only one project in the solution.
{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-29-18-59-07.png" alt="FormFieldExtension is not selectable." caption="FormFieldExtension is not selectable." %}

I worked around this by running the scripts manually:
1. Open a developer shell.
2. Navigate to the folder\
```cd .\DKR_PasswordField2022\PasswordFormFieldExtensionJS```.
3. Execute\
 ```npm run start```.
4. Repeat 1 and 2 and execute\
```npm run watch```.

The last one will allow you to reload the page after saving a file.

### ReadOnlyHtml mode
You can play around with the `ReadOnlyHtml` mode by providing a part of the generated JSON value as `Model value`.
```json
{
"hint":"123..345"
}
```

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-29-19-14-17.png" alt="Developing the form field extension" caption="Developing the form field extension" %}

### Plugin configuration
I'm using the plugin configuration in the `FormFieldExtension` and I'm to lazy to provide the configuration in the workbench every time. Therefore I created a `DefaultSDKConfiguration`. If no configuration is provided, e.g. developing mode, this one is used. This is determined by checking whether an expected property of the configuration exists.

```javascript
import defaultSDKConfiguration from "./components/DefaultSDKConfiguration"
export default ({ model, sdkConfiguration, fieldConfiguration }) => {

    if ((new URLSearchParams(document.location.search)).get("debug") == 'passwordField') {
        debugger;
    }
    const _sdkConfiguration = sdkConfiguration.Translation ? sdkConfiguration : defaultSDKConfiguration
```
### Debugger error
As you see above, I have a little debugger switch. By default you won't be able to build the package, because the debugger would cause an error during build.

You can reduce the error to a warning level by adding ```"no-debugger": "warn"``` to .eslintrc.json.
```
  "rules": {
    "no-console": "off",
    "no-unused-vars": "off",
    "no-debugger": "warn"
  },
```

## SDK actions
### Why was the Validate function used
Despite using OnBeforeElementSave the first version stored the original value. Therefore, I moved to the Validate function.

{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-30-21-20-00.png" alt="Original password was stored using OnBeforeElementSave" caption="Original password was stored using OnBeforeElementSave" %}


The functions `ConvertToDBType`, `OnDBValueSet` don't have a Context object which I could use to log debug information.

```c#
args.Context.PluginLogger.AppendDebug("Key length ok");
```

### Plugin configuration and translations
The business rule and form field extension have common configuration settings. These are stored in the file `PasswordEncryptionConfig`.

I wanted to provide two translations list, one for the common settings and one for the specialized plugin configuration. It seems that it's not possible to have two translations lists. At least I wasn't able to solve the errors. Everything was fine, as long as I only used either one. Therefore I have a base class, which is used for the translation list.

## Package creation
In the past I had some problems when not the exact assembly version wasn't available. In addition, the SDK Tools didn't reliably work. This may have gotten better. I haven't checked it out.
Nevertheless, the projects still use my old solution. 
I make use of the pre and post build events.
- `IncreaseRevisionNumber.ps1` is used in the pre-build event.\
This is also useful if you have another project in your solution. In the past the SDK Tools didn't increase the version of this one.
- `CreatePackage.ps1` is used in the post build event.\
The created package will contain:\
  - All assemblies from the build/release folder, which are not identical for `WEBCON BPS Portal` and `WEBCON BPS WorkFlow Service`.\
    Identical means, that they have the same assembly version. Yes, they have different versions and if a plugin is used by `BPS Portal` as well as the `Workflow Service` it may cause problems otherwise.\
    The script contains a commented section for updating the file list. You can paste the result into the script. In my case the installation is so old, that the installation folder is in the x86 folder. You will probably need to change the folder in your case.
  - Add all  *.bpspkg\
    The *.bpspkg has to be build before. This is done either by running  ```npm run build``` or ```npm run watch```. ```watch``` will always create the package when something changes.
  - Optionally add assemblies from another folder.


## Debug information
The form field extension has not really an option to provide feedback in case of errors. Therefore, I made use of the PluginLogger. If the debugging mode is configured for the extension you will get additional information.


{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-29-20-39-06.png" alt="Configure logging for the plugin." caption="Configure logging for the plugin." %}

## Unexpected error
During the development I had some `unexpected errors`. There were no further information in the browser or trace. I got more information in the log file of BPS Portal.
{% include figure image_path="/assets/images/posts/2023-08-29-password-field/2023-08-28-22-45-30.png" alt="Log files of BPS Portal" caption="Log files of BPS Portal" %}


# Download
[Source code](https://github.com/Daniel-Krueger/webcon_PasswordField)\
[Usable packages](https://github.com/Daniel-Krueger/webcon_PasswordField/releases/tag/0.8)\
The BPS 2023 package is way bigger because the SDK uses different assembly versions than they are utilized on the server.