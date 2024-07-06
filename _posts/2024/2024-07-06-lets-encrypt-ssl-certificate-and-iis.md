---
regenerate: true
title: "Let's Encrypt SSL certificate and IIS"
categories:
  - WEBCON BPS 
tags:  
  - Installation
excerpt:
    "Creating a checklist to define which artifacts need to be copied from on configuration database to another."
---

# Overview
In todays world it should be obvious that no website should be run without securing it with a certificate. Unfortunately, I have seen cases where this is still true, and the 'reasons' are combination of: 
> It's not available from the public.<br/>
> 
> It's only a dev environment.<br/>
> 
> I don't want to go through the hassle with the IT.<br/>


I used  `Let's Encrypt` service to get SSL certificates for my private web server. I'm not sure whether I have documented all initial steps to get it up and running. So, I will just provide a few information and links to the original site and go into more detail to use it with IIS.

{: .notice--warning}
**Remark:** I don't have qualified experience in this area. There may be better ways out there, but this is how I got it working and I'm providing the information `as is`.


# Get a SSL certificate
I've been using [certbot](https://certbot.eff.org/instructions) to get a certificate for my site. Since I'm using IIS, I selected `Web Hosting Product` on `Windows`

{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-07-57-10.png" alt="" caption="" %}

The page provides detailed instructions. If my notes are valid then I've used the following command line to get an SSL certificate for `bps.daniels-notes.de`.

``` powershell
#certbot doesn't work from PowerShell ISE
certbot certonly --standalone -d "bps.daniels-notes.de"
```

I'm using the `--standalone` parameter because no other site is using port 80.

{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-04-05.png" alt="My sites don't use the port 80" caption="My sites don't use the port 80" %}

With the command a folder for the site was created and the necessary files have been downloaded.

{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-21-54.png" alt="The folder with the files for the SSL certificate." caption="The folder with the files for the SSL certificate." %}

# Creating the .pfx file for IIS
After the files have been downloaded, I was provided with the next hurdle. How can I take these files so that I can use them with IIS.
The way I found was to use [OpenSSL for windows](https://sourceforge.net/projects/openssl-for-windows/) to create a .pfx file from those files.
1. Extracted the package to the folder <br/>`C:\Install\SSLCertificate\OpenSSL-1.1.1h_win32`
2. Create a password.txt in the certbot folder with the password to use. In my case the folder is: <br/>`C:\Certbot\live\bps.daniels-notes.de`.

The below script will switch to the site folder, use the string password to generate the .pfx file.

```powershell
cd C:\Certbot\live\bps.daniels-notes.de
#C:\Install\SSLCertificate\OpenSSL-1.1.1h_win32\openssl pkcs12 --help
$password = Get-Content "password.txt" -Encoding UTF8
C:\Install\SSLCertificate\OpenSSL-1.1.1h_win32\openssl pkcs12 -export -in cert.pem -inkey privkey.pem -out cert_combined.pfx -password pass:$password

```

# Adding the certificate for the site
Now that we have the certificate, the rest is easy.
1. Import the certificate.
2. Add it to the site in IIS

You can do it manually or use the below script. It will store the certificate in the personal certificates folder.

{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-31-01.png" alt="The certificate is imported in the personal certificates store" caption="The certificate is imported in the personal certificates store" %}


 The certificate will then be added to the site with the name `WEBCONBPS`. This site should have a single https binding.
{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-31-48.png" alt="The certificate is added to the site which has to have an existing binding." caption="The certificate is added to the site which has to have an existing binding." %}

```powershell
cd C:\Certbot\live\bps.daniels-notes.de
# Import the certificate to IIS and attach the certificate to the website.
$importedCertificate =  Import-PfxCertificate -FilePath cert_combined.pfx -CertStoreLocation 'Cert:\LocalMachine\My'  -Password (ConvertTo-SecureString -AsPlainText $password -Force)
$importedCertificate.Thumbprint

# get the web binding of the site
$binding = Get-WebBinding -Name WEBCONBPS -Protocol "https"

# set the ssl certificate
$binding.AddSslCertificate($importedCertificate.GetCertHashString(), "my")
```

# Updating the certificate
Each certificate will expire after 90 days. Since no one want's to update the certificate manually, the easiest way would be to add a task to the windows task scheduler to do everything.
Luckily the installation of certbot already created `Certbot Renew Task` for us, which checks twice a day, whether certificate files need to be updated.

{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-33-52.png" alt="certbot already created a job to renew the certificate" caption="certbot already created a job to renew the certificate" %}
 
All that's left is to add a task for the other steps. I've put all the code into an `install.ps1` file.

{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-37-17.png" alt="The script code to create and use the certificate." caption="The script code to create and use the certificate." %}

```powershell
#certbot certonly --standalone
#certbot --help
#certbot doesn't work from ISE
#certbot certonly --standalone -d "bps.daniels-notes.de"

# Generate the .pfx file
cd C:\Certbot\live\bps.daniels-notes.de
#C:\Install\SSLCertificate\OpenSSL-1.1.1h_win32\openssl pkcs12 --help
$password = Get-Content "password.txt" -Encoding UTF8
C:\Install\SSLCertificate\OpenSSL-1.1.1h_win32\openssl pkcs12 -export -in cert.pem -inkey privkey.pem -out cert_combined.pfx -password pass:$password

# Import the certificate to IIS and attach the certificate to the website.
$importedCertificate =  Import-PfxCertificate -FilePath cert_combined.pfx -CertStoreLocation 'Cert:\LocalMachine\My'  -Password (ConvertTo-SecureString -AsPlainText $password -Force)
$importedCertificate.Thumbprint

# get the web binding of the site
$binding = Get-WebBinding -Name WEBCONBPS -Protocol "https"

# set the ssl certificate
$binding.AddSslCertificate($importedCertificate.GetCertHashString(), "my")

```

Afterwards I've added a task:
1. Choose a name and schedule to your liking
2. Add an action to run a program and execute PowerShell to execute the script file<br/>
    {% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-40-30.png" alt="Run the script from an action." caption="Run the script from an action." %}
3. Ensure that you ticked `Run whether user is logged on or not`. It may be necessary to also  tick `Run with highest privileges` but this is something you need to check on your system.
    {% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-42-52.png" alt="The task should be executed regardless whether the user is logged in or not." caption="The task should be executed regardless whether the user is logged in or not." %}

Run the script from the context menu to verify, that it works. The `Last Run Result` should be 0x0.

{% include figure image_path="/assets/images/posts/2024-07-06-lets-encrypt-ssl-certificate-and-iis/2024-07-06-08-45-07.png" alt="Test the script by starting it manually." caption="Test the script by starting it manually." %}

