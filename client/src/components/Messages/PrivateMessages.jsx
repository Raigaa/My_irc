import React from 'react';

function PrivateMessages({ messages, currentConversation }) {
  return (
    <div className="messages p-4 flex-1 overflow-y-scroll">
      {messages
        .filter(msg => msg.sender === currentConversation || msg.recipient === currentConversation)
        .map((msg, index) => (
          <div key={index} className="message">
         
              <span>{msg.sender} : {msg.message}</span>
            
          </div>
        ))
      }
    </div>
  );
}

export default PrivateMessages;
