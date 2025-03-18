import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const GlobalNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("message", (message) => {
      if (message.global) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          message.message,
        ]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const removeNotification = (indexToRemove) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="global-notifications fixed bottom-0 left-0 ml-4 mb-4 z-50 w-full max-w-sm">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="notification flex justify-between items-center bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded shadow-lg"
        >
          <span>{notification}</span>
          <button
            onClick={() => removeNotification(index)}
            className="text-red-500 hover:text-red-700"
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default GlobalNotifications;