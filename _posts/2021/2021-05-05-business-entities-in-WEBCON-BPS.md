---
title: "Business Entities (Companies/Subsidiaries) in WEBCON BPS"
categories:
  - Private
  - WEBCON BPS  
tags:
  - Business Entity
  - Privileges
  - Data sources
excerpt:
    How the same workflow can be used by multiple Business Entities (Companies/Subsidiaries) in WEBCON BPS.
bpsVersion: 2021.1.2.101
---


# Overview

I started my career with Navision where I first encountered the concept that multiple companies / subsidiaries can share the logic of an ERP system but store their data separately. This is a good way to enforce that the different entities of a parent company use the predefined processes without implementing the logic multiple times. The same concept could be applied to SharePoint where the "companies" are site collections which business logic is represented by the used features. When I learned about WEBCON BPS I was really surprised to see the same concept applied to a process platform. 

While Navision used the term `Company` in WEBCON BPS it is `Business Entity`. There are three areas in the platform where you can make use of a Business Entity:

1.  Data separation
2.  Defining privileges
3.  One data definition but different data sources

The first two are similar two Navision, the last one though is one of my favourite WEBCON BPS features.

Since this Blog is about WEBCON BPS I will use the term `Business Entity` instead of companies, which is more appropriate anyway. I have seen cases where an own 'company' has been created for the HR department out of security reasons.

{: .notice--info}
**Info:** Navision has been rebranded a lot of times during the years. It's current name is Business Central (BC).

# Data separation
In most cases Business Entities shouldn't have access to the data of other Business entities. Their may even be legal reasons for this. Therefore, there must be an option to identify which record in the database is associated to which Business entity. When Microsoft introduced the SQL Server database for Navision it was decided to create own tables for each business entity and prefix the table with the business entity name.
{% include figure image_path="/assets/images/posts/2021-04-01-path-button-styling/2021-04-15-23-04-32.png" alt="The highlighted part is the Business Entity (Company) name in Navision" caption="The highlighted part is the Business Entity (Company) name in Navision" %}

As mentioned, you could represent a business entity in SharePoint by creating an own Site Collection for it. In the database the data is  separated by a column value instead of an own table, as it was down with Navision. There's a site collection table which key is reused in other tables.
The same approach is used in WEBCON BPS. The business entities are stored in the table `Companies` which key is used in table `WFElements` to separate the data.
{% include figure image_path="/assets/images/posts/2021-04-01-path-button-styling/2021-04-15-23-13-30.png" alt="The id of a company is stored in an own column WFD_COMID for each created workflow instance." caption="The id of a company is stored in an own column WFD_COMID for each created workflow instance." %}

{: .notice--info}
**Info:** WEBCON BPS is more than ten years old, so there have been different name changes in the UI which couldn't be reflected in the backend. Therefore, `Business entity` in the UI is in the database still a `Company`.

{: .notice--info}
**Remark:** All of the described approaches are fine, while the best one is another option in SharePoint. You can create an own database for each site collection, so the data is not only separated by a column value or table inside the same database file but are different database files all together.

# Privileges
## General
In all cases I know - Navision, SharePoint and WEBCON BPS - privileges are represented by a record in a table of a database. Since the data of each Business Entity is already separated it's kind of obvious that own privileges can be defined per Business Entity. The knowledge base entry [WEBCON BPS Designer Studio privileges
](https://community.webcon.com/posts/post/webcon-bps-designer-studio-privileges/44) already describes which privileges exists. There are only two additions to make:
1. If there's more than one Business Entity you can define different privileges on process level
   
    {% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-22-53-46.png" alt="Business Entities can have different privileges on process level." caption="Business Entities can have different privileges on process level." %}

2. In addition to the process level, privileges can be defined on form type level, too. This comes in handy, if you have an absence workflow, which handles vacation and sick leave requests. Granting someone access to read all vacation won't allow him to see the sick leave workflows.
   
{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-22-54-40.png" alt="Defining privileges on Form Type level." caption="Defining privileges on Form Type level." %}
## Starting workflows
The privilege to start a workflow is defined on process or form type level. There the `Launch new workflow instances` can be granted for all business entities (1) or selected ones (2, 3). In this case Tiffany can start workflows for any business entity while Sophia and Georg can start workflows for 'Cosmo Consult LS' as well as 'Cronus'.

{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-22-56-15.png" alt="1, 2 and 3 show different user privileges based on a business entity" caption="1, 2 and 3 show different user privileges based on a business entity" %}

In addition to the privileges we need `Start buttons`. There is one defined for each entity (1) as well as one other without a fixed value (2).

{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-22-58-44.png" alt="Shows the configuration of the existing start buttons." caption="Shows the configuration of the existing start buttons." %}

The `Start buttons` are than displayed in BPS Portal based on the defined privileges. Tiffany sees all, while Sophia and Georg see the same ones, as they have the same permissions for both business entities.
{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-22-32-39.png" alt="Each user uses a different theme." caption="Each user uses a different theme." %}

If a start button with a specified business entity is used, the query parameter `COM_ID` is added to the URL which populates the business entity field. If this exists, the field is no longer editable.
{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-22-35-16.png" alt="Business entity is populated based on the provided parameter `COM_ID`." caption="Business entity is populated based on the provided parameter `COM_ID`." %}

If no business entity is defined on the `Start button` than the field is editable (1) while one is selected as a default value.
{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-23-01-53.png" alt="Business entity can be selected from the allowed ones and one is selected as a default one." caption="Business entity can be selected from the allowed ones and one is selected as a default one." %}

The default one is either, the business entity with the lowest Id in the system or the one, which has been defined as default for the current user. The default business entity can be defined in `System Settings\Business entities\ Tab permissions`. In this case Sophia's default entity is CRONUS while the one for Georg is COSMO CONSULT LS.

{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-18-22-47-23.png" alt="Definition for whom a specific business entity is the default one." caption="Definition for whom a specific business entity is the default one." %}

{: .notice--info}
**Info:** As expected from WEBCON BPS, fiddling with the `COM_ID` parameter won't get you anywhere. If you don't have the privileges you will get an error.
![Playing with the business entities won't gain you access to those you don't have access to.`](/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-19-22-37-07.png)

{: .notice--info}
**Info:** Once the workflow has been saved, a business entity can no longer be changed.

{: .notice--info}
**Info:** There's also a field `Business entity is additional for`. According to the documentation it only applies to SharePoint installations.
![Configuration option `Business entity is additional for`](/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-19-21-04-05.png)

# Different data sources
If you implement process, you have quite often the situation, that you need to retrieve data from some other system. For example, you may have an contract approval process. In most cases an ERP system will be the primary source of customer information, but the contract approval process itself is not suited for implementing it in the ERP system itself. Therefore, it's better to create the process in an other platform and retrieve the customer information from the ERP system.

In WEBCON BPS this is done, by creating a choice field (1). This choice field has a data source (2) and a configuration (3) which information from the data source should be displayed. In addition, you can define which additional values of a selected customer should be copied to other fields.


{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-19-21-22-04.png" alt="Configuration of a choice field which copies No. and Contract to other fields." caption="Configuration of a choice field which copies No. and Contract to other fields." %}


{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-19-21-27-56.png" alt="Once a customer is selected (1) the values are copied (2)." caption="Once a customer is selected (1) the values are copied (2)." %}

The field uses a predefined data source, which can be reused in **all** processes. There's only a single point of failure. In this case it is a MSSQL database data source (1), which selects some fields from the `Customer` table of the `CRONUS` business entity (2). The query itself doesn't contain any information about the database or credentials which should be used. These are defined in another place (3). This allows us to specify the connection ones and reuse it in multiple data source definitions. 
{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-19-21-14-36.png" alt="" caption="" %}

{: .notice--info}
**Info:** If the connection details for the data source differ for Dev, Test and Prod environment you can define these in the appropriate tabs. The environment itself takes care of selecting the correct ones.

I like how this has been implemented. You have only a single point of failure. If there's a change in the external system, you have only one place which needs to be modified on your side. But this is still not the reason why it's one of my favourite features of WEBCON BPS. 


The reason for this is the greyed out field `Business entity` in the screenshot above. `Customer_Default` defines the common data source. The fields (1) make up a contract which need to be returned by  specialized data sources. This can be something simple. For example, customer data from Navision/BC should be retrieved by accessing the respective table (2) in the database. But it can be even a completely different kind of data source. For example, two business entities may run Navision on premise while another one uses the cloud version where the data needs to be retrieved via REST instead (3).

{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-19-22-04-03.png" alt="One default data source definition whit three specialized ones for the respective business entities. They all return the same fields." caption="One default data source definition whit three specialized ones for the respective business entities. They all return the same fields." %}

{% include figure image_path="/assets/images/posts/2021-04-22-business-entities-in-WEBCON-BPS/2021-04-19-22-21-32.png" alt="Depending on the selected business entity, different customers are available." caption="Depending on the selected business entity, different customers are available." %}


{: .notice--info}
**Info:** The screenshots show the configuration of different data source per business entity. Of course you can easily change the data source definition for a business entity when a source moves to the cloud, too.

WEBCON BPS already implements the data source types MS SQL, Oracle, SOAP, REST and SharePoint lists. If this is not sufficient you can even write your own plugin. For example, you could create one to access the Navision native database. :)

Due to this feature, it takes only minutes to reflect changes in the underlying system which are applied to **all** processes:
- The server hosting the database was changed
- The company in the external system has been renamed
- You started small with a SharePoint list but it's no longer sufficient
- You are in the transition from on ERP system to another
- You are planning to move to the cloud where you have no longer access the database directly
- In case a new business entity should use a process, only the specialized data sources need to be created

