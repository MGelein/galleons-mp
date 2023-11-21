class ModeSlider {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.fontSize = 36;
    this.timeout = 0;
    this.selected = 0;
    this.options = [];
    this.labels = [];
    this.active = false;
    this.scrollTimeout = 10;
    this.onChangeCb = () => {};
  }

  setLabel(label) {
    this.label = new Label(label, Colors.brown, this.fontSize, this.x, this.y);
    this.label.setAlign("right");
  }

  setOptions(options) {
    this.options = options;
    this.labels = this.options.map((option, i) => {
      const label = new Label(
        option,
        Colors.brown,
        this.fontSize,
        this.x,
        this.y
      );
      label.setAlign("left");
      return label;
    });
  }

  setSelectedValue(value) {
    const index = this.options.indexOf(value);
    if (index === -1) return console.log("Cant set mode selection to", value);
    this.selected = index;
  }

  onChange(callback) {
    this.onChangeCb = callback;
  }

  draw() {
    this.labels[this.selected].draw();
    this.label?.draw();

    if (this.active) {
      push();
      tint(Colors.brown);
      translate(
        this.x - Assets.uiTimeselector.height / 2,
        this.y + Assets.uiTimeselector.width / 2
      );
      rotate(-90);
      image(Assets.uiTimeselector, 0, 0);
      noTint();
      pop();
    }
  }

  update() {
    this.timeout--;
    if (!this.active) return;

    if (this.timeout < 0 && this.active) {
      const wasSelected = this.selected;
      if (kb.presses("left") || contro.presses("left") || leftStickLeft()) {
        this.selected--;
        this.timeout = config.scrollTimeout;
      }
      if (kb.presses("right") || contro.presses("right") || leftStickRight()) {
        this.selected++;
        this.timeout = config.scrollTimeout;
      }
      const optionAmount = this.options.length;
      this.selected = (this.selected + optionAmount) % optionAmount;
      if (this.selected !== wasSelected) this.onChangeCb(this.value);
    }
  }

  get value() {
    return this.options[this.selected];
  }
}
