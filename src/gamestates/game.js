class Game extends GameState {
  constructor() {
    super("game");
  }

  setup() {
    Ship.init = false;
    Ship.all = [];
    this.map = new GameMap();
    netPlayer.sendCommand(STATE_REQ);
  }

  drawSprites() {
    this.map.drawSprites();
    Ship.drawAll();
  }

  update() {
    this.map.update();
    Ship.followControl();
    Ship.handleInput();
    Ship.updateAll();
  }

  onCommand(command, payload) {
    switch (command) {
      case STATE:
        if (!Ship.init) Ship.initFromState(payload, this.map);
        break;
    }
  }
}
