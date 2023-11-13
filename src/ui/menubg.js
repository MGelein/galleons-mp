class MenuBG {
  constructor() {
    this.waveSpeed = -10;
    this.wavePhase = 0;
    this.waveVariation = 1;
    this.waveScale = 1.1;
    this.waveScaleVariation = 0.1;

    this.sky = new Sprite();
    this.sky.image = Assets.sky;
    this.sky.autoDraw = false;
    this.sky.collider = "none";

    this.island = new Sprite();
    this.island.image = Assets.island;
    this.island.autoDraw = false;
    this.island.y = height - Assets.sea.height;
    this.island.collider = "none";

    this.sea = [new Sprite(), new Sprite()];
    this.sea.forEach((part, i) => {
      part.image = Assets.sea;
      part.autoDraw = false;
      part.collider = "none";
      part.x = i * Assets.sea.width;
      part.y = height - Assets.sea.height / 2;
    });

    this.clouds = [new Sprite(), new Sprite(), new Sprite(), new Sprite()];
    this.clouds.forEach((cloud, i) => {
      const cloudNumber = (i % 3) + 1;
      cloud.image = Assets["cloud" + cloudNumber];
      cloud.autoDraw = false;
      cloud.collider = "kinematic";
      this.resetCloud(cloud);
      cloud.x = random(0, width);
      cloud.y = i * 200 + 100;
    });
  }

  update() {
    this.handleWaves();
    this.checkClouds();
  }

  draw() {
    this.sky.draw();
    this.island.draw();
    this.sea.forEach((part) => part.draw());
    this.clouds.forEach((cloud) => cloud.draw());
  }

  resetCloud(cloud) {
    cloud.x = width + 200;
    cloud.scale = random(0.9, 1.3);
    cloud.vel.x = random(-0.5, -1);
  }

  checkClouds() {
    this.clouds.forEach((cloud) => {
      if (cloud.x < -cloud.image.width) {
        this.resetCloud(cloud);
      }
    });
  }

  handleWaves() {
    this.wavePhase += 1;
    const sinus = sin(this.wavePhase);
    this.sea.forEach((part) => {
      part.x += this.waveSpeed + sinus * this.waveVariation;
      part.scale.y = this.waveScale + sinus * this.waveScaleVariation;
      if (part.x < -Assets.sea.width / 2) {
        part.x += Assets.sea.width * 2;
      }
    });
  }
}
