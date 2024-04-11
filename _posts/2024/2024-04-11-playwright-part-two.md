---
title: "Automated UI Tests for WEBCON BPS - Part two"
categories:
  - WEBCON BPS   
  - Private  
tags: 
  - Automated UI Tests
excerpt:
    The second post of my series of using Playwright from Microsoft for WEBCON BPS.
bpsVersion: 2023.1.3.118
---
# Overview
This is the second post of my series 'Automated UI Tests for WEBCON BPS'. 
My goal of this series to make it easy to create tests with Playwright for WEBCON BPS. Since there's still a lot of work, I will only cover the changes to the last post.

You can read up on the previous post here:
- [Automated UI Tests for WEBCON BPS - First steps](https://daniels-notes.de/posts/2024/playwright-first-steps)

This video show cases the changes and will give you how Playwright could be useful.
{% include video id="6cM16sWgUAI?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

# Changes
## Current step verification.
The form data now contains a property for the step id. The title of the step will be retrieved using the id, which in turn will be used for comparison. If the workflow instance is in the correct step, it will succeed even if you change the name of the step or change the language of the test user.
```js
const submitData: IFormData = {
..
  pathId: 292, // Submit
  currentStepId: 230, // Start
};
```

{% include figure image_path="/assets/images/posts/2024-04-11-playwright-part-two/2024-04-11-20-41-10.png" alt="Moved from fixed tag to dynamic text." caption="Moved from fixed tag to dynamic text." %}

## Tab and group support
The IFormData property  `fieldValues` was replaced by `controls`. This property allows adding:
- IFieldContainer<br/>
  These can be either a tab or a group, which in turn have a `controls` property
- IField<br/>
  An actual field.

The below example represents a form with two tabs, where the second tab contains a collapsed group.
```js
 controls: [
    new TabField("General", 1026, [
      new TextField("Title", ....),
      new MultiLineTextField("Description",....),
    ]),
    new TabField("Second tab", 1025, [
      new NumberField("Input field", ...),
      new GroupField("Output", 1027, [
        new NumberField("Output by form rule", ...),
        new NumberField("Output by form rule with business rule",...),
      ]),
    ]),
    new GroupField("Roles", 1024, [
      new ChooseFieldPopupSearch("Responsible", ...),
    ]),
  ],
```
{% include figure image_path="/assets/images/posts/2024-04-11-playwright-part-two/2024-04-11-20-50-02.png" alt="Two tabs and the second tab has a collapsed group." caption="Two tabs and the second tab has a collapsed group." %}

If you execute the enrich form data function and pass the `controls` property to `setAndCheckControls` the test will:
- activate the current tabs
- fill out the fields
- expand a collapsed group, if necessary.
  
```js
    // Update data with multilingual labels
    const data = await EnrichedFormData.BuildInstance(page, approvalData);
    // Set value and verify it was set.
    await setAndCheckControls(page, data.controls); 
```
## Updates to BaseField
I made a few changes to the BaseField definition:
- Define whether the field should be required.
- The action to execute.

The later one is necessary to support cases, where a form field will set other fields. I made a simple test with:
- Set one field with a form rule
- Set the other field with a form rule which executes a simple business rule

{% include figure image_path="/assets/images/posts/2024-04-11-playwright-part-two/2024-04-11-20-57-31.png" alt="Setting other fields with a form rule and business rule." caption="Setting other fields with a form rule and business rule." %}

Up to know I had only the option to `setAndCheck` the result. Now I needed to modify this, so I can verify a value only.

This is now supported by defining an action type for the field. This and defining `isRequired`  can be set using an options property.

```js


interface FieldOptions {
  /** Defines, whether the field should have be the required attribute. */
  isRequired?: boolean;  
  /** The default action type will be Set and check, you can overwrite it with an option. */
  action?: FieldActionType;
}

export abstract class BaseField implements IField {
  ...
  constructor(
    public label: string,
    public column: string,
    public value: any,
    options?: FieldOptions
  )
...

 new NumberField("Output by form rule"
                  , "AttInt2"
                  , 2 * 2
                  , {action: FieldActionType.CheckOnly}
                )
 ...
 new ChooseFieldPopupSearch("Responsible"
                          , "AttChoose1"
                          , "Demo Two"
                          , {isRequired: true}
                           )
```

# Outlook
These is the overview of the outlook I provided in the first post, and the completed ideas. Please understand `completed` as it seems to work but more testing under different circumstances would be required.
- Ensure positive transition was successful
- ✅ Enrich "Form data" to get the step title for a step id.
- Adding documentation to source code
- Azure AD authentication
- Field Support
  - Choose dropdown
  - Choose auto complete
  - Date time
  - Yes / No
  - ✅ Integer
  - Float
- Data table
- Data row
- ✅ Switching tabs
- ✅ Expand collapsed groups
- Value verification
  - ✅ Values set by form rules
  - ✅ Values set by form rules set by business rules
  - Target fields of choose / autocomplete fields
- Item list support
- Test generated document content
- Test mandatory fields
  - Submit workflow
  - Verify field is part of error message
  - Close dialog
- Modal dialog support?
- Menu button availability
- Path availability without execution
- Automatic creation of 'Form data' model
  - JSON generation for a step
  - Representing the form layout
- Person has an assigned task
- Open an element from a task list.  
There's no order, no roadmap and of course no timeline. 

# GitHub Repository

{: .notice--warning}
**Remark:** Before you head over to GitHub please read the [Important information](/posts/2024/playwright-first-steps#important-information).

At the moment I'm using an own branch in GitHub for each post. I'm to lazy to come up with a better name, so I will be calling them iteration x, where the x relates to the number of the post in this series.

[Iteration 2](https://github.com/Daniel-Krueger/webcon_playwright/tree/iteration2).
