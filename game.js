function gamerun() {
    //if the game is stopped, start it
    if (!inprogress) {
	_LTracker.push({'session': sessionID,'event': 'newgame','score': score,});
	inprogress = true;
	init();
    }
    //if game is in progress and not paused, pause it
    else if (!paused) {
	_LTracker.push({'session': sessionID,'event': 'pause','score': score,});
	clearInterval(id);
	paused = true;
    }
    //if the game is in progress and paused, restart it
    else {
	_LTracker.push({'session': sessionID,'event': 'restart','score': score,});
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
