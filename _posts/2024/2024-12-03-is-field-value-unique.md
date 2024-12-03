---
title: "Is field value unique"
categories:
  - WEBCON BPS
  - Private 
tags:
 - User Experience 
 - Fields
excerpt:
    "A business rule which checks whether a field value is unique."
bpsVersion: 2025.1.1.23
---

# Overview
Sometimes it takes writing something down to realize, that you did something wrong for a long time.

My latest realization was that I recreated the the check 'Is field value unique' over and over again. It is so easy to add this check, but why did I implement it dozens of times? I should have used a global business rule. 

{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-02-56.png" alt="Verification that a value is unique." caption="Verification that a value is unique." %}


# Implementation
## Overview
If you intend to apply this layout to a form you need:
- A global business rule with a few parameters
- Using the business rule

## Global business rule

I've created the business rule with the following parameters for the most common uniqueness checks.

```
Rule name: IsFieldValueUnique
Description: 
Returns true, if the field value is not used in another workflow instance.

Parameters
Name: Field
Description:
The database name of the field.

Name: FieldValue
Description:
This value should be the variable from the values tab and not from the object tab.

Name: Form type
Description: 
Multiple form types can be defined using the comma separator.
169,170

Name: Business entity
Description: 
The current business entity or EMPTY.

Name: StepsToIgnore
Description:
If multiple steps are used the comma should be used as a separator
359,120

Name: IgnoreEmptyValue
Description:
Pass true or false, to determine whether an empty field value should be ignored.
``` 
{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-13-01.png" alt="Business rule and the parameters" caption="Business rule and the parameters" %}

```SQL
select case 
   when '{BRP:185}'  = 'true' and '{BRP:181}' = '' then 1
   when 
      (
         Select Count(*) 
         from WFElements 
         where WFD_ID <> {WFD_ID} 
             and {BRP:180} = '{BRP:181}'
             and WFD_DTYPEID in ({BRP:182})
             and (WFD_COMID =  '{BRP:183}'  or '' =  '{BRP:183}' )
            and WFD_STPID not in (select * from dbo.SplitToTable('{BRP:184}',','))
      ) = 0 then 1
else 0 end IsUnique
```
{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-13-37.png" alt="The SQL command and parameter assignment of the business rule." caption="The SQL command and parameter assignment of the business rule." %}

{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-14-37.png" alt="Advanced mode of the SQL command." caption="Advanced mode of the SQL command." %}

## Configuring the validation action
In general, you will be using the business rule to return true or false in the validate action. After the setup you will probably configure a custom error message. In the following chapters you will find a little explanation of the configurations. Of course, there are also other combinations possible.

{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-17-04.png" alt="" caption="" %}



: .notice--info}
**Info:** I thought about using another business rule to define a general error message and pass the field name. I didn't continue with this approach, because I would also need to get the multilingual field name..

### Unique across all instances
The below configuration will check whether the value of the field `Unique overall` is unique in the database field `Unique overall` of the form types `Community` and `Second form type`. If the value is empty, the check is ignored and true will be returned.
You can either pass a single form type or numerous using the comma as a separator `167,168`.
Passing `Empty` for the parameters `Business entity` and `Steps to ignore` will ignore the business entity and form types.
It's important to use the appropriate tab, when assigning the variables.

{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-16-24.png" alt="Value has to be unique across all instances" caption="Value has to be unique across all instances" %}

### Unique per business entity
Adding the current business entity, selected from the `Values` tab, will allow to define that the same value can be used by each business entity ones.
{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-26-15.png" alt="Value has to be unique across per business entity" caption="Value has to be unique across per business entity" %}

### Unique per business entity, steps excluded
In case you cancel/abort a workflow instance, it may be valid to allow using the value in a new workflow instance. In these cases, you can pass the step ids, which should be ignored/excluded from the check.

{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-21-27-56.png" alt="Value has to be unique per business entity and in 'active' steps. Cancelled ones are ignored." caption="Value has to be unique per business entity and in 'active' steps. Cancelled ones are ignored." %}

# Remark 
## Internal Boolean value
The internal Boolean value changed from `1` to `true` in some version. If you are running an 'older' version and the business rule does not work for you, you can enable the diagnostic mode you can see to with which value the variable is replaced.

{% include figure image_path="/assets/images/posts/2024-12-03-is-field-value-unique/2024-12-03-20-59-58.png" alt="The diagnostic mode can log the executed SQL statement to verify the internal Boolean value." caption="The diagnostic mode can log the executed SQL statement to verify the internal Boolean value." %}

## Benefit of the business rule
It's tempting to recreate a SQL command every time especially if it's so simple like the unique value check. Is it worth the hassle to create a global business rule instead?
Actually, I'm not sure, but I simply hate redundant code. Besides this opinion, is there any benefit?
- Parameters are 'questions'<br/>
  Whenever I'm going to use the business rule, I have to fill out all parameters and that forces me to think of all aspects and I won't forget one.  <br/>
  - Which form types should I take into consideration<br/>
  - Should this be unique per business entity or across all?<br/>
  - Is an empty value a unique value or should it be ignored?<br/>
  - Should all steps be taken into account?<br/>
- Internal changes<br/>
  If something changes, for example the Boolean representation, we need to configure only one rule and don't need to hunt down all implementations. 


