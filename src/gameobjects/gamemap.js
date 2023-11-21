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
    this.lagoonColliders.color = "#000";
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
    this.bases.image = Assets.baseA;
    this.bases.width = 300;
    this.bases.height = 300;
    this.bases.collider = "static";
  }

  drawSprites() {
    this.sea.draw();
    this.lagoon.draw();
    this.bases.draw();
  }
}
