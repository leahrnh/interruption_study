var score;
var intro = new Audio('audio/intro.m4a'); //"Welcome! Today you be playing a game. I’m here to give you notifications. Go ahead and read the instructions on the right, then get started. Have fun!"
var goodJob = new Audio('audio/good_job.m4a'); //"Good job"
var tooLate = new Audio('audio/too_late.m4a'); //"Sorry. You're out of time."

var Item = function (siblings) {
    this.touched = false;
    this.waiting = false;
    this.siblings = siblings;
    siblings.push(this);
}

var dishwasherTaskObjs = [];
var dishwasher = new Item(dishwasherTaskObjs);
var cabinet = new Item(dishwasherTaskObjs);

var phoneTaskObjs = [];
var phone = new Item(phoneTaskObjs);

var toastTaskObjs = [];
var toast = new Item(toastTaskObjs);


//call different tasks at the appropriate time, with the appropriate initiation message
function tasks() {
    score = 0;
    //intro.play();
    //task one: after 60s
    window.setTimeout(function() {
	task(phoneTaskObjs, 20000, new Audio('audio/phonePrompt.m4a'));
	//"The phone is ringing. Answer it."
    }, 20000);
    //task two: after another 40s
    window.setTimeout(function() {
	task(dishwasherTaskObjs, 60000, new Audio('audio/dishwasherPrompt.m4a'));
	//"In the next minute, empty the dishwasher and put the plates in the cabinet."
    }, 50000);
    //tast three: after another 80s
    window.setTimeout(function() {
	task(toastTaskObjs, 20000, new Audio('audio/toastPrompt.m4a'));
	//"The toast is ready! Get it before it burns!");
    }, 60000);
    
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
    if (obj.waiting) {
	obj.touched = true;
	checkTouch(obj);
    }
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
	tooLate.play();
	for (var i=0;i<objList.length;i++) {
	    objList[i].waiting = false;
	}
    }
}
