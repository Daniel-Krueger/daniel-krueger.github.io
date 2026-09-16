---
title: "Calling a User Defined API Automation from a Form Rule"
categories:
  - WEBCON BPS
tags:
  - JavaScript
  - Form rules
  - REST
excerpt:
  "Retrieving different values via a business rule in a form isn't possible. You will have to execute the business rule multiple times or need to create different rules. This isn't necessary with UDAs."
bpsVersion: 2026.1.6.198, 2026.2.2.121
---

# Overview
Let's assume that you want to set information on a form based on the provided user input. The broadly known options are:
- Choose fields, which set target fields
- Define form rules which set other fields
- More complex, retrieve the data of these fields via business rules

While these work, it's somewhat annoying, that business rules can't return multiple values in terms of fields/columns from the same data. It's not only a hazel to define these, but it's also an unnecessary burden on the server and delay for the user. Using a User Defined API (UDA) can change this.

![Getting values for four fields is 2.5 times slower than getting values for 18 fields.](/assets/images/posts/2026-09-16-calling-a-user-defined-api-automation-from-a-form-rule/2026-09-16-19-28-14.png)

# UDA and business rule comparison

Calling a UDA automation from a form rule is like calling a business rule. There are two important differences though.

1. No access to the workflow instance**<br/>
A business rule runs in the context of the current workflow instance and can read field values directly. An UDA automation has no such context. Any data it needs must be passed explicitly in the request body. At least, if the user can modify the data of the field in the current step.

2. JSON response instead of a single value
A business rule returns a single value. A UDA automation returns a JSON object. This allows us to return multiple values, which improves the user experience.

Activating the cookie-based authentication will allow all users to call the UDA with [their credentials](/posts/2026/user-defined-api-overview-part-1#authentication).

# Implementation

The implementation consists of two parts: 

1. A global form rule
2. A HTML field

## Global form rule

The global form rule will abstract a few things and let's you focus on the actual implementation. It defines a `window.dkr.udaExecution` object with helper functions that handle the HTTP call, error responses, and data type conversions.

You can [download](#download) the JavaScript for the  business rule from the repository

```
Rule name: ExecuteUDALogic
Description: Helper to execute an UDA endpoint from a form rule and work with the result. For example, to set multiple form fields.
Edit mode. JavaScript mode
```

![Global form rule Execute UDA](/assets/images/posts/2026-09-16-calling-a-user-defined-api-automation-from-a-form-rule/2026-09-14-20-08-37.png)

This will provide you with the following functions.

1. executeUDAAutomation(endpoint, body, onSuccess, onCustomErrorHandling)**<br/>
Sends a POST request to the given endpoint with the body serialized as JSON. On success it calls `onSuccess` with the parsed response object. On error it calls `onCustomErrorHandling` if provided, otherwise it falls back to `defaultErrorHandling`.

2. GetBoolValue(fieldName)**<br/>
Reads a checkbox field with `GetValue` and converts the result to a boolean. The standard `GetValue` function of WEBCON returns `1` or `0` for checkbox fields. UDAs expect `true` or `false` instead. Unfortunately the GetValue also returns `0` for `null` values. I've no idea how we can work around this. See also the [remarks](#boolean-input-values) section below.

3. ParseDateTimeValue(value)**<br/>
WEBCON returns null dates as `0001-01-01T00:00:00`. This function will return `null` instead or the actual value.

## HTML field
### Minimum setup
The minimum HTML field will consist of four parts:
1. Invoke the global business rule 
2. Define the UDA endpoint
3. Function which triggeres the execution
4. Another function to process the result which is passed as the `onSuccess` parameter.

```html
<script>
  InvokeRule(#{BRUX:1826:ID}#);
  var udaEndpoint = "/api/udef/db/1/automation/ValueTest";

  window.executeGetInputValues = function () {
    let body = {
      "TextInput":    GetValue('#{FLD:4329}#'),
      "DecimalInput": GetTypedValue('#{FLD:4328}#').value,
      "DateValue":    GetTypedValue('#{FLD:4332}#').value,
      "BoolTrueValue":  dkr.udaExecution.GetBoolValue('#{FLD:4330}#'),
    };
    // Execute UDA with default error handling
    window.dkr.udaExecution.executeUDAAutomation(udaEndpoint, body, window.setBodyFromUDAResult);

    // Example with custom error handling:
    // window.dkr.udaExecution.executeUDAAutomation(udaEndpoint, body, window.setBodyFromUDAResult,
    //   function (status, jsonResponse) { alert('Custom error handling'); });

  }

  window.setBodyFromUDAResult = function (jsonResponse) {
    SetValue('#{FLD:4314}#', jsonResponse.Data["TextValue"]); 
    SetValue('#{FLD:4320}#', dkr.udaExecution.ParseDateTimeValue(jsonResponse.Data["DateValue"]));
  }
  
</script>
```

### Example with buttons 
In my example, I wanted to have buttons to trigger the UDA.

![One example where the user clicks on a button to execute the UDA.](/assets/images/posts/2026-09-16-calling-a-user-defined-api-automation-from-a-form-rule/2026-09-14-20-16-40.png)


The HTML field contains the buttons and the JavaScript that calls the automation. Load the global form rule with `InvokeRule` at the top so the helper functions are available.

```html
<div>
  <button type="button" onclick="executeGetValues()"
    class="webcon-ui button-base button button--primary button--rounded button--medium button--icon-text toolbar-button__button">
    Get values
  </button>
  <button type="button" onclick="executeGetInputValues()"
    class="webcon-ui button-base button button--primary button--rounded button--medium button--icon-text toolbar-button__button">
    Return input values
  </button>
</div>
<script>
  InvokeRule(#{BRUX:1826:ID}#);
  var udaEndpoint = "/api/udef/db/1/automation/ValueTest";

  window.executeGetValues = function () {
    let body = {
      "ReturnUnsetValues": dkr.udaExecution.GetBoolValue('#{FLD:4306}#')
    };
    window.dkr.udaExecution.executeUDAAutomation(udaEndpoint, body, window.setBodyFromUDAResult);
  }

  window.executeGetInputValues = function () {
    let body = {
      "ReturnUnsetValues": dkr.udaExecution.GetBoolValue('#{FLD:4306}#'),
      "ReturnInputValues": true,
      "TextInput":    GetValue('#{FLD:4329}#'),
      "DecimalInput": GetTypedValue('#{FLD:4328}#').value,
      "DateValue":    GetTypedValue('#{FLD:4332}#').value,
      "DateTimeValue":GetTypedValue('#{FLD:4327}#').value,
      "BoolTrueValue":  dkr.udaExecution.GetBoolValue('#{FLD:4330}#'),
      "BoolFalseValue": dkr.udaExecution.GetBoolValue('#{FLD:4331}#'),
    };
    window.dkr.udaExecution.executeUDAAutomation(udaEndpoint, body, window.setBodyFromUDAResult);
  }

  window.setBodyFromUDAResult = function (jsonResponse) {
    SetValue('#{FLD:4314}#', jsonResponse.Data["TextValue"]);
    SetValue('#{FLD:4311}#', jsonResponse.Data["TextEmptyValue"]);
    SetValue('#{FLD:4316}#', jsonResponse.Data["TextNullValue"]);
    SetValue('#{FLD:4304}#', jsonResponse.Data["DecimalValue2Digits"]);
    SetValue('#{FLD:4322}#', jsonResponse.Data["DecimalValue6Digits"]);
    SetValue('#{FLD:4323}#', jsonResponse.Data["DecimalEmptyValue"]);
    SetValue('#{FLD:4312}#', jsonResponse.Data["DecimalNullValue"]);
    SetValue('#{FLD:4317}#', jsonResponse.Data["BooleanTrueValue"]);
    SetValue('#{FLD:4313}#', jsonResponse.Data["BooleanFalseValue"]);
    SetValue('#{FLD:4318}#', jsonResponse.Data["BooleanEmptyValue"]);
    SetValue('#{FLD:4321}#', jsonResponse.Data["BooleanNullValue"]);
    SetValue('#{FLD:4320}#', dkr.udaExecution.ParseDateTimeValue(jsonResponse.Data["DateValue"]));
    SetValue('#{FLD:4315}#', dkr.udaExecution.ParseDateTimeValue(jsonResponse.Data["DateTimeValue"]));
    SetValue('#{FLD:4310}#', dkr.udaExecution.ParseDateTimeValue(jsonResponse.Data["DateEmptyValue"]));
    SetValue('#{FLD:4319}#', dkr.udaExecution.ParseDateTimeValue(jsonResponse.Data["DateNullValue"]));
  }
</script>
```

### Example with On value change of a field

Alternatively, you can trigger the execution, but you can also create a form rule in JavaScript mode, which you can trigger the defined functions in the HTML field. The only important part is to set the edit mode of the form rule to `JavaScript mode`

![You can also execute the UDA using a form rule.](/assets/images/posts/2026-09-16-calling-a-user-defined-api-automation-from-a-form-rule/2026-09-14-20-27-17.png)

# Remarks

I had to add wrapping functions for bool and date values which may not be necessary in future versions. Take also a look at the general remarks regarding the `Automation` execution mode.

[Inconveniences, pitfalls and workarounds](/posts/2026/user-defined-api-part-4-execute-automation#inconveniences-pitfalls-and-workarounds)

# Download

You can find the files [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/executeUserDefinedAPIAutomation).


