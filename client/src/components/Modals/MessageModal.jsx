import React, { useState } from "react";

function MessageModal({ isOpen, onClose, onSend, recipient }) {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    onSend(recipient, message);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-md shadow-lg max-w-sm w-full p-4">
        <h2 className="text-lg font-semibold mb-4">Send Message to {recipient}</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          rows="4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-4 text-gray-600">
            Cancel
          </button>
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
