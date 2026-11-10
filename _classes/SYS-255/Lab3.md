---
title: Lab 03 | Linux
date: 2026-09-13
tags: [linux, dhcp]
---

# Lab 03 | Linux
dhcp01 is our Linux box that will handle DHCP running rockyOS
## Networking dhcp01
Following along with [this video](https://drive.google.com/file/d/159rkSPeDkNa1tEDCzLfifZNbSoiXVGUq/view) and nmtui, we will network the VM with the following settings:
* IP/Netmask: 10.0.5.3/24
* Gateway: 10.0.5.2
* DNS: 10.0.5.5
* Search Domain: james.local
* Hostname: dhcp01-james
  * Run `sudo nmcli connection reload` to see changes
### Adding a named user to wheel
This is the admin group on centOS  
```
sudo useradd james
sudo passwd james
*Enter password*
sudo usermod -aG wheel james
```
## Add dhcp01 to ADDS
Update records in ad01 to include a forward record for dhcp01
## ssh
We should get used to using remote access for our linux boxes. We will be using the default ssh client in powershell for this task, however PuTTY and MobaXTerm are great alternatives.
`ssh username@hostname`
## Commands
  * pwd
    * Prints the working directory
  * cd
      Changes the current directory, can go relatively up or down or use an absolute path
  * ls -l
    * Lists all files and their verbose details in the working directory
  * man
    * Shows the manual for specified program or file
  * mkdir
    * Make a new directory in the working directory
  * yum
    * Our default package manager
  * groups
    * Prints the groups of hte user
  * sudo -i
    * Gives a period of increased privilege elevation
