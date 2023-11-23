const PLAY_AREA = 3000;
const BASE_VERTICES = [
  [-25, 30],
  [0, 234],
  [15, 40],
  [10, 10],
  [66, 2],
  [56, 3],
  [20, 0],
  [92, -5],
  [40, -10],
  [15, -10],
  [0, -254],
  [-15, -30],
  [-10, -10],
  [-86, 10],
  [-16, 50],
  [-30, 0],
  [-30, 0],
  [-26, -60],
  [-76, 0],
];

class GameMap {
  constructor() {
    this.sea = new Sprite();
    this.sea.autoDraw = false;
    this.sea.image = Assets.seaBg;
    this.sea.collider = "none";

    this.lagoon = new Sprite();
    this.lagoon.autoDraw = false;
    this.lagoon.image = Assets.lagoon;
    this.lagoon.collider = "none";

    this.lagoonColliders = new Group();
    this.lagoonColliders.autoDraw = false;
    this.lagoonColliders.collider = "static";

    new this.lagoonColliders.Sprite([
      [390, 120],
      [385, 220],
      [400, 270],
      [420, 290],
      [500, 270],
      [520, 225],
      [565, 220],
      [575, 160],
      [620, 150],
      [640, 130],
      [620, 40],
      [520, 35],
      [450, 55],
      [445, 100],
      [390, 120],
    ]);

    new this.lagoonColliders.Sprite([
      [900, 80],
      [920, 150],
      [1020, 160],
      [1035, 205],
      [1060, 220],
      [1090, 225],
      [1105, 270],
      [1125, 290],
      [1205, 270],
      [1210, 250],
      [1210, 60],
      [1190, 40],
      [950, 40],
      [910, 55],
      [900, 80],
    ]);

    new this.lagoonColliders.Sprite([
      [390, 640],
      [390, 810],
      [410, 860],
      [600, 860],
      [635, 835],
      [635, 740],
      [620, 690],
      [575, 675],
      [550, 620],
      [450, 610],
      [390, 640],
    ]);

    new this.lagoonColliders.Sprite([
      [1095, 635],
      [1090, 740],
      [960, 740],
      [910, 760],
      [900, 800],
      [915, 855],
      [940, 865],
      [1140, 865],
      [1210, 840],
      [1210, 660],
      [1190, 620],
      [1150, 610],
      [1095, 635],
    ]);

    this.bases = new Group();
    this.bases.autoDraw = false;
    this.bases.width = 300;
    this.bases.height = 300;
    this.bases.debug = true;
    this.bases.collider = "static";

    const extraHeight = (PLAY_AREA - height) / 2;
    const extraWidth = (PLAY_AREA - width) / 2;
    const leftX = -extraWidth;
    const centerX = width / 2;
    const centerY = height / 2;
    const rightX = extraWidth + width;
    const topY = -extraHeight;
    const bottomY = extraHeight + height;

    const baseTopLeft = new Sprite(
      leftX + 500,
      topY + 500,
      [...BASE_VERTICES],
      "static"
    );
    baseTopLeft.image = Assets.baseA;
    baseTopLeft.autoDraw = false;
    this.bases.push(baseTopLeft);
    baseTopLeft.rotation = 135;

    const baseTopRight = new Sprite(
      rightX - 500,
      topY + 500,
      [...BASE_VERTICES],
      "static"
    );
    baseTopRight.image = Assets.baseB;
    baseTopRight.autoDraw = false;
    this.bases.push(baseTopRight);
    baseTopRight.rotation = 225;

    const baseBottomRight = new Sprite(
      rightX - 500,
      bottomY - 500,
      [...BASE_VERTICES],
      "static"
    );
    baseBottomRight.image = Assets.baseC;
    baseBottomRight.autoDraw = false;
    this.bases.push(baseBottomRight);
    baseBottomRight.rotation = 315;

    const baseBottomLeft = new Sprite(
      leftX + 500,
      bottomY - 500,
      [...BASE_VERTICES],
      "static"
    );
    baseBottomLeft.image = Assets.baseD;
    baseBottomLeft.autoDraw = false;
    this.bases.push(baseBottomLeft);
    baseBottomLeft.rotation = 45;

    this.bounds = new Group();
    this.bounds.autoDraw = false;
    this.bounds.width = PLAY_AREA;
    this.bounds.height = 100;
    this.bounds.color = "black";
    this.bounds.collider = "static";

    new this.bounds.Sprite(centerX, topY);
    new this.bounds.Sprite(centerX, bottomY);
    const leftBound = new this.bounds.Sprite(leftX, centerY);
    const rightBound = new this.bounds.Sprite(rightX, centerY);
    leftBound.rotation = rightBound.rotation = 90;
  }

  drawSprites() {
    this.sea.draw();
    this.lagoon.draw();
    this.bases.draw();
    this.bounds.draw();
  }

  update() {
    this.sea.x = floor(camera.x / 64) * 64;
    this.sea.y = floor(camera.y / 64) * 64;
  }
}
