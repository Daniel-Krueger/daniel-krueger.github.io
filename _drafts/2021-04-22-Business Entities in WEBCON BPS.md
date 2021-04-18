---
title: "Companies/Subsidiaries (Business Entities) in WEBCON BPS"
categories:
  - Private
  - WEBCON BPS  
tags:
  - Business Entity
  - Privileges
  - Data sources
excerpt:
    How the same workflow can be used by multiple Companies/Subsidiaries (Business Entities) in WEBCON BPS.
bpsVersion: 2021.1.2.101
---

# Overview

I started my career with Navision where I first encountered the concept that multiple companies / subsidiaries can share the logic of an ERP system but store their data separately. This is a good way to enforce that the different entities of a parent company use the predefined processes without implementing the logic multiple times. The same concept could be applied to SharePoint where the "companies" are site collections which business logic is represented by the used features. When I learned about WEBCON BPS I was really surprised to see the same concept applied to a process platform. 

While Navision used the term `Company` in WEBCON BPS it is `Business Entity`. There are three areas in the platform where you can make use of a Business Entity

1.  Data separation
2.  Defining privileges
3.  Different data sources

While the first two are similar two Navision or Business Central (BC) which is it's current name, the last one is one of my favourite WEBCON BPS features.

Since this Blog is about WEBCON BPS I will use the term `Business Entity` instead of companies, which is more appropriate anyway. I have seen cases where an own 'company' has been created for the HR department out of security reasons.

# Data separation
In most cases Business Entities shouldn't have access to the data of other Business entities. In some cases their may even be legal reasons for this. Therefore there must be an option to identify which record in the database is associated to which Business entity. When Microsoft introduced the SQL Server database for Navision it was decided to create own tables for each business entity and prefix the table with the business entity name.
![The highlighted part is the company(Business Entity) name in Navision](/assets/images/posts/2021-04-01-path-button-styling/2021-04-15-23-04-32.png)

As mentioned before you could represent a business entity in SharePoint by creating an own Site Collection for it. In the database the data could be separated by a column value instead of an own table, as it was down with Navision. There's a site collection table which key is reused in other tables.
The same approach is used in WEBCON BPS. The business entities are stored in the table `Companies` which key is used in table `WFElements` to separate the data.
![The id of a company is stored in an own column WFD_COMID for each created workflow instance.](/assets/images/posts/2021-04-01-path-button-styling/2021-04-15-23-13-30.png)

{: .notice--info}
**Info:** WEBCON BPS is more than ten years old, so there have been different name changes in the UI which couldn't be reflected in the backend. Therefore `Business entity` in the UI is in the database still a `Company`.

{: .notice--info}
**Remark:** All of the described approaches are fine, while the best one is another option in SharePoint. You can create an own database for each site collection, so the data is not only separated by a column value or table inside the same database file but are different database files all together.

# Privileges
## General
In all cases I know - Navision, SharePoint and WEBCON BPS - privileges are represented by a record in a table of a database. Since the data of each Business Entity is already separated it's kind of obvious that own privileges can be defined per Business Entity. The knowledge base entry [WEBCON BPS Designer Studio privileges
](https://community.webcon.com/posts/post/webcon-bps-designer-studio-privileges/44) already describes which privileges exists. There are only two additions to make:
1. If there's more than one Business Entity you can define different privileges on process level
   
 ![Business Entities can have different privileges on process level.](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-22-53-46.png)
2. In addition to the process level, privileges can be defined on form type level, too. This comes in handy, if you have an absence workflow, which handles vacation and sick leave requests. Granting someone read access to all workflows with form type Vacation won't allow the same person to see the ones of type sick leave.
   
![Defining privileges on Form Type level.](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-22-54-40.png)
## Starting workflows
The privilege to start a workflow is defined on process or form type level. There the `Launch new workflow instances` can be granted for all business entities (1) or selected ones (2,3). In this case Tiffany can start workflows for any business entity while Sophia and Georg can start workflows for 'Cosmo Consult LS' as well as 'Cronus'.

![1,2 and 3 show different user privileges based on a business entity](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-22-56-15.png)

Besides the privileges we need `Start buttons`. There is one defined for each entity, with a fixed business entity (1) as well as one other without a fixed value (2).

![Shows the configuration of the existing start buttons.](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-22-58-44.png)

The `Start buttons` are than displayed in BPS Portal based on the defined privileges. Tiffany sees all, while Sophia and Georg see the same ones, as they have the same permissions for both business entities.
![Each user uses a different theme.](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-22-32-39.png)

If a buttons with a specified business entity is used, the query parameter `COM_ID` is added to the URL which populates the business entity field. If this exists, the field is no longer editable.
![Business entity is populated based on the provided parameter `COM_ID`](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-22-35-16.png)

If no business entity is defined on the `Start button` than the field is editable (1) while one is selected as a default value.
![Business entity can be selected from the allowed ones and one is selected as a default one.](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-23-01-53.png)

The default one is either, the business entity with the lowest Id in the system or the one, which has been defined as default for the current user. The default business entity can be defined in `System Settings\Business entities\ Tab permissions`. In this case Sophia default entity is CRONUS while the one for Georg is COSMO CONSULT LS.

![Definition for whom a specific business entity is the default one.](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-22-47-23.png)



{: .notice--info}
**Info:** As expected from WEBCON BPS, fiddling with the `COM_ID` parameter won't get you anywhere. If you don't have the privileges you get an error.
![Playing with the business entities won't gain you access to those you don't have access to.](/assets/images/posts/2021-04-22-Business%20Entities%20in%20WEBCON%20BPS/2021-04-18-23-04-41.png)

{: .notice--info}
**Info:** Ones the workflow has been saved, a business entity can no longer be changed.

{: .notice--info}
**Info:** There's also a field `Business entity is additional for`. According to the documentation it only applies to SharePoint installations.

# Different data sources


{: .notice--warning}
**Remark:** There's one major draw back if attribute selectors are used. The selector matches *each* character. If one of the values contains an additional white space it won't be matched. 
