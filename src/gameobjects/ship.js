const ROTATION_FRICTION = 0.8;
const FORWARD_FRICTION = 0.77;
const BASE_MOMENTUM = 0.2;
const CONTROLLER_DEADZONE = 0.5;
const REALIGN_FORCE = 1;
const CAMERA_SMOOTH = 0.02;
const CAMERA_FRICTION = 0.7;
const CAMERA_SLOW_SPEED = 0.5;
const CAMERA_FAST_SPEED = 5;
const CAMERA_SLOW_ZOOM = 0.9;
const CAMERA_FAST_ZOOM = 1.1;
const CAMERA_ZOOM_SMOOTH = 0.05;

class Ship {
  static all = [];
  static controlShip;
  static cameraVelX = 0;
  static cameraVelY = 0;
  static cameraTargetZoom = 1;

  static followControl() {
    if (!this.controlShip) return;
    const {
      sprite: { x, y },
    } = this.controlShip;
    this.cameraVelX += (x - camera.x) * CAMERA_SMOOTH;
    this.cameraVelY += (y - camera.y) * CAMERA_SMOOTH;
    this.cameraVelX *= CAMERA_FRICTION;
    this.cameraVelY *= CAMERA_FRICTION;
    const speed = sqrt(pow(this.cameraVelX, 2) + pow(this.cameraVelY, 2));
    const zoom = map(
      speed,
      CAMERA_SLOW_SPEED,
      CAMERA_FAST_SPEED,
      CAMERA_FAST_ZOOM,
      CAMERA_SLOW_ZOOM
    );
    this.cameraTargetZoom = constrain(zoom, CAMERA_SLOW_ZOOM, CAMERA_FAST_ZOOM);
    camera.zoom =
      camera.zoom + (this.cameraTargetZoom - camera.zoom) * CAMERA_ZOOM_SMOOTH;
    camera.x += this.cameraVelX;
    camera.y += this.cameraVelY;
  }

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
    this.acc = createVector(0, 0);
    this.forward = createVector(1, 0);
    this.forceAcc = 0.15;
    this.maxTurboFactor = 1.5;
    this.turboFactor = 1;
    this.turboFrames = 0;
    this.alignment = 0;
    this.direction = createVector(0, 0);
    this.targetAlign = 0;
    this.currentAlign = 0;
    this.controlDir = createVector(0, 0);

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
    this.sprite.image = Assets[`${color}Full`];
    this.sprite.friction = 0.1;
  }

  handleInput() {
    if (mouse.pressing()) {
      this.controlDir.set(mouse.x - this.sprite.x, mouse.y - this.sprite.y);
      if (this.controlDir.magSq() > 1) this.controlDir.normalize();
      this.acc.set(this.controlDir);
    } else {
      this.controlDir.set(contro.leftStick.x, contro.leftStick.y);
      this.acc.set(this.controlDir);
    }
    this.acc.mult(this.forceAcc);

    if (this.controlDir.mag() > CONTROLLER_DEADZONE) {
      let deltaRotation = this.controlDir.heading() - 90 - this.sprite.rotation;
      while (deltaRotation > 180) deltaRotation -= 360;
      while (deltaRotation < -180) deltaRotation += 360;
      this.sprite.rotationSpeed += deltaRotation * 0.005;
    }
  }

  update() {
    this.targetAlign = this.sprite.rotation + 90;
    this.forward.setHeading(this.targetAlign);
    this.direction.set(this.sprite.vel);
    if (this.sprite.vel.mag() < 0.1) this.direction.set(this.forward);
    this.currentAlign = this.direction.heading();
    this.direction.normalize();
    this.alignment = constrain(this.direction.dot(this.forward), 0, 1);

    this.sprite.rotationSpeed *= ROTATION_FRICTION;
    this.sprite.rotation = this.sprite.rotation % 360;
    this.sprite.vel.mult(FORWARD_FRICTION * this.alignment + BASE_MOMENTUM);
    this.sprite.vel.add(this.acc);

    let alignDiff = (this.targetAlign - this.currentAlign) * REALIGN_FORCE;
    while (alignDiff > 180) alignDiff -= 360;
    while (alignDiff < -180) alignDiff += 360;
    this.sprite.vel.setHeading(this.currentAlign + alignDiff);

    if (this.turboFrames > 0) {
      this.turboFrames--;
      this.turboFactor = (this.maxTurboFactor - this.turboFactor) * 0.1;
    } else {
      this.turboFactor += (1 - this.turboFactor) * 0.1;
    }
  }

  draw() {}
}
