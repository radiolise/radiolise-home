$(document).ready(function() {
	if (window.Notification && Notification.permission !== "granted") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
		});
	}
	$.post("post.php", {
		cmd: 8,
	}, function(data) {
		data = data.split(";");
		if (data[0] == "false") {
			var user = data[1];
			var vdir = data[2];
			var file = data[3];
			hint("Welcome to the user interface!");
			updateFinish("Almost done...: <p/><div style='text-align: justify'>Congratulations! It seems like " + appname + " has been set up successfully (almost). However, we need both read and write access to the file \"" + file + "\" to save new channels. To fix the problem, you should change the owner of that file by typing<p/><code>chown " + user + " " + vdir + "/" + file + "</code><p/>into a terminal with root privileges.</div>");
			$("#maincontrols").hide();
		}
		else {
			updateStart();
		}
	});
	$("#newname, #newurl").val(null);
    $("#aboutname").html("radio<span style='color: #ffec80'>li</span><span style='color: #80f6ff'>se</span> (meaning “<u>Radio</u> for GNU/<span style='color: #ffec80'><u>Li</u></span>nux <span style='color: #80f6ff'><u>se</u></span>rvers”)");
    $("#aboutversion").text(appversion);
    $(".navbar-brand").attr({
        "src": "radiolise.png",
        "alt": appname
    });
    var hash = location.hash;
    if (hash !== "") {
        switch (hash.substring(1)) {
			case "update":
				hint("<i class='fa fa-fw fa-exclamation-triangle'></i> Not yet working reliably");
				break;
            case "dialog":
                break;
            case "404":
                hint(
                    "<b>Error 404</b>: Unable to find the desired file on this server."
                );
                break;
            case "noscript":
                hint("JavaScript has been enabled successfully.");
                break;
            default:
                hint("<b>Invalid hashtag</b><br><br> \"" + hash +
                    "\" is unknown.");
        }
		var lite = "/";
		if (location.search == "?lite") {
			lite = "/?lite";	
		}
		history.replaceState({}, document.title, lite);
    }
    $("#chadd").on("click", addChannel);
    $("#chedit").on("click", editChannel);
    $("#chremove").on("click", removeChannel);
    $("body").on("keyup", function(event) {
		var keycode = event.which;
        if (!(location.hash == "#dialog" || event.ctrlKey)) {
            switch (keycode) {
				case 73:
					$("#learnmore").modal();
					break;
				case 189:
                case 109:
                    showVolume(false);
                    break;
				case 187:
                case 107:
                    showVolume(true);
                    break;
                case 32:
					if ($("#stop").hasClass("disabled") == false) {
						if ($("#stop").children().hasClass("fa-toggle-off")) {
							hint("<i class='fa fa-fw fa-play'></i> Turned radio on");
						}
						else {
							hint("<i class='fa fa-fw fa-stop'></i> Turned radio off");
						}
						$("#stop").trigger("click");
					}
                    break;
                default:
                    var digit;
                    if (keycode >= 49 && keycode <= 57) {
                        digit = keycode - 49;
                    }
					else if (keycode == 48) {
                        digit = 9;
                    }
                    if (digit < playlist.length) {
                        startStream(playlist[digit]);
                        hint(
                            "<i class='fa fa-fw fa-play'></i> " +
                            names[digit]);
                    } else if (digit !== undefined) {
                        hint(
                            "<i class='fa fa-fw fa-exclamation-triangle'></i> Channel " +
                            (digit + 1) + " doesn’t exist.");
                    }
            }
        }
		if (location.hash == "#dialog") {
			switch (keycode) {
				case 27:
					history.back();
					break;
			}
		}
    // }).on("click", function(event) {
        // if (event.which == 1) {
            // closehint();
        // }
    }).on("vmousemove mousemove", function(event) {
        if (ismousedown) {
            setBar(event);
        }
    }).on("touchend mouseup", function() {
        if (ismousedown) {
            ismousedown = false;
            setVolumeTimer();
        }
    });
    $("#volumebar").on("touchstart mousedown", function(event) {
        ismousedown = true;
        setBar(event);
    });
    $("#stop").on("click", function() {
		var icon = $(this).children();
		if (icon.hasClass("fa-toggle-on")) {
			$.post("post.php", {
				cmd: 1
			}).done(function() {
				toggle(false);
			});
		}
		else {
			$.post("post.php", {
				cmd: 2
			}).done(function() {
				toggle(true);
			});
		}
    });
    $("#minus").on("click", function() {
        showVolume(false);
    });
    $("#plus").on("click", function() {
        showVolume(true);
    });
    $(".modal").on("show.bs.modal", function() {
        history.pushState(null, null, "#dialog");
    }).on("hide.bs.modal", modalCloser);
    $(window).on("hashchange", function() {
        if (location.hash === "") {
            $(".modal").modal("hide");
        }
    }).on("dragstart", function() {
        return false;
    }).on("contextmenu", function() {
        return false;
    });
	$("#addchannel").on("keyup", function(event) {
		if (event.which == 13) {
			$("#chadd").trigger("click");
		}
	});
	$(window).on("beforeunload", function() {
		notification.close();
	});
	$("#addchannel").on("hidden.bs.modal", function() {
		$("#newurl").val("");
	});
});
var prevdata, prevvolume, gearclicked, hinttimer, volumetimer, volumerequest, slow, timedout, firsttime;
var appname = "radio·li·se";
var noconnection = "Disconnected from server: Please check your network connection. This message will disappear as soon as the problem doesn’t exist anymore.";
var timeoverflow = "Connection timed out: It takes too long to get a response from the server. This message will disappear as soon as the problem doesn’t exist anymore.";
var visible = false;
var appversion = "16.11.0";
var nostream = "Radio off";
var playlist = [];
var names = [];
var ismousedown = false;
function setVolumeTimer() {
    clearTimeout(volumetimer);
    volumetimer = setTimeout(function() {
        $("#volumemodal").finish().fadeOut();
    }, 3400);
}
$("title").text(appname);
function setBar(eventy) {
    clearTimeout(volumetimer);
    var percentage = Math.round((eventy.pageX - $("#volumebar").offset().left - 5) / 2);
	if (percentage - prevvolume < 0) {
		buttonhider(false, percentage + 10);
	}
	else {
		buttonhider(true, percentage - 10);
	}
	if (percentage < 0) {
		percentage = 0;
	} else if (percentage > 100) {
		percentage = 100;
	}
	if (prevvolume != percentage) {
		var width = percentage * 2;
		$("#volumeline").finish().animate({
			"width": width
		});
		$("#volumecircle").finish().animate({
			"margin-left": width - 5
		});
		if (volumerequest !== undefined) {
			volumerequest.abort();
		}
		volumerequest = $.post("post.php", {
			cmd: 3,
			arg: percentage
		});
		prevvolume = percentage;
	}
}
function modalCloser() {
    if (location.hash == "#dialog") {
        history.back();
    }
}
function buttonhider(plus, thisvolume) {
	if (plus) {
		if (thisvolume >= 90) {
			$("#plus").finish().animate({"opacity": "0"});
			$("#minus").finish().animate({"opacity": "1"});
		}
		else {
			$("#minus").finish().animate({"opacity": "1"});
		}
	}
	else {
		if (thisvolume <= 10) {
			$("#minus").finish().animate({"opacity": "0"});
			$("#plus").finish().animate({"opacity": "1"});
		}
		else {
			$("#plus").finish().animate({"opacity": "1"});
		}
	}
}
function showVolume(plus) {
    setVolumeTimer();
    var width;
    var sign = "-";
    if (plus) {
        sign = "+";
    }
    $.post("post.php", {
        cmd: 3
    }, function(data) {
		thisvolume = parseInt(data.substring(7));
		buttonhider(plus, thisvolume);
        width = thisvolume * 2;
        $("#volumeline").css({
            "width": width
        });
		$("#volumecircle").css({
			"margin-left": width - 5
		});
    }).done(function() {
        $.post("post.php", {
            cmd: 3,
			arg: sign + '10'
        });
        if (plus) {
            if (width < 180) {
                width += 20;
            }
			else {
                width = 200;
            }
        } else {
			if (width > 20) {
				width -= 20;
			}
			else {
				width = 0;
			}
        }
		$("#volumeline").stop().animate({
			"width": width
		});
		$("#volumecircle").stop().animate({
			"margin-left": width - 5
		});
    });
    $("#volumemodal").finish().fadeIn();
}
function hint(text) {
    clearTimeout(hinttimer);
    $("#alerttext").html(text);
    $("#alertmodal").finish().animate({
        "top": "0px",
        "opacity": "1"
    });
	if (location.search == "?lite") {
		$(".jumbotron").finish().animate({
			"margin-top": "80px"
		});
	}
	$("#hintspace").finish().slideDown();
    hinttimer = setTimeout(function() {
        closehint();
    }, 5000);
}
function closehint() {
    $("#alertmodal").finish().animate({
        "top": "-100px",
        "opacity": "0"
    });
	if (location.search == "?lite") {
		$(".jumbotron").finish().animate({
			"margin-top": "25px"
		});
	}
	$("#hintspace").finish().slideUp();
}
function updateFinish(string) {
    var newchannel = string.split(": ")[0];
	var newinfo = string.substring(newchannel.length + 2);
	if (firsttime == false) {
		notify(newchannel, newinfo);
	}
	else {
		firsttime = false;
	}
    if (string == nostream) {
        $('title').html(appname);
    } else {
        $('title').html(newchannel + " – " + appname);
    }
	if (prevdata == undefined || prevdata.split(": ")[0] != newchannel) {
		$("#channel").finish().hide(400, function() {
			$(this).html(newchannel);
		}).show(400);
	}
	$("#info").finish().hide(400, function() {
		$(this).html(newinfo);
	}).show(400);
	prevdata = string;
}
function startStream(url) {
	$("body").animate({
		scrollTop: 0
	});
    $.post('post.php', {
		cmd: 4,
        arg: url
    });
}
function addChannel() {
	var newchannel = $("#newurl").val();
	if (playlist.indexOf(newchannel) == -1) {
		$.post('post.php', {
			cmd: 5,
			arg: newchannel
		}).done(function() {
			sync();
		});
	}
	else {
		hint("<i class='fa fa-fw fa-exclamation-triangle'></i>Channel already exists.");
	}
}
function loadChannel(name, url) {
	var toappend = "<tr style='white-space: nowrap; overflow-x: auto'><td><p class=\"text-right\" style=\"padding-top: 11px; padding-bottom: 10px; font-size: 18px\"><span class='text-primary'>" +
        (playlist.length + 1) +
        "</span></p></td><td><a onclick=\"startStream('" + url +
        "');\" class=\"btn btn-lg btn-link\" style='text-align: left'><b>" +
        name +
        "</b></a></td>";
	if (location.search != "?lite") {
		toappend += "<td style=\"text-align: right\"><a onclick='$(\"#todelete\").text(\"" + name + "\"); gearclicked = \"" + url + "\"' class=\"btn btn-lg btn-link\" style=\"height: 46px\" data-toggle=\"modal\" title=\"Remove “" + name + "”\" data-target=\"#channeloptions\"><i class=\"fa fa-fw fa-trash-o\" style=\"padding-top: 4px\"></i></a></td>";
	}
	toappend += "</tr>";
    $("#channels").append(toappend);
    names.push(name);
    playlist.push(url);
	if (location.search == "?lite") {
		$("#addarea, .navbar").remove();
		$(".jumbotron").css({
			"background": "none",
			"box-shadow": "none",
			"padding": "0",
			"margin-top": "25px"
		}).find(".section-primary, .text-primary, a").css({
			"color": "white"
		});
		$("#alertmodal").css({
			"background-color": "#222"
		});
		$(".sh-content").css({
			"box-shadow": "none"
		})
		$("#alert-sm").css({
			"width": "100%",
			"padding": "0",
			"margin": "0"
		});
		$(".jumbotron, .sh:not(#volumemodal), .modal").css({
			"zoom": "150%"
		});
		$("#volumemodal").remove();
	}
}
function removeChannel() {
	$.post("post.php", {
		cmd: 7,
		arg: gearclicked
	}).done(function() {
		sync();
	});
}
function editChannel() {
    $("#editchannel").modal();
}
function updateStart() {
		if (prevdata != noconnection) {
			slow = setTimeout(function() {
				hint("It seems like the server needs a long time to respond.");
				timedout = setTimeout(function() {
					if (prevdata != timeoverflow) {
						updateFinish(timeoverflow);
						$("#maincontrols").finish().slideUp();
					}
				}, 10000);
			}, 5000);
		}
		$.post("post.php", {
			cmd: 0
		}, function(data) {
			if (data.charAt(0) == '0') {
				$("#stop").hide("swing");
			}
			else {
				$("#stop").show("swing");
			}
			data = data.substring(1).trim();
			if (data != prevdata) {
				var icon = $("#stop").children();
				if (data === "" && prevdata != nostream) {
					updateFinish(nostream);
					toggle(false);
				} else if (data !== "") {
					updateFinish(data);
					toggle(true);
				}
			}
		}).done(function() {
			if (prevdata == noconnection) {
				$("#maincontrols").finish().slideDown();
				hint("Successfully reconnected to the server.");
			}
			else if (prevdata == timeoverflow) {
				$("#maincontrols").finish().slideDown();
				hint("The server finally responded.");
			}
		}).fail(function() {
			if (prevdata != noconnection) {
				updateFinish(noconnection);
				$("#maincontrols").finish().slideUp();
			}
		}).always(function() {
			clearTimeout(slow);
			clearTimeout(timedout);
			setTimeout(function() {
				updateStart();
			}, 2000);
		});
		sync();
}
function sync() {
	$.post("post.php", {
		cmd: 6
	}, function(data) {
		if (playlist.toString() != data.substring(0, data.length - 1).split(";")) {
			names = [];
			playlist = [];
			$("#channels").empty();
			var count = data.split(";").length - 1;
			var channels = data.split(";", count);
			if (count != 0) {
				for (var i = 0; i < count; i++) {
					loadChannel("Channel " + (i + 1), channels[i]);
				}
				$("#channellist").show();
				$("#zero").hide();
			}
			else {
				$("#channellist").hide();
				$("#zero").show();
			}
		}
	});
}
function notify(songinfo, channel) {
	try {
		if (notification !== undefined) {
			notification.close();
		}
		if (window.Notification && Notification.permission === "granted") {
			spawn(songinfo, channel);
		}
		else if (window.Notification && Notification.permission !== "denied") {
			Notification.requestPermission(function(status) {
				if (status === "granted") {
					spawn(songinfo, channel);
				}
			});
		}
	}
	catch(err) {}
}
var notification;
function spawn(songinfo, channel) {
	notification = new Notification(songinfo, {
		body: channel,
		icon: "radiolise.ico"
	});
}
function toggle(on) {
	var icon = $("#stop").children();
	if (on) {
		icon
			.removeClass("fa-toggle-off")
			.addClass("fa-toggle-on");
	}
	else {
		icon
			.removeClass("fa-toggle-on")
			.addClass("fa-toggle-off");
	}
}
