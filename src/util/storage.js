class Storage {
  get(key) {
    return localStorage.getItem(key);
  }

  getNumber(key) {
    return parseFloat(this.get(key));
  }

  getObject(key) {
    return JSON.parse(this.get(key));
  }

  set(key, value) {
    localStorage.setItem(key, value);
  }

  setObject(key, value) {
    this.set(key, JSON.stringify(value));
  }
}

const storage = new Storage();
