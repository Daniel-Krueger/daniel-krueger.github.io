---
title: "Custom template for generated process documentation"
categories:
  - CC LS
  - WEBCON BPS  
tags:
  - Documentation
excerpt:
    This is a post about creating a template so that the generated process documentation follows the corporate design.
bpsVersion: 2021.1.3.205
---

# Overview  
WEBCON BPS allows to create a documentation for a process. The created documentation contains general descriptions about BPS Portal, and how to use it as well as information about the selected process. These are high level information about the process like workflows, fields, diagram as well as detailed information about the actions which are executed on path transition. 


{: .notice--info}
**Info:** More information can be found in this knowledge base post [Generating documentation](https://community.webcon.com/posts/post/generating-documentation/125). 


While the result of the predefined template can be fine, you may want to create the documentation using your corporate design. In our case the header contains the process name as well as the current chapter. In addition, our styles are for the headings (3) as well as for the table (4) are used.

{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-08-22-18-07.png" alt="Custom template with process name (1) and workflow name in header (2), headings (3) and tables (4) match the corporate design." caption="Custom template with process name (1) and workflow name in header (2), headings (3) and tables (4) match the corporate design." %}

Depending on your situation it may be easier to change the provided template or to modify the template from you company. This post covers the later one. 

# Location of the templates
The templates for creating the process documentation are stored within the Designer Studio installation folder. While the Designer Studio installed from the BPS Portal resides in the AppData folder  of the current folder the other one is stored in the Program Files (x86) folder:
- BPS Portal installation version\
  For each new version an own Designer Studio is installed in the following path
  `%appdata%\..\Local\DesignerStudio`
  Once you have selected the correct version you can navigate to `\Resources\Word\ProcessDocumentation`
- Setup.exe installed version\
  If you used the default installation folder, the templates can be found in the following path. 
  `%ProgramFiles(x86)%\WEBCON\WEBCON BPS Designer Studio\Resources\Word\ProcessDocumentation`

You can copy the provided paths to the explorer so that you can easily navigate to the process generation templates.

 {% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-13-20-07-50.png" alt="The variable in the copied path is resolved." caption="The variable in the copied path is resolved." %}
 
 {% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-14-45-00.png" alt="Template location" caption="Template location" %}


# Copying default information
After opening an existing template, you will notice that it contains the default documentation (1) as well as placeholders (2). The content of the whole document will be part of each generated documentation. while the placeholder will be replaced by their real value.
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-14-55-05.png" alt="The default documentation (1) as well as populated placeholders (2) will be part of every created documentation." caption="The default documentation (1) as well as populated placeholders (2) will be part of every created documentation." %}

If the generic information should be part of your documentation, or you want to add something else you can simply copy it to your template. The generated content will be placed afterwards. 

Let's have a look at the placeholders. If you press `Alt+F9`, the friendly placeholder names you will be replaced by their hidden field definition. 
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-15-02-29.png" alt="Placeholder `<<ProcessName>>` hides a field." caption="Placeholder `<<ProcessName>>` hides a field." %}

If you want to copy a specific placeholder to your own template, you can either create the field or copy the whole field. Just make sure to select the correct formatting option during pasting.
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-15-10-34.png" alt="Depending on the format options the inserted field will match the style of the current location." caption="Depending on the format options the inserted field will match the style of the current location." %}

That's all. You don't need to create the referenced field `ProcessName`. 

# Updating the table design
The table design we see on the first page of the default template will be applied to each generated table.

{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-15-17-17.png" alt="Default table design." caption="Default table design." %}

My first approach was to copy the table, so that the design is copied as well. This worked but I didn't like it. So I went on to find an even simpler approach and I found it. You can simply rename one of your table designs to `WebconTable`. Just right click the design, select `Modify Table Style` (1), and copy the name (2). That's all. 

{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-22-14-27.png" alt="The table design `WebconTable` is applied to each generated table." caption="The table design `WebconTable` is applied to each generated table." %}

# Necessary Headings 
The generated content will use at least headings 1-4 or even heading 5. This depends on the paths and defined actions.

{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-22-06-16.png" alt="A generated documentation may have use heading style level 1-5." caption="A generated documentation may have use heading style level 1-5." %}

If a heading is not displayed in the `Styles` area, you can easily display it by creating a heading of this level in the document. This is achieved by applying a displayed heading to a text and demoting it via the navigation pane.
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-21-55-41.png" alt="After demoting a heading to level five, `Heading 5` will be displayed." caption="After demoting a heading to level five, `Heading 5` will be displayed." %}


# Apply numbering to a heading
If you prefer to apply numbering to your headings, you can use the following way. Place the cursor on a `Heading` element, and open the drop down from the `Multilevel List` icon (2), and select `Define New Multilevel List` .
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-22-08-33.png" alt="Placing the cursor in a heading (1) will allow you to define a multilevel list numbering." caption="Placing the cursor in a heading (1) will allow you to define a multilevel list numbering." %}

The opened dialog will allow you the format of the number. After selecting a level (1), make sure it matches the appropriate `Heading x` style. Afterwards you can choose which of the previous level numbers you want to include in your number (3). Finally, you can select the number style for this level (4). You could even choose to use a different style for this level (5).
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-07-22-04-39.png" alt="Defining the numbering style for each heading." caption="Defining the numbering style for each heading." %}


{: .notice--warning}
**Remark:** The number style format needs to be applied for each level separately. 

# Styling the table of content
We already learned, that we need to style the headings one to five. If we want to display all headings in the table of content, we need to make sure that we style these also. If you click on the little arrow (1) in the `Styles group` the  `Styles` dialog (2) will be displayed. This dialog, lists all available styles. Within all these styles you need to locate the TOC styles and modify them (3) so that the table of content looks good.
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-08-22-07-35.png" alt="You can modify each style via the `Styles`dialog." caption="You can modify each style via the `Styles`dialog." %}

If you want to verify which styles something uses,  the click on middle icon (1) of the `Styles` dialog, the `Style Inspector` will be displayed.
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-08-22-10-19.png" alt="The `Style Inspector`can be opened from the `Styles` dialog." caption="The `Style Inspector`can be opened from the `Styles` dialog." %}

{: .notice--info}
**Info:** The `Styles` dialog can be used an alternative way for defining the heading styles.  

The `Style Inspector` displays the style which is applied to the paragraph in which the cursor is currently located. You can use this to verify which style is used for the current ToC entry.

{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-08-22-11-52.png" alt="A heading 1 table of content entry is styled according to the `TOC 1;index 1` style." caption="A heading 1 table of content entry is styled according to the `TOC 1;index 1` style." %}

# Remarks
The following applies at least to version 2021.1.3.205.

In some cases, a bold/not bold style is applied to heading. There's nothing that you can do about it. You can verify that you've defined the heading correctly by displaying the `Styles` dialog. If you place your cursor inside the heading, the current style will be displayed. In some cases `Not Bold` will be applied to the heading style and in others `Bold`.

{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-08-22-21-46.png" alt="The instance number heading is always styled as not bold. Your style definition gets overridden." caption="The instance number heading is always styled as not bold. Your style definition gets overridden." %}

This can easily be fixed in the generated documentation. Right click (1) on the style and choose `Select all` (2). This will mark all headings. Afterwards left click the heading again (3). This will apply the style to all selected elements.
{% include figure image_path="/assets/images/posts/2021-10-13-customized-process-documentation/2021-10-08-22-30-24.png" alt="You can select all occurrences of a style and apply a style. This will override any custom style settings." caption="You can select all occurrences of a style and apply a style. This will override any custom style settings." %}
