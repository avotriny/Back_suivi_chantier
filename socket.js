const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('receiveMessage', (message) => {
  console.log('Message received:', message);
});

const sendMessage = (messageData) => {
  console.log('Sending message:', messageData);
  socket.emit('sendMessage', messageData);
};

// Données de message exemple
const messageData = {
  senderId: '6684f02646de50a9f604285c',
  receiverId: '6684ef6f46de50a9f6042858',
  text: 'Hello, how are you?'
};

// Envoyer le message
sendMessage(messageData);
