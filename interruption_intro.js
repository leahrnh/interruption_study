var sessionID;

var instructions_1 = new Audio('audio/instructions_1.m4a'); //"The first part of the game is playing Snake. Click the black box to start right now, then use the arrow keys to turn the snake."
var instructions_2 = new Audio('audio/instructions_2.m4a'); //"If the snake hits the walls or itself, you die."
var instructions_3 = new Audio('audio/instructions_3.m4a'); //"Click the box again to pause the game."
var instructions_4 = new Audio('audio/instructions_4.m4a'); //"To get points, hit the red dots. This also increases the length of the snake. The longer the snake gets, the more points you get for each dot."
var instructions_5 = new Audio('audio/instructions_5.m4a'); //"Practice playing for a minute."
var instructions_6 = new Audio('audio/instructions_6.m4a'); //"The second component of the game is a house, with rooms. Here are the doors."
var instructions_7 = new Audio('audio/instructions_7.m4a'); //"Every so often, I will give you a task in the house, and you have to go click on the associated object. This will get you 20 points. For example, when I say the fireplace is dirty, you should go click on the fireplace. Try it now."
var instructions_8 = new Audio('audio/instructions_8.m4a'); //"Good job. With tasks like that, you can complete them whenever you want. However, some tasks are urgent, and must be completed within 10 second. For example, the television is on fire."
var instructions_9 = new Audio('audio/instructions_9.m4a'); //"There will be three rounds of the game, each with a different notification system. Time to start the first round."

var good_job = new Audio('audio/good_job.m4a');
var too_late = new Audio('audio/too_late.m4a');

var fireWaiting = false;
var tvWaiting = false;
var code;

//when entering from digit task, get session ID for use in logging
function getSession(){
    var locate = window.location.toString();
    var vars = locate.split("&");
    var sessionPair = vars[0].split("=");
    sessionID = sessionPair[1];
    var dsPair = vars[1].split("=");
    var ds = dsPair[1];
    getCode();
}

//decide on code based on a text file on the server. Goal is to evenly distribute people across settings
function getCode() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    code = "AA";
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                code = httpRequest.responseText;
            }
        }
    };
    httpRequest.open('GET', 'http://tts.speech.cs.cmu.edu/lnicolic/dialog/codes.php', false);
    httpRequest.send(null);
}

function introduction() {
    window.onload = function() {
        document.getElementById("doors").style.display = 'none';
    }
    gameStatus = 'stopped';
    totScore = 0;
    _LTracker.push({'session': sessionID, 'event': 'instructions_start', 'score': totScore, 'gameStatus': gameStatus});
    var time = 0;
    instructions_1.play(); //start playing
    time = time + 14000;
    window.setTimeout(function() {
        instructions_2.play(); //this is how you die
        _LTracker.push({'session': sessionID, 'event': 'instructions_die', 'score': totScore, 'gameStatus': gameStatus});
    }, time);
    time = time + 6000;
    window.setTimeout(function() {
        instructions_3.play(); //this is how to get points
        _LTracker.push({'session': sessionID, 'event': 'instructions_points', 'score': totScore, 'gameStatus': gameStatus});
    }, time);
    time = time + 14000;
    window.setTimeout(function() {
        instructions_4.play(); //this is how to pause
        _LTracker.push({'session': sessionID, 'event': 'instructions_pause', 'score': totScore, 'gameStatus': gameStatus});
    }, time);
    time = time + 10000;
    window.setTimeout(function() {
        die();
        totScore = 0;
        $('#canvas').trigger('updateScore', totScore);
        _LTracker.push({'session': sessionID, 'event': 'practice_start', 'score': totScore, 'gameStatus': gameStatus});
        instructions_5.play(); //practice playing for one minute
    }, time);
    time = time + 60000;
    window.setTimeout(function() {
        _LTracker.push({'session': sessionID, 'event': 'practice_end', 'score': totScore, 'gameStatus': gameStatus});
        die();
        totScore = 0;
        instructions_6.play(); //here are the doors.
    }, time);
    time = time + 5500;
    window.setTimeout(function() {
        $('#doors').show();
        instructions_7.play(); //Go click on the fire.
        fireWaiting = true;
    }, time);    
}

function touchTheFire() {
  if (fireWaiting) {
      _LTracker.push({'session': sessionID, 'event': 'touch_fire', 'score': totScore, 'gameStatus': gameStatus});
      instructions_8.play();
      fireWaiting = false;
      tvWaiting = true;
      window.setTimeout(function() {
          if (fireWaiting) {
              too_late.play();
              window.setTimeout(function () {
                  endRound();
              }, 3000);
          }
      }, 24000);
  }
}

function touchTelevision() {
    if (tvWaiting) {
        _LTracker.push({'session': sessionID, 'event': 'touch_television', 'score': totScore, 'gameStatus': gameStatus});
        good_job.play();
        window.setTimeout(function() {
            endRound();
        }, 2000)
    }
}

function endRound() {
    tvWaiting = false;
    instructions_9.play();
    window.setTimeout(function() {
        _LTracker.push({'session': sessionID, 'event': 'end_intro', 'score': totScore, 'gameStatus': gameStatus});
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
    }, 7000);
}

//clicking on a button that doesn't have an associated object (ie. the wrong one)
function falseTouch(name) {
    var event = 'falseTouch_' + name
    _LTracker.push({'session': sessionID, 'event': event, 'score': totScore, 'gameStatus': gameStatus});
}