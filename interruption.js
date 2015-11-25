var score;
var sessionID;
var intro = new Audio('audio/intro.m4a'); //"Welcome! Today you be playing a game. I’m here to give you notifications. Go ahead and read the instructions on the right, then get started. Have fun!"
var goodJob = new Audio('audio/good_job.m4a'); //"Good job"
var tooLate = new Audio('audio/too_late.m4a'); //"Sorry. You're out of time."
var almostDone = new Audio('audio/almost_done.m4a'); //"You have 1 more minute to play and finish any last tasks."

var Item = function (name, siblings) {
    this.name = name;
    this.touched = false;
    this.waiting = false;
    this.siblings = siblings;
    siblings.push(this);
}

//1. 1 thing, right now
var phoneTaskObjs = []; //"The phone is ringing. Answer it."
var phone = new Item('phone', phoneTaskObjs);

//5. multiple things, right now
var chopTaskObjs = []; //"It's time get the vegetables from the fridge and chop them, and put them in the pot for dinner"
var fridge = new Item('fridge', chopTaskObjs);
var cuttingboard = new Item('cuttingboard', chopTaskObjs);
var knife = new Item('knife', chopTaskObjs);
var littlepot = new Item('littlepot', chopTaskObjs);

//6. 1 thing, soon
var medicineTaskObjs = []; //"In the next two minutes, you need to take your medicine."
var medicine = new Item('medicine', medicineTaskObjs);

//3. multiple things, soon
var dishwasherTaskObjs = []; //"In the next two minutes, empty the dishwasher and put the plates in the cabinet."
var dishwasher = new Item('dishwasher', dishwasherTaskObjs);
var cabinet = new Item('cabinet', dishwasherTaskObjs);

//2. 1 thing, whenever
var clockTaskObjs = []; //"At some point, be sure to wind the grandfather clock."
var grandfatherclock = new Item('clock', clockTaskObjs);

//4. multiple things, whenever
var plantsTaskObjs = []; //At some point, make sure to water all the plants. There are 6 of them."
var plant1 = new Item('plant1', plantsTaskObjs);
var plant2 = new Item('plant2', plantsTaskObjs);
var plant3 = new Item('plant3', plantsTaskObjs);
var plant4 = new Item('plant4', plantsTaskObjs);
var plant5 = new Item('plant5', plantsTaskObjs);
var plant6 = new Item('plant6', plantsTaskObjs);

//other future options
//  Wash your hair, then comb and blowdry it.
//  "At some point today, be sure to make the bed and fluff the pillows."
//  "Right now, stoke the fire."
//  "The toast is ready! Get it before it burns!");


//
function getSession(){
    var locate = window.location.toString();
    var point = locate.indexOf("=");
    sessionID = locate.substring(point+1,locate.length);
}

//call different tasks at the appropriate time, with the appropriate initiation message
function tasks() {
    score = 0;
    _LTracker.push({
	'session': sessionID,
	'event': 'initiate-game',
	'score': score,
});
    intro.play();
    
    //1 minute for reading instructions and getting started
    
    window.setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'phonePrompt','score': score,});
	task(phoneTaskObjs, 10000, new Audio('audio/phonePrompt.m4a'));
	//"The phone is ringing. Answer it."
    }, 60000);

    //10s for doing the task
    //15s for playing the game

    window.setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'clockPrompt','score': score,});
	task(clockTaskObjs, null, new Audio('audio/clockPrompt.m4a'));
	//"At some point, be sure to wind the grandfather clock."
    }, 85000);

    //20s for playing the game

    window.setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'dishwasherPrompt','score': score,});
	task(dishwasherTaskObjs, 60000, new Audio('audio/dishwasherPrompt.m4a'));
	//"In the next minute, empty the dishwasher and put the plates in the cabinet."
    }, 105000);

    //60s for accomplishing this task
    //10s for transitioning (?)

    window.setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'plantsPrompt','score': score,});
	task(plantsTaskObjs, null, new Audio('audio/plantsPrompt.m4a'));
	//At some point, make sure to water all the plants. There are 6 of them."
    }, 175000);

    //15s for playing the game
    
    window.setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'chopPrompt','score': score,});
	task(chopTaskObjs, 10000, new Audio('audio/chopPrompt.m4a'));
	//"It's time get the vegetables from the fridge and chop them, and put them in the pot for dinner"
    }, 190000);

    //10s for accomplishing the task
    //20s for playing the game
        
    window.setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'medicinePrompt','score': score,});
	task(medicineTaskObjs, 60000, new Audio('audio/medicinePrompt.m4a'));
	//"In the next minute, you need to take your medicine."
    }, 220000);

    //40s buffer

    setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'almostDonePrompt','score': score,});
	almostDone.play();
    }, 260000);
    
    //20s till task time is up
    //40s till game time is up
    
    setTimeout(function() {
	_LTracker.push({'session': sessionID,'event': 'endOfSession','score': score,});
	var tot = score + size - 1;
	$('#game').hide();
	$('#instructions').hide();
	$('#doors').hide();
	$('#back').hide();
	$('#score').hide();
	$('#bedroom').hide();
	$('#kitchen').hide();
	$('#livingroom').hide();
	$('#bathroom').hide();
	alert("Time's up! Thank you for participating. Your final score was " + tot);
    }, 300000);
    
}

//perform a task that involves "touching" all the objects in the list in the given amount of time
function task(objList, time, prompt) {
    prompt.play();
    for (var i=0; i<objList.length; i++) {
	objList[i].touched = false;
	objList[i].waiting = true;
    }
    //if there is a time specified, the task must happen within that amount time. Otherwise, it can happen at any point
    if (time!=null) {
	setTimeout(function() {
	    checkTimeout(objList);
	}, time)
    }
}

//basic interaction with an object
//if it's waiting, then label it "touched"
function touch(obj) {
    var description = 'touch_' + obj.name;
    _LTracker.push({'session': sessionID,'event': description,'score': score,});
    if (obj.waiting) {
	obj.touched = true;
	checkTouch(obj);
    }
}

//clicking on a button that doesn't have an associated object (ie. the wrong one)
function falseTouch(name) {
    var s = 'falseTouch_' + name
    _LTracker.push({'session': sessionID,'event': s,'score': score,});
}

//check an object because it's been touched
function checkTouch(obj) {
    //if it's not waiting, we don't even care
    if (obj.waiting) {
	var objList = obj.siblings;
	for (var i=0;i<objList.length;i++) {
	    //if any of them were not touched, return and don't worry about going farther
	    if (!objList[i].touched) {
		return;
	    }
	}
	//if we get to the end and they were all touched, give the user points, and make them all stop waiting
	_LTracker.push({'session': sessionID,'event': 'finishTask','score': score,});
	goodJob.play();
	score = score + 10;
	$('#canvas').trigger('updateScore', score);
	for (var i=0;i<objList.length;i++) {
	    objList[i].waiting = false;
	}
    }
}

//check an object list because time is up
function checkTimeout(objList) {
    //if the objects are still waiting, then it means the person was too late
    //if any are waiting, they should all be waiting
    if (objList[0].waiting) {
	_LTracker.push({'session': sessionID,'event': 'failTask','score': score,});
	tooLate.play();
	for (var i=0;i<objList.length;i++) {
	    objList[i].waiting = false;
	}
    }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
