---
title: Lab 02 | DNS + ADDS Role
date: 2026-09-06
tags: [dns, active directory]
---

# Lab 02 | DNS + ADDS Role

## Setting up ad01
First is changing the local admin password
* The old Usual
* This will become the domain admin password
### Network Config
* IP Address:  10.0.5.5
* Netmask: 255.255.255.0
* Gateway 10.0.5.2 
* DNS 10.0.5.2
* Set to discoverable
* Change hostname to ad01-james
  * Test with a ping out to google.com
### Installing ADDS Role
Select "Add Roles and Features" under the management dropdown.
 * Enable AD installation
 * Promote the ad box to a domain controller
  * Name this forest "james.local"
Create a DSM Password
  * This is an "oh shit" password, only use when things are bad
Leave the error be, it does not apply to us since we are using it locally  
NetBIOS is set to 'JAMES'  
Now Login as DOMAIN ADMIN instead of local admin  

## DNS
The DNS address has now changed to 127.0.0.1, which is the loopback address. This address will point at itself. We should now make a DNS record on our server via the following:
 * Server Manager > DNS > Right-Click on the server > DNS Manager
 * Expand the Forward Lookup Zone for our domain
 * Right click the domain and add an A record
 * Input the hostname for fw01-james, and the IP: 10.0.5.2
 * There will be an error creating ptr records
### Reverse Zone
We must create a new Reverse Zone to see all hosts on the 10.0.5.0/24 network  
 * Select Primary
 * To all DNS servers running on domain controllers in this domain: james.local
 * IPv4
 * NetID is 10.0.5
 * Update the ptr records of ad01 and fw01

## Creating Domain Users
We need domain accounts to actually manage the way users interact with the machines, so we will use these in lieu of local users. To do this:  
 * Go to the AD DS tab
 * Right click on the domain
   * Active Directory Users and Computers
 * Find the Domain's user folder
 * add a domain admin and add the adm suffix on the username to denote that it is admin.
 * Set password and uncheck change password at logon
 * Add the user to the 'Domain Admins' group
 * Repeat the steps to create a regular user for my name w/o adding it to the adm group

## Preparing wks01 to join james.local
**ANYTIME YOU HAVE A NEW SYSTEM READY TO JOIN A DOMAIN IT MUST USE THE DOMAIN'S DNS SERVER**  
  
Use the following commands in powershell to change the DNS server on the adapter:
```
Get-NetAdapter
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 10.0.5.5
ipconfig /flushdns
```  
  
## Domain Joining wks01
First, change the hostname to wks01-james if it isn't already.
 * Control Panel > System & Security > System > Rename this PC (Advanced)
 * Click the 'Change...' option to add it to the domain
 * Keep computer name the same
 * Make wks a member of james.local
 * Input the username and password of the domain admin
 * Welcome to the domain!
 * Restart to apply changes
