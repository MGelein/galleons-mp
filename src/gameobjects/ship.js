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
const TRAIL_AGE = 150;
const TURBO_FRAMES = 60;

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
    this.left = createVector(1, 0);
    this.right = createVector(1, 0);
    this.bowOffset = createVector(0, 50);
    this.forceAcc = 0.15;
    this.maxTurboFactor = 1.3;
    this.turboFactor = 1;
    this.turboFrames = 0;
    this.alignment = 0;
    this.direction = createVector(0, 0);
    this.targetAlign = 0;
    this.currentAlign = 0;
    this.controlDir = createVector(0, 0);
    this.trail = [];

    this.sprite = new Sprite(
      x,
      y,
      [
        [-20, 0],
        [2, 60],
        [36, 0],
        [2, -60],
        [-20, 0],
      ],
      "dynamic"
    );
    this.sprite.addCollider(0, -30, 40);
    this.sprite.addCollider(0, 28, 40);
    this.sprite.image = Assets[`${color}Full`];
    this.sprite.friction = 0.1;
    this.sprite.autoDraw = false;
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
    this.acc.mult(this.forceAcc * this.turboFactor);

    if (this.controlDir.mag() > CONTROLLER_DEADZONE) {
      let deltaRotation = this.controlDir.heading() - 90 - this.sprite.rotation;
      while (deltaRotation > 180) deltaRotation -= 360;
      while (deltaRotation < -180) deltaRotation += 360;
      const easeFactor = this.turboFrames > 0 ? 0.001 : 0.005;
      this.sprite.rotationSpeed += deltaRotation * easeFactor;
    }
  }

  update() {
    this.targetAlign = this.sprite.rotation + 90;
    this.forward.setHeading(this.targetAlign);
    this.bowOffset.setHeading(this.targetAlign);
    this.left.setHeading(this.targetAlign - 90);
    this.right.setHeading(this.targetAlign + 90);
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
      this.turboFactor += (this.maxTurboFactor - this.turboFactor) * 0.1;
    } else {
      this.turboFactor += (1 - this.turboFactor) * 0.1;
    }
    this.sprite.scale.y = map(
      this.turboFactor,
      1,
      this.maxTurboFactor,
      1,
      1.05
    );
  }

  draw() {
    this.drawTrail();
    this.sprite.draw();
  }

  drawTrail() {
    const x = this.sprite.x + this.bowOffset.x;
    const y = this.sprite.y + this.bowOffset.y;
    const leftDivider = map(this.sprite.rotationSpeed, -2, 2, 2, 1);
    const leftSpeed = this.sprite.vel.mag() / leftDivider;
    if (leftSpeed > 0.05) {
      const vxL = this.left.x * leftSpeed * random(0.8, 1.2);
      const vyL = this.left.y * leftSpeed * random(0.8, 1.2);
      this.trail.push({ x, y, vx: vxL, vy: vyL, a: 0 });
    }
    const rightDivider = map(this.sprite.rotationSpeed, -2, 2, 1, 2);
    const rightSpeed = this.sprite.vel.mag() / rightDivider;
    if (rightSpeed > 0.05) {
      const vxR = this.right.x * rightSpeed * random(0.8, 1.2);
      const vyR = this.right.y * rightSpeed * random(0.8, 1.2);
      this.trail.push({ x, y, vx: vxR, vy: vyR, a: 0 });
    }

    const toDelete = [];
    let alpha = 0;
    let speed = 0;

    for (const t of this.trail) {
      t.a += 1;
      t.x += t.vx;
      t.y += t.vy;
      t.vx *= 0.95;
      t.vy *= 0.95;
      t.vx += random(-0.05, 0.05);
      t.vy += random(-0.05, 0.05);
      speed = t.vx * t.vx + t.vy * t.vy;
      alpha = map(speed, 0, 4, 20, 200);

      if (t.a > TRAIL_AGE && random(0, 1) < 0.1) toDelete.push(t);

      stroke(255, alpha);
      strokeWeight(alpha / 20 + 4 + t.a / 30);
      point(t.x, t.y);
    }

    for (const t of toDelete) this.trail.splice(this.trail.indexOf(t), 1);
  }
}
