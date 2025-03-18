import React from 'react';

function ChannelsList({ onSelectChannel, channels }) {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Channels</h2>
            <ul className="divide-y divide-gray-200">
                {channels.map((channel, index) => (
                    <li 
                        key={index} 
                        onClick={() => onSelectChannel(channel)}
                        className="cursor-pointer py-2 px-4 hover:bg-gray-100 transition duration-300 ease-in-out"
                    >
                        {channel}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChannelsList;
