// const ws = require('ws')
// const server = new ws.Server({port:"4000"})
// import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () =>
  console.log(`server is running on port ${PORT}`)
);

// const httpServer = createServer();
const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  // msg for only User
  socket.emit("message", "Welcome to Chat App!");

  // to all other user
  socket.broadcast.emit(
    "message",
    `User ${socket.id.substring(0, 3)} is connected`
  );

  // listen for msg event
  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 3)} : ${data}`);
  });
  // when user disconnected to all other
  socket.on("disconnect", () => {
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 3)} is disconnected`
    );
  });
  // for activity

  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  });
});

// server.on('connection',socket =>{
//     socket.on('message',message=>{
//         const b =Buffer.from(message)
//         console.log (b.toString())
//         socket.send(`${message}`)
//     })
// })
