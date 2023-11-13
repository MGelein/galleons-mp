class Lobby extends GameState {
  constructor() {
    super("lobby");
  }

  setup() {
    this.owner = "";
    this.state = {};
    this.title = new Label("Lobby", Colors.brown, 100, width / 2, 50);
    this.gameModeSelector = new ModeSlider(width / 2, 120);
    this.gameModeSelector.setOptions(["King of the Hill", "Deathmatch"]);
    this.menuBg = new MenuBG();
    Sounds.playBGM("waves");
    netRoom?.prepareLobbyState();
    netPlayer.sendCommand(STATE_REQ);
  }

  update() {
    this.menuBg.update();
    this.gameModeSelector.update();
  }

  drawSprites() {
    this.menuBg.draw();
  }

  drawUI() {
    this.gameModeSelector.draw();
    this.title.draw();
  }

  onCommand(command, payload) {
    switch (command) {
      case STATE:
        this.state = payload;
        this.owner = this.state.players[0];
        this.title.setText(`Lobby of ${this.owner}`);
        break;
      case STATE_EDIT:
        this.state = { ...this.state, ...payload };
    }
  }
}

const lobby = new Lobby();
