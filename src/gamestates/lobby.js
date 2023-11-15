class Lobby extends GameState {
  constructor() {
    super("lobby");
  }

  setup() {
    this.isOwner = !!netRoom;
    this.owner = "";
    this.state = {};
    this.title = new Label("Lobby", Colors.brown, 100, width / 2, 50);

    this.gameModeSelector = new ModeSlider(width / 2, 150);
    this.gameModeSelector.setOptions(["King of the Hill", "Deathmatch"]);
    this.gameModeSelector.setLabel("Gamemode: ");
    this.gameModeSelector.onChange((value) => {
      netPlayer.sendCommand(STATE_EDIT, { mode: value });
    });

    this.gameTimeSelector = new ModeSlider(width / 2, 200);
    this.gameTimeSelector.setOptions([
      "1 minute",
      "2 minutes",
      "3 minutes",
      "4 minutes",
      "5 minutes",
      "6 minutes",
      "7 minutes",
      "8 minutes",
      "9 minutes",
      "10 minutes",
    ]);
    this.gameTimeSelector.setLabel("Duration: ");
    this.gameTimeSelector.onChange((value) => {
      const timeInMinutes = parseFloat(value.replace(/[^\d]+/g, ""));
      netPlayer.sendCommand(STATE_EDIT, { duration: timeInMinutes });
    });

    this.menuBg = new MenuBG();
    Sounds.playBGM("waves");
    netRoom?.prepareLobbyState();
    netPlayer.sendCommand(STATE_REQ);
  }

  update() {
    this.menuBg.update();
    if (this.isOwner) {
      this.gameModeSelector.update();
      this.gameTimeSelector.update();
    }
  }

  drawSprites() {
    this.menuBg.draw();
  }

  drawUI() {
    this.gameModeSelector.draw();
    this.gameTimeSelector.draw();
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
    console.log(this.state);
    this.owner = this.state.players[0];
    this.title.setText(`Lobby of ${this.owner}`);
    this.gameModeSelector.setSelectedValue(this.state.mode);
    this.gameTimeSelector.setSelectedValue(`${this.state.duration} minutes`);
  }
}

const lobby = new Lobby();
