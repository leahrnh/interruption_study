var diplayNum;
var truth;
var index;
var interval;
var length;
var sessionID;
var dsScore;

var testAudio = new Audio('audio/testing.m4a');

//when entering from mturk, get workerID / sessionID
function getSession(){
    var locate = window.location.toString();
    sessionPair = locate.split("=");
    sessionID = sessionPair[1];
    console.log("Session: " + sessionID);
}

function initiate() {
    length = 3;
    iteration = 1;
    wrong = 0;
    //sessionID = '' + getRandomInt(100000, 999999);
    getSession();
    _LTracker.push({'session': sessionID,'event':'initiate_study','score': 0, 'gameStatus':'none', 'mode':'digitTask'});
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
	_LTracker.push({'session': sessionID,'event':scoreString,'score': 0, 'gameStatus':'none', 'mode':'digitTask'});
	//$('#digitDisplay').trigger('showDigit', "Your digit span score is: " + score);
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

/*function continue() {
    //var s = 'mturk_game.html?session=' + sessionID;
    window.location=mturk_game.html;
}*/


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
/*function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}*/
