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
