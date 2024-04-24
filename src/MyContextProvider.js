import React, { createContext, useState } from 'react';
const MyContext = createContext();
const MyContextProvider = ({ children }) => {
  const [loggedUserData, setLoggedUser] = useState({});
  const updateLoggedUserData = (user) => {
    
    setLoggedUser(user);
  };

  return (
    <MyContext.Provider value={{ loggedUserData, updateLoggedUserData}}>
      {children}
    </MyContext.Provider>
  );
};
export { MyContext, MyContextProvider };