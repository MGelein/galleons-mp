class GameState {
  static allStates = {};
  static current;
  static next;
  static transitioning;
  static transitionMask;
  static transitionTarget;
  static transitionOrigin;
  static transitionStage;

  static setActive(nextStateName) {
    if (this.transitionMask) return;
    this.next = this.allStates[nextStateName];
    if (!this.next) {
      console.log("Gamestate", nextStateName, "was not found");
      return;
    }
    if (this.current && !DEBUG) {
      this.transitionMask = new Sprite();
      this.transitionMask.autoDraw = false;
      this.transitionMask.image = Assets.transition;
      this.transitionMask.collider = "kinematic";
      this.transitionOrigin = -Assets.transition.height;
      this.transitionMask.y = this.transitionOrigin;
      this.transitionTarget = Assets.transition.height / 2;
      this.transitionStage = "down";
      Sounds.playSFX("transitionwave");
    } else {
      this.current = this.next;
      this.current.setup();
    }
  }

  static onCommand(command, payload) {
    this.current?.onCommand(command, payload);
  }

  static update() {
    if (!this.transitionMask) return this.current?.update();
  }

  static drawSprites() {
    this.current?.drawSprites();
  }

  static drawUI() {
    this.current?.drawUI();
    if (this.transitionMask) {
      this.transitionMask.draw();
      if (this.transitionStage === "down") {
        const delta = this.transitionTarget - this.transitionMask.y;
        this.transitionMask.y += delta * 0.05;
        if (delta < 10) {
          this.transitionStage = "up";
          this.next.setup();
          this.current = this.next;
        }
      } else {
        this.transitionMask.vel.y -= 0.3;

        if (this.transitionMask.y <= this.transitionOrigin) {
          this.transitionMask.remove();
          this.transitionMask = null;
          return;
        }
      }
    }
  }

  static keyPressed() {
    this.current?.keyPressed?.();
  }

  constructor(name) {
    GameState.allStates[name] = this;
  }

  setup() {}

  drawSprites() {}

  drawUI() {}

  update() {}

  keyPressed() {}

  onCommand(command, payload) {}
}
