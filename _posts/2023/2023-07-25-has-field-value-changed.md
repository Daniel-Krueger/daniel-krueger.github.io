---
title: "Has field value changed rule"
categories:
  - WEBCON BPS  
  - CC LS
tags:
  - Business rules
excerpt:
    Do something, if the value of a field has actually been changed.
bpsVersion: 2022.1.4.127
---

# Overview  
Now and then you need to do something based on a field. One solution is to do it, whenever the workflow instance is saved / moved to a different step. Depending on the type of action(s) which needs to be executed it would be better to executed this only, if the field value was changed at all.

{% include figure image_path="/assets/images/posts/2023-07-25-has-field-value-changed/2023-07-12-22-29-16.png" alt="Only execute the action, if the value actually was changed and not every time." caption="Only execute the action, if the value actually was changed and not every time." %}


# Implementation
## Global business rule
Add a new global business rule with return value `Text`.
```
Name: FieldWasChanged 

Parmeter 1
Name: Database Fieldname
Type: Text
Description: Example: WFD_AttText41

Parameter 2
Name: ComparePickerIdOnly
Type: Text
Description: If true (1), the id of the picker value is compared instead of the whole value. Only use 1, if it is a picker field.

```
{% include figure image_path="/assets/images/posts/2023-07-25-has-field-value-changed/2023-07-12-22-30-13.png" alt="Global business rule" caption="Global business rule" %}

Aftewards, copy the SQL statement and replace the parameters. In my case `Database Fieldname` has the id 56 while `ComparePickerIdOnly` has the id 57.
SQL command.
{% include figure image_path="/assets/images/posts/2023-07-25-has-field-value-changed/2023-07-12-22-37-50.png" alt="How the SQL command should look like." caption="How the SQL command should look like." %}
```sql
DECLARE @fieldname nvarchar(120);  
Declare @isPickerField tinyint;
Declare @historyColumn nvarchar(200)
Declare @currentColumn nvarchar(200)
DECLARE @ParmDefinition NVARCHAR(500);  
DECLARE @SQLString NVARCHAR(2000);  

SET @isPickerField = {BRP:57}
select @currentColumn = case 
	when @isPickerField = 1 then 'dbo.ClearWFElemIdAdv({BRP:56})'
	else '{BRP:56}'
end
select @historyColumn = case 
	when @isPickerField = 1 then 'dbo.ClearWFElemIdAdv('+REPLACE('{BRP:56}','WFD','WFH')+')'
	else REPLACE('{BRP:56}','WFD','WFH')
end 

/* Build the SQL string one time.*/  
SET @ParmDefinition = N'@wfId int';  
SET @SQLString =  
     N'
select Top 1 case 
		when '+@currentColumn + ' = '+@historyColumn+'
		then 0
		else 1 
	end as changed
FROM [dbo].[WFHistoryElements] join WFElements 
	on WFH_OrgID = WFD_ID and WFH_Version <> WFD_Version
where WFH_OrgID = @wfId
order by WFH_ID desc
';  

EXECUTE sp_executesql @SQLString, @ParmDefinition,@wfId = {WFD_ID};
```

{: .notice--warning}
**Remark:**
I haven't checked whether the 'bps_user' has permissions to read the history tables. In case an error is thrown it may be necessary to change data source from `Current BPS database` to one which has a dedicated user with appropriate privileges.

## Usage
You can use the business rule either in the execution condition of an action, which was the way to go in the past, or use the `Condition` operator, as displayed below.

{% include figure image_path="/assets/images/posts/2023-07-25-has-field-value-changed/2023-07-12-22-41-28.png" alt="Testing whether a the ID of a choose /picker field was changed in a `Condition` parameter" caption="Testing whether a the ID of a choose /picker field was changed in a `Condition` parameter" %}


If you use any other field type, use a 0, or this may have unintended side effects.



