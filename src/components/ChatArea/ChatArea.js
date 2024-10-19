const ChatArea = ({ messages, onSendMessage, messageInput, setMessageInput, currentChatName }) => {
    return (
        <main className="col-md-9 d-flex flex-column" style={{ height: '100%' }}>
            <div className="card shadow-sm flex-grow-1"> {/* Flex-grow para ocupar o espaço restante */}
                <div className="card-body d-flex flex-column">
                    <h2 className="card-title">{currentChatName}</h2>
                    <div id="messages" className="border p-3 flex-grow-1" style={{ overflowY: 'auto' }}>
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-2 p-2 border rounded">
                                {msg.user}: {msg.message}
                            </div>
                        ))}
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={onSendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default ChatArea;