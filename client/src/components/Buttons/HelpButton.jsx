import React, { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";

function HelpButton({ onClick }) {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-full flex items-center justify-center w-12 h-12"
            onClick={onClick}
        >
            <FiHelpCircle className="text-2xl"/>
        </button>
    );
}

export default HelpButton;