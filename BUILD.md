# radio·li·se setup instruction

## 1. Get necessary packages

In order to work, radio·li·se needs some third party packages. If you want to use radio·li·se, you'll have to install:

* any web server software with PHP support; [Apache](https://github.com/apache/httpd) in combination with the corresponding PHP package is recommended
* [Music Player Daemon](https://github.com/MaxKellermann/MPD)

## 2. Copy source files

Copy the files in the 'src' folder of the master branch to the virtual host directory of your web server software.

## 3. Grant privileges

radio·li·se needs read and write access to the file 'channels.list' to save new channels. To do so, you have to change the owner of that file. If you don't know how to do this: Don't worry, if you call the web interface via your web browser, radio·li·se will tell you how to grant those privileges.

## DONE

Now we're ready to take off! If something doesn't work the way you expected, you may always use the issues tab of this repository. Someone will try to help you out.
