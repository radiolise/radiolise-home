# radio·li·se setup instructions
<img src="radiolise.png" height=100em>

## Step 1: Install necessary packages

In order to work, radio·li·se needs some third party packages to be installed. Here is a list of packages you'll have to install if you want to use radio·li·se:

* Set up a web server with PHP support; I recommend using Apache in combination with the corresponding PHP package
* Set up Music Player Daemon

## Step 2: Copy files

Copy the files in the src folder of the master branch to the virtual directory of your web server.

## Step 3: Grant privileges

radio·li·se needs read and write access to the file 'channels.list' to save new channels. To do so, you have to change the owner of that file. If you don't know how to do this: Don't worry, if you call the web interface via your web browser, radio·li·se will tell you how to grant those privileges.

## DONE

Now we're ready to take off! If anything doesn't work the way you expected, please use the issues tab in this repository. The community will try to help you out.
