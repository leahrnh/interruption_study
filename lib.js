var ctx;
var WIDTH;
var HEIGHT;

var dx = 20;
var dy = 20;
var dr = 10;

// 0: left
// 1: up
// 2: right
// 3: down
var direction;

var snake;
var food;
var id;

var size = 1;
var gameStatus;
var gameScore = 0;
var totScore = 0;



//monitor whether game is ongoing, paused, etc
var inprogress = false;
var paused = false;

//wipe everything clean for a new round
function newRound(notice) {
    alert(notice);
    die();
    totScore = 0;
    $('#canvas').trigger('updateScore', 0);
    size = 1;
    //$('#size').trigger('updateGameScore', calculateScore(size));
    $("#dead").hide();
    $('#eor').show();
}

function gamePoints() {
    if (size > 1) {
        gameScore = gameScore + (size-1);
        totScore = totScore + (size-1);
        $('#size').trigger('updateGameScore', gameScore);
        $('#canvas').trigger('updateScore', totScore);
    } else {
        gameScore = 0;
        $('#size').trigger('updateGameScore', gameScore);
        $('#canvas').trigger('updateScore', totScore);
    }
}

function taskPoints() {
    totScore = totScore + 20;
    $('#canvas').trigger('updateScore', totScore);
}

function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    $("#dead").hide();
    $('#eor').hide();
    
    createsnake();
    size = 0;
    newfood();

    direction = 0;
    
    id = setInterval(step, 100);
}


function die() {
    if (id) {
        _LTracker.push({'session': sessionID, 'event': 'die', 'score': totScore, 'gameStatus': gameStatus});
        clearInterval(id);
        $('#dead').show();
        gameStatus = 'stopped';
        size = 0;
        gamePoints();
    }
    inprogress = false;
}

//Deal with movements
function onKeyDown(evt) {
  newdir = evt.keyCode - 37;

  // only lateral turns are allowed
  // (that is, no u-turns)
  if (newdir != direction && newdir != direction+2 && newdir != direction-2) {
      direction = newdir;
      var dirString = 'gameMove_' + direction;
      //_LTracker.push({'session': sessionID, 'event': dirString, 'score': totScore, 'gameStatus': gameStatus});
  }
}

if ($.browser.mozilla) {
    $(document).keypress(onKeyDown);
} else {
    $(document).keydown(onKeyDown);
}

function createsnake() {
  snake = Array();
  var head = Array();
  head.x = WIDTH/2;
  head.y = HEIGHT/2;
  snake.push(head);
}

function collision(n) {
    // are we out of the playground?
    if (n.x < 0 || n.x > WIDTH - 1 || n.y < 0 || n.y > HEIGHT - 1) {
        _LTracker.push({'session': sessionID, 'event': 'die_edge', 'score': totScore, 'gameStatus': gameStatus});
        return true;
    }

    // are we eating ourselves?
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].x == n.x && snake[i].y == n.y) {
            _LTracker.push({'session': sessionID, 'event': 'die_self', 'score': totScore, 'gameStatus': gameStatus});
            return true;
        }
    }
    return false;
}

function newfood() {
    var wcells = WIDTH / dx;
    var hcells = HEIGHT / dy;

    var randomx = Math.floor(Math.random() * wcells);
    var randomy = Math.floor(Math.random() * hcells);

    food = Array();
    food.x = randomx * dx;
    food.y = randomy * dy;
    food.r = dr;
    size += 1;
    gamePoints();
    _LTracker.push({'session': sessionID, 'event': 'eat', 'score': totScore, 'gameStatus': gameStatus});
}

function meal(n) {
    return (n.x == food.x && n.y == food.y);
}

function movesnake() {

    h = snake[0]; // peek head

    // create new head relative to current head
    var n = Array();
    switch (direction) {
        case 0: // left
            n.x = h.x - dx;
            n.y = h.y;
            break;
        case 1: // up
            n.x = h.x;
            n.y = h.y - dy;
            break;
        case 2: // right
            n.x = h.x + dx;
            n.y = h.y;
            break;
        case 3: // down
            n.x = h.x;
            n.y = h.y + dy;
            break;
    }


    // if out of box or collision with ourselves, we die
    if (collision(n)) {
        return false;
    }

    snake.unshift(n);

    // if there's food there
    if (meal(n)) {
        newfood(); // we eat it and another shows up
    } else {
        snake.pop();
        // we only remove the tail if there wasn't food
        // if there was food, the snake grew
    }

    return true;

}


function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function screenclear() {
    ctx.fillStyle = "#000000";
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    rect(0, 0, WIDTH, HEIGHT);
}

function drawsnake() {
    ctx.fillStyle = "#00CCFF";
    snake.forEach(function (p) {
        rect(p.x, p.y, dx, dy);
    })
}

function drawfood() {
    ctx.fillStyle = "#FF0000";
    circle(food.x + food.r, food.y + food.r, food.r);
}
