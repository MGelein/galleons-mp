class Game extends GameState {
  constructor() {
    super("game");
  }

  setup() {
    this.map = new GameMap();
    const ship = new Ship(
      width / 2,
      height / 2,
      storage.get("chosenShip") ?? "red"
    );
    Ship.setControl(ship);
  }

  drawSprites() {
    this.map.drawSprites();
    Ship.drawAll();
    Ship.followControl();
  }

  update() {
    this.map.update();
    Ship.handleInput();
    Ship.updateAll();
  }
}
