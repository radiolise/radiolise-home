# Setup using APT and Git

**Actually, this instruction only works on *[Debian](https://en.wikipedia.org/wiki/Debian)*-based *[GNU](https://en.wikipedia.org/wiki/GNU)*/*[Linux](https://en.wikipedia.org/wiki/Linux_kernel)* distributions!** (e.g. *[Debian](https://en.wikipedia.org/wiki/Debian)* itself, *[Raspbian](https://en.wikipedia.org/wiki/Raspbian)*, *[PureOS](https://en.wikipedia.org/wiki/Librem#Operating_system)* and [*Ubuntu*-based](https://en.wikipedia.org/wiki/List_of_Linux_distributions#Ubuntu-based) distributions)
https://github.com/radiolise?tab=repositories
Start a new terminal session as *root* or make sure that you use `sudo` with every single command.

### 1. Ensure that everything is up-to-date

    apt-get update
    apt-get upgrade
    
### 2. Install *Apache*, *PHP*, the *Apache PHP* module, *MPD* and *MPC*
    
    apt-get install apache2 php libapache2-mod-php mpd mpc
    
If the latest *PHP* version isn't available, you may use version 5 instead:

    apt-get install apache2 php5 libapache2-mod-php5 mpd mpc
    
### 3. Clone this repository
    
    git clone https://github.com/marco-bauer/radiolise-home radiolise/
    
### 4. Move the necessary files to the virtual host directory
    
    mv radiolise/src/* /var/www/html/
    
### 5. Allow *Radiolise Home* to save station information on your server

The user *www-data* is responsible for that:

    chown www-data /var/www/html/channels.json
    
### 6. Set mixer type to software

Edit the file `/etc/mpd.conf`.
    
    nano /etc/mpd.conf

Find the entry `audio_output` without a `#` sign.
Uncomment `mixer_type` by removing its `#` sign.
Change its value from `hardware` to `software`

**Example:**

BEFOREHAND:

    audio_output {
        type        "alsa"
        name        "My ALSA device"
    #   mixer_type  "hardware"
    }

AFTERWARDS:

    audio_output {
        type        "alsa"
        name        "My ALSA device"
        mixer_type  "software"
    }

There might also be other entries, but you should leave them as they are if you don't wish to have any further changes. To apply changes, press:
- **`Ctrl`**+**`O`** to save
- **`↵`** (Enter) to confirm
- **`Ctrl`**+**`X`** to exit *Nano*

-----
Of course you may use any other web server software that supports *PHP* and any other way to install the necessary packages instead.

**Thank you very much for using *Radiolise Home* and have fun!**
