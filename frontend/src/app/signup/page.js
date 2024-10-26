"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post("https://e-commerce-app-g2yu.onrender.com/signup", {
        username,
        password,
      });
      setSuccessMessage("Account created successfully! Please log in.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage("Error creating account. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2 mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2 mb-4"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2 mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
