var diplayNum;
var truth;
var index;
var interval;
var length;
var workerID;
var dsScore;

//when entering from mturk, get workerID / workerID
function getSessionID(){
    var locate = window.location.toString();
    sessionPair = locate.split("=");
    workerID = sessionPair[1];
}

function initiate() {
    length = 3;
    iteration = 1;
    wrong = 0;
    //sessionID = '' + getRandomInt(100000, 999999);
    getSessionID();
}

function run() {
    index = length;
    truth = "";
    $("#startButton").hide();
    interval = setInterval(function() {
	nextDigit();
    }, 1000);
}


function nextDigit() {
    if (index > 0) {
	var digit = getRandomInt(1,10);
	$('#digitDisplay').trigger('showDigit', digit);
	setTimeout(function() {
	    $('#digitDisplay').trigger('showDigit', " ");
	}, 500);
	truth = truth.concat(digit);
	index--;
    } else {
	$('#digitDisplay').trigger('showDigit', " ");
	endloop();
	clearInterval(interval);
    }
}

function endloop() {
    $("#digitDisplay").hide();
    $("#entry").show();
    $('#intro').trigger('changeButton', "Next");
}

function calc() {
    var guess = document.getElementById("guessbox").value;
    $("#digitDisplay").show();
    $("#entry").hide();
    $('#guessbox').val('');
    $("#startButton").show();
    /*if (guess!=truth) {
	wrong++;
	$('#digitDisplay').trigger('showDigit', "Incorrect. You said " + guess + " but the answer was " + truth);
    } else {
	$('#digitDisplay').trigger('showDigit', "Correct!");
	}*/
    if (guess!=truth) {
	wrong++;
    }
    $('#digitDisplay').trigger('showDigit', "");
    truth="";
    if (wrong > 1) {
	dsScore = length - 1;
	var scoreString = 'digitSpanScore_' + dsScore;
	_LTracker.push({'session': workerID,'event':scoreString,'score': 0, 'gameStatus':'digitspan'});
	//$('#digitDisplay').trigger('showDigit', "Your digit span totScore is: " + totScore);
	$('#digitDisplay').trigger('showDigit', "");
	$("#startButton").hide();
	$("#testAndCont").show();
    }
    iteration++;
    if (iteration > 2) {
	length ++;
	iteration = 1;
	wrong = 0;
	$('#intro').trigger('showLength', length);
    }
    
}


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}