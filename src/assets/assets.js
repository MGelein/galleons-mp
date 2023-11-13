class Assets {
  static allToLoad = [];

  static preload() {
    this.titleFont = loadFont("assets/font/chomsky.otf");
  }

  static get loadingLabel() {
    const loaded = this.totalSpriteNumber - this.allToLoad.length;
    return `Sprites: ${loaded}/${this.totalSpriteNumber}`;
  }

  static load() {
    this.totalSpriteNumber = 0;
    const ld = (name, url) => {
      this.allToLoad.push(url);
      this.totalSpriteNumber++;
      loadImage(`assets/${url}`, (image) => {
        this[name] = image;
        this.allToLoad.splice(this.allToLoad.indexOf(url), 1);
      });
    };

    ld("uiTile", "ui/tile.png");
    ld("uiTileWide", "ui/tile_broad.png");
    ld("uiTileLarge", "ui/tile_broad.png");
    ld("uiMinimapBg", "ui/minimap_bg.png");
    ld("uiPlayerselectorBg", "ui/playerselector_bg.png");
    ld("uiTimeselector", "ui/timeselector.png");
    ld("uiTileR1", "ui/tileR1overlay.png");
    ld("uiTileL1", "ui/tileL1overlay.png");
    ld("uiCannonball", "ui/cannonball.png");
    ld("puHealth", "ui/pu_health.png");
    ld("puMine", "ui/pu_mine.png");
    ld("puMachinegun", "ui/pu_machinegun.png");
    ld("puTurbo", "ui/pu_turbo.png");
    ld("puTornado", "ui/pu_tornado.png");
    ld("puAztecCoin", "ui/pu_aztec_coin.png");
    ld("uiA", "ui/buttonA.png");
    ld("uiB", "ui/buttonB.png");
    ld("uiX", "ui/buttonX.png");
    ld("uiY", "ui/buttonY.png");
    ld("uiArrow", "ui/arrow.png");
    ld("uiScore", "ui/scoretile.png");
    ld("heartFull", "ui/full_heart.png");
    ld("heartThreeQuarters", "ui/threeq_heart.png");
    ld("heartHalf", "ui/half_heart.png");
    ld("heartQuarter", "ui/quarter_heart.png");
    ld("heartEmpty", "ui/empty_heart.png");

    ld("seaBg", "seabg.png");
    ld("transition", "transition.png");
    ld("sky", "ui/sky.png");
    ld("island", "ui/island.png");
    ld("sea", "ui/sea.png");
    ld("cloud1", "ui/cloud1.png");
    ld("cloud2", "ui/cloud2.png");
    ld("cloud3", "ui/cloud3.png");

    ld("cannon", "cannon/cannon.png");
    ld("mountedCannon", "cannon/cannon_mounted.png");
    ld("looseCannon", "cannon/cannon_unmounted.png");
    ld("cannonBall", "cannon/ball.png");
    ld("cannonRow", "cannon/row.png");
    ld("cannonFire", "cannon/cannonfire.png");
    ld("tornado", "cannon/tornado.png");

    ld("explosion1", "fx/explosion1.png");
    ld("explosion2", "fx/explosion2.png");
    ld("explosion3", "fx/explosion3.png");

    ld("fire1", "fx/fire1.png");
    ld("fire2", "fx/fire2.png");

    ld("smoke1", "fx/smoke1.png");
    ld("smoke2", "fx/smoke2.png");
    ld("smoke3", "fx/smoke3.png");
    ld("smoke4", "fx/smoke4.png");
    ld("smoke5", "fx/smoke5.png");
    ld("smoke6", "fx/smoke6.png");
    ld("smoke7", "fx/smoke7.png");
    ld("smoke8", "fx/smoke8.png");

    ld("redFlag", "ui/pu_flag_red.png");
    ld("flagRed", "structures/redFlag.png");
    ld("blueFlag", "ui/pu_flag_blue.png");
    ld("flagBlue", "structures/blueFlag.png");
    ld("greenFlag", "ui/pu_flag_green.png");
    ld("flagGreen", "structures/greenFlag.png");
    ld("yellowFlag", "ui/pu_flag_yellow.png");
    ld("flagYellow", "structures/yellowFlag.png");
    ld("blackFlag", "ui/pu_flag_black.png");
    ld("flagBlack", "structures/blackFlag.png");
    ld("whiteFlag", "ui/pu_flag_white.png");
    ld("flagWhite", "structures/whiteFlag.png");

    ld("baseA", "structures/base1.png");
    ld("baseB", "structures/base2.png");
    ld("baseC", "structures/base3.png");
    ld("baseD", "structures/base4.png");
    ld("island1", "structures/island1.png");
    ld("island2", "structures/island2.png");
    ld("island3", "structures/island3.png");
    ld("island4", "structures/island4.png");
    ld("island5", "structures/island5.png");
    ld("island6", "structures/island6.png");
    ld("lagoon", "structures/lagoon.png");
    ld("crate", "cannon/crate.png");
    ld("mine", "cannon/mine.png");
    ld("blackDead", "ships/black_dead.png");
    ld("blackFull", "ships/black_full.png");
    ld("blackHeavy", "ships/black_heavy.png");
    ld("blackLight", "ships/black_light.png");
    ld("blueDead", "ships/blue_dead.png");
    ld("blueFull", "ships/blue_full.png");
    ld("blueHeavy", "ships/blue_heavy.png");
    ld("blueLight", "ships/blue_light.png");
    ld("greenDead", "ships/green_dead.png");
    ld("greenFull", "ships/green_full.png");
    ld("greenHeavy", "ships/green_heavy.png");
    ld("greenLight", "ships/green_light.png");
    ld("redDead", "ships/red_dead.png");
    ld("redFull", "ships/red_full.png");
    ld("redHeavy", "ships/red_heavy.png");
    ld("redLight", "ships/red_light.png");
    ld("whiteDead", "ships/white_dead.png");
    ld("whiteFull", "ships/white_full.png");
    ld("whiteHeavy", "ships/white_heavy.png");
    ld("whiteLight", "ships/white_light.png");
    ld("yellowDead", "ships/yellow_dead.png");
    ld("yellowFull", "ships/yellow_full.png");
    ld("yellowHeavy", "ships/yellow_heavy.png");
    ld("yellowLight", "ships/yellow_light.png");

    ld("base1", "structures/base1.png");
    ld("base2", "structures/base2.png");
    ld("base3", "structures/base3.png");
    ld("base4", "structures/base4.png");

    console.log("Started loading", Assets.length, " sprites");
  }
}
