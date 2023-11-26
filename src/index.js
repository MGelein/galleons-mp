const DEBUG = false; //location.port === "5500";

function preload() {
  Assets.preload();
  if (DEBUG) Assets.load();
}

function setup() {
  GameState.setActive(Boot);
  setupCanvas();

  if (DEBUG) GameState.setActive(Game);
}

function draw() {
  clear();
  GameState.update();
  camera.on();
  GameState.drawSprites();
  camera.off();
  GameState.drawUI();
}

function setupCanvas() {
  const { canvas } = new Canvas(1600, 900);
  canvas.style = "";
}

function keyPressed() {
  GameState.keyPressed();
}
