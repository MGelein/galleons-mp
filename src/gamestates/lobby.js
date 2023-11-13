class Lobby extends GameState {
  constructor() {
    super("lobby");
  }

  setup() {
    this.menuBg = new MenuBG();
    Sounds.playBGM("waves");
  }

  update() {
    this.menuBg.update();
  }

  drawSprites() {
    this.menuBg.draw();
  }

  onCommand(command, payload) {
    console.log("Received command", command);
    console.log({ payload });
  }
}

const lobby = new Lobby();
