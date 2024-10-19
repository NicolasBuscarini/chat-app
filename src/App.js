import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Importando os estilos
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/ChatArea/ChatArea';

const socket = io('http://localhost:3003'); // Conectar ao servidor Socket.IO na porta 3003

const App = () => {
    const [user, setUser] = useState('');
    const [currentChatId, setCurrentChatId] = useState('256d22b9-41fc-4b0d-ae0c-ce6dd624a40e');
    const [currentChatName, setCurrentChatName] = useState('Todos'); // Adicionando estado para o nome do chat
    const [userChats, setUserChats] = useState([
        { chatId: '256d22b9-41fc-4b0d-ae0c-ce6dd624a40e', name: 'Todos' },
        { chatId: 'chat-1', name: 'Alice' },
        { chatId: 'chat-2', name: 'Bob' },
        { chatId: 'chat-3', name: 'Carlos' },
    ]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    // Solicitar o nome do usuário
    useEffect(() => {
        setUser(prompt('Enter your name:'));
        socket.emit('joinChat', currentChatId);  // Entrar no chat "Todos"
    }, [currentChatId]);

    // Receber histórico de mensagens
    useEffect(() => {
        socket.on('chatHistory', (history) => {
            setMessages(history);
        });

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('chatHistory');
            socket.off('receiveMessage');
        };
    }, []);

    // Enviar mensagem
    const sendMessage = () => {
        if (messageInput.trim() !== '' && currentChatId) {
            socket.emit('sendMessage', { chatId: currentChatId, message: messageInput, user });
            setMessageInput(''); // Limpar campo de mensagem
        }
    };

    // Mudar para outro chat
    const joinChat = (chatId, chatName) => {
        socket.emit('leaveChat', currentChatId);  // Sair da sala anterior
        setCurrentChatId(chatId);
        setCurrentChatName(chatName); // Atualizar o nome do chat atual
        setMessages([]);  // Limpar mensagens ao trocar de chat
        socket.emit('joinChat', chatId);  // Entrar no novo chat
    };

    return (
        <div className="container-fluid">
            <div className="row" style={{ height: '100vh' }}> {/* Use 100% da altura da viewport */}
                <Sidebar chats={userChats} onChatSelect={joinChat} />
                <ChatArea
                    messages={messages} 
                    onSendMessage={sendMessage} 
                    messageInput={messageInput} 
                    setMessageInput={setMessageInput} 
                    currentChatName={currentChatName} // Passar o nome do chat atual
                />
            </div>
        </div>
    );
};

export default App;
