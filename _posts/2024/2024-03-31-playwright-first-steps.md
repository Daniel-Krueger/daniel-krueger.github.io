---
title: "Automated UI Tests for WEBCON BPS - First steps"
categories:
  - WEBCON BPS   
  - Private  
tags: 
  - Automated UI Tests
excerpt:
    This is the starting post for automated UI test of WEBCON BPS using Playwright from Microsoft.
bpsVersion: 2023.1.3.118
---
# Overview
In case you don't know what end-to-end testing or automated UI testing is, imagine the following:
- You have an approval workflow which requires some data.
- The first person enters the data and submits it.
- The second gets a task, enters further information and approves it.
- The second person then verifies, that the workflow was successfully moved to the 'Approved' step.

Instead of testing this on your own, you could define an UI test, which can then be run in seconds either manually or automated.

One of these tools, which can do this is play [Playwright](https://playwright.dev/docs/intro) from Microsoft. 
> Playwright enables reliable end-to-end testing for modern web apps.<br/>
> Playwright Test was created specifically to accommodate the needs of **end-to-end testing**. Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox. Test on Windows, Linux, and macOS, locally or on CI, headless or headed with native mobile emulation of Google Chrome for Android and Mobile Safari.

{% include video id="9f596ABqYHY?autoplay=1&loop=1&mute=1&rel=0" provider="youtube" %}

Off topic:<br/>
Hannes Leitner not only brought Playwright to my attention but also introduced me to WEBCON BPS. After playing a bit with Playwright I got reminded of the time when I first started to play with WEBCON BPS. Let's see whether this feeling will last in the upcoming weeks. At the moment I'm really hyped and full of ideas.

# Important information
## General
Before you continue with the post or heading over to the GitHub repository you should take the following into account:
1. No previous experience<br/>
   I'm just on a beginner level in terms of Playwright and TypeScript. Experienced persons would have done a few things differently with the test creation let alone aspects like scaling. 
2. InstantChange™️ / Breaking changes<br/>
   I will be using the same approach as I preach when creating processes:
   - Create a prototype
   - Gain experience 
   - Restart if necessary 
   - Deploy an improved version<br/>
  
   This means that the current version is just a prototype and I'm sure, that there will be breaking changes. Nevertheless, my aim is to provide and easy to use framework.
3. Collaboration<br/>
   I've never really collaborated in the context of GitHub repositories. Maybe it's a good time to gain experience with this. If you want to participate, you can reach out to me.
4. Multilingual support / changing labels<br/>
   While this is a strength of WEBCON BPS, this makes it quite hard for automated testing. I don't like the idea, that a test fails just because someone changed the language of the test user or changed the label. On the other hand, this is what UI tests are about, to a degree at least. I've not yet decided on a concept on how to approach this. 
5. Blog post focus<br/>
   My posts will focus on using the custom logic and not on Playwright or TypeScript in general. At the moment, it's also not my focus to provide tests which can be in unattended environment. For example, the browser will be open at the end of the tests.
6. Recording tests<br/>
   At first I started with [generating test](https://playwright.dev/docs/codegen#recording-a-test), but I quickly moved to coded tests. For these, I created some classes / functions which simplify the actual test definition. 

## Target audience
Even so I'm going for an easy-to-use test creation, I assume that you already have experience with VS Code, JavaScript/TypeScript or are willing to learn it on your own.


## License
For this repository I've chosen the license [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/). This is an excerpt from the referenced page from 2024-03-31.

>Permissions of this strong copyleft license **are conditioned on making available complete source code** of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. 
>
>| Permissions    | Conditions                   | Limitations |
>|----------------|------------------------------|-------------|
>| Commercial use | Disclose source              | Liability   |
>| Distribution   | License and copyright notice | Warranty    |
>| Modification   | Same license                 |             |
>| Patent use     | State changes                |             |
>| Private use    |                              |             |


# Playwright and WEBCON 

## Requirements /
I'm using VS Code for developing and executing the tests.
The [readme](https://github.com/Daniel-Krueger/webcon_playwright) contains a few notes on my installation steps. These are not meant to be a replacement for the official documentation.


## Setup 
### Authentication
The test file `simpleApproval.spec.ts` contains a few imports. One of those refers to a file which is not part of the repository. 

```js
import environment from "../.auth/simpleApprovalEnvironment";
``` 

This `environment` defines some global parameters like the hostname and user information.

In my case I defined that the environment should have two user properties and created the object.

``` js
import {  IEnvironment,  AuthenticationType,  IUser,
} from "../types/authentication";


// Define the interface of this environment
interface ISimpleApprovalWorkflow extends IEnvironment {
  userOne: IUser;
  userTwo: IUser;
}

// Then define your environment with the full IUser properties enforced:
const environment: ISimpleApprovalWorkflow = {
  hostname: "https://bps.daniels-notes.de",
  userOne: {
    username: ".\\demoUserOne",
    password: "", // Add actual properties
    authenticationType: AuthenticationType.Windows,
  },
  userTwo: {
    username: ".\\demoUserTwo",
    password: "",
    authenticationType: AuthenticationType.Windows,
  },
};

export default environment;
```


{: .notice--warning}
**Remark:** The  `./auth` folder is added to  `.gitignore` so that no sensitive information would be committed or pushed to the remote repository.

### Form data definition
I'm using the term `Form data` to define which values should be set in a given test and which path should be used.
Currently, the `Form data` has a `fieldValues` properties which defines which fields should be set. Only a few field types are supported in this version:
- Single line Text
- Multi line text
- Choose fields of type popup search

In addition, you can define the id of the path which should be used for the path transition.

Defining the data for submitting a new workflow instance.
```TypeScript

const submitData: IFormData = {
  fieldValues: [
    new TextField("Title", "AttText1Glob", "My title"),
    new ChooseFieldPopupSearch("Responsible", "AttChoose1", "Demo Two"),
    new MultiLineTextField(
      "Description",
      "AttLong1",
      "My long text\r\nsome new line."
    ),
  ],
  pathId: 292, // Submit
};
```

Defining the data for approving the submitted workflow instance.
```TS
const approvalData: IFormData = {
  fieldValues: [
    new MultiLineTextField("Decision", "AttLong2", "Yes, it's approved."),
  ],
  pathId: 293, // Approve
};
```

## Test creation
### Splitting test cases
It's a bad practice to do too much in a single test case. It's better to split them up and combine these. At least this is my feeling, I have no qualified experience in this area.

At the moment I'm using a serial test execution so that I can pass information from one test to another. In this example the test case `Submit workflow as user 1` will get the workflow instance id of the submitted workflow and save it to `wfElementId`. The other test will then use this information to directly open the element id.
I'm initializing the variable with an id, so that I could start/debug the second or third test case without running the first one. If all three tests are executed the initialized value will be overwritten anyway.

```JS
test.describe.serial("Submit and approve", () => {
  let signature: string;
  // Element id to us, in case a specific test should be used/debugged.
  let wfElementId: number = 2270;

  test("Submit workflow as user 1", async ({ browser }) => {
   ...
   wfElementId = getIdFromUrl("element", elementUrl);
  });

  test("Approve as user two", async ({ browser }) => {
    // Target url
    let url = environment.hostname + `/db/14/app/50/element/${wfElementId}`;
  ...
  });

  test("Verify is approved", async ({ browser }) => {
     // Target url
    let url = environment.hostname + `/db/14/app/50/element/${wfElementId}`;...
  });
});

```
### Submitting a new workflow instance
My current approach is:
- Define the target URL<br/>
  I'm passing the fixed part of the URL, for the target environment. I'm not yet sure whether making it dynamic will add only complexity without any gains.
- Open the page and authenticate the defined user.<br/>
  This is done by passing the url and user to the function `getAuthenticatedPage`. Currently, only windows user authentication is available. 
- Enrich the `Form data` <br/>
  In this version only the label of the defined path is added, so that we can click on the button. 
- Setting the values<br/>
  Set's the field values based on the `Form data`. It uses the WEBCON JavaScript function to check whether the value was not only written into the field but that it's also part of the backing model.
  At the moment, a limited number of field types are supported, and these can not be part of 'hidden' tabs or collapsed groups.
- Path transition<br/>
- Successful path transition<br/>
  I haven't tested whether this would create a false positive in case the path transition was not successful. For example, because of an error (red notification), or someone else needs to complete a task (orange notification).

```js
 test("Submit workflow as user 1", async ({ browser }) => {
    // Target url
    let url =
      environment.hostname + "/db/14/app/50/start/wf/78/dt/85/form?def_comid=1";

    // Authenticate
    const page = await getAuthenticatedPage(browser, url, environment.userOne);

    // Update data with multilingual labels
    const data = await EnrichedFormData.BuildInstance(page, submitData);

    // Set value and verify it was set.
    for (const field of data.fieldValues) {
      await field.setAndExpect(page);
    }

    // Path transition
    await page.getByRole("button", { name: data.pathName }).click();

    // Check the "green" notification of the successful path transition is displayed
    signature = await page.locator(".signature-button").innerText();
    await page.locator(".signature-button").click();

    // Get started workflow instance id by displaying the form again and get the id from the url.
    // Using a test scoped variable  makes it accessible in the other tests.
    let elementUrl = await page.url();
    wfElementId = getIdFromUrl("element", elementUrl);
  });
```
### Approve as another user
This is basically the same as above. The only differences are:
- Another url
- Verification of the current step
  I pass the name of the step. I don't like this at all and it will be improved in a future version. If the info panel is not visible for some reason, it should automatically be displayed so that the step can be verified using the info panel.

``` JavaScript
  test("Approve as user two", async ({ browser }) => {
    // Target url
    let url = environment.hostname + `/db/14/app/50/element/${wfElementId}`;

    ...
    // Verify that the workflow is in step 'In approval' by checking that this step is marked as 'Active' in the information panel.
    await showDetailsInfoTab(page);
    expect(await page.locator(".step-info-row--active").innerText()).toBe(
      "In approval"
    );

   ...
  });
```
# Outlook
These are just a few ideas which come to my mind. 
- Ensure positive transition was successful
- Enrich "Form data" to get the step title for a step id.
- Adding documentation to source code
- Azure AD authentication
- Field Support
  - Choose dropdown
  - Choose auto complete
  - Date time
  - Yes / No
  - Integer
  - Float
- Data table
- Data row
- Switching tabs
- Expand collapsed groups
- Value verification
  - Values set by form rules
  - Values set by form rules set by business rules
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
I've created an own [repository](https://github.com/Daniel-Krueger/webcon_playwright). A rough idea is that I 'close' a branch / start with a new one, whenever I publish a  blog post. This way I could always link the branch reflecting the post. 
Yes, there will be more. :)

[Branch for this post](https://github.com/Daniel-Krueger/webcon_playwright/tree/iteration1).
