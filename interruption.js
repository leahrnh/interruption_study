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

//1. 1 thing, right now
var phoneTaskObjs = []; //"The phone is ringing. Answer it."
var phone = new Item(phoneTaskObjs);

//5. multiple things, right now
var chopTaskObjs = []; //"It's time get the vegetables from the fridge and chop them, and put them in the pot for dinner"
var fridge = new Item(chopTaskObjs);
var cuttingboard = new Item(chopTaskObjs);
var knife = new Item(chopTaskObjs);
var littlepot = new Item(chopTaskObjs);

//6. 1 thing, soon
var medicineTaskObjs = []; //"In the next two minutes, you need to take your medicine."
var medicine = new Item(medicineTaskObjs);

//3. multiple things, soon
var dishwasherTaskObjs = []; //"In the next two minutes, empty the dishwasher and put the plates in the cabinet."
var dishwasher = new Item(dishwasherTaskObjs);
var cabinet = new Item(dishwasherTaskObjs);

//2. 1 thing, whenever
var clockTaskObjs = []; //"At some point, be sure to wind the grandfather clock."
var grandfatherclock = new Item(clockTaskObjs);

//4. multiple things, whenever
var plantsTaskObjs = []; //At some point, make sure to water all the plants. There are 6 of them."
var plant1 = new Item(plantsTaskObjs);
var plant2 = new Item(plantsTaskObjs);
var plant3 = new Item(plantsTaskObjs);
var plant4 = new Item(plantsTaskObjs);
var plant5 = new Item(plantsTaskObjs);
var plant6 = new Item(plantsTaskObjs);

//other future options
//  Wash your hair, then comb and blowdry it.
//  "At some point today, be sure to make the bed and fluff the pillows."
//  "Right now, stoke the fire."
//  "The toast is ready! Get it before it burns!");


//call different tasks at the appropriate time, with the appropriate initiation message
function tasks() {
    score = 0;
    //intro.play();
    
    window.setTimeout(function() {
	task(phoneTaskObjs, 20000, new Audio('audio/phonePrompt.m4a'));
	//"The phone is ringing. Answer it."
    }, 3000);
    
    window.setTimeout(function() {
	task(chopTaskObjs, 20000, new Audio('audio/chopPrompt.m4a'));
	//"It's time get the vegetables from the fridge and chop them, and put them in the pot for dinner"
    }, 3000);
    
    window.setTimeout(function() {
	task(medicineTaskObjs, 20000, new Audio('audio/medicinePrompt.m4a'));
	//"In the next two minutes, you need to take your medicine."
    }, 1000);
    
    window.setTimeout(function() {
	task(dishwasherTaskObjs, 20000, new Audio('audio/dishwasherPrompt.m4a'));
	//"In the next two minutes, empty the dishwasher and put the plates in the cabinet."
    }, 1000);
    
    window.setTimeout(function() {
	task(clockTaskObjs, 20000, new Audio('audio/clockPrompt.m4a'));
	//"At some point, be sure to wind the grandfather clock."
    }, 1000);
    
     window.setTimeout(function() {
	 task(plantsTaskObjs, 20000, new Audio('audio/plantsPrompt.m4a'));
	 //At some point, make sure to water all the plants. There are 6 of them."
     }, 1000);

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
