---
title: "Adding a new choice field value without leaving the page"
categories:
  - CC LS
  - WEBCON BPS  
tags:
  - JavaScript
  - Custom Action
excerpt:
    An approach for creating a new choice field value, without navigating to another page. Works on a mobile, too.
bpsVersion: 2021.1.4.84
---

# Overview  
Did you ever start a workflow for a new customer/prospect, fill in the data, but forgot that you need to create the customer before you can continue? Rephrased with mor WEBCON BPS specific wording: You need to add a new data source entry for a choice field before you can continue? If this is this case, this post is for you. The approach uses JavaScript to create a new window via which the new entry is generated (workflow is started). Once the user executes a path, it’s checked, whether the URL contains a specific parameter. If this is the case, the closing method of the parent window is called, and the instance id will be passed to it. This is used to populate the choice field. 

{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/teaser.gif" alt="" caption="" %}

{: .notice--info}
**Info:** I'm referring to the opened window as 'popup'.


{: .notice--warning}
**Remark:** I've tested this in edge on a desktop pc and in chrome on a mobile, but not in the mobile apps.


# Implementing the popup 
## Adding the button using a HTML field
Implementing a new popup may look 'scary' but this won’t be the case once you have read the explanation. It could be easier if I would have allowed only one popup but I prefer flexibility and reusable solutions. 
The button creating the popup is added to the form using a field of type `HTML`. It uses the following configuration:
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-21-21-54-53.png" alt="The configuration of the HTML field for the popup." caption="The configuration of the HTML field for the popup." %}

1. The logic for creating the popup is stored inside a global constant, which is used in the HTML field. This applies for the HTML defintion of the button itself too. 
2. This line is used to identify which `openNewWorkflowInstance` function should be called. This is necessary if you implement the popup functionality multiple times on the form.
3. This part defines what should happen, when the button is clicked. The green highlighted variables refer to the field which value is set, ones the popup is closed. If you want to do something different you can easily change this by modifying the body of `ccls.popup.closing`. The `ccls.popup.openNewWorkflowInstance` needs the application id, workflow id, form type id to create the URL and the height and width for the popup.
4. Retrieves the label of the HTML field and uses this for the button text. Displaying the field name is not required, it's deactivated in the configuration.

The button can easily be hidden in the view mode by defining an own empty HTML content for the view mode. This way, no unnecessary data needs to be transferred to the client.
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-21-40-17.png" alt="In view mode, no HTML will be rendered. " caption="In view mode, no HTML will be rendered. " %}

So, what do you have to do, if you want to create a new button? Copy the script below, and replace the seven variables `"#{......}#` with yours. That's all. 
```javascript
<div id="fieldId" data-targetfield="#{FLD:202}#">
<script>
ccls.popup.newWorkflowInstanceCalls['#{FLD:202}#'] = function ()
{
   ccls.popup.closing = function (result){
     debugger;
     SetValue('#{FLD:202}#', result);
  };
  ccls.popup.openNewWorkflowInstance(#{AP:8}#,#{WF:3}#,#{DT:3}#,1000,600)
}

ccls.formModel.getFieldMetadata(#{WFCON:201}#,(formMetadata) => {
  $("#addNewViaPopup",$("#SEL_HTML_#{WFCON:201}#"))[0].innerText = formMetadata.displayName;
});
</script>
```

## Popup creation script 
The popup opening/closing is handled via a generic script stored as a global constant.


{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-21-39-13.png" alt="Popup script is stored in a global constant." caption="Popup script is stored in a global constant." %}

The functions `openNewWorkflowInstance` and `openExistingWorkflowInstance` except parameters to generate the URL which should be used for the popup and the size of it. I'm assuming, that the target workflow will be in the same database as the current one. Therefore it's not necessary to provide the database id. If this should not be the case for some reason, you need to change the line `currentDBUrlString`. 

While the `openExistingWorkflowInstance` is intended to be used directly, this is not necessary the case for `openNewWorkflowInstance`. I'm assuming, that the popup could be used multiple times on the same form. Since we need different buttons and behaviors for creating the popup and processing the result, I added `newWorkflowInstanceCalls` and `executeNewWorkflowInstance`. The later one is automatically executed when the user clicks on any button. The function itself identifies which button has been clicked, and uses the function stored in `newWorkflowInstanceCalls`. This has been defined in part three above.

```javascript
<script>
window.ccls = window.ccls || {};
ccls.popup = ccls.popup || {};
ccls.popup.popupWindow= null;
ccls.popup.openNewWorkflowInstance = function (appId,wfId,docTypeId,height,width) {
    debugger;
    var openingUrl = `/app/${appId}/start/wf/${wfId}/dt/${docTypeId}/form?COM_ID=${GetPairID(G_COM)}&menucollapsed=1&popupMode=true`
    ccls.popup.openUrl(openingUrl,height,width);
}

ccls.popup.openExistingWorkflowInstance = function (appId,wfId,height,width) {
    var openingUrl = `/app/${appId}/element/${wfId}?menucollapsed=1&popupMode=true`;
    ccls.popup.openUrl(openingUrl,height,width);
}
ccls.popup.openUrl = function (url,height,width)
{
    var y = window.top.outerHeight / 2 + window.top.screenY - (height / 2);
    var x = window.top.outerWidth / 2 + window.top.screenX - (width / 2);
    var currentDBUrlString = document.location.href.substring(0,document.location.href.indexOf("/app/"))
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},left=${x},top=${y}`;
    ccls.popup.popupWindow= window.open(currentDBUrlString+url, '', params);
}
ccls.popup.closing = function (resultData) {};
ccls.popup.closePopup = function (resultData) {
    debugger;
    ccls.popup.closing(resultData)
    ccls.popup.popupWindow.close();
}


ccls.popup.newWorkflowInstanceCalls = ccls.popup.newWorkflowInstanceCalls || [];
ccls.popup.executeNewWorkflowInstance = function (clickedButton){
  debugger;
  let identifier =$("#fieldId", clickedButton.parentElement.parentElement.parentElement.parentElement.parentElement);
  ccls.popup.newWorkflowInstanceCalls[identifier .attr("data-targetfield")]();
}
</script>
```

{: .notice--warning}
**Remark:** It's assumed that the popup is always created for the same hostname and database id. If the database Id should differ, you need to add the database id as a parameter and change the line with `currentDBUrlString =`. By default this variable will contain the URL part until the `/app/*` part begins.


{: .notice--warning}
**Remark:** In the used version 2021.1.4.84 and previous ones, there is a limit of 2000 characters. If a constant has more characters the remaining won't be to an HTML field. If you hit this limit, you need to split the script to two constants.


## HTML definition of the button
The HTML button definition is stored in a global constant so that it can be reused everywhere. The button has a fixed id `addNewViaPopup`, which is used for updating it's text in the HTML configuration field. It won't be a problem when there are multiple buttons with the same id on the form. Each one can be identified because they are children of their own HTML field.
The onClick action `ccls.popup.executeNewWorkflowInstance(this)` is also fixed. As mentioned above, the function calls determines which function should really be executed.

{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-21-18-18.png" alt="Button HTML definition is defined as a global constant." caption="Button HTML definition is defined as a global constant." %}
```HTML
<div class="row wfContentRow row-same-height row-full-height editable"><div class="col-sm-5 col-xs-12 wfBesideLeft col-xs-height full-height ms-formlabel"></div><div class="col-sm-7 col-xs-12 ms-formbody wfBesideRight col-xs-height full-height th-frm-bg1 form-field-control"><div class="stylePanel stylePanelWithoutStyles"><button id="addNewViaPopup" onclick="ccls.popup.executeNewWorkflowInstance(this)" style="float: right;margin-bottom: 5px;">Add new</button></div></div></div>
```
## Form model script
The text of the button is set to the label of the HTML form field. Strictly said, it's either the label or it's translation. This is achieved by reading the form model and getting the display name from the field metadata. This requires another script. As expected, it's added as another global constant which can be used inside a HTML field.
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-21-22-49.png" alt="Script for retrieving the form model is also a global constant." caption="Script for retrieving the form model is also a global constant." %}

This field though needs to be placed in the top of the form template. This is necessary, so that the other scripts can rely on the defined functions.
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-21-48-50.png" alt="The HTML field needs to be placed in the top." caption="The HTML field needs to be placed in the top." %}

Due to the asynchronous retrieval of the form data, you should not directly access `ccls.formModel.model` always use `ccls.formModel.getModel` or `ccls.formModel.getFieldMetadata`. The function `ccls.formModel.getFieldMetadata` calls `ccls.formModel.getModel` internally. You can use this as an example if you need to access something else than a form field.


{: .notice--info}
**Info:** Strictly spoken, you don't need to place this code in an own HTML field, but you need to make sure that this script has been read by the browser before any script tries to access it. Since I like to prevent potential problems, I've placed it in an own field adding it to the top of the form.

{: .notice--info}
**Info:** I haven't found out whether the current form model is actually available via JavaScript. I found no other way than to retrieve it again. If someone can proof me wrong, please inform me, so that I can remove the duplicate call.



```javascript
<script>
window.ccls = window.ccls || {};
if (typeof(window.ccls.formModel) === "undefined") {
  ccls.formModel = {};
  ccls.formModel.model =null;
  ccls.formModel.isJsonFetched = false;
  ccls.formModel.getModel = new Promise(function(resolve,reject) {
    let req = new XMLHttpRequest();
    let currentDBUrlString = document.location.href.substring(0,document.location.href.indexOf("/app/"))
    let url;
    if (G_EDITMODE) {
      url = currentDBUrlString.replace('/db/',"/api/nav/db/") + `/app/${GetPairID(G_APP)}/start/wf/${GetPairID(G_WF)}/dt/${GetPairID(G_DOCTYPE)}/desktop`
    } else {
      url = currentDBUrlString.replace('/db/',"/api/nav/db/") + `/app/${GetPairID(G_APP)}/element/${GetPairID(G_WFELEM)}/desktop`
    }

    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        ccls.formModel.model = JSON.parse(req.response);
        resolve(ccls.formModel.model);
      } else {
        console.log("Error fetching model");
        reject();
      }
    };
    req.send();    
  });
  ccls.formModel.getFieldMetadata = function(fieldId,callback){
    ccls.formModel.getModel.then(
      (model) => {
        callback(model.liteData.liteModel.controls.find(f => f.id === fieldId));
      }
    )
  }
}
</script>
```

# Preparing the target workflow
A careful reader may have noticed that the popup is opened with a url with these parameters `?menucollapsed=1&popupMode=true`. The later one is necessary so that the displayed workflow can determine whether the current browser window should be closed. The popup is closed by calling `ccls.popup.closePopup` via a Hyperlink action. A provided parameter will be passed to `ccls.popup.closing` which can be implemented by the button HTML field. This can be the instance id or even a complex object. 
```javascript
javascript:window.opener.ccls.popup.closePopup("{WFD_ID}");
```

{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-22-00-10.png" alt="The workflow executes `closePopup` to return a value to the parent window." caption="The workflow executes `closePopup` to return a value to the parent window." %}

The question is, how to determine whether this action should be called or not. It depends on an url parameter, but how can we use this in an execution condition? There's a blog post about [using URL parameters](https://alterpaths.com/usage-of-url-parameters-in-webcon-bps/). This includes an undocumented feature to get the value of a parameter in SQL queries. I haven't tested this option as I don't like undocumented features and therefore, I created an own SDK action.

{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-22-09-19.png" alt="Custom SDK action which return the value of query parameter `popupMode`." caption="Custom SDK action which return the value of query parameter `popupMode`." %}

In our case though we simply need to return the value of the parameter `popupMode`. If it's called from our script the return value will be `true` otherwise it's empty. Since this is used as a execution condition the action won't be executed in the later case.

# GetUrlValue SDK action
The custom SDK action `GetUrlValue` allows you to retrieve different parts from the URL. The relevant information can returned by using on of the options of the `Url part to return` configuration option. Except `QueryParameter` and `RegExMatch` all other options are properties of [System.Uri](https://docs.microsoft.com/en-us/dotnet/api/system.uri?view=net-6.0) and return the described value.
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-22-29-48.png" alt="Different parts of the url can be returned using the custom SDK action." caption="Different parts of the url can be returned using the custom SDK action." %}

Choose query parameter and define it's name in the `The value` field (1) to return it. You can also extract a part of the URL via a regular expression. In this case you can define it also in `The value` field (1). Whichever option you use, you can decide, whether you want to return the result encoded. This would be only useful if you want to use the result in another URL as a query parameter value. In all other cases you wouldn't check this configuration field (2).
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-22-33-55.png" alt="If `DesignerStuidoTest` is selected, the action will will be executed against `Test url`" caption="If `DesignerStuidoTest` is selected, the action will will be executed against `Test url`" %}

The `Url to use` provides three options. The typical use case is to use `RefererUrl`. This is the URL which is displayed in the browser. When the user clicks on an action, the request is send with another URL, this is accessible using the `RequestUrl` option.

I really like the option to test everything in Designer Studio. That's the reason why I added the third option `DesignerStudioTest`. If this is selected, the `Test url` value is used, when you click on test in the configuration window. You only need to remember to switch back to the original `Url to use` value, after testing.
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-22-41-06.png" alt="The current URL and result of the executed action can be found in the plugin logs." caption="The current URL and result of the executed action can be found in the plugin logs." %}

Whenever the action is executed a plugin log entry will be written. The message contains the URL value and the result.
{% include figure image_path="/assets/images/posts/2022-01-17-add-new-choice-field-value-without-leaving-the-page/2022-01-20-22-48-46.png" alt="The plugin log messages contains the used url and the result." caption="The plugin log messages contains the used url and the result." %}

# Download
The repository of the custom SDK action can be found [here](https://github.com/Daniel-Krueger/webcon_cclsactions).\
If you don't want to build it yourself, you can download the .zip [here](https://github.com/Daniel-Krueger/webcon_cclsactions/releases)


