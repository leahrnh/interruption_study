var score;

//phone task
var phone = new Object();
phone.fail = "Too late: the phone stopped ringing.";
phone.touched = false;
phone.waiting = false;
phone.time = 5000;
phone.next = null;
phone.last = phone;


//toast task
var toast = new Object();
toast.fail = "Too late. The toast burned.";
toast.touched = false;
toast.waiting = false;
toast.time = 5000;
toast.next = null;
toast.last = toast;


//toilet cleaning tast
var toilet = new Object();
toilet.fail = null;
toilet.touched = false;
toilet.waiting = false;
toilet.time = null;
toilet.next = null;
toilet.last = toilet;

var toiletbrush = new Object();
toiletbrush.fail = null;
toiletbrush.touched = false;
toiletbrush.waiting = false;
toiletbrush.time = null;
toiletbrush.next = toilet;
toiletbrush.last = toilet;


//dishwasher task
var cabinet = new Object();
cabinet.fail = "Too slow :(";
cabinet.touched = false;
cabinet.waiting = false;
cabinet.time = null;
cabinet.next = null;
cabinet.last = cabinet;

var dishwasher = new Object();
dishwasher.fail = "Too slow :(";
dishwasher.touched = false;
dishwasher.waiting = false;
dishwasher.time = 60000;
dishwasher.next = cabinet;
dishwasher.last = cabinet;


//call different tasks at the appropriate time, with the appropriate initiation message
function tasks() {
    score = 0;
    window.setTimeout(function() {
	task(phone, "The phone is ringing! Answer it!");
    }, 3000);
    window.setTimeout(function() {
	task(toast, "The toast is ready! Get it before it burns!");
    }, 20000);
    window.setTimeout(function() {
	task(toiletbrush, "At some point, make sure to clean the toilet.");
    }, 60000);
    window.setTimeout(function() {
	task(dishwasher, "In the next minute, empty the dishwasher and put the plates in the cabinet.");
    }, 120000);
}

//perform a task that begins with an object, using the specified initiation message
function task(obj, msg) {
    alert(msg);
    obj.touched = false;
    obj.waiting = true;
    //if the object has a time specified, the task must happen within that amount time. Otherwise, it can happen at any point
    if (obj.time!=null) {
	setTimeout(function() {
	    check(obj);
	}, obj.time)
    }
}

//basic interaction with an object
//if it's waiting, then label it "touched"
function touch(obj) {
    if (obj.waiting) {
	obj.touched = true;
	//if it's has a next object, initiate that one so that it's waiting
	if (obj.next!=null) {
	    obj.next.touched = false;
	    obj.next.waiting = true;
	} else {
	    //if it doesn't have a next object, check this one and assign points
	    check(obj);
	}
    }
}

//check an object, either because it's just been touched, or because its time has run out
function check(obj) {
    //we only care if it's waiting. otherwise a touch means nothing
    if (obj.waiting) {
	obj.waiting = false;
	//if it's waiting and it's been touched and it has no next, give the player credit
	if (obj.touched) {
	    if (obj.next==null) {
		alert("Good job!");
		score = score + 10;
		$('#canvas').trigger('updateScore', score);
	    } else {
		//if it has a next, we should check that instead
		check(obj.next);
	    }
	    obj.touched = false;
	} else {
	    //if it's waiting but hasn't been touched, that's a fail
	    alert (obj.fail);
	}
    }
}
