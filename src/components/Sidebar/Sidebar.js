import React from 'react';
import './Sidebar.css'; // Crie um arquivo CSS para os estilos

const Sidebar = ({ chats, onChatSelect }) => {
  // Estrutura de exemplo para usuários, você pode substituir isso pela chamada à API mais tarde
  const users = {
    '256d22b9-41fc-4b0d-ae0c-ce6dd624a40e': { userId: '1', photo: 'url_da_foto_1' },
    'chat-1': { userId: '2', photo: 'url_da_foto_2' },
    'chat-2': { userId: '3', photo: 'url_da_foto_3' },
    'chat-3': { userId: '4', photo: 'url_da_foto_4' },
  };

  return (
    <nav className="col-md-3 sidebar">
      <h4 className="text-center mt-3">Meus Chats</h4>
      <div className="list-group">
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            className="chat-item"
            onClick={() => onChatSelect(chat.chatId, chat.name)}
          >
            <img
              src={users[chat.chatId]?.photo}
              alt={chat.name}
              className="user-photo"
            />
            <span>{chat.name}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
