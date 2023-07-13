---
title: "Unified save experience"
categories:
  - CC LS
  - WEBCON BPS  
tags:
  - Form rules
  - JavaScript
  - User Experience
excerpt:
    A how to about always displaying a save button in the top toolbar as well as a a save button in the 'Available paths' area.
last_modified_at: 2023-07-08
---
# Update 2023-07-08
Functional changes
- It's possible  different classes which would be valid for a WEBCON BPS version.
- The save draft path is now hidden in the `Available paths` button group
- The 'save' path button will check whether [Revised uniform path button styling](https://daniels-notes.de/posts/2023/path-button-styling-revisited) is available. If it is the light or dark theme class will be used. 
- The code here is working with BPS 2021, for newer versions refer to [GitHub](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/Save%20and%20save%20draft).


# Overview  
One of the top questions of users new to WEBCON BPS is why you don't have a `Save` button for new workflow instances. Of course, you can explain the reasons to them, and some users may find this interesting but, in my experience, the major part simply doesn't care. If you are in edit mode, you should always be able to  execute the save action intuitively. This means that you don't need to think about where the save button is located. This post is not only about how to achieve the this, but also some background information why you may help yourself in the long run.

{% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-10-19-22-24-39.png" alt="The user can always save a new or an existing instance from the toolbar or the available paths area. " caption="The user can always save a new or an existing instance from the toolbar or the available paths area. " %}
 

# Background information
## Saving a workflow instance for the first time
If you are familiar with WEBCON BPS you can simply replace every occurrence of 'state' with 'step', in the following text.
WEBCON BPS uses a real state machine workflow engine. If you don't know what a state machine workflow is, you can watch some excerpt from the YouTube video *Building Business Process Solutions: with MS Power Platform & WEBCON BPS (without Cutting Corners!)*:
- [Workflow design](https://youtu.be/4TSYSO1hVC0?t=2881) 
- [Definition of linear (sequential) workflows](https://youtu.be/4TSYSO1hVC0?t=2959) 
- [Definition of state machine workflows](https://youtu.be/4TSYSO1hVC0?t=3089)
- [State machine logic explained](https://youtu.be/4TSYSO1hVC0?t=3270)

This implementation has a lot of advantages but also the little drawback, that you need to fulfill all internal requirements for moving to a new state. Writing the workflow information to the database for the first time also moves the workflow to a new state, which is the reason why we use a path for this. You could argue that you could add a save button which magically does this, but there are a lot of reasons, why using a different approach is better
- There are cases, where a workflow may not even be saved in the start step but should be moved directly to the next step.
- If you want to continue filling out the workflow form at a later time, you could save a draft version of it. But how should a simple save button 'know' whether you want to send reminders after some time or which kind of task description should be set. So that the user has a reminder what he needs to do to send the workflow to the next step.
- Maybe others should gain access to the workflow, so that it can be completed, when the author is ill.

## Differences between the save button and a save path  
If you use a _save draft_ path in your workflows you may be tempted to always create a _save_ path, too. This way the users will always have the option to save the workflow using a button in the `Available paths` area. Even so this looks to the user as the path does the same as the button, this is simply not the case.

The difference between saving the workflow using the button and using a path is, that the **button does not cause** a state transition. The **path causes** a state transition even if the target state is the same as the current one. If you look at the Designer it's kind of obvious, that the `OnPath`, `OnExit` and `OnEntry` actions are not executed (1), when you click on the button. The same is true when you use the path, the save actions (2) won't be executed.

{% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-10-19-22-43-15.png" alt="Using the save button from the toolbar won't trigger the path actions and vice versa." caption="Using the save button from the toolbar won't trigger the path actions and vice versa." %}

What you need to know though is, that the timeout actions are also created during path transition. If you use a save path, the old timeout actions removed, and new ones are recreated. This does not happen, when you use the save button.       

{% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-10-19-22-45-33.png" alt="Timeout actions are created on path transition." caption="Timeout actions are created on path transition." %}

If you wonder whether this is a problem, the answers is, it depends. Example: You want to escalate an outstanding task to a supervisor after five days. If the user only uses the save button the escalation will be send **five** days after the workflow entered the step. If he uses a save path on the third day and again after an additional four days, the escalation will be triggered five days after the last save path has been used. Instead of sending the escalation after five days it will be sent **twelve** days after the first time the workflow entered the step.   


{: .notice--warning}
**Remark:** If you are using a field as a start date and need to calculate its value, you have to do this `OnPath` or `OnExit`. You can't use `OnEntry` for this. The timeouts are created either in parallel or before `OnEntry` is executed so the field will either have no value or an old value. The first one caused me some problems because I wasn't aware of the limitation. This is by design and won't be changed.
{% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-11-11-23-07-28.png" alt="A calculated `Start date` must be set in `OnPath` or `OnExit`. If it's set during `OnEntry` it will cause problems." caption="A calculated `Start date` must be set in `OnPath` or `OnExit`. If it's set during `OnEntry` it will cause problems." %}

# Form Rules
## Save draft path as a menu button
If you have a `Save draft` path to save new workflow instances, you can use the below JavaScript as a form rule to generate a button in the toolbar. I'm using a global form rule which I'm adding to the behavior tab of each form. 

{% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-11-11-21-17-40.png" alt="This form rule will generate a button for the `save draft` path." caption="This form rule will generate a button for the `save draft` path." %}

Remarks
1. The script utilizes the setTimeout approach described [here](https://daniels-notes.de/posts/2021/javascript-form-rule-execution-on-page-load#testing-whether-an-element-exists-yet).
2. You need to fix the business rule parameters in the last line of the script so they match your parameters\
    {% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-11-10-22-22-09.png" alt="The form rule uses parameters which need to be corrected if you copy it." caption="The form rule uses parameters which need to be corrected if you copy it." %}
3. The script provides default labels for the button. These can be extended in the switch scope `switch G_BROWSER_LANGUAGE.substring(0,2)`
4. If the default labels are not suitable for a specific workflow, they can be overridden using the provided parameter.
5. Adding the query parameter "debug=1" will trigger the developer tools if they have been opened.
    {% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-11-11-21-20-45.png" alt="Adding debug=1 will trigger the debugger if developer tools are open." caption="Adding debug=1 will trigger the debugger if developer tools have been opened." %}
6. The menu button will be placed where the default `save button` would be.


```javascript
window.ccls = window.ccls || {};
ccls.addSaveDraftButton = {};
ccls.addSaveDraftButton.Timeout = 0;
ccls.addSaveDraftButton.TimeoutMax  = 4;
ccls.addSaveDraftButton.leftToolbarClass = "LeftToolbar";
ccls.addSaveDraftButton.newToolbarButtonId = "NewToolbarButton";
ccls.addSaveDraftButton.returnToolbarButtonId = "ReturnToolbarButton";
ccls.addSaveDraftButton.saveButton = null;    
// Define the label of the path
switch (G_BROWSER_LANGUAGE.substring(0,2)){
    case  "de":
        ccls.addSaveDraftButton.saveDraftButtonLabel = "Entwurf speichern";
        break;
    default:
        ccls.addSaveDraftButton.saveDraftButtonLabel = "Save draft";
        break;
}

ccls.addSaveDraftButton.createSaveDraftButton = function (pathId,alternativeLabel){
    // Start debugger, if debug parameter is set and dev tools are started.
    if (new URLSearchParams(document.location.search).get("debug") == 1) {
        debugger;
    }
   // The pathId is passed as a string so we need to parse it to an int.
    pathId = parseInt(pathId);    
    // if this is a an existing element: hide the save draft path and return
    if (!G_EDITVIEW || !G_WFELEM.startsWith("0")){
        HidePath(pathId);
        return
    }

    if (typeof(alternativeLabel) == "string" && alternativeLabel.length > 0){
        ccls.addSaveDraftButton.saveDraftButtonLabel = alternativeLabel;
    }


    var items = document.getElementsByClassName(ccls.addSaveDraftButton.leftToolbarClass);
    // verify that there is exactly one LeftToolbar
    if (items == null || items.length != 1 ){
        if (ccls.addSaveDraftButton.Timeout<= ccls.addSaveDraftButton.TimeoutMax){
            setTimeout(function (){ccls.addSaveDraftButton.createSaveDraftButton(pathId);},333)
        }
        return;
    }

    // creating a dummy element and insert the default html code for the save button
    // the only changes to the default html is the label and the MoveToNextStep function 
    var saveButton = document.createElement('div');
    saveButton.innerHTML = '<span><button id="SaveToolbarButton" title="'+ccls.addSaveDraftButton.saveDraftButtonLabel+'" type="button" class="toolbar-button btn btn-default btn-md hide-on-sidebar-dash" onclick="MoveToNextStep('+pathId+')"><span class="ms-promotedActionButton-icon"><i class="icon ms-Icon ms-Icon--Save" aria-hidden="true"></i></span><span>'+ccls.addSaveDraftButton.saveDraftButtonLabel+'</span></button></span>"';

   
    var leftToolbar = items[0];
    
    // Get the target position of the draft button
    var saveDraftButtonPosition
    for ( saveDraftButtonPosition = 0; saveDraftButtonPosition < leftToolbar.children.length; saveDraftButtonPosition++){
        if (leftToolbar.children[saveDraftButtonPosition].children[0].id == ccls.addSaveDraftButton.newToolbarButtonId || 
            leftToolbar.children[saveDraftButtonPosition].children[0].id == ccls.addSaveDraftButton.returnToolbarButtonId) {
            continue
        }
        break;
    }
    
    // insert the draft button
    if (saveDraftButtonPosition >= leftToolbar.children.length) {
        leftToolbar.appendChild(saveButton.firstChild)
    } else {
        leftToolbar.insertBefore(saveButton.firstChild, leftToolbar.children[saveDraftButtonPosition])
    }
}

ccls.addSaveDraftButton.createSaveDraftButton(#{BRP:-2}#,#{BRP:-3}#);
```


## Save button as a path button
The below script can be used to render a `path button` in addition to an existing `Save button`. Clicking on the  `path button` will trigger the default save button action. If the save button does not exist, it's marked as invisible in the form field matrix, the `path button` won't be rendered either due to the maximum number of retries defined by the `TimeoutMax` variable.
{% include figure image_path="/assets/images/posts/2021-11-10-unified-save-experience/2021-11-11-21-00-51.png" alt="The save action can be triggered by a path button" caption="The save action can be triggered by a path button" %}
Remarks 
1. The remarks 1-5 mentioned above apply here too.
2. The path button will be moved to the left most position.
3. The path button is styled using attribute selectors which are described in my post [Uniform path button styling](https://daniels-notes.de/posts/2021/path-button-styling#css-attribute-selectors-are-the-alternative-to-a-css-class)
   
```javascript
window.ccls = window.ccls || {};
ccls.addSaveButtonAsPath = {};
ccls.addSaveButtonAsPath.Timeout = 0;
ccls.addSaveButtonAsPath.TimeoutMax  = 4;
ccls.addSaveButtonAsPath.saveButtonId = "SaveToolbarButton";
ccls.addSaveButtonAsPath.saveButton = null;    
// Define the label of the path
switch (G_BROWSER_LANGUAGE.substring(0,2)){
    case  "de":
        ccls.addSaveButtonAsPath.savePathLabel = "Speichern";
        break;
    default:
        ccls.addSaveButtonAsPath.savePathLabel = "Save";
        break;
}


ccls.addSaveButtonAsPath.createPathButton = function (alternativeLabel){
    // Start debugger, if debug parameter is set and dev tools are started.
    if (new URLSearchParams(document.location.search).get("debug") == 1) {
        debugger;
    }

   // When the document switches from edit to view mode in "My task view" the script is executd twice
   if (document.getElementById("ccls_SavePathButton") != null){
      return
   }
    // return, if we are not in edit mode or this is a new element.
    if (!G_EDITMODE || G_WFELEM.startsWith("0")){
        return;
    }
    
    if (typeof(alternativeLabel) == "string" && alternativeLabel.length > 0){
        ccls.addSaveButtonAsPath.savePathLabel = alternativeLabel;
    }


    ccls.addSaveButtonAsPath.saveButton = document.getElementById(ccls.addSaveButtonAsPath.saveButtonId)
    // verify that the save button exists, if the button is not available after the 4th try, it was probably hidden in the form field matrix
    if (ccls.addSaveButtonAsPath.saveButton == null ){
        if (ccls.addSaveButtonAsPath.Timeout<= ccls.addSaveButtonAsPath.TimeoutMax){
            ccls.addSaveButtonAsPath.Timeout++;
            setTimeout(function (){ccls.addSaveButtonAsPath.createPathButton();},333)
        }
        return;
    }
    
    // creating a dummy element and insert the default html code for a path button
    // the only changes to the default html is the label and the MoveToNextStep function 
    var savePathButton = document.createElement('div');
    savePathButton.innerHTML = '<div class="path-button-container"><input id="ccls_SavePathButton" type="button" class="btn btn-default btn-md pathPanelButton" value="'+ccls.addSaveButtonAsPath.savePathLabel+'" onClick="ccls.addSaveButtonAsPath.saveButton.click();" style="background-color: rgb(0, 0, 30);"></div>';
   
    var pathPanelRow = document.getElementsByClassName("pathPanelRow");
    if (pathPanelRow == null || pathPanelRow.length != 1){
        console.log("Can not add save path button, path panel row was not found.");
        return;
    }
    
    var savePathButtonPosition = 0
    
    // insert the save 'path' button
    if (savePathButtonPosition >= pathPanelRow[0].children.length) {
        pathPanelRow[0].appendChild(savePathButton.firstChild);
    } else {
        pathPanelRow[0].insertBefore(savePathButton.firstChild, pathPanelRow[0].children[savePathButtonPosition]);
    }
}

ccls.addSaveButtonAsPath.createPathButton(#{BRP:-4}#);
```
