const socket = io()
let userName = ''

// Запрос имени при первом подключении
while (!userName) {
  userName = prompt('Пожалуйста, введите ваше имя:')?.trim()
}

// Сохраняем имя и отправляем на сервер
localStorage.setItem('chatName', userName)
socket.emit('setName', userName)

// Обработчик отправки сообщений
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    socket.emit('message', { text: e.target.value.trim() })
    e.target.value = ''
  }
})

// Обработчик получения сообщений
socket.on('message', (data) => {
  const chatDiv = document.getElementById('chat')
  const messageElement = document.createElement('div')
  messageElement.innerHTML = `
    <strong>${data.name}:</strong> ${data.text}
  `
  chatDiv.appendChild(messageElement)
  chatDiv.scrollTop = chatDiv.scrollHeight
})

const inputs = document.querySelectorAll('input, textarea');

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        window.scrollTo(0, input.getBoundingClientRect().top + window.scrollY - 100); // Прокрутка вверх
    });
});



const videoElement = document.getElementById('video');
// Отправляем событие при воспроизведении
videoElement.addEventListener('play', () => {
    socket.emit('play');
});

// Отправляем событие при паузе
videoElement.addEventListener('pause', () => {
    socket.emit('pause');
});

// Отправляем событие при перемотке
videoElement.addEventListener('seeked', () => {
    socket.emit('seek', videoElement.currentTime);
});

// Получаем события от сервера и обновляем состояние видео
socket.on('play', () => {
    videoElement.play();
});

socket.on('pause', () => {
    videoElement.pause();
});

socket.on('seek', (time) => {
    videoElement.currentTime = time;
});
socket.on('videoState', (state) => {
    if (state.isPlaying) {
        videoElement.currentTime = state.currentTime;
        videoElement.play();
    } else {
        videoElement.currentTime = state.currentTime;
        videoElement.pause();
    }
});
