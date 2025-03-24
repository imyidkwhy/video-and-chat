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


const users = new Map();


io.on('connection', (socket) => {

  socket.on('setName', (name) => {
    users.set(socket.id, name || 'Неизвестный');
    console.log(`Пользователь ${socket.id} установил имя: ${name}`);
  });


  socket.on('message', (msg) => {
    const userName = users.get(socket.id) || 'Неизвестный';
    io.emit('message', {
      name: userName,
      text: msg.text,
    });
  });


  socket.on('play', () => {
    socket.broadcast.emit('play');
  });


  socket.on('pause', () => {
    socket.broadcast.emit('pause');
  });


  socket.on('seek', (time) => {
    socket.broadcast.emit('seek', time);
  });


  socket.on('disconnect', () => {
    users.delete(socket.id);
  });
});
let currentVideoState = {
    isPlaying: false,
    currentTime: 0
};

io.on('connection', (socket) => {
   
    socket.emit('videoState', currentVideoState);

    
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

 


server.listen(3000, () => console.log('Сервер запущен на порту 3000'));
