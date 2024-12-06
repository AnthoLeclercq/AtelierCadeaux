import React, { createContext, useState } from "react";

const initialUser = {
  token: "",
  user_id: "",
  name: "",
  email: "", 
  role: "",
};

const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <userContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </userContext.Provider>
  );
};

export default userContext;
