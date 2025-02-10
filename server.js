const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(express.static('public'))
const users = new Map()
http.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
io.on('connection', (socket) => {
  // Обработчик установки имени
  socket.on('setName', (name) => {
    users.set(socket.id, name || 'Неизвестный')
    console.log(`Пользователь ${socket.id} установил имя: ${name}`)
  })

  // Обработчик сообщений
  socket.on('message', (msg) => {
    const userName = users.get(socket.id) || 'Неизвестный'
    io.emit('message', {
      name: userName,
      text: msg.text,
    })
  })

  // Удаляем пользователя при отключении
  socket.on('disconnect', () => {
    users.delete(socket.id)
  })
})

server.listen(3000, () => console.log('Сервер запущен на порту 3000'))
