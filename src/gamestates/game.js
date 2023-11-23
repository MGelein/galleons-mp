class Game extends GameState {
  constructor() {
    super("game");
  }

  setup() {
    this.map = new GameMap();
    const ship = new Ship(width / 2, height / 2, "red");
    Ship.setControl(ship);
  }

  drawSprites() {
    this.map.drawSprites();
    Ship.drawAll();
    Ship.followControl();
  }

  update() {
    Ship.handleInput();
    Ship.updateAll();
  }
}

const game = new Game();
