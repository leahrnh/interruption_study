function gamerun() {
    //if the game is stopped, start it
    if (!inprogress) {
	inprogress = true;
	init();
    }
    //if game is in progress and not paused, pause it
    else if (!paused) {
	clearInterval(id);
	paused = true;
    }
    //if the game is in progress and paused, restart it
    else {
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
      inprogress = false;
  }
}

function draw() {
  screenclear();
  drawsnake();
  drawfood();
}
