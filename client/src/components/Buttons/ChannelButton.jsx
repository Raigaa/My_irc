import React from 'react';
import { FaRegMessage } from "react-icons/fa6";


const ChannelButton = ({ onClick }) => {
    return (
        <div onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center w-12 h-12">
            <FaRegMessage />
        </div>
      );
}

export default ChannelButton;