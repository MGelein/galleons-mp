const SHIP_NAMES = [
  "Stormhunter",
  "Golden Dubloon",
  "White Whale",
  "Night's Edge",
  "Crimson Wave",
  "Lucky Clover",
];

const SHIP_COLORS = ["blue", "yellow", "white", "black", "red", "green"];

class ShipSelector {
  static SS_WIDTH = 280;
  static SS_GAP = 30;
  static SS_SPACING = this.SS_WIDTH + this.SS_GAP;

  static getOffset() {
    const leftOver = width - 4 * (this.SS_WIDTH + this.SS_GAP);
    return leftOver / 2;
  }

  constructor(x) {
    this.w = ShipSelector.SS_WIDTH;
    this.h = Assets.uiPlayerselectorBg.height;
    this.x = x;
    this.y = height - this.h - 30;
    this.playerLabel = new Label("Empty", Colors.white, 36, this.w / 2, 40);
    this.shipLabel = new Label("", Colors.white, 36, this.w / 2, 350);
    this.uiPromptLabel = new Label("Ready?", Colors.white, 40, this.w / 2, 550);
    this.setPlayer();
    this.shipIndex = -1;
    this.timeout = 0;
    this.active = true;
    this.sprites = [
      Assets.blueFull,
      Assets.yellowFull,
      Assets.whiteFull,
      Assets.blackFull,
      Assets.redFull,
      Assets.greenFull,
    ];
    this.sprite;
    this.tintColor;
    this.spriteX = 0;
    this.ready = false;
    this.setUIPrompt("A");
  }

  onChange(callback) {
    this.onChangeCb = callback;
  }

  setPlayer(player) {
    this.player = player;
    this.connected = !!this.player;
    this.playerLabel.setText(player ?? "Empty");
    this.playerLabel.color = this.connected ? Colors.brown : color(255, 200);
  }

  setUIPrompt(name) {
    const isA = name === "A";
    this.uiSprite = isA ? Assets.uiA : Assets.uiB;
    this.uiTint = isA ? Colors.green : Colors.red;
    this.uiX = this.w / 2 - this.uiSprite.width / 2;
    this.uiPromptLabel.setText(isA ? "Ready?" : "Cancel");
  }

  setColor(colorName) {
    this.shipIndex = SHIP_COLORS.indexOf(colorName);
    this.shipLabel.setText(SHIP_NAMES[this.shipIndex]);
    this.sprite = this.sprites[this.shipIndex];
    this.spriteX = this.w / 2 - this.sprite.width / 2;

    if (colorName === "white") colorName === "cream";
    this.tintColor = Colors[colorName];
  }

  update() {
    this.timeout--;
    if (!this.active) return;

    const pressANotReady = !this.ready && contro.presses("a");
    const pressBReady = this.ready && contro.presses("b");
    if (
      kb.presses("enter") ||
      kb.presses("space") ||
      pressANotReady ||
      pressBReady
    ) {
      this.ready = !this.ready;
      this.onChangeCb?.({
        color: SHIP_COLORS[this.shipIndex],
        ready: this.ready,
      });
      this.setUIPrompt(this.ready ? "B" : "A");
    }

    if (this.timeout < 0 && this.active) {
      const wasSelected = this.shipIndex;
      if (kb.presses("left") || contro.presses("left") || leftStickLeft()) {
        this.shipIndex--;
        this.timeout = config.scrollTimeout;
      }
      if (kb.presses("right") || contro.presses("right") || leftStickRight()) {
        this.shipIndex++;
        this.timeout = config.scrollTimeout;
      }
      const optionAmount = this.sprites.length;
      this.shipIndex = (this.shipIndex + optionAmount) % optionAmount;
      if (this.shipIndex !== wasSelected) {
        this.setColor(SHIP_COLORS[this.shipIndex]);
        this.onChangeCb?.({
          color: SHIP_COLORS[this.shipIndex],
          ready: this.ready,
        });
      }
    }
  }

  draw() {
    push();
    this.tintColor = this.connected ? Colors.brown : color(255, 200);
    tint(this.tintColor);
    translate(this.x, this.y);
    image(Assets.uiPlayerselectorBg, 0, 0);
    this.playerLabel.draw();

    if (this.shipIndex !== -1 && this.connected) {
      this.shipLabel.draw();
      tint(this.tintColor);
      image(Assets.uiArrow, this.w - 70, 220);
      scale(-1, 1);
      image(Assets.uiArrow, -70, 220);
      scale(-1, 1);
      noTint();
      image(this.sprite, this.spriteX, 200);

      tint(this.uiTint);
      image(this.uiSprite, this.uiX, 470);
      this.uiPromptLabel.draw();
      noTint();
    }
    pop();
  }
}
