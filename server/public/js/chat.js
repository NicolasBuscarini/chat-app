const socket = io();  // Conectar ao servidor Socket.IO
const user = prompt('Enter your name:');  // Solicitar nome do usuário
let currentChatId = '256d22b9-41fc-4b0d-ae0c-ce6dd624a40e';  // ID do chat "Todos"

const userChats = [
    { chatId: '256d22b9-41fc-4b0d-ae0c-ce6dd624a40e', name: 'Todos' },  // Chat "Todos"
    { chatId: 'chat-1', name: 'Alice' },
    { chatId: 'chat-2', name: 'Bob' },
    { chatId: 'chat-3', name: 'Carlos' }
];

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatList = document.getElementById('chatList');
const chatTitle = document.getElementById('chatTitle');

// Função para exibir uma mensagem
const displayMessage = (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('mb-2', 'p-2', 'border', 'rounded');
    messageElement.textContent = `${data.user}: ${data.message}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Rolagem automática
};

// Quando o histórico de mensagens for recebido, exibir todas as mensagens anteriores
socket.on('chatHistory', (history) => {
    messagesDiv.innerHTML = '';  // Limpa as mensagens anteriores
    history.forEach(displayMessage);  // Exibe todas as mensagens do histórico
});

// Quando uma nova mensagem é recebida em tempo real
socket.on('receiveMessage', displayMessage);

// Quando o botão "Send" for clicado
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '' && currentChatId) {
        socket.emit('sendMessage', { chatId: currentChatId, message, user });
        messageInput.value = '';  // Limpar o campo de mensagem
    }
});

// Função para adicionar os chats na sidebar
const loadChatList = () => {
    userChats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.textContent = chat.name;
        chatItem.addEventListener('click', () => joinChat(chat.chatId, chat.name));
        chatList.appendChild(chatItem);
    });
};

// Função para entrar em um chat, sair da sala atual e carregar o histórico
const joinChat = (chatId, chatName) => {
    if (currentChatId) {
        socket.emit('leaveChat', currentChatId);  // Sair da sala anterior
    }
    currentChatId = chatId;  // Atualizar o chat atual
    socket.emit('joinChat', chatId);  // Solicitar histórico de mensagens para o chat
    chatTitle.textContent = chatName;  // Atualizar o título do chat
};

// Entrar automaticamente no chat "Todos" ao carregar a página
socket.emit('joinChat', currentChatId);  // Solicitar o histórico do chat "Todos"
chatTitle.textContent = 'Todos';  // Atualizar o título para o chat "Todos"

// Carregar os chats na sidebar quando a página carregar
loadChatList();
