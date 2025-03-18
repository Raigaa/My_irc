import React, { useState, useEffect } from 'react';

function TabsMessagerie({ conversations, currentConversation, onSelectConversation }) {
    const [openedConversations, setOpenedConversations] = useState(new Set(conversations));

    const handleSelectConversation = (conversation) => {
        onSelectConversation(conversation);
    
        if (!openedConversations.has(conversation)) {
          setOpenedConversations((prev) => new Set([...prev, conversation]));
        }
      };
    
      useEffect(() => {
        setOpenedConversations(new Set(conversations));
      }, [conversations]);
    
    
      return (
        <div className="tabs flex flex-wrap p-2">
          {[...openedConversations].map((conversation, index) => (
            <div
              key={index}
              className={`tab-item flex items-center justify-between rounded-full px-4 py-2 m-1 ${
                currentConversation === conversation
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              } cursor-pointer`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <span>{conversation}</span>
            </div>
          ))}
        </div>
      );
    }
    

export default TabsMessagerie;