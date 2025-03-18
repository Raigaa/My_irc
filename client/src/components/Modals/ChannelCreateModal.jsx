import React, { useState } from "react";
import { FiX } from "react-icons/fi";

function ChannelCreateModal({ isOpen, onClose, onCreateChannel }) {
    const [channelName, setChannelName] = useState("");
  
    const handleCreateChannel = () => {
      onCreateChannel(channelName);
      setChannelName("");
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FiX className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold mb-4">Create a New Channel</h2>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel name"
            className="w-full border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
            onClick={handleCreateChannel}
          >
            Create Channel
          </button>
        </div>
      </div>
    );
  }
  
  export default ChannelCreateModal;
  
