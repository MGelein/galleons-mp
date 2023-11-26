class Testing extends GameState {
  constructor() {
    super("testing");
  }

  setup() {
    this.shipSelector = new ShipSelector(100);
    this.shipSelector.setPlayer("trb1914");
    this.shipSelector.setColor("red");
  }

  update() {
    this.shipSelector.update();
  }

  drawUI() {
    this.shipSelector.draw();
  }
}
