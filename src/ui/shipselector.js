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
  constructor(x) {
    this.active = false;
    this.w = Assets.uiPlayerselectorBg.width;
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

  onReadyChange(callback) {
    this.onReadyChangeCb = callback;
  }

  setPlayer(player) {
    this.player = player;
    this.connected = !!this.player;
    this.playerLabel.setText(player ?? "Empty");
    this.playerLabel.color = this.connected ? Colors.white : color(200);
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
      this.onReadyChangeCb?.(this.ready);
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
        this.onChangeCb?.(this.value);
        this.setColor(SHIP_COLORS[this.shipIndex]);
      }
    }
  }

  draw() {
    push();
    tint(255, this.connected ? 255 : 200);
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
