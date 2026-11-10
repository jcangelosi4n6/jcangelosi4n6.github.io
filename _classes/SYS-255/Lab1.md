# Lab 01 | Environment Setup.md
To network all of our VMs together on Proxmox, we need to set up our environment and establish a connection.  

## Assigning Networks on fw01
### Network Cards
First is the PfSense fw01 VM that has two network adapter that need to be configured  
* net0 is assigned to the WAN bridge assigned to the class
  * The Model is VirtIO (paravirtualized) and the MAC is BC:24:11:E0:E6:60
* net1 is assigned to the LAN bridge assigned to my network
  * The Model is VirtIO (paravirtualized) and the MAC is BC:24:11:08:34:ED  
### Assigning Interfaces
We can open the console on Proxmox to access the PfSense console.  
The order of settings to reassign interfaces are as follows:
1. Select option 1) Assign Interfaces
2. Do not set up VLANS now
3. Change the WAN and LAN interfaces to be vtnet0 and vtnet1 respectively
4. Proceed
### Setting Interface IPs
We now need to actually set the IP addresses and our upstream gateway to get up connected.
The steps to assign the WAN IP and GW are as follows:  
1. Select 2) Set interface(s) IP address
2. Select 1 to set the WAN interface
3. Select no DHCP assignment
4. Enter the class assigned WAN address from canvas
   * *I am using 10.0.17.111 as my WAN IP was not assigned on canvas*
5. Enter the subnet bit count
   * In this case we are on 24
6. Set the upstream gateway as 10.0.17.2
7. Set this as the default gateway
8. Do not assign IPv6 it will not be used here
9. Do not enable DHCP
10. Do not enable HTTP as webConfigurator protcol since we will be using https

The steps to assign the LAB interface are as follows:
1. Select 2) Set interface(s) IP address
2. Select 2 to set the LAN interface
3. Do not use DHCP
4. Assign the IP
   * *The IP we are using is 10.0.5.2 which is the same for every student*
5. Enter the subnet bit count
   * In this case we are on 24
6. There is no upstream gateway for LAN
   * *We ARE the gateway for the LAN*
7. No DHCP6, IPv6, or DHCP
8. Do not revert to http

Now our interfaces are set up!

## Configuring wks01
Our Windows Client box is next up to be configured.  
**NOTE: CTRL+ALT+DELETE CAN BE SENT TO THE SYSTEM WITH THE NOVNC SLIDE OUT MENU -> SHOW EXTRA KEYS**  
### New Local Admin Account
We first need to set up a new Local Admin Account  
On boot I was prompted to create a new password for user Administrator.  
### Changing the Hostname
Steps to change hostname:
1. Open File Explorer
2. This PC Properties
3. Scroll to Rename this PC (Advanced)
4. Click Change
5. Renamed Computer name to wks01-james
6. Restart Pc
7. Confirm the change with the hostname command
### Assigning IPs
To manually assign the IP address for wks01 the steps are as follows:
1. Win+R to get to the Run menu
2. Enter ncpa.cpl
3. Right click on the correct interface
4. Properties
5. Double-Click on IPv4
6. Click on the Use the "following IP address" option
7. Enter the correct IP information
   * Our IP is 10.0.5.100, Subnet 255.255.255.0, Default Gateway 10.0.5.2
8. Set The DNS server to the same address as the default gateway
9. Click OK

## Configuring PfSense GUI
1. Enter the Gateway IP into IE
2. Login with the same creds as the PfSense VM
3. A setup wizard appears that should be set up with the following information:
  * *General Information*
    * Hostname: fw01-james
    * Domain: james.local
    * Primary DNS: 8.8.8.8
  * *Configure WAN Interface*
    * RFC1918 Networks: Uncheck "Block private networks from entering via WAN"
  * *Set Root Password*
    * Set this to whatever, just remember it!  

## Lab Deliverables
1. Pinging champlain.edu from fw01.
   * I had some trouble with this one, I didn't realize that I needed to forward the DNS queries. I did some research and that option was the one that said anything regarding upstream. Will have to look into this one more to get a better understanding.
2. Show the output of whoami, hostname, ping -n 1 google.com, and ipconfig from powershell.
   * I mistyped a 1 instead of a 10 so I was getting allllllll sorts of DNS issues here. Going into properties to change it worked wonders
3. Successful Navigation from wks01 to champlain.edu using chrome.
4. tracert command against champlain.edu from wks01 with a maximum of 3 hops.
5. What technical terms or steps were you unfamiliar with?
   * I was mostly unfamiliar with how DNS configuration works. Forwarding DNS queries upstream was not something I really had in my bag as of now but I’m glad I was able to successfully configure the systems.
6. Meets the submission guidelines
7. Tech Journal entry
## Default Gateway Question
A default gateway is where all traffic from a system that is destined for any location outside of its local network with be routed through. For example, when we where pinging champlain.edu, the request was being sent to our gateway first then out to the open internet to resolve the name into a usable IP.
