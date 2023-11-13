const GAME_ID = "nl-trb1914-galleons";
const PLAYER_JOIN = "playerJoin";
const PLAYER_LIST = "playerList";
const DISCONNECT = "disconnect";

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
      this.sendCommand(PLAYER_JOIN, {});
    });
    this.connection.on("close", () => {
      this.inRoom = false;
    });
  }

  sendCommand(command, payload) {
    this.connection?.send({
      command,
      payload: { ...payload, from: this.id },
    });
  }
}

class NetRoom {
  constructor(player) {
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
      this.connections = [connection, ...(this.connections ?? [])];
      console.log("Current player amount:", this.connections.length);

      connection.on("data", (data) => {
        const { command, payload } = data;
        if (command === PLAYER_JOIN) {
          this.sendAll(PLAYER_LIST, this.players);
          return;
        }

        this.sendAll(command, payload);
      });

      connection.on("close", () => {
        this.connections.splice(this.connections.indexOf(connection), 1);

        this.connections.forEach((conn) => {
          conn.send({ command: DISCONNECT, payload: connection.peer });
        });
      });
    });
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

  const intervalId = setInterval(() => {
    if (netRoom.id) {
      clearInterval(intervalId);
      netPlayer.connect(netPlayer.name);
    }
  }, 100);
}