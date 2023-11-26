class MainMenu extends GameState {
  constructor() {
    super("mainmenu");
  }

  setup() {
    textFont(Assets.titleFont);
    this.menuBg = new MenuBG();
    this.menuOptions = new MenuOptions();

    this.title = new Label(
      "Galleons",
      Colors.brown,
      200,
      width / 2,
      height / 2 - 50
    );
    this.title.setShadow(Colors.shadow, 2);

    Sounds.playBGM("waves");
  }

  update() {
    this.menuBg.update();
    this.menuOptions.update();
    this.title.update();
  }

  drawSprites() {
    this.menuBg.draw();
  }

  drawUI() {
    this.menuOptions.draw();
    this.title.draw();
  }
}
