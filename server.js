const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

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

    socket.on('disconnect', () => {
        users.delete(socket.id);
    });

    // Синхронизация воспроизведения
    socket.on('play', () => {
        socket.broadcast.emit('play');
    });

    socket.on('pause', () => {
        socket.broadcast.emit('pause');
    });

    socket.on('seek', (time) => {
        socket.broadcast.emit('seek', time);
    });
});

// Запуск сервера
server.listen(3000, () => console.log('Сервер запущен на порту 3000'));
