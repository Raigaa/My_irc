import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

function ChannelCreateButton({ onClick }) {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-full flex items-center justify-center w-12 h-12"
            onClick={onClick}
        >
            <CiCirclePlus className="text-2xl"/>
        </button>
    );
}

export default ChannelCreateButton;