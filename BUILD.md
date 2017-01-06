# One of many ways to set up radio·li·se

**ACTUALLY, THIS INSTRUCTION ONLY WORKS ON DEBIAN-BASED LINUX DISTRIBUTIONS!** (e.g. Debian itself, Ubuntu or Linux Mint)

Start a new terminal session as "root" or make sure that you use "sudo" with every single command.

## 1. Ensure that everything is up-to-date

    apt-get update
    apt-get upgrade
    
## 2. Install Apache 2, PHP, the Apache 2 PHP module, Git, MPD and MPC
    
    apt-get install apache2 php libapache2-mod-php git mpd mpc
    
If the latest PHP version isn't available, you may use PHP 5 instead:

    apt-get install apache2 php5 libapache2-mod-php5 git mpd mpc
    
## 3. Clone this repository
    
    git clone https://github.com/celsiuswr/radiolise
    
## 4. Move only the necessary files to the virtual host directory
    
    mv radiolise/src/* /var/www/html/
    
## 5. Allow radio·li·se to save station information on your server

The user www-data is responsible for that:
    
    chown www-data /var/www/html/channels.json
-----
Of course you may use any other web server software that supports PHP and any other way to install the necessary packages instead. If you don't want to keep Git, you can remove it like this:

    apt-get remove git
