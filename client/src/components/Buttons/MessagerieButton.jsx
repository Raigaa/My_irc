import React from 'react';
import { BsEnvelope } from "react-icons/bs";


const MessagerieButton = ({ onClick }) => {
    return (
        <div onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center w-12 h-12">
            <BsEnvelope />
        </div>
      );
}

export default MessagerieButton;