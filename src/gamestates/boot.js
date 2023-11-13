class Boot extends GameState {
  constructor() {
    super("boot");
    this.loading = true;
    this.anim = 0;
  }

  setup() {
    textFont(Assets.titleFont);
    Sounds.load();
    if (!DEBUG) Assets.load();
  }

  update() {
    this.loading = Sounds.getPercentageLoaded() !== 1;
    this.anim += 6;
  }

  drawUI() {
    fill(Colors.white);
    textSize(200);
    let tw = textWidth("Galleons");
    text("Galleons", width / 2 - tw / 2, height / 2);

    fill(200);
    textSize(36);
    tw = textWidth("Made by Mees Gelein");
    text("Made by Mees Gelein", width / 2 - tw / 2, height / 2 + 50);

    fill(sin(this.anim) * 55 + 200);
    const label = this.loading
      ? "Loading, please wait"
      : "Press any key to continue";
    textSize(50);
    tw = textWidth(label);
    text(label, width / 2 - tw / 2, height / 2 + 200);

    fill(200);
    textSize(24);
    text(Sounds.loadingLabel, 16, height - 16);
    text(Assets.loadingLabel, 16, height - 50);

    if (controAny()) this.nextState();
  }

  keyPressed() {
    this.nextState();
  }

  nextState() {
    if (this.loading) return;
    GameState.setActive("mainmenu");
  }
}

const boot = new Boot();
