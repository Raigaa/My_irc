import React from 'react';

function Messages({ messages, currentChannel }) {

  return (
    <div className="messages p-4 flex-1 overflow-y-scroll">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          {msg.channelName === currentChannel && (
            <span>
              {msg.sender ? `${msg.sender} : ` : ''}{msg.message}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Messages;