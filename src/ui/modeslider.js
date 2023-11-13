class ModeSlider {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.timeout = 0;
    this.selected = 0;
    this.options = [];
    this.labels = [];
    this.active = true;
    this.scrollTimeout = 10;
    this.onChangeCb = () => {};
  }

  setOptions(options) {
    this.options = options;
    this.labels = this.options.map((option, i) => {
      const label = new Label(option, Colors.brown, 36, this.x, this.y);
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
  }

  update() {
    this.timeout--;

    if (this.timeout < 0 && this.active) {
      const wasSelected = this.selected;
      if (kb.presses("left") || contro.presses("left") || leftStickLeft()) {
        this.selected--;
        this.timeout = this.scrollTimeout;
      }
      if (kb.presses("right") || contro.presses("right") || leftStickRight()) {
        this.selected++;
        this.timeout = this.scrollTimeout;
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
