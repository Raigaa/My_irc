import React from 'react';

function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-lg z-10">
        <h2 className="text-lg font-semibold mb-4">Error</h2>
        <p className="mb-4">{message}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
