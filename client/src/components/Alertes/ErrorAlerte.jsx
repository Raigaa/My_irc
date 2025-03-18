import React from 'react';

const Alerte = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
      <div className="bg-red-500 text-white p-4 rounded-md shadow-lg">
        <p>{message}</p>
        <button className="mt-2 bg-white text-red-500 p-1 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Alerte;
