const CHOOSE_NEW = "Choose a new username";
const CREATE_ROOM = "Create a new game";
const JOIN_ROOM = "Join an existing game";

class MenuOptions {
  constructor() {
    this.accountChosen = false;
    this.joiningRoom = false;
    this.username = storage.get("username");
    this.hasUsername = this.username !== null;
    if (this.username) createPeer(this.username);

    this.options = new Options(width / 2, height / 2 + 130, 60);
    this.reconsiderOptions();
    this.options.onSelect((option) => {
      if (option === CHOOSE_NEW) {
        this.username = prompt("Type a username (only alphanumeric, no spaces");
        this.username = this.username.replaceAll(/[^a-zA-Z0-9]/gi, "");
        createPeer(this.username);
        setTimeout(() => {
          if (!this.loggedIn) {
            this.username = null;
            this.reconsiderOptions();
          }
        }, 10000);
      }

      if (option.includes("Continue as")) {
        this.accountChosen = true;
      }

      if (option === CREATE_ROOM) {
        createRoom();
      }

      if (option === JOIN_ROOM) {
        this.joiningRoom = true;
        const joinName = prompt(
          "Type the username of the player you want to join"
        );
        if (joinName) netPlayer.connect(joinName);
        else this.joiningRoom = false;

        setTimeout(() => {
          this.joiningRoom = false;
          this.reconsiderOptions();
        }, 10000);
      }

      this.reconsiderOptions();
    });
  }

  reconsiderOptions() {
    if (this.joiningRoom) {
      this.options.setOptions(["!Waiting to join"]);
      return;
    }

    if (this.accountChosen) {
      this.options.setOptions([CREATE_ROOM, JOIN_ROOM]);
      return;
    }

    if (this.username === null) {
      this.options.setOptions([CHOOSE_NEW]);
      return;
    }

    if (this.username && this.loggedIn) {
      this.options.setOptions([`Continue as ${this.username}`, CHOOSE_NEW]);
      return;
    }

    if (this.username && !this.loggedIn) {
      this.options.setOptions([`!Authenticating ${this.username}`, CHOOSE_NEW]);
    }
  }

  update() {
    const newLoggedIn = !!netPlayer?.peer?.id;
    if (newLoggedIn !== this.loggedIn) {
      this.loggedIn = newLoggedIn;
      this.reconsiderOptions();
    }
    this.options.update();

    if (netPlayer?.inRoom) GameState.setActive("lobby");
  }

  draw() {
    this.options.draw();
  }
}
