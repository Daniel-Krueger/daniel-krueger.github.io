---
regenerate: true
title: "Checklist for copying artifacts to another config database"
categories:
  - WEBCON BPS 
tags:  
  - Installation
  - Governance
excerpt:
    "Creating a checklist to define which artifacts need to be copied from on configuration database to another."
bpsVersion: 2022.1.4.127
---

# Overview
This post will describe my approach to define which information of the configuration database and needs to be transferred to a new environment. Use cases I've encountered where I needed this:
- Starting with WEBCON BPS Express and moving to the full version which allowed to install a test environment.
- Migrating from WEBCON APPS to an own server.
- Recreate a server.


# Use configuration database as a checklist

I've built up my checklist by:
- Create a screenshot of the tables
- Group the related tables
- Mark of the completed elements in the screenshot itself

In the end the checklist consisted of:
1. BPS Groups: Need to be transferred.
2. User profile and favorites: Can be ignored.
3. Registered API applications: Need to be transferred.
4. Devices: Can be ignored
5. Licenses assignments: Need to be transferred since subscription licensing is used.
6. Substitutions: Can be ignored
7. Themes: Need to be transferred


{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-09-19-39-45.png" alt="Creating a checklist from the tables in the configuration database." caption="Creating a checklist from the tables in the configuration database." %}

I have no idea in which regard the Identity* tables are used.


{: .notice--info}
**Info:** There's a database documentation which contains sometimes helpful information: [Database documentation](https://developer.webcon.com/2023/resources/db/index.html).

# Options to transfer artifacts

There are basically three options to transfer an artifact.
1. Manual via the BPS Portal or Designer Studio interface.
2. Using the REST API.
3. Using SQL statements to directly write to the database.

The first option is only an option if
- there are either only a few elements to create and it's unlikely to make errors during this
- or there's some encrypted information which cannot be decrypted by the target environment.

If you use this, you could still compare the table in the source and target environment, whether there are any obvious differences.

Besides the manual creation, the REST API is the only supported one, but not everything can be transferred using it.

Therefore I have to admit, that I also used the SQL option. Sometimes it is just easier or the only viable option and I determined that the risks could be neglected, but this was my decision and yours may be different.

# Transfer BPS Groups
## REST API
These are the available REST API methods related to managing BPS groups, owners and members.
{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-09-19-53-26.png" alt="BPS Group REST API" caption="BPS Group REST API" %}

I don't have a solution I can share in regard to the REST API, but this is an example of a call from PowerShell. 
```powershell

 $groupId = 'xyz@bps.local'
 $displayName = 'X Y Z'
 $members = "{'bpsId':'user@domain.eu'},
 {'bpsId':'S-1-5-21-0000000000-0000000000'}"
 
 
$groupBody = 
@"
{
    "bpsId": "$groupId",
    "name": "$displayName",
    "email":"$groupId",
    "members": [
        $members
    ]
  }
"@


$resultAddGroup = Invoke-RestMethod `
-Method Post `
-Uri "$($global:WEBCONConfig.Hostname)/api/data/$($global:WEBCONConfig.ApiVersion)/admin/groups" `
-ContentType "application/json" `
-Headers @{"accept" = "application/json"; "Authorization" = "Bearer $accessToken" } `
-Body $groupBody 

```

{: .notice--info}
**Info:** The bpsId with the `S-1-5-21-0...` is the security identifier of an active directory group.


## SQL statements
This one requires that there's a copy of the configuration database from where the data should be copied. In my case the source database is called `BPS_Config_Temp` and the target database `BPS_Config`.

{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-10-21-37-41.png" alt="BPS_Config_Temp is a copy of the source environment." caption="BPS_Config_Temp is a copy of the source environment." %}

Luckily, the table for the BSP users and relationships  use the bps ids of the groups and users directly, so we can simply copy them.

The first statement only copies the BPS groups. If you have other BPS users you want to copy you need to change the where condition.

{: .notice--warning}
**Remark:** I did not test the statement for the BPSGroupOwners.


```sql
insert into BPS_Config.dbo.BpsUsers 
(
  [BUS_AccountType]
  , [BUS_BpsID]
  , [BUS_Email]
  , [BUS_DisplayName]    
)
select 
  [BUS_AccountType]
  , [BUS_BpsID]
  , [BUS_Email]
  , [BUS_DisplayName]    
from BPS_Config_Temp.dbo.BpsUsers
where [BUS_AccountType] = 2


insert into BPS_Config.dbo.BpsGroupsOwners 
(
  [BGO_UserBpsID]
  , [BGO_GroupBpsID]    
)
select 
  [BGO_UserBpsID]
  , [BGO_GroupBpsID]
from BPS_Config_Temp.dbo.BpsGroupsOwners

insert into BPS_Config.dbo.BpsUsersGroupRelations 
(
  [BUSGR_UserBpsID]
  , [BUSGR_GroupBpsID]
)
select 
  [BUSGR_UserBpsID]
  , [BUSGR_GroupBpsID]   
from BPS_Config_TEMP.dbo.BpsUsersGroupRelations 
```

After executing the statement you should trigger a [full user synchronization](https://docs.webcon.com/docs/2023R3/Studio/SystemSettings/GlobalParams/UserSynch/) from the Designer Studio.

# Transfer user profile and favorites
In my case it was not necessary to transfer these. If you are going to recreate a production environment this may be different.
If you need to do it SQL statements seem to be the only available option in case of large numbers of elements.

# Transfer registered API applications
I recreated the existing ones manually. I have no idea, whether the secret could be transferred. But I used the tables to check, whether I setup the scopes/grants correctly.

# Transfer devices
In my case it was not necessary to transfer these. If you are going to recreate a production environment this may be different.
I have no idea whether SQL statements would work.

# Transfer licenses assignments
## Per application vs per user license
If you have the old perpetual license, you can ignore these table. If you are using the subscription model you may have a challenge ahead, at least if you use `per application` licensing. 
{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-09-20-30-06.png" alt="License per app or per user." caption="License per app or per user." %}

While the license are called `per application` and `per user` here, you will find additional information in the [documentation](https://docs.webcon.com/docs/2023R3/Studio/Licence/#subscription-licenses) when you search for the following:
- Unlimited-Solutions Access License (User license)  \
  The user may access all processes and applications built in WEBCON BPS without any limitations on the number of processes or applications.
- Single-Solution Access License (Application license) \
  Each of these licenses assigned to a user enables them to use exactly one process built in WEBCON BPS. This process must be designated by the administrator in the settings and may contain a maximum of two workflows.

A process can be enabled to be used for a  `Single-Solution Access License` by activating the  `Process license` option.

{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-09-20-37-14.png" alt="Application license = Single-Soluation AUcess License = Process license " caption="Application license = Single-Soluation AUcess License = Process license " %}


The mentioned challenge is that the application licenses are assigned to a process in  a content database by using their integer id. If your content database ids differ for some reason or the process ids don't align in the source and target database you may need a mapping between those. If you  [copy the content database](/posts/2023/copy-a-database), you can skip at least the mapping of the process ids.

## REST API
We have REST API endpoint to read the licenses from the source environment and write them to the target environment. 

I haven't used it so I can't provide any information for this.
{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-09-20-17-16.png" alt="License REST API." caption="License REST API." %}

## SQL
I'm assuming that you have read the [SQL statements](#sql-statements) part of [Transfer bps groups](#transfer-bps-groups) and have a copy of the source configuration database.

If you are not using application license this little statement is all you need. It will insert all the licenses except for
- local user accounts 
- registered applications

Depending on your case you may want to change the statement.
``` sql
  /* delete from  [BPS_Config].[dbo].[UsersCals]*/
  INSERT INTO [BPS_Config].[dbo].[UsersCals] (
      [UCL_BpsID],
      [UCL_LicenseType],
      [UCL_Guid],
      [UCL_AllowDesignerDeskProjectCreation],
      [UCL_AllowDesignerDeskProjectPublishing]
  )
  SELECT
      [UCL_BpsID],
      [UCL_LicenseType],
      [UCL_Guid],
      [UCL_AllowDesignerDeskProjectCreation],
      [UCL_AllowDesignerDeskProjectPublishing]
  FROM [BPS_Config_TEMP].[dbo].[UsersCals]
  where
    -- exclude local accounts
    [UCL_BpsID] not like '%\%' 
    -- exclude API applications
    and UCL_BpsID not in ( select RAP_AppLogin from [BPS_Config_TEMP].dbo.RegisteredApps)

```

In case you have single-solution licenses you need the afore mentioned mapping for the content database id and process id. The below statement is an example of how to map the values from the source configuration database to those of the target environment.

In my case the content database id 1 of the source environment is the `BPS_Content` database. This `BPS_Content` database has the name `TEST_BPS_Content` on the target environment and has a different id. So, I have a mapping that the CDID = 1 should  be mapped to the CD_ID of the ContentDatabase table, where CD_Name is `TEST_BPS_Content`.
I use a similar approach to map the processes. While we don't have a fixed name for a process we will make use of the GUID. After all this is the same across all environments.

``` sql
  INSERT INTO [BPS_Config].[dbo].SingleSolutionCals(
      SSC_UCLID,
      SSC_CDID,
      SSC_ProcessId
  )
  select targetUsers.UCL_ID
    , case 
      when SingleSolutionCals.SSC_CDID = 1 then 
        (select CD_ID from BPS_Config.dbo.ContentDatabases where CD_Name = 'TEST_BPS_Content') 
      else  'CD ID  not mapped'
    end as ContentDBId
    --, SingleSolutionCals.SSC_CDID
    , case 
      when SingleSolutionCals.SSC_CDID = 1 then 
        case				
          when SingleSolutionCals.SSC_ProcessID = 27 then 
            (select DEF_ID from [TEST_BPS_Content].dbo.WFDefinitions where DEF_GUID = '774de502-56b6-4f80-99ca-4a2796b9d5e1')
          when SingleSolutionCals.SSC_ProcessID = 30 then 
            (select DEF_ID from [TEST_BPS_Content].dbo.WFDefinitions where DEF_GUID = '490d2e50-a2ca-4c48-88b4-36bb09dc4ce9')
          when SingleSolutionCals.SSC_ProcessID = 39 then 
            (select DEF_ID from [TEST_BPS_Content].dbo.WFDefinitions where DEF_GUID = '0488c8c5-8b4c-433d-b51a-47d9ef755d59')
          when SingleSolutionCals.SSC_ProcessID = 49 then 
            (select DEF_ID from [TEST_BPS_Content].dbo.WFDefinitions where DEF_GUID = '403be215-6d4f-4bbf-adbd-d81f43167399')
          when SingleSolutionCals.SSC_ProcessID = 64 then 
            (select DEF_ID from [TEST_BPS_Content].dbo.WFDefinitions where DEF_GUID = 'faa078fb-9659-46ec-95f7-288901a0b49a')
          when SingleSolutionCals.SSC_ProcessID = 65 then 
            (select DEF_ID from [TEST_BPS_Content].dbo.WFDefinitions where DEF_GUID = 'be7152ad-2dc5-4759-907e-e8b34e3e644c')
          when SingleSolutionCals.SSC_ProcessID = 74 then 
            (select DEF_ID from [TEST_BPS_Content].dbo.WFDefinitions where DEF_GUID = '5c9a735f-a954-446c-b15e-2d92cd08d974')
          else  'CD ID  and Process id mapping not defined'	
        end 	
      else  'CD ID  not mapped for processes' 
    end as ProcesId
    --, SingleSolutionCals.SSC_ProcessID
  from 
    BPS_Config.dbo.UsersCals targetUsers join BPS_Config_TEMP.dbo.UsersCals sourceUsers on
      targetUsers.UCL_BpsID = sourceUsers.UCL_BpsID
    join  BPS_Config_TEMP.dbo.SingleSolutionCals  on
SingleSolutionCals.SSC_UCLID = sourceUsers.UCL_ID

```


While I created the mapping for the CDID manually, I was too lazy to do so for the process id mapping. I created those using the below SQL statement on the source environment for the content database.


```sql
  -- Get when statement for the singlesolutions cals
  
  select  
  '				when SingleSolutionCals.SSC_ProcessID = '+cast(DEF_ID as varchar(10))+' then '+Char(13)+
  '					(select DEF_ID from ['+targetContentDatabaseName+'].dbo.WFDefinitions where DEF_GUID = '''+DEF_GUID+''')'
  as whenStatement
  from 
  (
    SELECT distinct
        'TEST_BPS_Content' as targetContentDatabaseName
        , [SSC_ProcessID]
        , DEF_ID
      , DEF_Guid
    FROM [BPS_Config].[dbo].[SingleSolutionCals] join	[BPS_Content].dbo.WFDefinitions on
    SSC_ProcessID = DEF_ID
    where SSC_CDID = 1
) processesWithSingleSolutionCals   
```

{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-09-21-01-40.png" alt="Generating the process mapping for one database." caption="Generating the process mapping for one database." %}

# Transfer substitutions
In my case I decided against transferring substitutions. I reinstalled a test environment and copied to the settings from a production environment. So, I don't need the substitutions.

While this was the decision I made for my case, it may be different the next time. 

The official way to transfer the substitutions would be to use the REST API.
{% include figure image_path="/assets/images/posts/2024-06-10-checklist-for-copying-artifacts-to-another-config-database/2024-06-10-21-05-54.png" alt="Substitution REST API" caption="Substitution REST API" %}

# Transfer themes
There are only a few themes at most which need to be transferred, using the BPS Portal interface is sufficient for this.
This is the documentation on how to create themes and at the end of the post the export/import options are described: \
[Color themes](https://community.webcon.com/posts/post/color-themes/321/4)