<?php
	$command;
	$argument = $_POST['arg'];
	$requireFeedback = false;
	$output;
	$file = "channels.list";
	$channels = file_get_contents($file);
	switch ($_POST['cmd']) {
		case 0:	//Gets channel information
			if (exec('mpc playlist') == '') {
				$output = 0;
			}
			else {
				$output = 1;
			}
			$command = 'mpc current';
			$requireFeedback = true;
			break;
		case 1:	//Stops playing 
			$command = 'mpc stop';
			break;
		case 2: //Starts playing
			$command = 'mpc play 1';
			break;
		case 3: //Gets or sets volume
			$command = 'mpc volume';
			if ($argument == '') {
				$requireFeedback = true;
			}
			else {
				$command .= ' ' . $argument;
			}
			break;
		case 4: //Switches channel
			$command = 'mpc clear && mpc add ' . $argument . ' && mpc play 1';
			break;
		case 5: //Adds a channel
            if (strpos($channels, ';') == false) {
                file_put_contents($file, $argument . ';');
            }
            else {
                file_put_contents($file, $argument . ';', FILE_APPEND);
			}
			break;
		case 6: //Gets all channels
			echo $channels;
			break;
		case 7: //Remove a channel
			file_put_contents($file, str_replace($argument . ';', '', file_get_contents($file)));
			break;
		case 8: //Checks if $file is writeable
			if (is_writable($file) && is_readable($file)) {
				echo "true";
			}
			else {
				echo "false;" . exec("whoami") . ";" . getcwd() . ";" . $file;
			}
			break;
	}
	$output .= exec($command);
	if ($requireFeedback) {
		echo $output;
	}
?>
