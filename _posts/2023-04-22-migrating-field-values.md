---
title: "Migrating field values"
categories:
  - WEBCON BPS  
  - CC LS
tags:
  - Fields
  - Snippet
excerpt:
    This post may help you, if you need to migrate a field value from one type to another. Or if you need to copy a 'local' field to a global field.
bpsVersion: 2022.1.4.155
---

# Overview  
While working with WEBCON BPS you may come in a situation where it's required to change the underlying type of a field. This could be the case when you want to introduce a global field, for example a 'Title' field or when you stored some workflow id in an integer field but want to change it to a picker so that you can display the related workflow and provide a link to it. 
This post will provide two SQL templates which can help you in those cases.

{% include figure image_path="/assets/images/posts/2023-04-22-migrating-field-values/2023-04-20-20-53-03.png" alt="Dry run of the script to migrate an integer value to a picker value." caption="Dry run of the script to migrate an integer value to a picker value." %}

{: .notice--warning}
**Remark:** Both templates will be executed against the database and will modify the date. This is not supported and if you break something you are on your own. If you still want to use those, make at least backup and test the restore before executing them.

# Copy values to a global field

Migrating a value from a 'local' field, a field created on process level, to a global field, is a simple copy, if the data type doesn't change. This needs to be executed for the current element and the history.

In the template below you can simply change the document type, verify the correct columns and you are good to go. 

```sql
Update WFElements
set  WFD_AttText1Glob = WFD_AttText1 
where WFD_DTYPEID 
in (
	select DTYPE_ID 
	from WFDocTypes
	where DTYPE_Guid in ('129e5a2b-5c44-42d8-99b6-6588d8ff0cf4')
)
and WFD_AttText1Glob is null

Update WFHistoryElements
set  WFH_AttText1Glob = WFH_AttText1 
where WFH_DTYPEID 
in (
	select DTYPE_ID 
	from WFDocTypes
	where DTYPE_Guid in ('129e5a2b-5c44-42d8-99b6-6588d8ff0cf4')
)
and WFH_AttText1Glob is null
```

{: .notice--info}
**Info:** Why would you want to do something like this? The values of global fields are visible in the archive. Another reason would be to have one field in each process which contains its title, which proofs useful for generic queries like generating a [breadcrumb](/posts/2023/breadcrumb) or the SQL template in the next chapter.

{% include figure image_path="/assets/images/posts/2023-04-22-migrating-field-values/2023-04-20-21-27-25.png" alt="Global fields are displayed in the archive." caption="Global fields are displayed in the archive." %}

# Migrating to a picker value
In the beginning I stored a grandparent workflow instance id in a technical integer field. This helped solve all kinds of problems but in the meantime, I realized, that it would be even better to store these values in a picker field, which uses a `BPS Internal view`. Then I could show the workflow and directly provide a link to it for the user. Combined with a data row the user can see the most important information.
{% include figure image_path="/assets/images/posts/2023-04-22-migrating-field-values/2023-04-20-21-07-21.png" alt="A picker to the parent workflow with data rows displaying further information." caption="A picker to the parent workflow with data rows displaying further information." %}

The problem here was that I needed to migrate values from an integer field to a picker field. This on a whole other level than just copying the value and a lot more can go wrong. Therefore, I wanted an SQL statement which I could execute and verify what would happen. Afterwards I would execute it again.

The below script will fill a table variable `@newValues` with the old value of the target field and the new value.  While `@dryRun` is true, the `@newValues` entries will be displayed. As you see, in the screenshot below, it's really helpful to have a global title field. :)
{% include figure image_path="/assets/images/posts/2023-04-22-migrating-field-values/2023-04-20-20-53-03.png" alt="Dry run of the script to migrate an integer value to a picker value." caption="Dry run of the script to migrate an integer value to a picker value." %}

If you switch the value to false (0), the update sections will be executed. 

{: .notice--warning}
**Remark:** The provided script is a template/starting point, which needs to be modified to match your needs. This means, that you need to modify the select statement which populates the `@newValues` table and a little change to the `update`  statement, so that the correct column will be updated. This needs to be repeated for the history.



```sql
/*** Get document types ids for this database ***/
/*** Get the integer document types of the workflow elements which should be updated and store them in a table. The GUIDs of the document types are used, so that the script can be executed against all databases.***/
	declare @choiceFieldSourceDocumentType varchar(40) = (select DTYPE_ID from WFDocTypes where DTYPE_Guid = '129e5a2b-5c44-42d8-99b6-6588d8ff0cf4')
	
	declare @documentTypesToUpdate table (ids int) 
	set nocount on
	insert into @documentTypesToUpdate

	select DTYPE_ID
	from WFDocTypes /* Form type guids */
	where DTYPE_Guid in ('f13323eb-b477-4f01-901d-8b3a0cbb387e','cddcd993-f55b-4536-a14e-6e42e5cb952b','4bbaf253-7379-4235-b18c-947ab617bf6f')
	set nocount off

	--select ids from @documentTypeToUpdate
	

declare @newValues table (wfdId int, docType int, title varchar(255),wfdVersion int,currentValue varchar(1000), newValue varchar(1000),otherInformation varchar(max)) 	
declare @dryRun tinyint = 1

begin -- Update measures
/*** Define migration / update for the current version ***/
	print ' Workflow instance update current element: Transfering WFD_AttInt1 to the new field WFD_AttChoose5 '
	print ' Populating temp table with the new values '
	delete from @newValues 
	insert into @newValues
	select  workflowsToUpdate.WFD_ID,workflowsToUpdate.WFD_DTYPEID, workflowsToUpdate.WFD_AttText1Glob,null
		/** old value , new value **/
		,workflowsToUpdate.WFD_AttChoose5, cast(choiceFieldSource.WFD_ID as varchar(10))+'#'+choiceFieldSource.WFD_AttText1Glob as newValue 
		/** other information **/
		, 'Value of field used for joining '+cast(workflowsToUpdate.WFD_AttInt1 as varchar(20))
	from WFElements as workflowsToUpdate join WFElements as choiceFieldSource
		on 
		workflowsToUpdate.WFD_AttInt1 = choiceFieldSource.WFD_ID
		and choiceFieldSource.WFD_DTYPEID = @choiceFieldSourceDocumentType
	where workflowsToUpdate.WFD_DTYPEID in  (select ids from @documentTypesToUpdate)
		/*** in case we want to transfer an old value into a new field we should check wether the new field hasn't a value yet ***/
		and workflowsToUpdate.WFD_AttChoose5 is null		

	if (@dryRun = 1) begin
		print ' Show results, it''s a dryrun'
		select Top 1000 * from @newValues
	end else begin
		print ' Updating data'
		update WFElements 	
		set WFD_AttChoose5 = newValueTable.newValue
		from @newValues as newValueTable
		where WFD_ID =	newValueTable.wfdId
	end


/*** Define migration / update for the history version ***/
	print ' Workflow instance history update: Transfering WFD_AttInt1 to the new field WFD_AttChoose5 '
	print ' Populating temp table with the new values '
	delete from @newValues 
	insert into @newValues
	select  workflowsToUpdate.WFH_ID,workflowsToUpdate.WFH_DTYPEID, workflowsToUpdate.WFH_AttText1Glob,workflowsToUpdate.WFH_Version,
			/** old value , new value **/
			workflowsToUpdate.WFH_AttChoose5, cast(choiceFieldSource.WFD_ID as varchar(10))+'#'+choiceFieldSource.WFD_AttText1Glob as newValue 
			/** other information **/
		, 'Value of field used for joining '+cast(workflowsToUpdate.WFH_AttInt1 as varchar(20))
	from WFHistoryElements as workflowsToUpdate 
		-- There's no way to join a specific history of a sub workflow with a specific version of the parent workflow
		-- we will just use the value from the current versoin
		join WFElements as choiceFieldSource
		on 
		workflowsToUpdate.WFH_AttInt1 = choiceFieldSource.WFD_ID
		and choiceFieldSource.WFD_DTYPEID = @choiceFieldSourceDocumentType
		
	where workflowsToUpdate.WFH_DTYPEID in  (select ids from @documentTypesToUpdate)
		/*** in case we want to transfer an old value into a new field we should check wether the new field hasn't a value yet ***/
		and workflowsToUpdate.WFH_AttChoose5 is null		

	if (@dryRun = 1) begin
		print ' Show results, it''s a dryrun'
		select Top 1000  * from @newValues
	end else begin
		print ' Updating data'
		update WFHistoryElements 	
		set WFH_AttChoose5 = newValueTable.newValue
		from @newValues as newValueTable
		where WFH_ID =	newValueTable.wfdId
	end
end


```