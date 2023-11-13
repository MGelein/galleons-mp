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
  }

  setOptions(options) {
    this.options = options;
    this.labels = this.options.map((option, i) => {
      const label = new Label(option, Colors.brown, 36, this.x, this.y);
      return label;
    });
  }

  draw() {
    this.labels[this.selected].draw();
  }

  update() {
    this.timeout--;

    if (this.timeout < 0 && this.active) {
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
    }
  }

  get value() {
    return this.options[this.selected];
  }
}
