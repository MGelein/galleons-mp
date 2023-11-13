class Sounds {
  static load() {
    soundFormats("ogg", "wav");
    this.allLoadingSounds = [];
    const ld = (name) => {
      this.allLoadingSounds.push(name);
      loadSound(`assets/audio/${name}`, (file) => {
        let newName = name.replace(/\.wav/gi, "");
        newName = newName.replace(/\.ogg/gi, "");
        this[newName] = file;
        this.allLoadingSounds.splice(this.allLoadingSounds.indexOf(name), 1);
      });
    };

    ld("waves");
    ld("transitionwave.wav");

    this.totalLoadingSounds = this.allLoadingSounds.length;
  }

  static getPercentageLoaded() {
    return 1 - this.allLoadingSounds.length / this.totalLoadingSounds;
  }

  static get loadingLabel() {
    const loadedSounds = this.totalLoadingSounds - this.allLoadingSounds.length;
    return `Sounds: ${loadedSounds}/${this.totalLoadingSounds}`;
  }

  static playBGM(name) {
    const bgm = this[name];
    if (!bgm) return console.log("Could not find music file: ", name);
    if (this.music === bgm) return console.log("File already playing: ", name);

    bgm.playMode("restart");
    bgm.setLoop(true);
    bgm.setVolume(0);
    bgm.setVolume(1, 5);
    bgm.play();

    this.music = bgm;
  }

  static playSFX(name) {
    const sfx = this[name];
    sfx.playMode("restart");
    sfx.setLoop(false);
    sfx.setVolume(1);
    sfx.play();
  }

  static setMusicVolume(volume) {}

  static setSFXVolume(volume) {}
}
