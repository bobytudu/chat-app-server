const { createServer } = require("http");
const { Server } = require("socket.io");
// import { getUser } from "./util.js";
const { getUser } = require("./util.js");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);
  // console.log(socket.handshake.headers);
  socket.on("msg", async (msg) => {
    try {
      const { from, to, message } = msg;
      const user = await getUser(to);
      if (user) {
        console.count(`sending msg from ${from} to ${to}`);
        io.to(user.socketId).emit(`response`, msg);
      }
    } catch (error) {
      console.log(error.message);
    }
  });
});
console.log("hello");
io.on("disconnect", (socket) => {
  // console.log("a user disconnected", socket);
  // ...
});
io.on("error", (err) => {
  console.log("received error from client:", socket.id);
  console.log(err);
});

httpServer.listen(8000, function () {
  console.log(new Date() + " Server is listening on port 8000");
});
