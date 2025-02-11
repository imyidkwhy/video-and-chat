const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

// Состояние видео и пользователей
let videoState = {
  isPlaying: false,
  currentTime: 0,
  videoUrl: '' // Добавьте URL вашего видео при необходимости
};

const users = new Map();

io.on('connection', (socket) => {
  // Отправляем текущее состояние новому пользователю
  socket.emit('video-sync', videoState);

  // Обработчик установки имени
  socket.on('setName', (name) => {
    users.set(socket.id, name || 'Неизвестный');
    console.log(`Пользователь ${socket.id} установил имя: ${name}`);
  });

  // Обработчики управления видео
  socket.on('play', (time) => {
    videoState.isPlaying = true;
    videoState.currentTime = time;
    console.log(`Play at ${time}`);
    io.emit('play', videoState); // Рассылаем всем
  });

  socket.on('pause', (time) => {
    videoState.isPlaying = false;
    videoState.currentTime = time;
    console.log(`Pause at ${time}`);
    io.emit('pause', videoState);
  });

  socket.on('seek', (time) => {
    videoState.currentTime = time;
    console.log(`Seek to ${time}`);
    io.emit('seek', videoState);
  });

  // Обновление времени каждую секунду
  socket.on('time-update', (time) => {
    videoState.currentTime = time;
  });

  // Обработчик отключения
  socket.on('disconnect', () => {
    users.delete(socket.id);
    console.log(`Пользователь ${socket.id} отключен`);
  });
});

server.listen(3000, () => console.log('Сервер запущен на порту 3000'));
