---
title: "Updating to BPS 2023"
categories:
  - WEBCON BPS  
  - CC LS
tags:
  
excerpt:
    This post is a summary of all the changes we had to implement after updating to WEBCON BPS 2023.
bpsVersion: 2023.1.1.56
last_modified_at: 2023-07-29
---
# Updates
## Update 2023-07-08
- Added up [Do choose fields with only ID exist](/posts/2023/updating-to-bps-2023#do-choose-fields-with-only-id-exist).\
- Added SQL queries as files to [GitHub](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/BPS2023_upgrade_checks).
  
## Update 2023-07-29
- Added warning to SDK migration

# Overview  
The new WEBCON BPS 2023 is out and the [change log](https://community.webcon.com/download/changelog/188?q=07cb66b) is full of information. Unfortunately, there are breaking changes, which makes this update not so easy as the ones I experienced before. Two of these are intended and if you neither use SDK plugins nor jQuery, you aren't subject to those. But I also encountered one, which may be unintended and another breaking change, which only is a breaking change due to my laziness.


{: .notice--warning}
**Remark:** We have cloned our single server dev environment and updated it from 2022.1.1.155 to 2023.1.1.41 and afterwards to 2023.1.1.56. So there may be differences depending on the time when you read this post to the current version.


# Calculated columns for Choose fields
## New database field 
From the change log 
```
Added calculated columns to the WFElements table which will allow 
identifiers of choice fields to be loaded more efficiently.
Until now, the dbo.ClearWFElemID function was used.
Queries will now use new calculated columns e.g.  WFD_AttChoose[Number]_ID.
This should increase the loading speed of Reports, BPS internal view data sources, and SQL COMMAND functions in Business rules.
```
What does this mean. If you are referencing a field using a variable:
WFD_DTYPEID = {DT:12} and {WFCONCOL_ID:153} = {WFD_ID}
This has been "translated" to in BPS 2022
WFD_DTYPEID = 1 and dbo.ClearWFElemId(WFD_AttChoose1) = 2
In BPS 2023 the result is:
WFD_DTYPEID = 1 and WFD_AttChoose1_ID = 2

Some notes regarding the new field:

1. This is only used for single value fields. In case of multi value fields the old logic is used instead of the new field
2. In the case of multi value fields only the first id is stored.
3. When installing BPS 2023.1.1.41/56 there's a potential issue. If you have a choose field which only contains an Id without a display name, then the value of the new column is null. For example, when creating a sub workflow I quite often only assigned the id to a field and let the system handle the rest. I had cases where the system did not store the display name so the value in the calculated column is empty. There were some changes in the system though. When I used the same action in the new version the display name was populated, and the id was filled.

{% include figure image_path="/assets/images/posts/2023-05-31-updating-to-bps-2023/2023-05-31-23-01-20.png" alt="" caption="" %}

## Breaking change due to one's own laziness
If you have been lazy you may encounter errors like this:
{% include figure image_path="/assets/images/posts/2023-05-31-updating-to-bps-2023/2023-05-31-23-03-03.png" alt="" caption="" %}

This may happen, if you used an integer value as the id of the choose field and then used a condition like:
 `{WFCONCOL_ID:153} = {WFD_ID}`
This will now fail, because the left side will be the new column, which is text and the right side is integer.
If you have always used '' for the right side, 
`{WFCONCOL_ID:153} = '{WFD_ID}'`
which would have been correct, as it improves performance a little bit, this error wouldn't occur.

## Checks _before_ upgrading to BPS 2023
### Do choose fields with only ID exist
If choose field only has an ID, there's no #, this may cause problems.

The `ChooseFields_without_displayname.sql` and `ChooseFields_ItemList_without_displayname.sql` will output those records which have only an ID in the first 10 choose/people fields.

The files can be downloaded from [GitHub](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/BPS2023_upgrade_checks).

### Where are choose fields IDs used
I'm not a fan of trial and error. Therefore, I put together some SQL commands which can be used as an initial check, before you upgrade to 2023.

Since t-sql doesn't support regular expressions, the process would be:
1. Execute the SQL command
   ![](/assets/images/posts/2023-05-31-updating-to-bps-2023/2023-06-07-22-22-05.png)
2. Copy the results to notepad++ or another tool 
   ![](/assets/images/posts/2023-05-31-updating-to-bps-2023/2023-06-07-22-22-44.png)
3. Use find with enabled regular expression ```WFCONCOL_ID:\d*\}\s+=\s+[^']``` to locate all occurrences in the current document
![](/assets/images/posts/2023-05-31-updating-to-bps-2023/2023-06-07-22-24-05.png)
4. Check the results
![](/assets/images/posts/2023-05-31-updating-to-bps-2023/2023-06-07-22-28-14.png)

In the last image only the red highlighted columns would cause a problem. Constants (EPV) are text the id of an item list (DNCCOL_ID) is text too. The blue one could cause a problem, in case the column is integer, maybe. I haven't checked this case yet.
The SQL command contains a row number, this way it's a little bit easier to scroll up to the number and then check the row in the management studio.

{: .notice--warning}
**Remark:** The regular expression above checks for the = operator. Unfortunately we could also have `in` ,`<>`, the sides could be swapped and so on. So you could use ```WFCONCOL_ID:\d*\}``` instead which will show every line where it is used.

{: .notice--warning}
**Remark:** I tried to add as much information to the SQL commands as I could find, but in some cases it may not be enough. In addition, it can be set I missed some. If you find a problem, have improvements, find another object which uses SQL commands, get in touch with me.
#### Actions
It's also available as file on [GitHub](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/BPS2023_upgrade_checks).
``` sql

SELECT TOP (1000) 
	ROW_NUMBER () OVER ( order by actionDefinition.ACT_ID asc) as RowNumber
	, actionProcess.DEF_Name as ActionProcess
	, automationProcess.DEF_Name as AutomationProcess
	, WF_Name
	, STP_Name
	, PATH_Name
	, PLU_Name
	, actionDefinitionAutomation.AUTM_Name
	, actionDefinition.[ACT_ID] 
	, DicActionKinds.EnglishName ActionKind
	, DicActionTypes.ObjectName ActionType
	, actionDefinition.[ACT_Name] actionName
	, actionDefinition.ACT_Description actionDescription
	, actionDefinition.ACT_Configuration actionConfiguration
	, templateAction.ACT_ID templateId
	, templateAction.[ACT_Name] templateName
	, templateAction.ACT_Description templateDescription
	, templateAction.ACT_Configuration templateConfiguration	
FROM [dbo].[WFActions] as actionDefinition
  left join WFDefinitions as actionProcess on DEF_ID = ACT_DEFID 
  join DicActionKinds on ACT_ActionKindID = DicActionKinds.TypeID
  join DicActionTypes on ACT_ActionTypeID = DicActionTypes.TypeID
  left join WorkFlows on ACT_WFID = WF_ID
  left join WFSteps on ACT_STPID = STP_ID
  left join WFAvaiblePaths on ACT_PATHID = PATH_ID
  left join WFPlugIns on PLU_ID = ACT_PLUID
  left join Automations as actionDefinitionAutomation on  actionDefinition.ACT_AUTMID = actionDefinitionAutomation.AUTM_ID
  left join [WFActions] as templateAction on templateAction.ACT_ID = actionDefinition.ACT_ACTID
  left join WFDefinitions  as automationProcess  on actionDefinitionAutomation.AUTM_DEFID = automationProcess.DEF_ID
where actionDefinition.ACT_Configuration like '%WFCONCOL_ID:%'
```
#### Business rules
It's also available as file on [GitHub](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/BPS2023_upgrade_checks).
``` sql
SELECT 
	ROW_NUMBER () OVER ( order by command.[BRD_ID] asc) as RowNumber
	, APP_ID as Application
	, process.DEF_Name as Process
	, command.[BRD_ID]  Command_BRD_ID
	, command.[BRD_BRDID] as Command_BRD_BRDID
	, command.[BRD_Name] as Command_BRD_Name
	, command.[BRD_Value] as Command_BRD_Value
	, command.[BRD_Documentation] as Command_BRD_Documentation
	, parent.[BRD_ID]  Command_BRD_ID
	, parent.[BRD_BRDID] as Command_BRD_BRDID
	, parent.[BRD_Name] as Command_BRD_Name
	, parent.[BRD_Value] as Command_BRD_Value
	, parent.[BRD_Documentation] as Command_BRD_Documentation
FROM [dbo].[WFBusinessRuleDefinitions] command
  left join [dbo].[WFBusinessRuleDefinitions] parent on parent.BRD_ID = command.BRD_BRDID
  join [dbo].WFDefinitions  process on command.BRD_DEFID = DEF_ID
  join WFApplications on DEF_APPID = APP_ID
where command.BRD_Value like '%WFCONCOL_ID:%'

```
#### Data sources
It's also available as file on [GitHub](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/BPS2023_upgrade_checks).
``` sql
/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000)
	ROW_NUMBER () OVER ( order by directSource.[WFS_ID] asc) as RowNumber
	, directSource.[WFS_ID]
	, directSource.WFS_Name
	, directSource.[WFS_WFSID] as IdParentSource      
	, parentSource.WFS_Name as ParentSource
	, directSource.[WFS_COMID]
	, directSource.[WFS_Type]
	, directSource.[WFS_SelectCommand]
FROM [dbo].[WFDataSources] directSource
	left join [dbo].[WFDataSources] parentSource on parentSource.WFS_ID = directSource.WFS_WFSID
where directSource.WFS_SelectCommand like '%WFCONCOL_ID:%'
```
#### Fields
It's also available as file on [GitHub](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/BPS2023_upgrade_checks).
``` sql
/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000)
	ROW_NUMBER () OVER ( order by [WFCON_ID] asc) as RowNumber
	, APP_Name as Application
	, DEF_Name as Process
	, [WFCON_ID]
    , [WFCON_Prompt]
    , [WFCON_SelectOrCaml]
    , [WFCON_DefaultSelect]      
    , [WFCON_Config]
      
  FROM [dbo].[WFConfigurations] join WFDefinitions on WFCON_DEFID = DEF_ID
  join WFApplications on DEF_APPID = APP_ID
  where [WFCON_SelectOrCaml] like '%WFCONCOL_ID:%' 
  or [WFCON_DefaultSelect] like '%WFCONCOL_ID:%' 
  or [WFCON_Config] like '%WFCONCOL_ID:%' 
```

# Default values are set before URL parameters
From the change log:
``` 
Changed the order in which rules are executed when starting a workflow 
instance. After the change, the order is as follows: 1) restrictions, 2) default values, 3) other values set by: users, actions that change the instance, URL parameters
```
I really dislike this one, because I use URL parameters a lot. In an unknown number of cases default values may rely on fields which are set by URL parameters. This worked fine in BPS 2022 but now the default values are calculated _before_ the URL parameters are set and therefore will be incorrect.

Although I knew better I tested whether "Form rule to be executed on value change" could be used to update the default value. It did not.

If you are using the URL parameters internally you can calculate the correct "default value" and pass it as an URL parameter. That's not nice but it works. The problem is when the URL is generated by an external application...

I created a ticket for this, let's see how this will evolve.


# jQuery replacement by cash
From the change log:
```
The cash-dom library has replaced the former jQuery library.
The change may affect how form rules work in JavaScript mode if the rules used the functionality provided by jQuery.
For a description of the differences in the operation of the two libraries, see: 
[https://github.com/fabiospampinato/cash/blob/master/docs/migration_guide.md](https://github.com/fabiospampinato/cash/blob/master/docs/migration_guide.md)
```
The migration guide is lacking in my cases and I intend to help updating it, after we have migrated everything.
I also opened a thread in the community regarding this:
[https://community.webcon.com/forum/thread/3065](https://community.webcon.com/forum/thread/3065)

We have encountered the following differences so far


Comment |jQuery | Cash | 
---------|----------|----------|
  Replace contains | .contains("true") | .indexOf("true") > -1  |
 Execute click for a single element|$("#ReloadToolbarButton").click(); | reloadButton[0].click() |
 Execute click for all  elements|$("button", $(".reload-button-container")).click(); |  $(".reload-button-container").find("button").each((index,element)=> {element.click()}); | 
 Add triggers| $("#cclsCloseDialog > button").click(function () {  ccls.modal.dialog.close();});|$("#cclsCloseDialog > button").on('click',function () {  ccls.modal.dialog.close();});| 




# SDK Migration
It seems some major refactoring was done and this also is reflected in the SDK. A lot of functions are now asynchronous, which requires changes to the existing plugins, before they can be used.
There's the official [SDK Migration](https://community.webcon.com/community/public/uploads/editor/Migration_Document_2023_1.pdf) but I will post here all the changes I encountered to *build* the plugin again. I didn't necessarily test the plugins in depth.
I also only did some lazy changes, because I want to test the new version and not the plugins.

{: .notice--warning}
**Warning:** To make it clear: If you use the changes below, you will potentially nullify the performance gains which would be available due to the refactoring to use asynchronous methods. It's bad practice as snoop pointed out in a comment. As stated, my focus was on testing the new version as fast as possible.


## Run to RunAsync
Before
```
public override void Run(RunCustomActionParams args)
        
```
After

```
public override System.Threading.Tasks.Task RunAsync(RunCustomActionParams args)
{
	RunOld(args);
	return System.Threading.Tasks.Task.CompletedTask;
}

public void RunOld(RunCustomActionParams args)
```

##  GetDataTableFromDataSource to Async
Before
```
 GetDataTableFromDataSourceParams dataSourceParams = new GetDataTableFromDataSourceParams(Convert.ToInt32(Configuration.DataSourceID), args.Context);
 DataTable table = WebCon.WorkFlow.SDK.Tools.Data.DataSourcesHelper.GetDataTableFromDataSource(dataSourceParams);                  
```

After
```
GetDataTableFromDataSourceParams dataSourceParams = new GetDataTableFromDataSourceParams(Convert.ToInt32(Configuration.DataSourceID));
DataTable table = new WebCon.WorkFlow.SDK.Tools.Data.DataSourcesHelper(args.Context).GetDataTableFromDataSourceAsync(dataSourceParams).Result;
               
```

##  GetDataTableForSqlCommandOutsideTransactionWithAdminPrivileges to Async
Before
```
DataTable dataTable = SqlExecutionHelper.GetDataTableForSqlCommandOutsideTransactionWithAdminPrivileges(statement.SqlQuery);
```

After
```
DataTable dataTable = new SqlExecutionHelper(args.Context).GetDataTableForSqlCommandOutsideTransactionWithAdminPrivilegesAsync(statement.SqlQuery).Result;                               
```

##  SqlFields.Value to Async
Before
```
foreach (var sqlField in args.Context.CurrentDocument.SqlFields)
{
	tables.Add(sqlField.DisplayName, sqlField.Value);
}
```

After
```
foreach (var sqlField in args.Context.CurrentDocument.SqlFields)
{
	tables.Add(sqlField.DisplayName, sqlField.GetDataAsync().Result);
}                
```

##  Evaluate to Async
Before
```
public override EvaluationResult Evaluate(CustomBusinessRuleParams args)       
```

After
```
public override Task<EvaluationResult> EvaluateAsync(CustomBusinessRuleParams args)
{
	return System.Threading.Tasks.Task.FromResult(EvaluateOld(args));
}
public EvaluationResult EvaluateOld(CustomBusinessRuleParams args)
```

##  GetDocumentByID to Async
Before
```
ExistingDocumentData data = manager.GetDocumentByID(Convert.ToInt32(Configuration.DocumentId));            
```

After
```
ExistingDocumentData data = manager.GetDocumentByIdAsync(Convert.ToInt32(Configuration.DocumentId)).Result;                        
```

##  Attachments.GetByID to Async
Before
```
 var contentData = args.Context.CurrentDocument.Attachments.GetByID(Convert.ToInt32(Configuration.AttachmentID));
```

After
```
var contentData = args.Context.CurrentDocument.Attachments.GetByIDAsync(Convert.ToInt32(Configuration.AttachmentID)).Result;           
```

##  Attachments.AddNew to Async
Before
```
args.Context.CurrentDocument.Attachments.AddNew(targetFilename, item.Value);
```

After
```
args.Context.CurrentDocument.Attachments.AddNewAsync(targetFilename, item.Value);            
```
## CustomFilesManager.UploadFile to Async
Before
```
Guid customFileGuid = customFilesManager.UploadFile(uploadParams);
```

After
```
Guid customFileGuid = customFilesManager.UploadFileAsync(uploadParams).Result;             
```

## WriteToLog
Before
```
WebCon.WorkFlow.SDK.Tools.Log.Logger.WriteToLog(new WebCon.WorkFlow.SDK.Tools.Log.WriteToLogParams())
```

After
```
(new WebCon.WorkFlow.SDK.Tools.Log.Logger(args.Context)).WriteToLog(new WebCon.WorkFlow.SDK.Tools.Log.WriteToLogParams()              
```


##  GenerateDocx replacement
Not solved yet.
From the change log:
```
SDK.Tools was used to implement the GenerateDocx method. This method is no longer available in the new SDK. It can be substituted with a regular WORD document generation action or a custom component for generating docx files.
```
Before
```
new FileGenerationHelper(args.Context).GenerateDocx(genparams);     
```

After
```
???
```
