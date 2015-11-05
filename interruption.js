var score;

var phone_touched;
var phone_waiting;
var toast_touched;
var toast_waiting;
var toiletbrush_touched;
var toiletbrush_waiting;
var toilet_touched;
var toilet_waiting;

function tasks() {
    score = 0;
    window.setTimeout(phone, 3000);
    window.setTimeout(toast, 60000);
    window.setTimeout(toilet,30000);
}

/** Phone task */
function phone() {
    alert("The phone is ringing! Answer it!");
    phone_touched = false;
    phone_waiting = true;
    window.setTimeout(checkPhone, 4000);
}
function phoneTouched() {
    phone_touched = true;
    checkPhone();
}
function checkPhone() {
    if (phone_waiting) {
	phone_waiting = false;
	if (!phone_touched) {
	    alert("Out of time to answer the phone");
	} else {
	    alert("Good job!");
	    score = score + 10;
	    $('#canvas').trigger('updateScore', score);
	    phone_touched = false;
	}
    }
}

/** Toast task */
function toast() {
    alert("The toast is ready! Get it before it burns!");
    toast_touched = false;
    toast_waiting = true;
    window.setTimeout(checkToast, 6000);
}
function toastTouched() {
    toast_touched = true;
    checkToast();
}
function checkToast() {
    if (toast_waiting) {
	toast_waiting = false;
	if (!toast_touched) {
	    alert("The toast burned.");
	} else {
	    alert("Good job!");
	    score = score + 10;
	    $('#canvas').trigger('updateScore', score);
	    toast_touched = false;
	}
    }
}

/** Toilet task */
function toilet() {
    alert("At some point, make sure to clean the toilet.");
    toiletbrush_touched = false;
    toilet_touched = false;
    toiletbrush_waiting = true;
    toilet_waiting = false;
}
function toiletbrushTouched() {
    if (toiletbrush_waiting) {
	toiletbrush_touched = true;
	toiletbrush_waiting = false;
	toilet_waiting = true;
    }
}
function toiletTouched() {
    if (toilet_waiting) {
	alert("Good job!");
	score = score + 10;
	$('#canvas').trigger('updateScore', score);
	toilet_waiting = false;
    }
}

/** Dishwaser task */
function dishwasher() {
    alert("In the next couple of minutes, empty the dishwasher and put the plates in the cabinet.");
    dishwasher_touched = false;
    plates_touched = false;
    dishwasher_waiting = true;
    plates_waiting = false;
    window.setTimeout(checkDishwasher, 120000);
}
function dishwasherTouched() {
    if (dishwasher_waiting) {
	dishwasher_touched = true;
	dishwasher_waiting = false;
	plates_waiting = true;
    }
}
function platesTouched() {
    if (plates_waiting) {
	alert("Good job!");
	score = score + 10;
	$('#canvas').trigger('updateScore', score);
	plates_waiting = false;
    }
}
function checkDishwasher() {
    
    if (phone_waiting) {
	phone_waiting = false;
	if (!phone_touched) {
	    alert("Out of time to answer the phone");
	} else {
	    alert("Good job!");
	    score = score + 10;
	    $('#canvas').trigger('updateScore', score);
	    phone_touched = false;
	}
    }
}
