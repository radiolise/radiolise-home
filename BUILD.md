# radio·li·se setup instruction for Debian-based Linux distributions with APT

Log on as "root" or make sure that you use sudo before every single command.

    apt-get update
    apt-get upgrade
    apt-get install apache2 php libapache2-mod-php git mpd mpc
    git clone https://github.com/celsiuswr/radiolise
    mv radiolise/src/* /var/www/html/
    chown www-data /var/www/html/channels.json
