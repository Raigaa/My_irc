import React, { useState, useEffect } from 'react';

function TabsChannels({ channels, currentChannel, onSelectChannel, onCloseChannel, leavedChannel, socketLeave

 }) {
  const [openedChannels, setOpenedChannels] = useState(new Set(channels));

  const handleSelectChannel = (channel) => {
    onSelectChannel(channel);

    if (!openedChannels.has(channel)) {
      setOpenedChannels((prev) => new Set([...prev, channel]));
    }
  };

  useEffect(() => {
    setOpenedChannels(new Set(channels));
  }, [channels]);

  useEffect(() => {
    if (leavedChannel) {
      setOpenedChannels((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leavedChannel);
        return newSet;
      });
    }
  }, [leavedChannel]);

  return (
    <div className="tabs flex flex-wrap p-2">
      {[...openedChannels].map((channel, index) => (
        <div
          key={index}
          className={`tab-item flex items-center justify-between rounded-full px-4 py-2 m-1 ${
            currentChannel === channel
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          } cursor-pointer`}
          onClick={() => handleSelectChannel(channel)}
        >
          <span>{channel}</span>
          <button
            className="ml-2 text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              socketLeave(channel);
              onCloseChannel(channel);
              setOpenedChannels((prev) => {
                const newSet = new Set(prev);
                newSet.delete(channel);
                return newSet;
              });
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default TabsChannels;
