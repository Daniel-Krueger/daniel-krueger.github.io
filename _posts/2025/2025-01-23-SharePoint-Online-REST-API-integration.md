---
title: "SharePoint Online REST API integration"
categories:
  - WEBCON BPS
  - Private 
tags:
 - Data sources
 - REST
excerpt:
    "Setup an App Registration and accessing SharePoint REST API"
bpsVersion: 2025.1.1.44
---

# Overview

{: .notice--info}
**Info:** My SharePoint days are long gone and there may be other / better ways, but this was working for me in a development environment (January 2025).

This is a documentation of the necessary steps to create an App registration in Microsoft Entra ID which can then be used to access the SharePoint REST API. I'm documenting it because I've wasted way more time with this than expected. The reasons for this are:
- Missing knowledge on my side
- Outdated information due to changes
- Incomplete answers

In addition, I’m providing an example how we can get the access token ourselves.

{: .notice--info}
**Info:** I copied values from WEBCON BPS in which variables are used. I replaced them with {VariableName}. You will need to replace the whole value, including the {} with the actual WEBCON BPS variable.

{: .notice--info}
**Info:** Update 2025-01-26: I added a post about the new REST custom authentication SDK type: [SharePoint Online certificate authentication ](/posts/2025/sharepoint-certificat-authentication-sdk)

# Registering the application
## Authentication via certificate

If you are able to authorize your REST request with client id and a certificate, everything will be easy. 
You can simply use the PNP PowerShell and follow the [guide](https://pnp.github.io/powershell/articles/registerapplication.html).

Install and prepare PNP PowerShell in VS Code. The latest version does not work in PS ISE. In replaced the variables in the below code with values to make it easier to understand.
````ps
Install-Module PnP.PowerShell -Scope CurrentUser
import-module PNP.Powershell     
# This will create an application used for the user authentication if 'Interactive' is used.
# It will output the GUID of the application which will be needed later.
# 01234567-89AB-CDEF-0123-456789ABCDEF
Register-PnPEntraIDAppForInteractiveLogin -ApplicationName "PnP PowerShell" -Tenant domain.onmicrosoft.com -Interactive
````

Create the application

````ps
# https://pnp.github.io/powershell/cmdlets/Register-PnPAzureADApp.html
[SecureString]$CertificatePassword = Read-Host -Prompt "Certificate password" -AsSecureString
Connect-PnPOnline -Url "https://domain.sharepoint.com/sites/site1" -Interactive -ClientId "1234567-89AB-CDEF-0123-456789ABCDEF"

$app = Register-PnPAzureADApp -ApplicationName "WEBCON to SharePoint" -Tenant "00000000-1111-2222-3333-444444444444" -CertificatePassword $CertificatePassword -SharePointApplicationPermissions "Sites.Selected" -GraphApplicationPermissions "Sites.Selected" -Interactive
# Get the client id of the new registered app 55555555-6666-7777-8888-999999999999
$app.'AzureAppId/ClientId'

# https://pnp.github.io/powershell/cmdlets/Grant-PnPAzureADAppSitePermission.html
Grant-PnPAzureADAppSitePermission -AppId "55555555-6666-7777-8888-999999999999" -DisplayName "WEBCON to SharePoint" -Site "https://domain.onmicrosoft.com/sites/site" -Permissions Write
Disconnect-PnPOnline

````

{: .notice--info}
**Info:** This is not supported by WEBCON BPS 2025 with the standard data source connection options. There's are new [SDK type](https://community.webcon.com/community/public/uploads/editor/SDK_Migration_2025_1.pdf) `CustomAuthentication` and I’m playing around with it. 


## Authentication via client secret
At the time of this writing Microsoft disabled this option by default and it will be retired:

> Starting April 2, 2026, Azure Access Control service (ACS) usage will be retired for SharePoint in Microsoft 365 and users will no longer be able to create or use Azure ACS principals to access SharePoint. Learn more about the Access Control retirement

That being said, I still needed this approach, and it should be valid for the next 13 months.

The first steps are the ones I expected:
- Create the App registration in Microsoft Entra Id<br/>
- Define a secret<br/>
- Grant API Permissions and admin consent<br/>
  ![API Application permissions ](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-16-22-40-49.png)
- Grant permissions in SharePoint<br/>
  Open `https://domain.sharepoint.com/sites/site/_layouts/15/AppInv.aspx`, provide the ClientId and the `Permission Request XML`
  ```xml
  <AppPermissionRequests AllowAppOnlyPolicy="true">
    <AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="FullControl" />
  </AppPermissionRequests> 
  ```

Afterwards I wanted to test it, and this was the time when I went down into a rabbit hole.

When I used this app for accessing a SharePoint REST API I got the response `Token type is not allowed`. 
If you are looking for an answer you will soon find this [answer](https://learn.microsoft.com/en-us/answers/questions/714147/token-type-is-not-allowed-error-on-sharepoint-rest) which tells you to enable the custom app authentication again using PowerShell.

````ps
Install-Module -Name Microsoft.Online.SharePoint.PowerShell  
$adminUPN="<the full email address of a SharePoint administrator account, example: jdoe@contosotoycompany.onmicrosoft.com>"  
$orgName="<name of your Office 365 organization, example: contosotoycompany>"  
$userCredential = Get-Credential -UserName $adminUPN -Message "Type the password."  
Connect-SPOService -Url https://$orgName-admin.sharepoint.com -Credential $userCredential  
set-spotenant -DisableCustomAppAuthentication $false  
```` 

After installing the module and executing it I got the error `Microsoft.Online.SharePoint.TenantAdministration.SyntexFeatureScopeValue can not be found in assebmly...`.<br/>
I won't go into details what I tried but to make a long story short:<br/>
VS Code / PowerShell 7 does not support Microsoft.Online.SharePoint.PowerShell. You need to execute this in the PowerShell ISE. Then it is working as expected.


# Getting an access token for REST actions

{: .notice--info}
**Info:** This is an example how you can get an access token if the combination of `OAuth2 App -> API` and `REST Web Service` does not work for you. It won't help, if you want to use data source but it can be used to execute [Invoke REST Web service actions](https://docs.webcon.com/docs/2025R1/Studio/Action/Integration/Action_RESTWebServiceInvoke)


If you are working with SharePoint Online you will probably use the REST actions in multiple processes. Therefore, I suggest the following:
- Create a global automation with input and output parameters
- Make use of the automation in the processes

## Global automation
I've created this global automation with the following parameters:
- Input
  - TenantId (GUID)
  - ClientId (GUID)
  - ClientSecret 
  - SharePointHostname (domain.sharepoint.com)
- Output
  - Access token

![Global automation and the parameters](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-32-01.png)  

You will need at least the `Get SharePoint access token` action, which is of type `Invoke REST Web service`:
- Authentication<br/>
  The authentication is set to anonymous, after all we want to retrieve an access token
  ![Get access token: Authentication](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-43-16.png)
- Request data<br/>
  Set the URL to `https://accounts.accesscontrol.windows.net/{TenantId}/tokens/oAuth/2` and the `HTTP method` to `POST`
  ![Get access token: Request data](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-43-08.png)
- Request body<br/>
  Is of type `Form - urlencoded` with the following values
  ```
  grant_type    client_credentials
  client_id     {ClientId}@{TenantId}
  client_secret {ClientSecret}
  resource      00000003-0000-0ff1-ce00-000000000000/{SharePointHostname}@{TenantId}
  ```
  ![Get access token: Request body](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-42-47.png)
- Response<br/>
  You can use the below json to populate the response. Afterwards assign the `access_token` to the output parameter
  ```json
  {
    "access_token": "",
    "expires_in": "86399",
    "expires_on": "1737144421",
    "not_before": "1737057721",
    "resource": "00000003-0000-0ff1-ce00-000000000000/xyz.sharepoint.com@00000000-1111-2222-3333-444444444444",
    "token_type": "Bearer"
  }
  ```
  ![Get access token: Response](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-42-28.png)

## Using the global automation
It's probably self-explaining how the global automation would be used in a process.
In my case:
-  I'm retrieving the information from a dictionary<br/>
-  store them in local parameters<br/>
-  pass them to the global automation<br/>
![Using the global automation in a process](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-47-02.png)

What may be more interesting is how the access token is used in the `Invoke REST Web service` action. I will provide an example which uploads a document to a SharePoint document library.

- Authentication<br/>
  The authentication is set to anonymous!<br/>
  I've grown used to use `Base service instance URL` for the complete request URL because of [this](https://community.webcon.com/forum/thread/5645).<br/>
  For some reason business rules and parameters are not encoded in this field but in the `URL/REST request suffix` of the `Request data` tab.
  `https://domain.sharepoint.com/sites/site1/_api/web/Lists(guid'{ListGUID}')/RootFolder/Files/Add( overwrite=true,url='{AttachmentNameParameter}')?$expand=ListItemAllFields&$select=ListItemAllFields/ID`
  ![Upload file to SharePoint: Authentication](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-55-34.png)
- Request data<br/>
  Set the `HTTP method` to `POST` and define these `Custom headers`
  ```
  Accept          application/json;odata=verbose
  Authorization   Bearer {Acccess token}
  If-Match        *
  ```
  ![Upload file to SharePoint: Request data](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-55-45.png)
- Request body<br/>
  ![Upload file to SharePoint: Request body](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-20-57-10.png)  
- Response<br/>
  You can use the below json to populate the response. Afterwards assign the `Id` to a parameter. You will probably need it to add metadata or delete the file later.
  ```json
  {
    "d": {
        "__metadata": {
            "id": "",
            "uri": "",
            "type": "SP.File"
        },
        "ListItemAllFields": {
            "__metadata": {
                "id": "1452bbe9-d5f3-4300-97e8-2932345153a2",
                "uri": "",
                "etag": "\"1\"",
                "type": ""
            },
            "Id": 25,
            "ID": 25
        }
    }
  }
  ```
  ![Upload file to SharePoint: Response](/assets/images/posts/2025-01-25-SharePoint-Online-REST-API-integration/2025-01-20-21-01-21.png)

# Storing the client secret
If you have read this far, you are probably not able to use the standard `OAuth2 App -> API` for connecting to SharePoint. Therefore, we have a little problem with the client secret. How and where can we store it? Unfortunately, this something you need to decide on your own.
I have opted for this approach:
- A dictionary to store the configuration values, so that I can define different connections for each business entity.
- encrypting the field with a custom SDK: [Password field](/posts/2023/password-field).

The later could be neglected:
- if you can ensure that only persons can access the dictionary who know the secret anyway
- the database can only be accessed by those people too.
