"use client"; // Add this line to declare the component as a client component

import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// Create AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated based on token in local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to log in the user
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("token", token); // Save token to local storage
  };

  // Function to log out the user
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token"); // Remove token from local storage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
