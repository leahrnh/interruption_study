function gamerun() {
    //if the game is stopped, start it
    if (!inprogress) {
        gameStatus = 'active'
        _LTracker.push({'session': sessionID, 'event': 'startGame', 'score': totScore, 'gameStatus': gameStatus});
        inprogress = true;
        init();
    }
    //if game is in progress and not paused, pause it
    else if (!paused) {
        gameStatus = 'paused'
        _LTracker.push({'session': sessionID, 'event': 'pauseGame', 'score': totScore, 'gameStatus': gameStatus});
        clearInterval(id);
        paused = true;
    }
    //if the game is in progress and paused, restart it
    else {
        gameStatus = 'active'
        _LTracker.push({'session': sessionID, 'event': 'restartGame', 'score': totScore, 'gameStatus': gameStatus});
        paused = false;
        id = setInterval(step, 100);
        step();
    }
}

function step(){
  update();
  draw();
}

function update() {
  if (!movesnake()) {
      die();
  }
}

function draw() {
  screenclear();
  drawsnake();
  drawfood();
}
