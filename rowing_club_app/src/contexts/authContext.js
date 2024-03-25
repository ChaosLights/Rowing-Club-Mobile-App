import React, { createContext, useState } from 'react';

// Creating a context to share authentication status across the app.
export const AuthContext = createContext({
  userUID: null,
  setUserUID: () => {},
});

// A component that provides authentication data to its children.
export const AuthProvider = ({ children }) => {
  // State to keep track of the current user's UID.
  const [userUID, setUserUID] = useState(null);

  // Making the userUID and its updater function available to child components.
  return (
    <AuthContext.Provider value={{ userUID, setUserUID }}>
      {children}
    </AuthContext.Provider>
  );
};


/* This file establishes a central place to manage and share the authentication status (userUID) to the entire application. */