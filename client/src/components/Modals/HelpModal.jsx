import React from "react";
import { FiX } from "react-icons/fi";

function HelpModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="relative bg-white rounded-md shadow-lg max-w-3xl w-full p-6">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <FiX className="h-6 w-6" />
                </button>
                <h2 className="text-lg font-semibold mb-4">Available Commands:</h2>
                <pre className="whitespace-pre-wrap text-sm">
                    {`
                    /nick [new_nick] - Change your nickname
                    /list - List all channels
                    /create [channel_name] - Create a new channel
                    /delete [channel_name] - Delete a channel
                    /join [channel_name] - Join a channel
                    /leave [channel_name] - Leave a channel
                    /users [channel_name] - List users in a channel
                    /msg [nickname] [message] - Send a private message
                    /help - Show available commands
                    `}
                </pre>
    
            </div>
        </div>
    );
}

export default HelpModal;
