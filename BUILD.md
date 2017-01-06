# One of many ways to set up radio·li·se

**Actually, this instruction only works with Debian-based Linux distributions (e.g. Debian itself, Ubuntu or Linux Mint)!**

Log on as "root" or make sure that you use "sudo" with every single command.

Ensure that all packages are up-to-date:

    apt-get update
    apt-get upgrade
    
Install Apache 2, PHP, the Apache 2 PHP module, MPD and MPC:
    
    apt-get install apache2 php libapache2-mod-php git mpd mpc
    
If this didn't work and you want to install PHP 5 instead:

    apt-get install apache2 php5 libapache2-mod-php5 git mpd mpc
    
Clone this repository:
    
    git clone https://github.com/celsiuswr/radiolise
    
Move only the necessary files to the virtual host directory:
    
    mv radiolise/src/* /var/www/html/
    
Allow radio·li·se to save station information on your server (the user www-data is responsible for that):
    
    chown www-data /var/www/html/channels.json

Of course you may use any other web server software that supports PHP and any other way to install the necessary packages instead.
