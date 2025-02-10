const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let videoState = {
  isPlaying: false,
  currentTime: 0,
  videoUrl: "ВАША_ССЫЛКА_НА_ВИДЕО"
};

io.on("connection", (socket) => {
  // Отправляем текущее состояние новому клиенту
  socket.emit("sync", videoState);

  // Обработка событий от клиентов
  socket.on("play", () => {
    videoState.isPlaying = true;
    io.emit("play", videoState.currentTime);
  });

  socket.on("pause", () => {
    videoState.isPlaying = false;
    io.emit("pause", videoState.currentTime);
  });

  socket.on("seek", (time) => {
    videoState.currentTime = time;
    io.emit("seek", time);
  });

  socket.on("timeupdate", (time) => {
    videoState.currentTime = time;
  });
});

 
const PORT = process.env.PORT || 3000; // Используйте переменные окружения
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
