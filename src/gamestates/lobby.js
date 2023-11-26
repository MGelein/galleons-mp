class Lobby extends GameState {
  constructor() {
    super("lobby");
  }

  setup() {
    this.player = storage.get("username");
    this.uiIndex = 0;
    this.timeout = 100;
    this.isOwner = !!netRoom;
    this.state = {};
    this.claimedColors = [];
    this.title = new Label("Lobby", Colors.brown, 100, width / 2, 50);

    this.shipSelectors = [];
    for (let i = 0; i < 4; i++) {
      let x = ShipSelector.getOffset() + i * ShipSelector.SS_SPACING;
      this.shipSelectors.push(new ShipSelector(x));
    }

    this.gameModeSelector = new ModeSlider(width / 2, 150);
    this.gameModeSelector.setOptions(["King of the Hill", "Deathmatch"]);
    this.gameModeSelector.setLabel("Gamemode: ");
    this.gameModeSelector.onChange((value) => {
      netPlayer.sendCommand(STATE_EDIT, { mode: value });
    });

    this.gameTimeSelector = new ModeSlider(width / 2, 220);
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
      const timeInMinutes = parseFloat(value.replace(" minutes", ""));
      netPlayer.sendCommand(STATE_EDIT, { duration: timeInMinutes });
    });

    this.uiComponents = this.isOwner
      ? [this.gameModeSelector, this.gameTimeSelector]
      : [];

    this.menuBg = new MenuBG();
    Sounds.playBGM("waves");
    netPlayer.sendCommand(PLAYER_JOIN);
  }

  update() {
    this.menuBg.update();
    if (this.isOwner) {
      this.gameModeSelector.update();
      this.gameTimeSelector.update();
    }

    this.uiComponents.forEach((ui) => (ui.active = false));
    const activeUI = this.uiComponents[this.uiIndex];
    if (activeUI) activeUI.active = true;
    else this.myShipSelector?.update();

    this.timeout--;

    if (this.timeout < 0) {
      if (kb.presses("down") || contro.presses("down") || leftStickDown()) {
        this.uiIndex++;
        this.timeout = config.scrollTimeout;
      }
      if (kb.presses("up") || contro.presses("up") || leftStickUp()) {
        this.uiIndex--;
        this.timeout = config.scrollTimeout;
      }
      const totalComponents = this.uiComponents.length + 1;
      this.uiIndex = constrain(this.uiIndex, 0, totalComponents);
    }
  }

  drawSprites() {
    this.menuBg.draw();
  }

  drawUI() {
    this.gameModeSelector.draw();
    this.gameTimeSelector.draw();
    this.shipSelectors.forEach((ss) => ss.draw());
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
      case LOAD_GAME:
        GameState.setActive(Game);
        break;
    }
  }

  onStateChange() {
    console.log(this.state);
    this.claimedColors = [];
    this.owner = this.state.owner;
    this.title.setText(`Lobby of ${this.state.owner}`);
    this.gameModeSelector.setSelectedValue(this.state.mode);
    this.gameTimeSelector.setSelectedValue(`${this.state.duration} minutes`);
    this.shipSelectors.forEach((ss) => ss.setPlayer(null));
    this.myShipSelector?.onChange(() => {});
    this.state.players.forEach((playerName, i) => {
      this.shipSelectors[i].setPlayer(playerName);
      const player = this.state[playerName];
      this.shipSelectors[i].setColor(player.color);
      this.shipSelectors[i].setReady(player.ready);

      if (player.ready) {
        this.claimedColors.push(player.color);
      }
      if (playerName === this.player) {
        this.myShipSelector = this.shipSelectors[i];
      }
    });
    this.myShipSelector.setClaimed(this.claimedColors);
    this.myShipSelector.onChange((state) => {
      const edit = {};
      edit[this.player] = { ...state };
      netPlayer.sendCommand(STATE_EDIT, edit);
    });

    if (this.isOwner) {
      const readyPlayers = this.state.players.reduce((readyCount, player) => {
        if (this.state[player].ready) return readyCount + 1;
        return readyCount;
      }, 0);
      const allReady = readyPlayers === this.state.players.length;

      if (allReady) netRoom.prepareGameState();
    }
  }
}
