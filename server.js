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
        socket.broadcast.emit('play'); // Отправляем событие всем остальным пользователям
    });

    socket.on('pause', () => {
        socket.broadcast.emit('pause'); // Отправляем событие всем остальным пользователям
    });

    socket.on('seek', (time) => {
        socket.broadcast.emit('seek', time); // Отправляем событие всем остальным пользователям
    });
});

  // Удаляем пользователя при отключении
  socket.on('disconnect', () => {
    users.delete(socket.id);
  });
});

// Запуск сервера
server.listen(3000, () => console.log('Сервер запущен на порту 3000'));
