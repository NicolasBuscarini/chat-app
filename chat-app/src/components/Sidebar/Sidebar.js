import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Sidebar.css'; // Crie um arquivo CSS para os estilos

const Sidebar = ({ chats, users, onChatSelect, onReorderChats }) => {
  // Função chamada quando o item é solto
  const handleDragEnd = (result) => {
    if (!result.destination) return; // Se não houver destino, não faça nada
    const reorderedChats = Array.from(chats);
    const [removed] = reorderedChats.splice(result.source.index, 1); // Remove o item
    reorderedChats.splice(result.destination.index, 0, removed); // Adiciona o item no novo índice
    onReorderChats(reorderedChats); // Chama a função para atualizar a ordem dos chats
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <nav
            className="col-md-3 sidebar"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <h4 className="text-center mt-3">Meus Chats</h4>
            <div className="list-group">
              {chats.map((chat, index) => (
                <Draggable key={chat.chatId} draggableId={chat.chatId} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder} 
            </div>
          </nav>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Sidebar;
