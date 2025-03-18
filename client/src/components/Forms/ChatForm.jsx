import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

function ChatForm({ onMessageSend }) {
    const [message, setMessage] = useState('');
    const { nick } = useUser();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {
            onMessageSend(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center justify-between p-3 border-t border-gray-200 bg-white">
            <input
                type="text"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 mr-3 text-sm leading-tight text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                Send
            </button>
        </form>
    );
}

export default ChatForm;
