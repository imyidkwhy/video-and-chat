const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*', // Для продакшена замените на домен вашего фронтенда!
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public')); // Раздача статики из папки "public"
const users = new Map(); // Хранилище пользователей

io.on('connection', (socket) => {
  // Установка имени пользователя
  socket.on('setName', (name) => {
    const trimmedName = name?.trim() || 'Неизвестный';
    users.set(socket.id, trimmedName);
    console.log(`Пользователь ${socket.id} установил имя: ${trimmedName}`);
  });

  // Обработка сообщений
  socket.on('message', (msg) => {
    const userName = users.get(socket.id) || 'Неизвестный';
    if (typeof msg.text === 'string' && msg.text.trim()) {
      io.emit('message', {
        name: userName,
        text: msg.text.trim(),
      });
    }
  });

  // Удаление пользователя при отключении
  socket.on('disconnect', () => {
    users.delete(socket.id);
    console.log(`Пользователь ${socket.id} отключен`);
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000; // Используйте переменные окружения
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
