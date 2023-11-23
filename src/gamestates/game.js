class Game extends GameState {
  constructor() {
    super("game");
  }

  setup() {
    this.map = new GameMap();
    const ship = new Ship(100, 100, "red");
    Ship.setControl(ship);
  }

  drawSprites() {
    this.map.drawSprites();
    Ship.drawAll();
  }

  update() {
    Ship.handleInput();
    Ship.updateAll();
  }
}

const game = new Game();
