class Label {
  constructor(text, color, size, x, y) {
    this.interactive = !text.startsWith("!");
    this.size = size;
    this.color = color;
    this.x = x;
    this.y = y;
    this.shadow = null;
    this.setText(text);
  }

  setText(text) {
    textSize(this.size);
    this.text = text.replace("!", "");
    this.w = textWidth(this.text);
    this.h = this.size * 0.9;
    this.hw = this.w / 2;
    this.hh = this.h / 2;
    this.strokeWeight = this.size / 10;
  }

  setShadow(color, distance) {
    if (!color || !distance) this.shadow = null;
    this.shadow = { color, distance };
  }

  setStrokeWeight(number) {
    this.strokeWeight = number;
  }

  update() {}

  draw() {
    push();
    textSize(this.size);
    translate(this.x, this.y);
    const x = -this.hw;
    const y = this.hh * 0.9;
    if (this.shadow) {
      fill(this.shadow.color);
      text(this.text, x + this.shadow.distance, y + this.shadow.distance);
    }
    fill(this.color);
    text(this.text, x, y);

    if (this.selected && this.interactive) {
      tint(Colors.green);
      image(Assets.uiA, -this.hw * 1.25, -this.hh);
      tint(Colors.white);
      strokeWeight(this.strokeWeight);
      stroke(this.color);
      line(-this.hw, this.hh * 1.2, this.hw, this.hh * 1.2);
    }

    pop();
  }
}
