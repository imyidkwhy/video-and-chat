const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Создаем экземпляр приложения Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Статические файлы из папки 'public'
app.use(express.static('public'));

// Хранение пользователей
const users = new Map();

// Обработка подключения новых пользователей
io.on('connection', (socket) => {
  // Обработчик установки имени
  socket.on('setName', (name) => {
    users.set(socket.id, name || 'Неизвестный');
    console.log(`Пользователь ${socket.id} установил имя: ${name}`);
  });

  // Обработчик сообщений
  socket.on('message', (msg) => {
    const userName = users.get(socket.id) || 'Неизвестный';
    io.emit('message', {
      name: userName,
      text: msg.text,
    });
  });

  // Обработчик воспроизведения видео
  socket.on('play', () => {
    socket.broadcast.emit('play');
  });

  // Обработчик паузы видео
  socket.on('pause', () => {
    socket.broadcast.emit('pause');
  });

  // Обработчик перемотки видео
  socket.on('seek', (time) => {
    socket.broadcast.emit('seek', time);
  });

  // Удаляем пользователя при отключении
  socket.on('disconnect', () => {
    users.delete(socket.id);
  });
});
let currentVideoState = {
    isPlaying: false,
    currentTime: 0
};

io.on('connection', (socket) => {
    // Отправляем текущее состояние видео новому пользователю
    socket.emit('videoState', currentVideoState);

    // Обработчики событий
    socket.on('play', () => {
        currentVideoState.isPlaying = true;
        socket.broadcast.emit('play');
    });

    socket.on('pause', () => {
        currentVideoState.isPlaying = false;
        socket.broadcast.emit('pause');
    });

    socket.on('seek', (time) => {
        currentVideoState.currentTime = time;
        socket.broadcast.emit('seek', time);
    });
});

 

// Запуск сервера
server.listen(3000, () => console.log('Сервер запущен на порту 3000'));
