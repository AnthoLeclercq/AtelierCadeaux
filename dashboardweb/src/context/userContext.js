import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    userId: null,
    name: null,
    email: null,
    role: null,
    address: null,
    city: null,
    zipcode: null,
    profession: null,
  });

  const login = (
    userId,
    name,
    email,
    role,
    address,
    city,
    zipcode,
    profession
  ) => {
    setUser({
      isLoggedIn: true,
      userId,
      name,
      email,
      role,
      address,
      city,
      zipcode,
      profession,
    });
  };

  const logout = () => {
    setUser({
      isLoggedIn: false,
      userId: null,
      name: null,
      email: null,
      role: null,
      address: null,
      city: null,
      zipcode: null,
      profession: null,
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
