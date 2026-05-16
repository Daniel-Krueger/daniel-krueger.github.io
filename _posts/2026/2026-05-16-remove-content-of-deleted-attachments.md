---
title: "Removing binary content of deleted attachments"
categories:
  - WEBCON BPS
tags:
  - Governance
excerpt:
  "Depending on the way an attachment has been deleted in WEBCON BPS, its binary content can stay in the database indefinitely. These scripts let you reclaim that space safely."
bpsVersion: 2026.1.6.198
---

# Overview

When a user removes an attachment in the BPS Portal, or when an automation removes it without explicitly clearing the file content, the binary data stays in the database. The attachment is flagged as deleted but the bytes are never freed. 

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-11-18-52.png" alt="Diskspace allocated by deleted attachments." caption="Diskspace allocated by deleted attachments." %}

Whether this is an issue depends on your use case. If it's a generated document, you likely don't need those. On the other hand, it may be even an issue, that users can access a deleted version. While you can correct this for the future, you still need to handle the old documents.

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-11-55-40.png" alt="A user can view and download a deleted attachment from history." caption="A user can view and download a deleted attachment from history." %}

WEBCON BPS has no built-in mechanism to clean this up.
> [Delete attachments with binary data](https://community.webcon.com/forum/thread/8056?messageid=8056)<br/>
> Konrad Keppert (WEBCON)<br/>
> Unfortunately, there isn't a simple way. Once an attachment is removed, it is flagged as deleted in the database and further actions do not operate on it.
> The functionality to remove binary data of deleted attachments is in backlog and I hope it will be implemented sooner than later.
> As a workaround, advanced users may want to *manually update* ATF_Value to empty string or change ATT_IsDeleted to 0 and then execute an action again.

If something is not possible with the built-in options, it's a good topic for a blog post. :)

# Removing the content of deleted attachments
The suggested way requires modifying the database directly. We can simply clear the content directly instead of marking the file as not deleted and then trigger the action to remove the content. 

I prepared two versions for this:
1. Single script <br/>
  This is intended for a quick execution / limited amount of data you want to remove in a test database. This runs in a single transaction.
2. Database backend <br/>
  I've used this to cleanup a large amount of data in a production environment. Production environments are always special, and I wanted to have a better option to verify what would happen and what did happen. In addition, this will execute the cleanup in transaction batches, which will prevent the transaction log file grows too much.

Both approaches clear the file content by setting `ATF_Value` to an empty binary value (`0x0`) and marking both the attachment and its versions as deleted. Neither approach deletes rows from the database, so no referential integrity is affected.

{: .notice--warning}
**Remark:** If the attachment isn't deleted I recommend to use the action `Remove attachment` and set the mode to `Remove only history of binary data`. 
  ![It's possible to remove the content of old versions for non-deleted attachments.](/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-00-14.png)

{: .notice--warning}
**Remark:** These scripts modify data directly in the WEBCON BPS database. Always run in dry-run mode first, take a backup before executing, and test in a non-production environment.

## Option 1: Single script

This script is suited for targeted cleanups on a smaller number of records. It uses a table variable to collect the records matching your filter, shows a preview in dry-run mode or executes the update inside a single transaction.

The key configuration is at the top of the script:

```sql
declare @dryrun bit = 1;  -- Set to 1 for dry run (preview), 0 for actual update
```

The `WHERE` clause controls which attachments are selected. Adjust it to match your scenario:

```sql
where /* ATT_Name like 'GeneratedDocument%' */
    ATT_WFDID = 993
    and ATT_IsDeleted = 1
    and datalength(ATF_Value) > 1;
```
{: .notice--info}
**Tip:** Take a look at [Filters](#filters) for a few suggestions.

Make sure that you update all references to the correct databases. There are three places in the script in which you need to define the content database and the attachment file database. The latter one can be different for each process. You can simply search for `Content` in the script.

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-21-57.png" alt="Update the database names to match your process configuration." caption="Update the database names to match your process configuration." %}

{: .notice--info}
**Tip:** If you have already opened up the SQL Management Studio, you can use this statement to get the attachment database name of the processes.
```sql
select DEF_Name, DEF_AttachmentsDatabase
from WFDefinitions 
```

In dry-run mode the script prints the estimated data volume and lists every record that would be affected. When you set `@dryrun = 0` the update runs in a single transaction and rolls back automatically if the affected row count does not match the expected count.

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-27-27.png" alt="Result of the dry-run." caption="Result of the dry-run." %}

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-28-07.png" alt="Result of the executed script." caption="Result of the executed script." %}
{: .notice--warning}

**Remark:** Because the update runs in a single transaction, the SQL Server transaction log will grow by at least the total size of the binary data being cleared. Verify that you have sufficient free space in the transaction log and data files before running the actual update on a large dataset. If in doubt, use Option 2.

## Option 2: Database backend approach

This approach is designed for larger or long-running cleanups where you want better visibility and control. It uses a dedicated database `AttachmentCleanupDB` as a job log and processes records in configurable batches, committing each batch separately to keep the transaction log manageable.

The four scripts are intended to be run in order.

### Script 1: Setup

Run `AttachmentCleanupDB_1_setup.sql` once. It creates the `AttachmentCleanupDB` database, the `AttachmentCleanupLog` table, and two stored procedures:

- sp_AttachmentCleanup_DryRun<br/>
Reads the log table and shows all pending records along with their current state in the live database.

- sp_AttachmentCleanup_BatchDelete<br/>
Processes pending records in batches. Each batch is committed independently. Records that fail are marked with status `Error` and the error message is stored in the log table for review.

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-29-23.png" alt="The generated database." caption="The generated database." %}

### Script 2: Populate log table

`AttachmentCleanupDB_2_populate.sql` queries the WEBCON BPS databases and inserts the matching attachment records into `AttachmentCleanupLog` with status `Pending`. 

Before running the script, you need to:
1. Update the database names <br/>
  WEBCON BPS can store attachment data in a dedicated database that is separate from the content database. These are defined by each process. 
2. Update the filter <br/>
  This should match your scenario. I've listed a few suggestions [here](#filters).

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-40-18.png" alt="You need to update these parts to match your environment and filter conditions." caption="You need to update these parts to match your environment and filter conditions." %}

{: .notice--warning}
**Remark:** You need to provide the database names in the SELECT because the other stored procedures will generate a statement using these. Otherwise, we would need to modify the script each time to match the target databases.

{: .notice--info}
**Tip:** If you already opened up the SQL Management Studio, you can use this statement to get the attachment database name of the procresses.
```sql
select DEF_Name, DEF_AttachmentsDatabase
from WFDefinitions 
```

You can run this script multiple times with different filters to add more records to the log before starting the deletion.

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-44-24.png" alt="You can view the `AttachmentCleanupLog` table to verify the results." caption="You can view the `AttachmentCleanupLog` table to verify the results." %}


### Script 3: Dry-run

`AttachmentCleanupDB_3_dryrun_proc.sql` calls `sp_AttachmentCleanup_DryRun`. Review the output to confirm the record list. This is the last step, to ensure that everything is fine.

1. You can compare the records using the file version
2. Verify the current/new status / file size.
3. You can view the generated statement.

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-11-58-23.png" alt="The dry-run offers an option to review the files which are intended to be cleared." caption="The dry-run offers an option to review the files which are intended to be cleared." %}


### Script 4: Batch delete

`AttachmentCleanupDB_4_batchdelete_proc.sql` calls `sp_AttachmentCleanup_BatchDelete` with a configurable batch size (default 1000). Each batch commits independently, so the transaction log stays under control even for very large datasets.

```sql
exec sp_AttachmentCleanup_BatchDelete @BatchSize = 1000
```

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-10-57-14.png" alt="The test executed the deletion in batches of 1 for testing purposes." caption="The test executed the deletion in batches of 1 for testing purposes." %}

After completion, you can check the log table. In theory individual errors for a record should be saved, but I haven't tested it.

{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-11-00-52.png" alt="The executed procedure will update the log table" caption="The executed procedure will update the log table" %}

# Filters

## Filtering the attachment files
Recommendations for the filter
- ATT_WFDID<br/>
  Restrict to a specific workflow instance for testing
- ATT_Name <br/>
  If you generate documents, you can filter using the same pattern used for generating. Make sure that no custom documents are accidentally included.
- ATT_Description
  In some processes, I've hidden the description in the UI, so that the users couldn't provide a description and I set a value for all generated values.
- ATT_Attribute1
  This stores the value of the `Category(folder)` if enabled.
- ATT_IsDeleted = 1
  Should always be included to avoid removing versions of still existing files, at least if you don’t want to achieve just that. :)
- AT*F*_TsUpdated
  In case you want to remove only versions which are older than two years.

## Get all attachments of form types
This script will return all attachments in a given process.
```sql
declare @defId int = (select DEF_ID from WFDefinitions  where DEF_Guid = 'de6a610b-ca59-4058-9907-53f6b3887431')

select WFAttachmentFiles.ATF_ATTID, WFAttachmentFiles.ATF_Version, WFAttachmentFiles.ATF_OrginalName
from 
  WFAttachmentFiles 
  join WFDataAttachmets on ATF_ATTID = ATT_ID   
  /* The V_WFElements view would be another option, but the execution will be longer because of the numerous joins */
  join WFElements on ATT_WFDID = WFD_ID
  join WFDocTypes on  WFD_DTYPEID = DTYPE_ID
where 
 DTYPE_DEFID = @defId

```

You can combine the filters on the attachment files table with the form type like this
```sql

....
where
   ATT_IsDeleted = 1 and datalength(ATF_Value) > 1
   and ATT_ID in ( 
    select WFAttachmentFiles.ATF_ATTID
    from 
      WFAttachmentFiles 
      join WFDataAttachmets on ATF_ATTID = ATT_ID   
      /* The V_WFElements view would be another option, but the execution will be longer because of the numerous joins */
      join WFElements on ATT_WFDID = WFD_ID
      join WFDocTypes on  WFD_DTYPEID = DTYPE_ID
    where 
    DTYPE_DEFID = @defId
   )
```

# Disk space of deleted attachments
This SQL statement will list how much space is taken by the attachment versions. While this can be an indicator of whether you can free up some space. Make sure that the business is fine for deleting those versions.

```sql

select 
 ( select sum(datalength(ATF_Value)/1024/1024) [Total MB]
  from dbo.WFAttachmentFiles join WFDataAttachmets on  ATF_ATTID = ATT_ID
  where ATF_IsDeleted = 1 and ATT_IsDeleted = 0) [Total MB of deleted attachments versions, which files have not been deleted] ,
  ( select sum(datalength(ATF_Value)/1024/1024) [Total MB]
  from dbo.WFAttachmentFiles join WFDataAttachmets on  ATF_ATTID = ATT_ID
  where ATF_IsDeleted = 1 and ATT_IsDeleted = 1) [Total MB of deleted attachments versions, which files have been deleted] ,
  ( select sum(datalength(ATF_Value)/1024/1024) [Total MB]
  from dbo.WFAttachmentFiles join WFDataAttachmets on  ATF_ATTID = ATT_ID
  where ATF_IsDeleted = 0) [Total MB existing attachments versions]

```
{% include figure image_path="/assets/images/posts/2026-05-16-remove-content-of-deleted-attachments/2026-05-16-11-30-23.png" alt="Comparision of the allocated disk space." caption="Comparision of the allocated disk space." %}
# Download

You can find the files [here](https://github.com/Daniel-Krueger/webcon_snippets/tree/main/removeContentOfDeletedAttachments).


