$(document).ready(function() {
	if (window.Notification && Notification.permission !== "granted") {
		Notification.requestPermission(function (status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
		});
	}
	$.post("post.php", {
		cmd: 7,
	}, function(data) {
		data = data.split(";");
		if (data[0] == "false") {
			var user = data[1];
			var vdir = data[2];
			var file = data[3];
			hint("Welcome to the user interface!");
            var command = "chown " + user + " " + vdir + "/" + file
			updateFinish("We’re almost ready!: <p/><div style='text-align: justify'>Congratulations! It seems like <span style='text-shadow: -1px 0 1px #222222, 0 1px 1px #222222, 1px 0 1px #222222, 0 -1px 1px #222222;'><span style='color: #ffffff'>radio</span><span style='color: #ffec80'>li</span><span style='color: #80f6ff'>se</span></span> has been set up successfully (almost). However, we need both read and write access to the file \"" + file + "\" to save new stations. To fix the problem, you should tell the server to change the owner of that file by typing<p/><div class='text-left' style='background-color: #f9f2f4; white-space: nowrap; overflow-x: auto;'><code>" + command + "</code></div><p/>into a terminal with root privileges.</div>");
			$("#maincontrols").hide();
		}
		else {
			updateStart();
            sync();
		}
	});
	$("#newname, #newurl").val(null);
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
		history.replaceState({}, document.title, "/");
    }
    $("#chadd").on("click", addChannel);
    $("#chedit").on("click", editChannel);
    $("#chremove").on("click", removeChannel);
    $("body").on("keyup", function(event) {
		var keycode = event.which;
        console.log(keycode);
        if (!(location.hash == "#dialog" || event.ctrlKey)) {
            switch (keycode) {
                case 67:
                    $("#brush").trigger("click");
                    break;
				case 73:
                    if (location.hash != "#dialog") {
                        $("#learnmore").modal();
                    }
					break;
				case 189:
                case 173:
                case 109:
                    showVolume(false);
                    break;
				case 187:
                case 171:
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
                        startStream(playlist[digit][1]);
                        hint(
                            "<i class='fa fa-fw fa-play'></i> " +
                            playlist[digit][0]);
                    } else if (digit !== undefined) {
                        hint(
                            "<i class='fa fa-fw fa-exclamation-triangle'></i> Station " +
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
        $(".jumbotron").stop().animate({
            "opacity": "0.15"
        });
        $(".navbar").children().stop().animate({
            "opacity": "0"
        });
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
	$("input")
        .on("keyup", function(event) {
            if (event.which == 13) {
                $("#findchannel").trigger("click");
            }
        }).on("input", function() {
            $("#results").hide();
            if ($(this).val() == "") {
                $("#findchannel").addClass("disabled");
            }
            else {
                $("#findchannel").removeClass("disabled");
            }
        });
    $("form").on("submit", function(event) {
        event.preventDefault();
    });
	$(window).on("beforeunload", function() {
        if (notification != undefined) {
            notification.close();
        }
	});
	$("#addchannel").on("hidden.bs.modal", function() {
		$("input").val("");
        $("#results").hide();
	}).on("shown.bs.modal", function() {
        $("input").select();
    });
    $("#brush").on("mousedown", function() {
        if (! $(this).children().hasClass('disabled')) {
            changeColor();
        }
    }).on("mouseenter", function() {
        if (! $(this).children().hasClass('disabled')) {
            $(this).stop().animate({
                'width': '70px',
                'height': '70px'
            });
            $(this).children().stop().animate({
                'margin': '30px'
            });
        }
    }).on("mouseleave", function() {
        $(this).stop().animate({
            'width': '50px',
            'height': '50px'
        });
        $(this).children().stop().animate({
            'margin': '20px'
            
        });
    });
});
var prevdata, prevvolume, gearclicked, hinttimer, volumetimer, volumerequest, slow, timedout, firsttime;
var appname = "radio·li·se";
var noconnection = "Sudden disconnect: Please check your network connection.";
var timeoverflow = "Sluggish connection: Couldn’t get a response from the server for over 15 seconds.";
var visible = false;
var appversion = "1.0-α";
var nostream = "Radio off";
var playlist = [];
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
    $(".jumbotron").stop().animate({
            "opacity": "1"
    });
    $(".navbar").children().stop().animate({
        "opacity": "1"
    });
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
		$("#volumeline").finish().animate({
			"width": width
		});
		$("#volumecircle").finish().animate({
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
        changeColor(true);
    } else {
        $('title').html(newchannel + " – " + appname);
        changeColor(false);
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
function addChannel(id, favicon, tags) {
    $.get("http://www.radio-browser.info/webservice/v2/json/url/" + id, function(data) {
        var notexisting = true;
        for (i = 0; i < playlist.length; i++) {
            if (playlist[i][1] == data.url) {
                notexisting = false;
                break;
            } 
        }
        if (notexisting) {
            playlist.push([data.name, data.url, favicon, tags]);
            channelUpdate();
        }
        else {
            hint("<i class='fa fa-fw fa-exclamation-triangle'></i>Station already added.");
        }
    });
}
function channelUpdate(locally = true) {
    if (locally) {
        sync(true);
    }
    $("table").empty();
    for (i = 0; i < playlist.length; i++) {
        var content = "<tr><td style='vertical-align: middle'><div style='background-image: url(\"" + playlist[i][2] + "\"); background-size: contain; background-repeat: no-repeat; width: 30px; height: 30px; margin-right: 20px'></div></td><td><a onclick='startStream(\"" + playlist[i][1] + "\")'><div style='padding-top: 20px'><span class='media-body'><h4 class='media-heading text-primary' style='font-weight: bold'>" + playlist[i][0] + "</h4><h4>";
        for (z = 0; z < playlist[i][3].split(",").length; z++) {
            content += "<span class='label text-primary' style='background-color: #dddddd'>" + playlist[i][3].split(",")[z] + "</span> ";
        }
        content += "</h4></span></div></a></td><td style='padding-bottom: 10px'><a class='text-primary' id='chremove' onclick='gearclicked = " + i + "; $(\"#todelete\").text(\"" + playlist[i][0] + "\"); $(\"#channeloptions\").modal()'><h4><i class='fa fa-fw fa-trash-o'></i></h4></a></td></tr>";
        $("table").append(content);
    }
    $("table").find(".text-primary").css({
       "color": prevcolor
    });
    if (playlist.length != 0) {
		$("#zero").hide();
    }
    else {
		$("#zero").show();        
    }
}
function removeChannel() {
    playlist.splice(gearclicked, 1);
    channelUpdate();
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
		}).done(function(data) {
			if (prevdata == noconnection) {
				$("#maincontrols").finish().slideDown();
				hint("Successfully reconnected to the server.");
			}
			else if (prevdata == timeoverflow) {
				$("#maincontrols").finish().slideDown();
				hint("The server finally responded.");
			}
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
}
function sync(locally = false) {
    $("#loading").stop().fadeIn();
    $.post("post.php", {
        cmd: 6
    }, function(data) {
        if (JSON.stringify(playlist) != data) {
            if (locally) {
                $.post("post.php", {
                    cmd: 5,
                    arg: JSON.stringify(playlist)
                });
            }
            else {
                playlist = JSON.parse(data);
                channelUpdate(false);              
            }
        }
        $("#loading").hide();
    });
}
function findChannel(name) {
    $("input").blur();
    $("#loading").stop().fadeIn();
    $.get("http://www.radio-browser.info/webservice/json/stations/byname/" + name, function(data) {
        $("#results").empty();
        var sum = 0;
        for(i = 0; i < data.length; i++) {
            if (data[i].lastcheckok == "1") {
                var current = "<div><a data-dismiss='modal' class='white' onclick='addChannel(\"" + data[i].id + "\", \"" + data[i].favicon + "\", \"" + data[i].country + "," + data[i].state + "," + data[i].tags + "\")' ><div class='media-body'><h4 class='media-heading'>" + data[i].name + "</h4><p class='text-muted'><span class='label'>" + data[i].country + "</span> <span class='label'>" + data[i].state + "</span> ";
                if (data[i].tags != "") { 
                    for(z = 0; z < data[i].tags.split(",").length; z++) {
                        current += "<span class='label'>" + data[i].tags.split(",")[z] + "</span> "
                    }
                }
                else {
                    current += "<br>";
                }
                current += "</p></div></a></div>";
                $("#results").append(current);
                sum++;
            }
        }
        if(sum == 0) {
            $("#results").html("<div style='font-size: 18px; text-align: center'><i class='fa fa-fw fa-meh-o'></i>Oops! No matching stations found.</div>");
        }
        $("#loading").hide();
        $("#results").show(400);
    });
}
var prevcolor;
function changeColor(gray = undefined) {        
    var color;
    if (gray) {
        color = '#333333;';
    }
    else {
        color = 'hsl(' + Math.floor(Math.random() * 360) + ', 50%, 30%);';
    }
    prevcolor = color;
    $(".text-primary, .btn-link:not(.white)").finish().animate({
        "color": color
    }, 2000); 
    $("body, .section-primary").finish().animate({
        "background-color": color
    }, 2000, function() {
        $("#brush").children().removeClass("fa-refresh fa-spin disabled").addClass("fa-paint-brush");
        $("#brush").css({'cursor': 'pointer'});
    }); 
    $("#brush").children().removeClass('fa-paint-brush').addClass('fa-refresh fa-spin disabled');
    $("#brush").stop().animate({'width': '50px', 'height': '50px'});
    $("#brush").children().stop().animate({'margin': '20px'});
    $("#brush").css({'cursor': 'auto'});
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
