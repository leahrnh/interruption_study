var sessionID;
var mode;

var goodJob = new Audio('audio/good_job.m4a'); //"Good job"
var tooLate = new Audio('audio/too_late.m4a'); //"Sorry. You're out of time."

var excuseMe = new Audio('audio/excuseMe.m4a'); //Excuse me!
var preUrgentPrompt = new Audio('audio/urgent.m4a'); //Urgent!
var preRelaxPrompt = new Audio('audio/relax.m4a'); //When you have a minute

//Round settings
var round;
var code;
var room;
var notStyle;
var urg;
var obj1;
var audio1;
var obj2;
var audio2;

var Item = function (name) {
    this.name = name;
    this.touched = false;
    this.waiting = false;
}

//create things
var telephone = new Item('telephone');
var bed = new Item('alarmclock');
var toaster = new Item('toaster');
var pot = new Item('pot');
var bathtub = new Item('bathtub');
var sink = new Item('sink');

var event = '';


/**
 * set up configuration variables
 * assumes url ends with "?session=ID&code=CODE&round=ROUND"
 */
function initiate(){
    var locate = window.location.toString();
    var vars = locate.split("&");
    var sessionPair = vars[0].split("=");
    sessionID = sessionPair[1];
    var codePair = vars[1].split("=");
    code = codePair[1];
    var code1 = code.charAt(0); //A, B, C
    var code2 = code.charAt(1); //A, B, C, D, E, F
    var roundPair = vars[2].split("=");
    round = roundPair[1];


    if (round=="4") {
        window.location="http://tts.speech.cs.cmu.edu/lnicolic/dialog/survey.html?session="+sessionID+"&code="+code;
    } else {
        //deal with code
        setNotStyle(round, code1);
        setUrg(round, code2);
        setObjs(room, urg);
        tasks();
        gameStatus = "stopped";
        event = 'initiateRound';
        _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
        event = 'code_' + code;
        _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
        event = "round_" + round;
        _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
        event = "notificationStyle_" + notStyle;
        _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
        event = "room_" + room;
        _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
        event = "urg_" + urg;
        _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
    }
}

/**
 * Controls the pacing of the game and all secondary tasks.
 */
function tasks() {
    var time = 0;
    score = 0;

    time = time + 30000;

    window.setTimeout(function() {
        task(obj1, audio1);
    }, time);

    time = time + 30000;

    window.setTimeout(function() {
        task(obj2, audio2);
    }, time);

    time = time + 60000;

    window.setTimeout(function() {
        endRound();
    }, time);
}

/**
 * Conclude the round and display link to the appropriate next page
 */
function endRound() {
    event = "endRound";
    _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
    alert("Round Over. Final score " + totScore);
    $('#game').hide();
    $('#instructions').hide();
    $('#doors').hide();
    $('#back').hide();
    $('#totScore').hide();
    $('#bedroom').hide();
    $('#kitchen').hide();
    $('#livingroom').hide();
    $('#bathroom').hide();
    $('#continue').show();
}

/**
 * Trigger the start of a specific task, with its associated audio style
 * @param obj  the object to be touched
 * @param audio  the audio notification associated with it
 */
function task(obj, audio) {
    //decide how to play prompt based on notification style
    if (notStyle=="base") {
        event = 'startTask_' + obj.name;
        _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
        audio.play();
    } else if (notStyle=="pre") {
        _LTracker.push({'session':sessionID,'event':'interrupt', 'score':totScore, 'gameStatus':gameStatus});
        excuseMe.play();
        window.setTimeout(function () {
            event = 'startTask_' + obj.name;
            _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
            audio.play();
        }, 3000);
    } else if (notStyle=="urg") {
        if (urg=='urgent') {
            _LTracker.push({'session':sessionID,'event':'interrupt', 'score':totScore, 'gameStatus':gameStatus});
            preUrgentPrompt.play();
        } else {
            _LTracker.push({'session':sessionID,'event':'interrupt', 'score':totScore, 'gameStatus':gameStatus});
            preRelaxPrompt.play();
        }
        window.setTimeout(function () {
            event = 'startTask_' + obj.name;
            _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
            audio.play();
        }, 3000);
    } else {
        alert("Error: issue with notification style: " + notStyle);
    }

    obj.waiting = true;
    obj.touched = false;
    
    //if the task is urgent, it must happen within 10 seconds
    if (urg=="urgent") {
        setTimeout(function() {
            console.log("checking" + obj.name);
            check(obj);
        }, 10000);
    }
}

/**
 * Touch an object in order to complete a task
 * @param obj
 */
function touch(obj) {
    event = 'touch_' + obj.name;
    _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
    if (obj.waiting) {
	    obj.touched = true;
	    check(obj);
    }
}

/**
 * Touch an object not associated with a task (for logging purposes)
 * @param name
 */
function falseTouch(name) {
    event = 'falseTouch_' + name;
    _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
}

/**
 * Check an object because it's been touched or because time is up
 */
function check(obj) {
    //if it's not waiting, we don't even care (we also always expect it to be waiting when we check)
    if (obj.waiting) {
	    //if it's been touched, then you get points
	    if (obj.touched) {
            event = 'completeTask_' + obj.name;
            _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
	        goodJob.play();
	        taskPoints();
	    } else {
            event = 'failTask_' + obj.name;
            _LTracker.push({'session':sessionID,'event':event, 'score':totScore, 'gameStatus':gameStatus});
	        tooLate.play();
	    }
	    obj.waiting = false;
	    obj.touched = false;
    }
}

/**
 * look up and set room and notification style
 * @param round  round round number: 1, 2, or 3
 * @param code1  defines room and notification style: A, B, or C
 */
function setNotStyle(round, code1) {
    if (round=="1") {
        if (code1=="A") {
            room = "bedroom";
            notStyle = "base";
        } else if (code1=="B") {
            room = "kitchen";
            notStyle = "urg";
        } else if (code1=="C") {
            room = "bathroom";
            notStyle = "pre"
        } else {
            alert("Error: issue with code1: " + code1);
        }
    } else if (round=="2") {
        if (code1=="A") {
            room = "kitchen";
            notStyle = "pre";
        } else if (code1=="B") {
            room = "bathroom";
            notStyle = "base";
        } else if (code1=="C") {
            room = "bedroom";
            notStyle = "urg";
        } else {
            alert("Error: issue with code1: " + code1);
        }
    } else if (round=="3") {
        if (code1=="A") {
            room = "bathroom";
            notStyle = "urg";
        } else if (code1=="B") {
            room = "bedroom";
            notStyle = "pre";
        } else if (code1=="C") {
            room = "kitchen";
            notStyle = "base";
        } else {
            alert("Error: issue with code1: " + code1);
        }
    } else {
        alert("Error: issue with round number: " + round);
    }
}

/**
 * look up and set the urgency level
 * @param round  round number: 1, 2, or 3
 * @param code2  defines urgency type: A-F
 */
function setUrg(round, code2) {
    if (round=="1") {
        if (code2 == "A" || code2 == "B" || code2 == "F") {
            urg = "urgent"
        } else if (code2 == "C" || code2 == "D" || code2 == "E") {
            urg = "relax"
        } else {
            alert("Error: issue with code2: " + code2);
        }
    } else if (round=="2") {
        if (code2=="A" || code2=="C" || code2=="E") {
            urg = "urgent"
        } else if (code2=="B" || code2=="D" || code2=="F") {
            urg = "relax"
        } else {
            alert("Error: issue with code2: " + code2);
        }
    } else if (round=="3") {
        if (code2=="B" || code2=="C" || code2=="D") {
            urg = "urgent"
        } else if (code2=="A" || code2=="E" || code2=="F") {
            urg = "relax"
        } else {
            alert("Error: issue with code2: " + code2);
        }
    }
}

/**
 * Based on room and urgency level, set the objects that need to be clicked, and the associated notification audio
 * TODO add actual audio files
 * @param room  room notifications are in for this round
 * @param urg   urgent or relaxed
 */
function setObjs(room, urg) {
    if (room=="bedroom") {
        obj1 = telephone;
        obj2 = bed;
        if (urg=="urgent") {
            audio1 = new Audio('audio/telephone_urgent.m4a');
            audio2 = new Audio('audio/bed_urgent.m4a');
        } else if (urg=="relax") {
            audio1 = new Audio('audio/telephone_relax.m4a');
            audio2 = new Audio('audio/bed_relax.m4a');
        } else {
            alert("Error: issue with urgency: " + urg);
        }
    } else if (room=="kitchen") {
        obj1 = toaster;
        obj2 = pot;
        if (urg=="urgent") {
            audio1 = new Audio('audio/toaster_urgent.m4a');
            audio2 = new Audio('audio/pot_urgent.m4a');
        } else if (urg=="relax") {
            audio1 = new Audio('audio/toaster_relax.m4a');
            audio2 = new Audio('audio/pot_relax.m4a');
        } else {
            alert("Error: issue with urgency: " + urg);
        }

    } else if (room=="bathroom") {
        obj1 = bathtub;
        obj2 = sink;
        if (urg=="urgent") {
            audio1 = new Audio('audio/bathtub_urgent.m4a');
            audio2 = new Audio('audio/sink_urgent.m4a');
        } else if (urg=="relax") {
            audio1 = new Audio('audio/bathtub_relax.m4a');
            audio2 = new Audio('audio/sink_relax.m4a');
        } else {
            alert("Error: issue with urgency: " + urg);
        }

    } else {
        alert("Error: issue with room: " + room);
    }
}
