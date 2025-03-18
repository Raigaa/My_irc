import React, { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function NickComponents({ onNickSet }) {
  const [nickname, setNickname] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    socket.emit("getUsers");

    socket.once("getUsers", (users) => {
      if (users.includes(nickname)) {
        setErrorMessage(
          "This nickname is already taken, please choose another one."
        );
      } else {
        sessionStorage.setItem("nickname", nickname);
        onNickSet(nickname);
      }
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      setErrorMessage("The nickname must only contain letters and numbers.");
    } else if (value.length > 12) {
      setErrorMessage("The nickname cannot exceed 12 characters.");
    } else {
      setNickname(value);
      setErrorMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full p-6 bg-white rounded shadow-md max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
      >
        <div className="mb-4">
          <label
            htmlFor="nickname"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Quel est ton nickname ?
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Soumettre
          </button>
        </div>
        {errorMessage && (
          <span
            id="error"
            className="block bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3"
            role="alert"
          >
            {errorMessage}
          </span>
        )}
      </form>
    </div>
  );
}

export default NickComponents;
