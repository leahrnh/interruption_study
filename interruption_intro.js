var sessionID;

var instructions_1 = new Audio('audio/instructions_1.m4a'); //"The first part of the game is playing Snake. Click the black box to start right now, then use the arrow keys to turn the snake."
var instructions_2 = new Audio('audio/instructions_2.m4a'); //"If the snake hits the walls or itself, you die."
var instructions_3 = new Audio('audio/instructions_3.m4a'); //"Click the box again to pause the game."
var instructions_4 = new Audio('audio/instructions_4.m4a'); //"To get points, hit the red dots. This also increases the length of the snake. The longer the snake gets, the more points you get for each dot."
var instructions_5 = new Audio('audio/instructions_5.m4a'); //"Practice playing for a minute."
var instructions_6 = new Audio('audio/instructions_6.m4a'); //"The second component of the game is a house, with rooms. Here are the doors."
var instructions_7 = new Audio('audio/instructions_7.m4a'); //"Every so often, I will instruct you to click on something in the house. Right now, go click on the dishwasher."
var instructions_8 = new Audio('audio/instructions_8.m4a'); //"Good job! You get 10 points for each thing you find. For some, there will be a 10 second time limit, but others have unlimited time. There will be three rounds of the game, each with a different notification system. Time to start the first round."

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
    window.onload = function() {
        document.getElementById("doors").style.display = 'none';
    }
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

function endRound() {
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
}

//clicking on a button that doesn't have an associated object (ie. the wrong one)
function falseTouch(name) {
    var s = 'falseTouch_' + name
    _LTracker.push({'session':sessionID,'event':s, 'score':totScore, 'gameStatus':gameStatus, 'mode':mode});
}