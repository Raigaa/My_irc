import React, { useState } from "react";
import { BsEnvelopePlus } from "react-icons/bs";
import MessageModal from '../Modals/MessageModal';

function UsersList({ members, onSendPrivateMessage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState("");

  const handleOpenModal = (recipient) => {
    setSelectedRecipient(recipient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipient("");
  };

  return (
    <div className="bg-white rounded-md shadow-lg max-w-sm w-full p-4 sm:p-6 md:max-w-md lg:max-w-lg xl:max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Channel Members</h2>
      <ul>
        {members.length > 0 ? (
          members.map((member, index) => (
            <li key={index} className="py-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-700">{member}</span>
              </div>
              <button
                onClick={() => handleOpenModal(member)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-in-out"
              >
                <BsEnvelopePlus />
              </button>
            </li>
          ))
        ) : (
          <li>No members in this channel</li>
        )}
      </ul>
      <MessageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSend={onSendPrivateMessage}
        recipient={selectedRecipient}
      />
    </div>
  );
}

export default UsersList;