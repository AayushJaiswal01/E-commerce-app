"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState(""); // Change to username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the API call for login using username
      const response = await axios.post(
        "https://e-commerce-app-g2yu.onrender.com/login",
        {
          username, // Use username for login
          password,
        }
      );
      // Redirect on successful login
      const { accessToken } = response.data; // Adjust based on your API response structure
      console.log(accessToken);
      localStorage.setItem("token", accessToken); // Save token in local storage
      router.replace("/");
      setTimeout(() => {
        window.location.reload();
      }, 100); // Adjust the delay (in milliseconds) as needed
    } catch (error) {
      setErrorMessage("Invalid username or password.");
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post("https://e-commerce-app-g2yu.onrender.com/signup", {
        username, // Use username for sign up
        password,
      });
      setSuccessMessage("Account created successfully! Please log in.");
      setErrorMessage();
      setIsLogin(true); // Switch back to login form
    } catch (error) {
      setErrorMessage("Error creating account. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={isLogin ? handleLoginSubmit : handleSignUpSubmit}
        className="bg-white p-8 rounded shadow-md min-h-[500px]" // Increased padding and set a fixed width
      >
        <h2 className="text-3xl mb-4">{isLogin ? "Login " : "Sign Up"}</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}

        <input
          type="text"
          placeholder="Username" // Change placeholder to Username
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2 mb-8 mt-8 h-12"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-2 mb-8 h-12"
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-8 py-3"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="mt-0 text-sm">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
