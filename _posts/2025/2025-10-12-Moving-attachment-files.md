---
title: "Moving attachment files to other database"
categories:
  - COSMO CONSULT
  - WEBCON BPS
tags:
  - Governance
excerpt:
    "Yes, you can move the attachment files."
bpsVersion: 2025.2.1.179
---

# Overview

If you are wondering why this is necessary, this post is probably not for you. But the reason is that you cannot change the attachment database after an attachment has been added using the Designer Studio. Nevertheless, with a little bit of understanding of the database structures and SQL, this isn’t a problem. :)
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-09-36-16.png" alt="If it doesn’t work from the Designer Studio we use another way." caption="If it doesn’t work from the Designer Studio we use another way." %}

# Test scenario
I've set up a standard process which saves the attachments in the default attachment database.
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-07-45-45.png" alt="Standard process which stores attachment in content db." caption="Standard process which stores attachment in content db." %}

I added multiple documents to a workflow instance:
- Quote for bikes 2023-09-15.docx
  I've modified this in Word a few times
  - Version 1\
    /attachments/db/23/preview/236?fileversion=0&isdesignerdesk=0&authkey=
    ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-07-59-21.png)
  - Version 2\
    /attachments/db/23/preview/236?fileversion=1
    ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-00-54.png)
  - Version 3\
    Has been modified in the same step
    /attachments/db/23/preview/236?fileversion=2
    ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-01-33.png)
    ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-01-49.png)
  - Version 4\
    /attachments/db/23/preview/236?fileversion=3
    ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-02-23.png)
- Credit rating as of 2023-09-17.docx
  Has been added in one step and deleted at a later step
- Overwriting Credit-rating as of 2023-09-17.pdf with capa-report.pdf\
  The attachment id is the same
  /attachments/db/23/preview/237?fileversion=0\
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-03-04.png)
  /attachments/db/23/preview/237?fileversion=1
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-04-28.png)

In the below screenshot we can see that the content database is accessed to fetch the attachment file. I've used this approach to verify that the copied files will be read from the correct database, before deleting them from the content database.
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-12-09.png" alt="SQL Profiler trace shows that the content database is used." caption="SQL Profiler trace shows that the content database is used." %}

{: .notice--info}
**Info:** If you want to test this, you shouldn’t click on all attachments for the preview. It seems that WEBCON BPS somehow caches the previewed document. 


This SQL queries returns all the attachment files
```sql
/* Using the GUID will allow us to execute the same script on different environments */
declare @defId int = (select DEF_ID from WFDefinitions  where DEF_Guid = 'ec4a610b-ca59-4058-9907-53f6b3877c9c')
select  WFAttachmentFiles.ATF_ATTID, WFAttachmentFiles.ATF_Version, WFAttachmentFiles.ATF_OrginalName
from 
  WFAttachmentFiles 
	join WFDataAttachmets on ATF_ATTID = ATT_ID		
	/* The V_WFElements view would be another option, but the execution will be longer because of the numerous joins */
	join WFElements on ATT_WFDID = WFD_ID
	join WFDocTypes on  WFD_DTYPEID = DTYPE_ID
where 
 DTYPE_DEFID = @defId


```

{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-19-32.png" alt="The current attachment files rows in the content database." caption="The current attachment files rows in the content database." %}

# Moving files
## Attachment database creation
If you haven't done so already, create a new attachment database from the `Tools for application management` dialog in the setup.
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-07-39-42.png" alt="Setup.exe -> Tools for application management -> Create attachment database" caption="Setup.exe -> Tools for application management -> Create attachment database" %}

Follow the advice and recycle the application pool or run `iisreset` from the command line in admin mode.

## From content db to attachment db
This very simple query will copy the files of the defined process from the current content database to the target attachment database and change the attachment database. Make sure to read the

```sql
/* Using the GUID will allow us to execute the same script on different environments */
declare @defId int = (select DEF_ID from WFDefinitions where DEF_Guid = 'ec4a610b-ca59-4058-9907-53f6b3877c9c')

insert into [DEV01_BPS_Content_DKR_Att].dbo.WFAttachmentFiles (
    ATF_WFDID, ATF_ATTID, ATF_Value, ATF_TSInsert, ATF_TSUpdate, 
    ATF_IsDeleted, ATF_Version, ATF_AttachmentImage, ATF_OrginalValueHash, ATF_FileType, 
    ATF_CreatedBy, ATF_UpdatedBy, ATF_FlexiData, ATF_AttributesMapping, ATF_OrginalName, ATF_FRData
)
select 
    ATF_WFDID, ATF_ATTID, ATF_Value, ATF_TSInsert, ATF_TSUpdate, 
    ATF_IsDeleted, ATF_Version, ATF_AttachmentImage, ATF_OrginalValueHash, ATF_FileType, 
    ATF_CreatedBy, ATF_UpdatedBy, ATF_FlexiData, ATF_AttributesMapping, ATF_OrginalName, ATF_FRData
from 
    WFAttachmentFiles 
    join WFDataAttachmets on ATF_ATTID = ATT_ID
    join WFElements on ATT_WFDID = WFD_ID
    join WFDocTypes on WFD_DTYPEID = DTYPE_ID
where 
    DTYPE_DEFID = @defId

update WFDefinitions
 set DEF_AttachmentsDatabase = 'DEV01_BPS_Content_DKR_Att'
where DEF_ID = @defId
```

Afterwards I would recommend:
- Execute an IIS reset
- Restart the WEBCON service
- Reset all caches in the Designer Studio
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-10-24-55.png)

Even so I did all this and hit the `Refresh all` button the Designer studio the changed database name has only be visible after a restart
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-45-02.png" alt="The Designer Studio showed the new database name only after a restart" caption="The Designer Studio showed the new database name only after a restart" %}
## Verification 
Everything seems to be fine:
- The profiler trace is looking good\
  We now see the attachment database name
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-46-58.png)
- Preview from the form works
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-49-23.png)
- The previews from the history look fine
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-48-23.png)
- Editing existing file works
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-50-07.png)
-  The new version is saved in the attachment database
  ![](/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-08-52-55.png)

## Deletion of the old rows
Since everything looks good, it's time for the real test and delete the existing rows in the database.

```sql
/* Using the GUID will allow us to execute the same script on different environments */
declare @defId int = (select DEF_ID from WFDefinitions where DEF_Guid = 'ec4a610b-ca59-4058-9907-53f6b3877c9c')

delete from WFAttachmentFiles
where ATF_ATTID in (
    select ATT_ID
    from WFDataAttachmets
    join WFElements on ATT_WFDID = WFD_ID
    join WFDocTypes on WFD_DTYPEID = DTYPE_ID
    where DTYPE_DEFID = @defId
)
```


## Reindex the process
If you haven't deactivated the `Add attachment content to SOLR` in the process settings, you should reindex the process
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-07-41-52.png" alt="Process settings defining, whether an attachment can be searched." caption="Process settings defining, whether an attachment can be searched." %}
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-07-43-50.png" alt="Select the process" caption="Select the process" %}

## Final tests
I could open all the previews just fine and even the search is working:

{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-09-11-30.png" alt="Even searching for the content works fine." caption="Even searching for the content works fine." %}

## From one attachment database to another
I didn't check this thoroughly and only wanted to test it because it's just adding a database name to the SQL statements. :)


This is the statement for copying the files to another attachment database and the difference to the original one:
``` sql
/* Using the GUID will allow us to execute the same script on different environments */
declare @defId int = (select DEF_ID from WFDefinitions where DEF_Guid = 'ec4a610b-ca59-4058-9907-53f6b3877c9c')

insert into [DEV01_BPS_Content_DKR_Att2].dbo.WFAttachmentFiles (
    ATF_WFDID, ATF_ATTID, ATF_Value, ATF_TSInsert, ATF_TSUpdate, 
    ATF_IsDeleted, ATF_Version, ATF_AttachmentImage, ATF_OrginalValueHash, ATF_FileType, 
    ATF_CreatedBy, ATF_UpdatedBy, ATF_FlexiData, ATF_AttributesMapping, ATF_OrginalName, ATF_FRData
)
select 
    ATF_WFDID, ATF_ATTID, ATF_Value, ATF_TSInsert, ATF_TSUpdate, 
    ATF_IsDeleted, ATF_Version, ATF_AttachmentImage, ATF_OrginalValueHash, ATF_FileType, 
    ATF_CreatedBy, ATF_UpdatedBy, ATF_FlexiData, ATF_AttributesMapping, ATF_OrginalName, ATF_FRData
from 
   [DEV01_BPS_Content_DKR_Att].dbo.WFAttachmentFiles 
    join WFDataAttachmets on ATF_ATTID = ATT_ID
    join WFElements on ATT_WFDID = WFD_ID
    join WFDocTypes on WFD_DTYPEID = DTYPE_ID
where 
    DTYPE_DEFID = @defId

update WFDefinitions
 set DEF_AttachmentsDatabase = 'DEV01_BPS_Content_DKR_Att2'
where DEF_ID = @defId
```
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-09-22-44.png" alt="Differences between the statements for copying the files" caption="Differences between the statements for copying the files" %}

This is the statement for deleting the files to another attachment database and the difference to the original one:
``` sql
/* Using the GUID will allow us to execute the same script on different environments */
declare @defId int = (select DEF_ID from WFDefinitions where DEF_Guid = 'ec4a610b-ca59-4058-9907-53f6b3877c9c')

delete from [DEV01_BPS_Content_DKR_Att].dbo.WFAttachmentFiles
where ATF_ATTID in (
    select ATT_ID
    from WFDataAttachmets
    join WFElements on ATT_WFDID = WFD_ID
    join WFDocTypes on WFD_DTYPEID = DTYPE_ID
    where DTYPE_DEFID = @defId
)
```
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-09-23-36.png" alt="Difference between the statements for deleting the attachment files." caption="Difference between the statements for deleting the attachment files." %}
In my case SOLR throwed and error and I have no idea why. I needed to grant the WEBCON workflow service account permission to the database manually although it had been created using the setup. 
{% include figure image_path="/assets/images/posts/2025-10-12-Moving-attachment-files/2025-10-12-09-20-04.png" alt="" caption="" %}

Afterwards everything was working as expected.

# Warnings
## It's your risk
You should be aware that any database modifications can severely damage your environment.

You need to verify everything for yourself in your own environment. Especially, if you are using OCR. I don't have this in my environment.

Remember, it would be best if you could recreate the production database on your test environment and test it there. You don’t know how? Of course, there’s a [post]( /posts/2023/copy-a-database) for this. ;)

After recreating the database, you should backup it too. This will save time, if there's an issue with the script.
 
## OneDrive
While it shouldn't make a difference you should also check whether any files are currently made available in OneDrive. While I don't think that it will have an impact, it could have.

## Verify columns
I've tested this using version 2025.2.1.179, if you are running a different version, you should verify that you copy all columns except:
- ATF_ID
- ATF_RowVersion
  
# Script improvements

## Handle database growth with transaction
Depending on the amount and size of your attachment files it will not only take a while but will bloat the log file if you don't modify the scripts. 
It may be necessary to add some transaction /commit commands so that the log file won't grow to the same size as the attachment files which will be transferred. Depending on your hard disk setup this may cause problems otherwise.
The below is an untested suggestion form AI
```sql
DECLARE @defId INT = (SELECT DEF_ID FROM WFDefinitions WHERE DEF_Guid = 'ec4a610b-ca59-4058-9907-53f6b3877c9c');
DECLARE @BatchSize INT = 100;
DECLARE @LastAttatchmenFileId INT = 0;
DECLARE @RowsMoved INT = 1; -- Initialize to enter the loop

WHILE @RowsMoved > 0
BEGIN
    BEGIN TRANSACTION;

    WITH BatchToMove AS (
        SELECT TOP (@BatchSize)
            ATF_WFDID, ATF_ATTID, ATF_Value, ATF_TSInsert, ATF_TSUpdate, 
            ATF_IsDeleted, ATF_Version, ATF_AttachmentImage, ATF_OrginalValueHash, ATF_FileType, 
            ATF_CreatedBy, ATF_UpdatedBy, ATF_FlexiData, ATF_AttributesMapping, ATF_OrginalName, ATF_FRData
        FROM 
            WFAttachmentFiles 
            JOIN WFDataAttachmets ON ATF_ATTID = ATT_ID
            JOIN WFElements ON ATT_WFDID = WFD_ID
            JOIN WFDocTypes ON WFD_DTYPEID = DTYPE_ID
        WHERE 
            DTYPE_DEFID = @defId
            AND ATF_ID > @LastAttatchmenFileId
        ORDER BY ATF_ID
    )
    INSERT INTO [DEV01_BPS_Content_DKR_Att].dbo.WFAttachmentFiles (
        ATF_WFDID, ATF_ATTID, ATF_Value, ATF_TSInsert, ATF_TSUpdate, 
        ATF_IsDeleted, ATF_Version, ATF_AttachmentImage, ATF_OrginalValueHash, ATF_FileType, 
        ATF_CreatedBy, ATF_UpdatedBy, ATF_FlexiData, ATF_AttributesMapping, ATF_OrginalName, ATF_FRData
    )
    SELECT 
        ATF_WFDID, ATF_ATTID, ATF_Value, ATF_TSInsert, ATF_TSUpdate, 
        ATF_IsDeleted, ATF_Version, ATF_AttachmentImage, ATF_OrginalValueHash, ATF_FileType, 
        ATF_CreatedBy, ATF_UpdatedBy, ATF_FlexiData, ATF_AttributesMapping, ATF_OrginalName, ATF_FRData
    FROM BatchToMove;

    SET @RowsMoved = @@ROWCOUNT;

    -- Update the last max ATT_ID for the next batch
    SELECT @LastAttatchmenFileId = MAX(ATF_ID) FROM BatchToMove;

    COMMIT TRANSACTION;
END

-- Update after all batches
UPDATE WFDefinitions
SET DEF_AttachmentsDatabase = 'DEV01_BPS_Content_DKR_Att'
WHERE DEF_ID = @defId;
```

## Working in batches
If you can't execute the migration during offline times, it may be necessary to split the movement into batches. This will require us to check which files have already been copied to the target database and then continue with the missing ones.

If you are doing this, wait with the change of the attachment database until the final batch. 
