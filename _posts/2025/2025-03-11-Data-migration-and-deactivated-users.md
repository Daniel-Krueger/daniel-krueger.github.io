---
title: "Data migration and deactivated users"
categories:
  - WEBCON BPS
  - COSMO CONSULT
tags:
 - Best practices
excerpt:
    "Three options to handle removed and/or deactivated users when migrating data to WEBCON BPS."
bpsVersion: 2025.1.1.44
---

# Situation
You have finished the first version of an application. For example, one which handles claims or incidents. The old system needs to be shut down and you need to migrate the data. One typical issue here is that it's very likely that persons left the company over the time. Even if the claims/ incidents are completed, you can't simply populate a person field in WEBCON BPS with a non-existing value. Therefore, the question is what options we have to deal with this.


{: .notice--info}
**Info:** All options here assume, that you either know the user principle name of the user or can freely create another value which can be used for the [BpsId](https://docs.webcon.com/docs/2025R1/Studio/SystemSettings/GlobalParams/SystemSettings_BpsUsersAndGroups#import-form-template).


# Mapping users to other accounts
The first option is to create a mapping of old users to active user accounts.
I would choose this option for all migration data which:
-	will create a running workflow instance,
-	the users may receive a task 

In addition, I would add a comment like:

> The workflow was originally reported by John Doe who left the company. During the migration he was replaced by Mary Dow.

For the other cases, where the workflow is just created to store the information, you could take a look at the next two options.

# User is deleted
If the user has been deleted from the Active Directory / does no longer exist in the [CacheOrganizationStructure](https://developer.webcon.com/2025/resources/db/?PageSpeed=off#CacheOrganizationStructure), we can create an `External User` with the old UPN.

![Creating an `External user` for deleted users.](/assets/images/posts/2025-03-11-Data-migration-and-deactivated-users/2025-02-02-21-42-08.png)

You can also do this from the [Designer Studio](https://docs.webcon.com/docs/2025R1/Studio/SystemSettings/GlobalParams/SystemSettings_BpsUsersAndGroups) and with an Excel file for bulk inserting users.

After the migration has been executed, you can remove the users again.

# User is deactivated
The above will only work for users, who are deleted / no longer synchronized. If the user is only deactivated, it will still exist in the CacheOrganizationStructure table. This will prevent the creation of the `External user` because the user or better the BpsId already exist in the table. At the same time, you can't select the user for field because it's deactivated. How can we deal with this?

The easiest way, but not necessarily the supported one, would be the following:
- Decide on a time frame when the migration should be executed<br/>
- Disable the user synchronization.<br/>
- Set the `COS_IsActive` value to 1.<br/>
- Execute the migration.<br/>
- Enable the user synchronization and execute it.<br/>

This approach will make the user available until the next synchronization is executed.

{: .notice--warning}
**Remark:** If you are thinking of using this approach, make sure to verify it in the test system first. If you have only a single system, you have a test system in which you are entering production data. ;)

