const GAME_ID = "nl-trb1914-galleons";
const PLAYER_JOIN = "playerJoin";
const PLAYER_LIST = "playerList";
const DISCONNECT = "disconnect";
const STATE_REQ = "stateRequest";
const STATE_EDIT = "stateEdit";
const STATE = "state";
const LOAD_GAME = "loadGame";

let netPlayer;
let netRoom;

class NetPlayer {
  constructor(id) {
    this.name = id;
    this.inRoom = false;
    this.peer = new Peer(`${GAME_ID}-${id}`);
    this.peer.on("open", (id) => {
      this.id = id;
      storage.set("username", this.name);
      console.log("Player received id: ", id);
    });
    this.peer.on("error", (error) => {
      this.error = error;
    });
  }

  connect(playerName) {
    this.connection = this.peer.connect(`${GAME_ID}-ROOM-${playerName}`);
    this.connection.on("open", () => {
      this.inRoom = true;
      this.connection.on("data", ({ command, payload }) => {
        GameState.onCommand(command, payload);
      });
    });
    this.connection.on("close", () => {
      this.inRoom = false;
    });
  }

  sendCommand(command, payload) {
    this.connection?.send({ command, payload });
  }
}

class NetRoom {
  constructor(player) {
    this.state = {};
    this.connections = [];
    this.peer = new Peer(`${GAME_ID}-ROOM-${player.name}`);
    this.peer.on("open", (id) => {
      this.id = id;
      console.log("Room received id: ", id);
    });
    this.peer.on("error", (error) => {
      this.error = error;
    });
    this.peer.on("connection", (connection) => {
      console.log("New player connected to room:", connection.peer);
      this.connections = [...this.connections, connection];
      console.log("Current player amount:", this.connections.length);

      connection.on("data", (data) => {
        const { command, payload } = data;
        if (command === PLAYER_JOIN) {
          const newState = addNewPlayer(this.state, this.players);
          this.sendAll(STATE_EDIT, {
            ...newState,
          });
          return;
        }

        if (command === STATE_REQ) {
          connection.send({ command: STATE, payload: this.state });
          return;
        }

        if (command === STATE_EDIT) {
          this.state = { ...this.state, ...payload };
        }

        this.sendAll(command, payload);
      });

      connection.on("close", () => {
        this.connections.splice(this.connections.indexOf(connection), 1);
        const username = connection.peer.replace(`${GAME_ID}-`, "");
        const newState = removePlayer(username, this.state, this.players);
        this.sendAll(STATE_EDIT, { ...newState });
      });
    });
  }

  prepareLobbyState() {
    this.state = {
      owner: storage.get("username"),
      players: [],
      mode: "Deathmatch",
      duration: 5,
    };
  }

  prepareGameState() {
    const duration = this.state.duration * 60;
    const mode = this.state.mode;
    const playerData = {};
    this.players.forEach(
      (player) =>
        (playerData[player] = {
          pos: { x: -1, y: -1 },
          acc: { x: 0, y: 0 },
          rotationSpeed: 0,
          color: this.state[player].color,
        })
    );
    this.state = {
      owner: storage.get("username"),
      players: this.players,
      ...playerData,
      mode,
      duration,
    };
    this.sendAll(LOAD_GAME);
  }

  sendAll(command, payload) {
    this.connections.forEach((conn) => conn.send({ command, payload }));
  }

  get players() {
    return this.connections.map((conn) => conn.peer.replace(`${GAME_ID}-`, ""));
  }
}

function createPeer(name) {
  netPlayer = new NetPlayer(name);
}

function createRoom() {
  if (!netPlayer) {
    console.log("To create a room you must be a connected peer");
    return;
  }
  netRoom = new NetRoom(netPlayer);
  netRoom.prepareLobbyState();

  const intervalId = setInterval(() => {
    if (netRoom.id) {
      clearInterval(intervalId);
      netPlayer.connect(netPlayer.name);
    }
  }, 100);
}

function addNewPlayer(oldState, players) {
  const state = { ...oldState, players };
  const unassigned = players.filter((p) => !state[p]);

  const availableColors = [...SHIP_COLORS];
  players.forEach((p) => {
    if (unassigned.indexOf(p) !== -1) return;
    const playerColor = state[p];
    availableColors.splice(availableColors.indexOf(playerColor), 1);
  });

  unassigned.forEach((unassignedPlayer) => {
    state[unassignedPlayer] = {
      ready: false,
      color: availableColors.pop(),
    };
  });
  return state;
}

function removePlayer(player, oldState, players) {
  const state = { ...oldState, players };
  delete state[player];
  return state;
}
