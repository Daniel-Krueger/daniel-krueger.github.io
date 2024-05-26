---
title: "Handling translations in WEBCON BPS"
categories:
  - WEBCON BPS   
  - Private  
tags: 
  - SDK
  - Translations
  - Designer Desk
excerpt:
    An overview of the different to provide translations for user interface (custom and default), data and SDK.
bpsVersion: 2023.1.3.118
---

# Overview
WEBCON BPS offers numerous options to provide translations. While there are already a lot of sources, there's not one which provides a complete overview. This post is intended to provide an overview of all the options, either with links to the sources and/or explanations/tips.\
The topics are:
- [User interface](#user-interface)
- [Data](#data)
- [Emails](#emails)
- [Enforce one language](#enforce-one-language)
- [SDK](#sdk)

If you are new to the whole translation topic, I can recommend this video.

{% include video id="vnDqq3FRrjY?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}


{: .notice--info}
**Info:** In case I missed something, feel free to add it as a comment or get in touch with me, so that this overview can be updated.


{: .notice--warning}
**Remark:** Please take a look at the referenced [user voices](#user-voices).

# User interface
## Available languages

There are two different sources which need to be configured depending on the type of translation you want to provide.
- [Interface language packs](https://docs.webcon.com/docs/2023R2/Studio/SystemSettings/GlobalParams/SystemSettings_LanguagePack)\
  Defines the translations for the default elements which also sets the date format.
- [Translation languages](https://docs.webcon.com/docs/2023R2/Studio/SystemSettings/GlobalParams/SystemSettings_Language)\
  The language for which a translation of a configuration element can be defined.

Additional resource:

>[SYSTEM LANGUAGES](https://community.webcon.com/posts/post/system-languages/134/4)\
>Applies to version 2019.1; author: Jarosława Markopolska
>
>This article is an extension of Translation of WEBCON BPS Portal user interface content and contains more information about language configuration in WEBCON BPS Designer Studio:
>
>1. System language setting
>2. Mass notification language setting (added in BPS 2020.1.3)
>3. Application language setting
>4. Notification language setting for new users (added in BPS 2020.1.3)

## Interface language
If you want, you can modify the existing user interface translations or create a completely new language pack. The user interface language elements are marked with a yellow rectangular while the configuration elements are red. Configuration elements are those created by the user, for example: Applications, Dashboards, Report, Processes, Fields etc.

> [Translation of WEBCON BPS PORTAL user interface content](https://community.webcon.com/posts/post/translation-of-webcon-bps-portal-user-interface-content/102/3)\
> Applies to version: 2019.1.4.x and above; author: Jacek Język
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-10-00-26.png" alt="Yellow interface elements, red configuration elements" caption="Yellow interface elements, red configuration elements" %}


An user friendly option to generate / update translations is the [BPS Translator](https://bpstranslator.webcon.com/GettingStarted.aspx).

>BPS Translator key features
>
>- All phrases in all languages in the same spot\
>- Overview of all translations currently in use
>- Add new translations for individual phrases, and suggest changes to existing ones
>- Translate to and from any language
>- Preview translations for a phrase in different languages
>- Create translations for languages not yet available in WEBCON BPS

## UI configuration elements
### Single element translation
#### Designer Studio
This is the oldest and most prominent option to define a translation for a configuration element. Wherever you see the translation icon, you can bring up the window, to define the translations. These are typically:
- Name of an element
- Description of an element
- Documentation of an element

{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-10-08-43.png" alt="Translating an element in Designer Studio" caption="Translating an element in Designer Studio" %}

Sometimes you need to click into a cell to display the icon:

{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-10-30-27.png" alt="Translating a choose column." caption="Translating a choose column." %}

Of course, you can translate columns, and views in reports too. You just need to activate the edit mode. 
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-10-31-28.png" alt="Translating report elements." caption="Translating report elements." %}

{: .notice--warning}
**Remark:** You should only use translations for columns in reports, when this is necessary. If you defined those for a field, they will get used by default. But not in choose fields. If you are annoyed by these please take a loot at the [user voices](#user-voices).

#### BPS Portal 
WEBCON BPS 2023 added an additional collaboration option with the business users. They can view the form, field matrix and workflow as well as provide translations via BPS Portal. Search for the term `Using the application and Edit mode` in the linked post, to see how it is done.

> [From prototype to production-deployed application: Edit mode in WEBCON BPS Portal](https://community.webcon.com/posts/post/from-prototype-to-production-deployed-application-edit-mode-in-webcon-bps-portal/381/3)
> Applies to version: 2023.1.x and above; author: Krystyna Gawryał
>
> Persons authorized to edit a process in Portal:
> - global system administrator,
> - application administrator, and
> - a user who has been granted the privilege Designer Desk edit in Portal directly in the process configuration.
>
> *In case the user does not have a personal license to access Designer Desk, all designers will open in read-only mode and the user will be prompted accordingly.*

Tl;dr;\
In edit mode and sufficient privileges, you will see a `Processes` navigation menu from which you can choose the process. Afterwards the form is displayed and:
1. You can select the language which should currently be displayed. This makes it easy to see missing translations.
2. Those can be ignored, as they are HTML fields.
3. You can click into a text to translate it.
4. Description/Documentation as well as multi languages can be defined using the properties window.

{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-11-51-58.png" alt="Business users can translate elements using the portal." caption="Business users can translate elements using the portal." %}


It comes in handy, if you have a convention like putting all `system` fields in a group with the name `usageFields`. This way, the users know that these are not relevant for the user interface and only will be visible in admin mode/documentation.
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-11-52-54.png" alt="A naming convention helps to tell users which fields are not visible to normal users." caption="A naming convention helps to tell users which fields are not visible to normal users." %}

### Bulk translation with Excel
If you already have an existing application and need to translate it, you may want to do it in one go. You can export the translations for a single process to an Excel file. This file will contain a whole bunch of worksheets for the different elements. It takes some time to get used to it, but it will help you in the end. It's not necessarily the best option for the business users though.

Here are a few tips / guide lines:
- Close the Designer Studio\
  If you don't close it, hit reload all, after an import. Otherwise, you may have old information and will overwrite the new translations with old ones.
- Translating application elements\
  There's no separate option to export the translations for an application. You always export the translations for a process with all application elements. Dashboards, Reports etc. My advice is to translate the first process, import it and afterwards you can export the translations of all other processes, because:
- Last one wins\
  The last imported file wins. If you import the exported files in the wrong order, because only one contains the application translations, they won't be translated.
- No need to translate report columns\
  If you provide translations for your fields, you don't need to translate these. Calculated columns are an exception to this rule.
- Spell check with Word\
  You can copy the translations to Word for a spell check. If you don't have line breaks in your translations, you can copy them back. Alternatively replace the line breaks with an unused character and revert it later. You can enter a line break in the replace function with `ctrl+j`
  {% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-10-55-54.png" alt="The invisible line break character can be entered with ctrl+j" caption="The invisible line break character can be entered with ctrl+j" %}
- Multilingual choose values can not be translated
- Worksheet navigation\
  Right clicking on the left/right cursor next to worksheets will open a selection.\
  {% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-10-37-03.png" alt="Right click the cursors to open the worksheet selection." caption="Right click the cursors to open the worksheet selection." %}

  
#### Before WEBCON BPS 2023
Before BPS 2023 there was a separate tool, which required a direct connection to the database. I haven't used it in a long time, but I remember that some elements weren't supported.

> [WEBCON BPS translation tool](https://community.webcon.com/posts/post/translation-tool/155/10)\
> With the *`as is` license*, WEBCON additionally provides an external tool, which exports all translatable phrases from a process to an Excel spreadsheet. This spreadsheet contains additional columns, named after the languages defined in Designer Studio.


#### Starting with WEBCON BPS 2023
With the release of WEBCON BPS 2023 the translation tool was replaced with an built-in solution. This is available from the Designer Studio as well as BPS Portal.

> [Export and import of translations in WEBCON BPS](https://community.webcon.com/posts/post/export-and-import-of-translations-in-webcon-bps/418/4)\
> Applies to version: 2023 R1 and above; author: Krystyna Gawryał\
> Note: Translations can be exported/imported within one environment and one main version of WEBCON BPS.



This video demonstrates the export/import from BPS Portal:<br/>
{% include video id="vsmCnw7sWgk?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

#### Bulk translation in WEBCON BPS 2023.1.2.44
In version 2023.1.2.44 I noticed an issue. While this was fixed in the meantime, there's at least one environment out there, which still has the issues. So I'm keeping this as a reference. 
The issue is, that importing the translation break the transport.

1. After importing the translation the report configuration will look like this in the database. There's nothing wrong with it and it works just fine in the _current_ environment.
2. When you export the application and import it to another environment, you may be in for a surprise.
3. Comparing the configuration shows some difference. In my case the field 569, was not visible in the first screenshot, was an AttText4 field in the source and a WFD_Tab field in the target environment. This caused the problem.
4. This can be corrected, by changing anything in the report definition. For example, by clicking the `default view` checkbox twice.
5. Afterwards, you can save the report which will restore the variable definitions. Take a close look and compare the ProcessID value in 1. and 2. 

{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-09-02-45.png" alt="Ids are not marked as variables after an import" caption="Ids are not marked as variables after an import" %}

You can execute this SQL statement to verify if there's something for you to do. It should not return any rows.


```sql
SELECT TOP (1000) [ARP_ID],[ARP_APPID] ,[ARP_Name],[ARP_Configuration]
FROM [dbo].[AppReports]
where ARP_Configuration not like '%SelectedApplicationId>#%'

SELECT TOP (1000) [ARP_ID],[ARP_APPID] ,[ARP_Name],[ARP_Configuration]
FROM [dbo].[AppReports]
where ARP_Configuration not like '%SelectedApplicationId>#%'
```


# Data
Up to know we focused on the user interface, but WEBCON is not limited to it. You can also provide translation for data stored in choose fields.

## Choose field
### Syntax
We can define multilingual values for a choose fields.

> [Multilingual choice fields](https://community.webcon.com/posts/post/multilingual-choice-fields/264/23)\
> Applies to version: 2019.1.x and above; author: Jacek Język\
> DEFAULT_NAME$$LANG_CODE$$LANG_NAME$$ LANG_CODE $$ LANG_NAME …
>
> - Limitations of the size of the data stored in the base – values of fields and choice columns saved in the database can be 1000 characters long. This limits the phrase length and the number of the translations themselves which together cannot be longer than 1000 characters.
> - Translation changes in the data source are not taken into account for the saved value until the form was saved with the new translation.
> 
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-12-40-23.png" alt="Example of a multilingual choose field value." caption="Example of a multilingual choose field value." %}

### Build multilingual string with Excel
In my [Little excel helpers for WEBCON BPS](https://daniels-notes.de/posts/2021/little-excel-helpers#sql-command-for-fixed-values-used-in-a-picker-field), there's a worksheet for building the string using an Excel worksheet. This is especially helpful, in case you have multiple language want to prevent errors due to missing $ characters. :)


{: .notice--warning}
**Remark:** In the Excel file, there also worksheet to create the html for multilingual icons. I would use a different approach, as the [Text function](#business-rule-function-text) was not available then. At least, when I have the option to use it. We can't use a business rule for calculated columns in BPS internal views or reports.

### Retrieve specific language value in an action
In case you need to retrieve the value of a specific language, you can make use of the `dbo.ClearWFElemAdvLanguage` function.
```sql
select 'DE' as Language
  , dbo.ClearWFElemAdvLanguage('1#Fallback$$DE$$Text DE','de') as value
union
select 'Current language' as Language
  , dbo.ClearWFElemAdvLanguage('1#Fallback$$DE$$Text DE$',substring ('{USERLAN}',1,2)) as value
```

{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-12-51-40.png" alt="Retrieve a language value in an action" caption="Retrieve a language value in an action" %}

### Dynamically generating the value from rows
On of my first posts in the community was this tip:<br/>
[SQL command: Populating multilingual choice field with form type names](https://community.webcon.com/forum/thread/1092?messageid=1092)

I had a case where I wanted to select a form type but:
- I wanted to display the translated form type name
- I didn't want two have multiple sources where I would have to change the name.

Therefore, I created a comment which uses the `Translates` table.


```sql
select DTYPE_ID
, DTYPE_Name + isnull(
  (
	select distinct '$$', substring(LAN_Name,1,2) +'$$'+TRANS_Name
	FROM WFDocTypes as innerDocType join Translates on TRANS_ELEMID = DTYPE_ID and TRANS_OBJID = 13 join TranslateLanguages on TRANS_LANID = LAN_ID
	where innerDocType.DTYPE_ID = outerDocType.DTYPE_ID
	FOR XML PATH('')
	),'') as Label
FROM WFDocTypes outerDocType
where DTYPE_ID in ({DT:4},{DT:7})
```
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-09-11-13.png" alt="Multilingual values from different rows. Second value is not translated." caption="Multilingual values from different rows. Second value is not translated." %}

In the post there are two more examples one for the workflow name and one of the step name.

## Attachment categories
This was new to me, although it's available since years. You can provide translations for categories.  

If you enable the `multi language names` options of the attachment category, you can select different columns from the data source.
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-12-04-05.png" alt="Providing translations for attachment categories" caption="Providing translations for attachment categories" %}



> [Translation of attachment category names](https://community.webcon.com/posts/post/translation-of-attachments-category-names/87/4)\
> Applies to version: 2020.1.x and above; author: Michał Kastelik

{: .notice--warning}
**Remark:** Unfortunately, this approach is not available for other choose fields.

## Survey
Starting with 2023 R3 we have the option to translate not only the field name but the questions and values of the survey fields. Due to the nature how they are handled, adding translations will not affect old workflow instance.

> [Translations of survey fields](https://community.webcon.com/posts/post/translations-of-survey-fields/414/23)\
> Applies to version: 2023 R3 and above; author: Krystyna Gawryał




## Translate absence types
I have never used this, so I'm just referencing the documentation:

> [Step 8: Absence types](https://docs.webcon.com/docs/2023R3/Studio/Process/CreateNew/Vacation/Wizard_VacationProccessStep8#1-use-default-data-source-in-translation)\
> The option allows you to select one of the two system data sources of leave types. For the Polish language, it is the DefaultVacationTypesPL source which includes the following leaves: Holiday, On demand, and Personal. For the English language, the source is DefaultVacationTypesEN which includes leaves called Vacation and Personal. 

## DD/MM/YYYY or MM/DD/YYYY date format
If you are not a native English speaker you probably won't bother, whether the translations are provided as `English (United States) _en-US_` or `English (United Kingdom) _en-GB_`. What you may care about is the date format:
- GB: DD/MM/YYYY
- US: MM/DD/YYYY


Depending on your case you should use the English language which fits your date format the best.

> [British date format in WEBCON BPS](https://community.webcon.com/posts/post/british-date-format-in-webcon-bps/369/3)\
> Applies to version: 2020.1.x and above; author: Łukasz Maciaszkiewicz


## Business rule function Text
In WEBCON BPS 2022 a `Text` function was added to the business rule functions. This allows us to define a _text_ in multiple languages. 

{% include figure image_path="/assets/images/posts/2024-03-25-graphical-cues/2024-03-26-20-46-14.png" alt="`Text` business rule function usage." caption="`Text` business rule function usage." %}

{: .notice--warning}
**Remark:** The above image is from this post [Graphical cues - Scheduled / postponed workflow instance](/posts/2024/graphical-cues#scheduled--postponed-workflow-instance).


# Emails
Multilingual mails, these are a beast on their own, but WEBCON did a pretty good job here too.
If you are interested in this topic, you should read this post:

> [Language of emails in multilingual environments](https://community.webcon.com/posts/post/language-of-e-mails-in-multilingual-environments/52/4)\
> Applies to version: 2020.1.x and above; author: Michał Kastelik
>

While the fundamentals of the post still apply, you may be choosing different approaches today. 
- Automations haven't been available and while the execution condition is still available most people would use the `if` or even `switch` operator today.
- Depending on the complexity of the mail, the `Text` function could also be an alternative to defining two separate mails.

# Enforce one language 
## Global level

If all your users should only use one language, you can enforce this on a [global level](https://docs.webcon.com/docs/2023R3/Studio/SystemSettings/GlobalParams/SystemSettings_LanguagePack#2-system-language). This may come in handy, if you do now want that users can choose from different languages and/or date formats.
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-18-23-29.png" alt="Enforce one language." caption="Enforce one language." %}

## Application level
If you don't want to enforce the language for the whole platform but for a few applications, you can set the language on the application level itself. This option is available in the `General` tab of the application at the bottom.
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-18-25-42.png" alt="Define language of an application" caption="Define language of an application" %}

## Mails aka Notification
We need to distinguish two different situations:
- New users who never logged in  
- Users who already logged in\
  If a user has logged in, a user profile was created with a language. This language is typically set based on the language preferences of the browser.

You can define the language of notifications / mails for the first group on a global or application level
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-18-29-06.png" alt="Define notification language for new users." caption="Define notification language for new users." %}

While this option is useful for new users, you can also define the language of a custom notification. This may be helpful, if you define the text of the mail in one language but there are elements which would be translated automatically. This way you can prevent a mix of languages.
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-18-31-30.png" alt="Setting the language of a notification" caption="Setting the language of a notification" %}



# SDK
Last but not least, we can define, that a configuration value can be translated. This could be used if we want to display an error message which should be configurable as well as translatable.


Class definition
``` csharp
public class Config: PluginConfiguration
{
[ConfigEditableTranslationsList(DisplayName ="Translatable texts")]
public TranslatableTexts Translations { get; set; }

}
public class TranslatableTexts
{
[ConfigEditableTranslation(DefaultTranslation = "Authenticate", DisplayName = "Authenticate button label")]
public string AuthenticationButtonLabel
{
get; set;
}
...
}
```
After this is setup correctly, we will get a grid in the configuration. We can define the default value as well as adding columns for a language and the respective translations.
{% include figure image_path="/assets/images/posts/2024-05-26-translations/2024-05-26-08-59-47.png" alt="Define configurable translatable values" caption="Define configurable translatable values" %}

We can simply access the property in C#. WEBCON BPS will return the value for the current language.
```csharp
Configuration.Translations.AuthenticationButtonLabel
```

This also works in FormFieldExtensionJS. This would be an example if you are using a function component:
```js
props.sdkConfiguration.Translations.AuthenticationButtonLabel
```


# User voices 
I want to take the opportunity to highlight a view user voices (limitations) which are related to translations.
1. [Reuse translations of columns from a BPS internal view in a data row / data table](https://community.webcon.com/forum/thread/4098)
2. [Dynamic language in workflow preview (started)](https://community.webcon.com/forum/thread/4066/15)
3. [Add an own option for setting only id of a choose field](https://community.webcon.com/forum/thread/4936/15)
4. [Designer Studio: Adding windows spell checking (not now)](https://community.webcon.com/forum/thread/908?messageid=908)


