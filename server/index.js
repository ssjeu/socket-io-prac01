const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//listen event
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 채팅방 구분
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    // 프론트에서 emit한 "send_message" data 읽어옴
    // console.log(data);

    // 백에서 연결된 전체에 프론트로 data 보내기
    // socket.broadcast.emit("receive_message", data); // 단일방
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
