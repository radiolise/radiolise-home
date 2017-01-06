# How to set up radio·li·se on Debian-based Linux distributions using APT and Apache 2

Log on as "root" or make sure that you use "sudo" with every single command.

Ensure that all packages are up-to-date:

    apt-get update
    apt-get upgrade
    
Install Apache 2, PHP for code execution on the server, the Apache2 PHP module to enable integration of PHP in Apache, Git to clone this repository, MPD for playing music on your server and MPC to enable integration of MPD in radio·li·se:
    
    apt-get install apache2 php libapache2-mod-php git mpd mpc
    
If this didn't work and you want to install PHP 5 instead:

    apt-get install apache2 php5 libapache2-mod-php5 git mpd mpc
    
Clone this repository:
    
    git clone https://github.com/celsiuswr/radiolise
    
Move only the necessary files to the virtual host directory:
    
    mv radiolise/src/* /var/www/html/
    
Allow radio·li·se to save station information on your server (the user www-data is responsible for that):
    
    chown www-data /var/www/html/channels.json
