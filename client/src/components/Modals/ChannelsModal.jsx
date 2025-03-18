import React from 'react';
import { FiX } from 'react-icons/fi';
import ChannelsList from '../Lists/ChannelsList';

const ChannelsModal = ({ isOpen, onClose, channels, onSelectChannel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div className="relative bg-white rounded-md shadow-lg max-w-3xl w-full p-6">
        <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => onClose()}
        >
            <FiX className="h-6 w-6" />
        </button>
        <div className="p-5">
        <ChannelsList
            channels={channels}
            onSelectChannel={(channelName) => {
              onSelectChannel(channelName);
              onClose(); 
            }}
          />
        </div>

    </div>
    </div>
  );
};

export default ChannelsModal;
