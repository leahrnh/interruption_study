var sessionID;
var mode;

var goodJob = new Audio('audio/good_job.m4a'); //"Good job"
var tooLate = new Audio('audio/too_late.m4a'); //"Sorry. You're out of time."

var instructions_1 = new Audio('audio/instructions_1.m4a');
var instructions_2 = new Audio('audio/instructions_2.m4a');
var instructions_3 = new Audio('audio/instructions_3.m4a');
var instructions_4 = new Audio('audio/instructions_4.m4a');
var instructions_5 = new Audio('audio/instructions_5.m4a');
var instructions_6 = new Audio('audio/instructions_6.m4a');
var instructions_7 = new Audio('audio/instructions_7.m4a');
var instructions_8 = new Audio('audio/instructions_8.m4a');

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

var bed = new Item('bed', new Audio('audio/bedBase.m4a'),  new Audio('audio/bedUrgent.m4a'),  new Audio('audio/bedRelax.m4a'));
var television = new Item('television', new Audio('audio/televisionBase.m4a'),  new Audio('audio/televisionUrgent.m4a'),  new Audio('audio/televisionRelax.m4a'));
var stove = new Item('stove', new Audio('audio/stoveBase.m4a'),  new Audio('audio/stoveUrgent.m4a'),  new Audio('audio/stoveRelax.m4a'));
var bathtub = new Item('bathtub', new Audio('audio/bathtubBase.m4a'),  new Audio('audio/bathtubUrgent.m4a'),  new Audio('audio/bathtubRelax.m4a'));
var alarmclock = new Item('alarmclock', new Audio('audio/alarmclockBase.m4a'),  new Audio('audio/alarmclockUrgent.m4a'),  new Audio('audio/alarmclockRelax.m4a'));
var telephone = new Item('telephone', new Audio('audio/telephoneBase.m4a'),  new Audio('audio/telephoneUrgent.m4a'),  new Audio('audio/telephoneRelax.m4a'));
var toaster = new Item('toaster', new Audio('audio/toasterBase.m4a'),  new Audio('audio/toasterUrgent.m4a'),  new Audio('audio/toasterRelax.m4a'));
var hairdryer = new Item('hairdryer', new Audio('audio/hairdryerBase.m4a'),  new Audio('audio/hairdryerUrgent.m4a'),  new Audio('audio/hairdryerRelax.m4a'));


//when entering from digit task, get session ID for use in logging
function getSession(){
    var locate = window.location.toString();
    var vars = locate.split("&");
    var sessionPair = vars[0].split("=");
    sessionID = sessionPair[1];
    var dsPair = vars[1].split("=");
    var ds = dsPair[1];
}

function introduction() {
    gameStatus = 'stopped';
    mode = 'intro';
    totScore = 0;
    _LTracker.push({'session': sessionID,'event': 'startRound_instructions','score': totScore, 'gameStatus':gameStatus, 'mode':mode});
    var time = 0;
    instructions_1.play(); //start playing
    time = time + 18000;
    window.setTimeout(function() {
        instructions_2.play(); //this is how you die
    }, time);
    time = time + 10000;
    window.setTimeout(function() {
        instructions_3.play(); //this is how to get points
    }, time);
    time = time + 12000;
    window.setTimeout(function() {
        instructions_4.play(); //this is how to pause
    }, time);
    time = time + 10000;
    window.setTimeout(function() {
        die();
        totScore = 0;
        $('#canvas').trigger('updateScore', totScore);
        _LTracker.push({'session': sessionID,'event': 'startRound_practice','score': totScore, 'gameStatus':gameStatus, 'mode':mode});
        instructions_5.play(); //practice playing for one minute
    }, time);
    time = time + 60000;
    window.setTimeout(function() {
        _LTracker.push({'session': sessionID,'event': 'endRound_practice','score': totScore, 'gameStatus':gameStatus, 'mode':mode});
        die();
        totScore = 0;
        instructions_6.play(); //here are the doors.
    }, time);
    time = time + 5500;
    window.setTimeout(function() {
        $('#doors').show();
        instructions_7.play(); //Go click on the dishwasher.
    }, time);    
}

//call different tasks at the appropriate time, with the appropriate initiation message
function tasks(roundList) {
    time = 0;
    instructions_8.play();
    time = time + 18000
   
    window.setTimeout(function() {
        alert("End of intro.");
        $('#canvas').trigger('updateScore', totScore);
        console.log("starting first task");
        newRound("Round one");
        _LTracker.push({'session': sessionID,'event': 'endRound0','score': totScore, 'gameStatus':gameStatus, 'mode':mode});
        $('#canvas').trigger('updateScore', totScore);
        startRound(roundList[0], [bed, toaster, television, hairdryer, alarmclock, telephone, stove, bathtub], ['urgent', 'urgent', 'relax', 'urgent', 'relax', 'relax', 'urgent', 'relax']);
    }, time);
    
    time = time + 300000; //5 minutes for a round
    window.setTimeout(function() {
        alert("Round Over. Final totScore " + totScore);
        _LTracker.push({'session': sessionID,'event': 'endRound1','score': totScore, 'gameStatus':gameStatus, 'mode':mode});
        newRound("Round two");
        $('#canvas').trigger('updateScore', totScore);
        startRound(roundList[1], [hairdryer, television, alarmclock, stove, bathtub, toaster, bed, telephone], ['relax', 'relax', 'urgent', 'relax', 'urgent', 'relax', 'urgent', 'urgent']);
    }, time);

    time = time + 300000; //5 minutes for a round
    window.setTimeout(function() {
        alert("Round Over. Final totScore " + totScore);
        _LTracker.push({'session': sessionID,'event': 'endRound2', 'score': totScore, 'gameStatus':gameStatus, 'mode':mode});
        newRound("Round three");
        startRound(roundList[2], [alarmclock, hairdryer, bathtub, bed, television, toaster, telephone, stove], ['urgent', 'relax', 'urgent', 'urgent', 'relax', 'relax', 'urgent', 'relax']);
    }, time);

    time = time + 300000; //5 minutes for a round

    setTimeout(function() {
        alert("Round Over. Final totScore " + totScore);
        _LTracker.push({'session': sessionID,'event': 'endRound3', 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
        $('#game').hide();
	$('#instructions').hide();
        $('#doors').hide();
        $('#back').hide();
        $('#totScore').hide();
        $('#bedroom').hide();
        $('#kitchen').hide();
        $('#livingroom').hide();
        $('#bathroom').hide();
        //$('#canvas').trigger('updateLog', logString);
	$('#continue').show();
    }, time);

}


//start one round, with the appropriate settings
//the lists should contain one of each object, and even numbers of urgencies (urgent or relaxed)
function startRound(newMode, objectList, urgencyList) {
    //some alert or something about starting the next round
    totScore = 0;
    mode = newMode;
    var time = 0;
    var status = 'startRound_' + newMode;
    _LTracker.push({'session': sessionID,'event': status, 'score': totScore, 'gameStatus':gameStatus, 'mode':mode});
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
    _LTracker.push({'session': sessionID,'event': status, 'score': totScore, 'gameStatus':gameStatus, 'mode':mode});
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
	    _LTracker.push({'session': sessionID,'event': 'remaining_notification', 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
	    obj.base.play();
	}, 3000);
    }
    else if (mode=='PreBase') {
	excuseMe.play()
	setTimeout(function() {
	    _LTracker.push({'session': sessionID,'event': 'remaining_notification', 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
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
    _LTracker.push({'session':sessionID,'event':description, 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
    if (obj.waiting) {
	obj.touched = true;
	check(obj);
    }
}

//clicking on a button that doesn't have an associated object (ie. the wrong one)
function falseTouch(name) {
    var s = 'falseTouch_' + name
    _LTracker.push({'session':sessionID,'event':s, 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
}

//check an object because it's been touched or because time is up
function check(obj) {
    //if it's not waiting, we don't even care (we also always expect it to be waiting when we check)
    if (obj.waiting) {
	//if it's been touched, then you get points
	if (obj.touched) {
	    var status = 'completeTask_' + obj.name;
	    _LTracker.push({'session':sessionID,'event':status, 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
	    goodJob.play();
	    taskPoints();
	} else {
	    var status = 'failTask_' + obj.name;
	    _LTracker.push({'session':sessionID,'event':status, 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
	    tooLate.play();
	}
	obj.waiting = false;
	obj.touched = false;
    }
}