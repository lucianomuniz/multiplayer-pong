let readyPlayerCount = 0;

function listen(io) {
  const pongNamespace = io.of("/pong");
  pongNamespace.on("connection", (socket) => {
    let room;

    console.log("a user connected", socket.id);

    socket.on("ready", () => {
      room = "room" + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log("Player ready", socket.id, room);

      readyPlayerCount++;

      // broadcast message to all players to startGame
      if (readyPlayerCount % 2 === 0) {
        pongNamespace.in(room).emit("startGame", socket.id);
      }
    });

    // broadcast to all players in the room except to the sender
    socket.on("paddleMove", (paddleData) => {
      socket.to(room).emit("paddleMove", paddleData);
    });

    // broadcast to all players in the room except to the sender
    socket.on("ballMove", (ballData) => {
      socket.to(room).emit("ballMove", ballData);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected from ${room}: ${reason}`);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen,
};
