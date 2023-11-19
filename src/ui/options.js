class Options {
  constructor(x, y, gap) {
    this.x = x;
    this.y = y;
    this.gap = gap;
    this.options = [];
    this.labels = [];
    this.onSelectCb = () => {};
    this.timeout = 0;
    this.scrollTimeout = 10;
  }

  setOptions(options) {
    this.options = options;
    this.selected = 0;

    this.labels = this.options.map((option, i) => {
      const label = new Label(
        option,
        Colors.brown,
        48,
        this.x,
        this.y + i * this.gap
      );
      return label;
    });
  }

  onSelect(callback) {
    this.onSelectCb = callback;
  }

  update() {
    this.timeout--;

    if (this.timeout < 0) {
      if (kb.presses("down") || contro.presses("down") || leftStickDown()) {
        this.selected--;
        this.timeout = config.scrollTimeout;
      }
      if (kb.presses("up") || contro.presses("up") || leftStickUp()) {
        this.selected++;
        this.timeout = config.scrollTimeout;
      }

      if (kb.presses("enter") || kb.presses("space") || contro.presses("a")) {
        this.onSelectCb(this.options[this.selected]);
      }
    }

    this.selected = (this.selected + this.options.length) % this.options.length;
    this.labels.forEach((label) => (label.selected = false));
    if (this.labels.length >= this.selected) {
      this.labels[this.selected].selected = true;
    }
  }

  draw() {
    this.labels.forEach((label) => label.draw());
  }
}
