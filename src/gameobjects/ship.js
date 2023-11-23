class Ship {
  static all = [];
  static controlShip;

  static drawAll() {
    this.all.forEach((ship) => ship.draw());
  }

  static updateAll() {
    this.all.forEach((ship) => ship.update());
  }

  static handleInput() {
    this.controlShip?.handleInput();
  }

  static setControl(ship) {
    this.controlShip = ship;
  }

  constructor(x, y, color) {
    Ship.all.push(this);
    this.hp = 100;
    this.color = color;

    this.sprite = new Sprite(
      x,
      y,
      [
        [-25, 0],
        [7, 55],
        [36, 0],
        [7, -55],
        [-25, 0],
      ],
      "dynamic"
    );
    this.sprite.addCollider(0, -27, 50);
    this.sprite.addCollider(0, 40, [
      [5, 12],
      [13, 15],
      [13, -15],
      [5, -12],
      [-36, 0],
    ]);
    this.sprite.debug = true;
    this.sprite.image = Assets[`${color}Full`];
  }

  handleInput() {}

  update() {}

  draw() {}
}
