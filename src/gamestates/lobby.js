class Lobby extends GameState {
  constructor() {
    super("lobby");
  }

  setup() {
    this.isOwner = !!netRoom;
    this.owner = "";
    this.state = {};
    this.title = new Label("Lobby", Colors.brown, 100, width / 2, 50);

    this.gameModeSelector = new ModeSlider(width / 2, 120);
    this.gameModeSelector.setOptions(["King of the Hill", "Deathmatch"]);
    this.gameModeSelector.onChange((value) => {
      netPlayer.sendCommand(STATE_EDIT, { mode: value });
    });

    this.menuBg = new MenuBG();
    Sounds.playBGM("waves");
    netRoom?.prepareLobbyState();
    netPlayer.sendCommand(STATE_REQ);
  }

  update() {
    this.menuBg.update();
    if (this.isOwner) this.gameModeSelector.update();
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
        this.onStateChange();
        break;
      case STATE_EDIT:
        this.state = { ...this.state, ...payload };
        this.onStateChange();
        break;
    }
  }

  onStateChange() {
    this.owner = this.state.players[0];
    this.title.setText(`Lobby of ${this.owner}`);
    this.gameModeSelector.setSelectedValue(this.state.mode);
  }
}

const lobby = new Lobby();
