import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Importando os estilos
import Sidebar from "./components/Sidebar/Sidebar";
import ChatArea from "./components/ChatArea/ChatArea";

const socket = io("http://localhost:3003"); // Conectar ao servidor Socket.IO na porta 3003

const App = () => {
  const [user, setUser] = useState("");
  const [currentChatId, setCurrentChatId] = useState(
    "256d22b9-41fc-4b0d-ae0c-ce6dd624a40e"
  );
  const [currentChatName, setCurrentChatName] = useState("Todos"); // Adicionando estado para o nome do chat
  const [userChats, setUserChats] = useState([
    { chatId: "256d22b9-41fc-4b0d-ae0c-ce6dd624a40e", name: "Todos" },
    { chatId: "chat-1", name: "Alice" },
    { chatId: "chat-2", name: "Bob" },
    { chatId: "chat-3", name: "Carlos" },
    { chatId: "chat-4", name: "Diana" },
    { chatId: "chat-5", name: "Eduardo" },
    { chatId: "chat-6", name: "Fernanda" },
    { chatId: "chat-7", name: "Gustavo" },
    { chatId: "chat-8", name: "Helena" },
    { chatId: "chat-9", name: "Igor" },
    { chatId: "chat-10", name: "Juliana" },
    { chatId: "chat-11", name: "Luís" },
    { chatId: "chat-12", name: "Mariana" },
    { chatId: "chat-13", name: "Nicolas" },
    { chatId: "chat-14", name: "Olga" },
    { chatId: "chat-15", name: "Paulo" },
  ]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Estrutura de exemplo para usuários, você pode substituir isso pela chamada à API mais tarde
  const users = {
    "256d22b9-41fc-4b0d-ae0c-ce6dd624a40e": {
      userId: "1",
      photo: "url_da_foto_1",
    },
    "chat-1": { userId: "2", photo: "url_da_foto_2" },
    "chat-2": { userId: "3", photo: "url_da_foto_3" },
    "chat-3": { userId: "4", photo: "url_da_foto_4" },
    "chat-4": { userId: "5", photo: "url_da_foto_5" },
    "chat-5": { userId: "6", photo: "url_da_foto_6" },
    "chat-6": { userId: "7", photo: "url_da_foto_7" },
    "chat-7": { userId: "8", photo: "url_da_foto_8" },
    "chat-8": { userId: "9", photo: "url_da_foto_9" },
    "chat-9": { userId: "10", photo: "url_da_foto_10" },
    "chat-10": { userId: "11", photo: "url_da_foto_11" },
    "chat-11": { userId: "12", photo: "url_da_foto_12" },
    "chat-12": { userId: "13", photo: "url_da_foto_13" },
    "chat-13": { userId: "14", photo: "url_da_foto_14" },
    "chat-14": { userId: "15", photo: "url_da_foto_15" },
    "chat-15": { userId: "16", photo: "url_da_foto_16" },
  };

  // Solicitar o nome do usuário
  useEffect(() => {
    setUser(prompt("Enter your name:"));
    socket.emit("joinChat", currentChatId); // Entrar no chat "Todos"
  }, [currentChatId]);

  // Receber histórico de mensagens
  useEffect(() => {
    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, []);

  // Enviar mensagem
  const sendMessage = () => {
    if (messageInput.trim() !== "" && currentChatId) {
      socket.emit("sendMessage", {
        chatId: currentChatId,
        message: messageInput,
        user,
      });
      setMessageInput(""); // Limpar campo de mensagem
    }
  };

  // Mudar para outro chat
  const joinChat = (chatId, chatName) => {
    socket.emit("leaveChat", currentChatId); // Sair da sala anterior
    setCurrentChatId(chatId);
    setCurrentChatName(chatName); // Atualizar o nome do chat atual
    setMessages([]); // Limpar mensagens ao trocar de chat
    socket.emit("joinChat", chatId); // Entrar no novo chat
  };

  const handleReorderChats = (newOrder) => {
    setUserChats(newOrder);
  };

  // Obter a foto do usuário atual
  const currentUserPhoto = users[currentChatId]?.photo;

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "100vh" }}>
        <Sidebar
          chats={userChats}
          users={users}
          onChatSelect={joinChat}
          onReorderChats={handleReorderChats}
        />
        <ChatArea
          messages={messages}
          onSendMessage={sendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          currentChatName={currentChatName}
          currentUserPhoto={currentUserPhoto} // Passar a foto do usuário atual
        />
      </div>
    </div>
  );
};

export default App;
