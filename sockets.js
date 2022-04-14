let readyPlayerCount = 0;

function listen(io) {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("ready", () => {
      console.log("`Player ready", socket.id);

      readyPlayerCount++;

      // broadcast message to all players to startGame
      if (readyPlayerCount % 2 === 0) {
        io.emit("startGame", socket.id);
      }
    });

    // broadcast to all players except to the sender
    socket.on("paddleMove", (paddleData) => {
      socket.broadcast.emit("paddleMove", paddleData);
    });

    // broadcast to all players except to the sender
    socket.on("ballMove", (ballData) => {
      socket.broadcast.emit("ballMove", ballData);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
    });
  });
}

module.exports = {
  listen,
};