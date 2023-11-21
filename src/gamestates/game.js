class Game extends GameState {
  constructor() {
    super("game");
  }

  setup() {
    this.map = new GameMap();
  }

  drawSprites() {
    this.map.drawSprites();
  }

  update() {}
}

const game = new Game();
