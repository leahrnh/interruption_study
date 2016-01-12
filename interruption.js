var score;
var sessionID;
var mode;
var gameStatus;
var logString ="";

var intro = new Audio('audio/intro.m4a'); //"Welcome! Today you be playing a game. I’m here to give you notifications. Go ahead and read the instructions on the right, then get started. Have fun!"
var goodJob = new Audio('audio/good_job.m4a'); //"Good job"
var tooLate = new Audio('audio/too_late.m4a'); //"Sorry. You're out of time."
var almostDone = new Audio('audio/almost_done.m4a'); //"You have 1 more minute to play and finish any last tasks."

var excuseMe = new Audio('audio/excuseMe.m4a'); //Excuse me!
var preUrgentPrompt = new Audio('audio/urgent.m4a'); //Urgent!
var preRelaxPrompt = new Audio('audio/relax.m4a'); //When you have a minute

var Item = function (name, prompt_base, prompt_urgent, prompt_relax) {
    this.name = name;
    this.touched = false;
    this.waiting = false;
    //audio prompts
    this.base = prompt_base; //ex. "Click on the phone"
    this.urgent = prompt_urgent; //ex. "Click the phone right away"
    this.relax = prompt_relax; //ex. "Click the phone at some point"
}

//big things
var bed = new Item('bed', new Audio('audio/bedBase.m4a'),  new Audio('audio/bedUrgent.m4a'),  new Audio('audio/bedRelax.m4a'));
var television = new Item('television', new Audio('audio/televisionBase.m4a'),  new Audio('audio/televisionUrgent.m4a'),  new Audio('audio/televisionRelax.m4a'));
var stove = new Item('stove', new Audio('audio/stoveBase.m4a'),  new Audio('audio/stoveUrgent.m4a'),  new Audio('audio/stoveRelax.m4a'));
var bathtub = new Item('bathtub', new Audio('audio/bathtubBase.m4a'),  new Audio('audio/bathtubUrgent.m4a'),  new Audio('audio/bathtubRelax.m4a'));
var alarmclock = new Item('alarmclock', new Audio('audio/alarmclockBase.m4a'),  new Audio('audio/alarmclockUrgent.m4a'),  new Audio('audio/alarmclockRelax.m4a'));
var encyclopedia = new Item('encyclopedia', new Audio('audio/encyclopediaBase.m4a'),  new Audio('audio/encyclopediaUrgent.m4a'),  new Audio('audio/encyclopediaRelax.m4a'));
var toaster = new Item('toaster', new Audio('audio/toasterBase.m4a'),  new Audio('audio/toasterUrgent.m4a'),  new Audio('audio/toasterRelax.m4a'));
var hairdryer = new Item('hairdryer', new Audio('audio/hairdryerBase.m4a'),  new Audio('audio/hairdryerUrgent.m4a'),  new Audio('audio/hairdryerRelax.m4a'));


//when entering from digit task, get session ID for use in logging
function getSession(){
    var locate = window.location.toString();
    var vars = locate.split("&");
    sessionPair = vars[0].split("=");
    sessionID = sessionPair[1];
    dsPair = vars[1].split("=");
    var ds = dsPair[1];
    t = new Date().getTime();
    logString += ("\n" + t + "," + sessionID + "," + "digitSpan_" + ds + "," + score + "," + gameStatus + "," + mode);
    //var point = locate.indexOf("=");
    //sessionID = locate.substring(point+1,locate.length);
}

//wipe everything clean for a new round
function newRound(notice) {
    alert(notice);
    die();
    score = 0;
    $('#canvas').trigger('updateScore', score);
    size = 1;
    $('#size').trigger('updateGameScore', size);
    $("#dead").hide();
    $('#eor').show();  
}

//call different tasks at the appropriate time, with the appropriate initiation message
function tasks(roundList) {

    //init
    gameStatus = 'stopped'
    mode = 'intro'
    score = 0;
    _LTracker.push({'session': sessionID,'event': 'startRound_intro','score': score, 'gameStatus':gameStatus, 'mode':mode});
    t = new Date().getTime();
    logString += ("\n" + t + "," + sessionID + "," + "startRound_intro" + "," + score + "," + gameStatus + "," + mode);
    intro.play();
    var time = 0;
    time = time + 120000; //2 minutes for reading instructions and getting started (and baseline game score?)
    $('#canvas').trigger('updateScore', score);
    console.log("starting first task");
   
    window.setTimeout(function() {
	alert("End of intro. Initial score: " + score);
	newRound("Round one");
	_LTracker.push({'session': sessionID,'event': 'endRound0','score': score, 'gameStatus':gameStatus, 'mode':mode});
	t = new Date().getTime();
	logString += ("\n" + t + "," + sessionID + "," + "endRound0" + "," + score + "," + gameStatus + "," + mode);
	$('#canvas').trigger('updateScore', score);
	startRound(roundList[0], [bed, toaster, television, hairdryer, alarmclock, encyclopedia, stove, bathtub], ['urgent', 'urgent', 'relax', 'urgent', 'relax', 'relax', 'urgent', 'relax']);
    }, time);
    
    /*time = time + 300000; //5 minutes for a round
    window.setTimeout(function() {
	alert("Round Over. Final score " + score);
	_LTracker.push({'session': sessionID,'event': 'endRound1','score': score, 'gameStatus':gameStatus, 'mode':mode});
	t = new Date().getTime();
	logString += ("\n" + t + "," + sessionID + "," + "endRound1" + "," + score + "," + gameStatus + "," + mode);
	newRound("Round two");
	$('#canvas').trigger('updateScore', score);
	startRound(roundList[1], [hairdryer, television, alarmclock, stove, bathtub, toaster, bed, encyclopedia], ['relax', 'relax', 'urgent', 'relax', 'urgent', 'relax', 'urgent', 'urgent']);
    }, time);

    time = time + 300000; //5 minutes for a round
    window.setTimeout(function() {
	alert("Round Over. Final score " + score);
	_LTracker.push({'session': sessionID,'event': 'endRound2', 'score': score, 'gameStatus':gameStatus, 'mode':mode});
	t = new Date().getTime();
	logString += ("\n" + t + "," + sessionID + "," + "endRound2" + "," + score + "," + gameStatus + "," + mode);
	newRound("Round three");
	startRound(roundList[2], [alarmclock, hairdryer, bathtub, bed, television, toaster, encyclopedia, stove], ['urgent', 'relax', 'urgent', 'urgent', 'relax', 'relax', 'urgent', 'relax']);
    }, time);
  
    time = time + 300000; //5 minutes for a round*/

 setTimeout(function() {
	alert("Round Over. Final score " + score);
	_LTracker.push({'session': sessionID,'event': 'endRound3', 'score':score, 'gameStatus':gameStatus, 'mode':mode});
	t = new Date().getTime();
	logString += ("\n" + t + "," + sessionID + "," + "endRound3" + "," + score + "," + gameStatus + "," + mode);
	$('#game').hide();
	$('#instructions').hide();
	$('#doors').hide();
	$('#back').hide();
	$('#score').hide();
	$('#bedroom').hide();
	$('#kitchen').hide();
	$('#livingroom').hide();
     $('#bathroom').hide();
     $('#canvas').trigger('updateLog', logString);
	$('#survey').show();
    }, time);
    
}


//start one round, with the appropriate settings
//the lists should contain one of each object, and even numbers of urgencies (urgent or relaxed)
function startRound(newMode, objectList, urgencyList) {
    //some alert or something about starting the next round
    score = 0;
    mode = newMode;
    var time = 0;
    var status = 'startRound_' + newMode;
    _LTracker.push({'session': sessionID,'event': status, 'score': score, 'gameStatus':gameStatus, 'mode':mode});
    t = new Date().getTime();
    logString += ("\n" + t + "," + sessionID + "," + status + "," + score + "," + gameStatus + "," + mode);
    for (var i=0; i<objectList.length; i++) {
	time = time + 30000;
	var obj = objectList[i];
	var urgLevel = urgencyList[i];
	window.setTimeout(task.bind(this, obj, urgLevel), time);
    }
}

//perform a task that involves the specified object in the specified amount of time
function task(obj, urgency) {
    var status = 'startTask_' + obj.name + "_" + urgency;
    _LTracker.push({'session': sessionID,'event': status, 'score': score, 'gameStatus':gameStatus, 'mode':mode});
    t = new Date().getTime();
    logString += ("\n" + t + "," + sessionID + "," + status + "," + score + "," + gameStatus + "," + mode);
    console.log("task", obj, urgency);

    //decide how to play prompt based on mode and urgency
    if (mode=='NoPre') {
	if (urgency=='urgent') {
	    obj.urgent.play();
	} else if (urgency =='relax') {
	    obj.relax.play();
	}
    } else if (mode=='PreUrg') {
	if (urgency=='urgent') {
	    preUrgentPrompt.play();
	} else {
	    preRelaxPrompt.play();
	}
	window.setTimeout(function() {
	    _LTracker.push({'session': sessionID,'event': 'remaining_notification', 'score':score, 'gameStatus':gameStatus, 'mode':mode});
	    t = new Date().getTime();
	    logString += ("\n" + t + "," + sessionID + "," + "remaining_notification" + "," + score + "," + gameStatus + "," + mode);
	    obj.base.play();
	}, 3000);
    }
    else if (mode=='PreBase') {
	excuseMe.play()
	setTimeout(function() {
	    _LTracker.push({'session': sessionID,'event': 'remaining_notification', 'score':score, 'gameStatus':gameStatus, 'mode':mode});
	    t = new Date().getTime();
	    logString += ("\n" + t + "," + sessionID + "," + "remaining_notification" + "," + score + "," + gameStatus + "," + mode);
	    if (urgency=='urgent') {
		obj.urgent.play();
	    } else if (urgency =='relax') {
		obj.relax.play();
	    }
	}, 3000);
    }

    obj.waiting = true;
    obj.touched = false;
    
    //if the task is urgent, it must happen within 20 seconds
    if (urgency=='urgent') {
	setTimeout(function() {
	    console.log("checking" + obj.name);
	    check(obj);
	}, 10000);
    }
}

//basic interaction with an object
//if it's waiting, then label it "touched"
function touch(obj) {
    console.log("touched " + obj.name);
    var description = 'touch_' + obj.name;
    _LTracker.push({'session':sessionID,'event':description, 'score':score, 'gameStatus':gameStatus, 'mode':mode});
    t = new Date().getTime();
    logString += ("\n" + t + "," + sessionID + "," + description + "," + score + "," + gameStatus + "," + mode);
    if (obj.waiting) {
	obj.touched = true;
	check(obj);
    }
}

//clicking on a button that doesn't have an associated object (ie. the wrong one)
function falseTouch(name) {
    var s = 'falseTouch_' + name
    _LTracker.push({'session':sessionID,'event':s, 'score':score, 'gameStatus':gameStatus, 'mode':mode});
    t = new Date().getTime();
    logString += ("\n" + t + "," + sessionID + "," + s + "," + score + "," + gameStatus + "," + mode);
}

//check an object because it's been touched or because time is up
function check(obj) {
    //if it's not waiting, we don't even care (we also always expect it to be waiting when we check)
    if (obj.waiting) {
	//if it's been touched, then you get points
	if (obj.touched) {
	    var status = 'completeTask_' + obj.name;
	    _LTracker.push({'session':sessionID,'event':status, 'score':score, 'gameStatus':gameStatus, 'mode':mode});
	    t = new Date().getTime();
	    logString += ("\n" + t + "," + sessionID + "," + status + "," + score + "," + gameStatus + "," + mode);
	    goodJob.play();
	    score = score + 10;
	    $('#canvas').trigger('updateScore', score);
	} else {
	    var status = 'failTask_' + obj.name;
	    _LTracker.push({'session':sessionID,'event':status, 'score':score, 'gameStatus':gameStatus, 'mode':mode});
	    t = new Date().getTime();
	    logString += ("\n" + t + "," + sessionID + "," + status + "," + score + "," + gameStatus + "," + mode);
	    tooLate.play();
	}
	obj.waiting = false;
	obj.touched = false;
    }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}




//other phrase possibilities
//  Wash your hair, then comb and blowdry it.
//  "At some point today, be sure to make the bed and fluff the pillows."
//  "Right now, stoke the fire."
//  The toast is ready! Get it before it burns!
//  At some point, make sure to water all the plants. There are 6 of them."
//  At some point, be sure to wind the grandfather clock."
//  In the next two minutes, empty the dishwasher and put the plates in the cabinet.
//  In the next two minutes, you need to take your medicine.
//  It's time get the vegetables from the fridge and chop them, and put them in the pot for dinner
//  The phone is ringing. Answer it.
