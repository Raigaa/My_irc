import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext({
  nick: "",
  setUser: () => {}
});

export const UserProvider = ({ children }) => {
  const [nick, setNick] = useState("");

  const setUser = (newNick) => {
    setNick(newNick);
  };

  return (
    <UserContext.Provider value={{ nick, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
