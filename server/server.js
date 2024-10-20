const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Permite qualquer origem
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// Configurar CORS
app.use(cors({
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
}));

// Conectar ao MongoDB
mongoose.connect('mongodb://mongo:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o modelo de mensagem do chat
const messageSchema = new mongoose.Schema({
    chatId: String,
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Quando um cliente se conecta
io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // Quando o cliente se junta a um chat com um GUID (chatId)
    socket.on('joinChat', async (chatId) => {
        socket.join(chatId);  // O cliente entra na sala de chat

        console.log(`Cliente ${socket.id} entrou no chat ${chatId}`);

        // Recuperar o histórico de mensagens do MongoDB
        const history = await Message.find({ chatId }).sort({ timestamp: 1 });
        socket.emit('chatHistory', history);  // Enviar o histórico para o cliente
    });

    // Quando o cliente envia uma mensagem
    socket.on('sendMessage', async ({ chatId, message, user }) => {
        const newMessage = new Message({ chatId, user, message });
        await newMessage.save();  // Salvar a mensagem no MongoDB

        // Enviar a mensagem para todos os clientes conectados ao chat
        io.to(chatId).emit('receiveMessage', newMessage);
        console.log(`Mensagem enviada para chat ${chatId} por ${user}: ${message}`);
    });

    // Quando um cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });

    socket.on('leaveChat', (chatId) => {
        socket.leave(chatId);
        console.log(`Cliente ${socket.id} saiu do chat ${chatId}`);
    });
    
});

// Servir o arquivo estático do frontend (index.html)
// app.use(express.static(__dirname + '/public'));

// Iniciar o servidor
const port = process.env.PORT || 3003;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
