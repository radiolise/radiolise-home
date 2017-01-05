<?php
	$command;
	$argument = $_POST['arg'];
	$requireFeedback = false;
	$output;
	$file = "channels.json";
	$channels = file_get_contents($file);
	switch ($_POST['cmd']) {
		case 0:	//Get channel information
			if (exec('mpc playlist') == '') {
				$output = 0;
			}
			else {
				$output = 1;
			}
			$command = 'mpc current';
			$requireFeedback = true;
			break;
		case 1:	//Stop playing 
			$command = 'mpc stop';
			break;
		case 2: //Start playing
			$command = 'mpc play 1';
			break;
		case 3: //Get or set volume
			$command = 'mpc volume';
			if ($argument == '') {
				$requireFeedback = true;
			}
			else {
				$command .= ' ' . $argument;
			}
			break;
		case 4: //Switch channel
            $command = 'mpc clear && mpc add \'' . $argument . '\' && mpc play 1';
			break;
		case 5: //Edit channel file
            file_put_contents($file, $argument);
			break;
		case 6: //Get all channels
			echo $channels;
			break;
		case 7: //Check if $file is writeable
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
