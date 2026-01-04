import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../service/axiosInstance";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        username,
        role: "user", // Always create as regular user
      });
      
      if (response.data && response.data.access_token) {
        login(response.data.user, response.data.access_token);
        navigate("/movies");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <div className="bg-[#FAFBFC] border border-[#D1D9E0] p-8 rounded-lg shadow-sm">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-20 h-20 border rounded-full border-[#D1D9E0] bg-white"
            />
          </div>
        <h2 className="text-base font-semibold text-center">
          Create Your Account
        </h2>
        <p className="text-xs mb-6 text-center">
          Join the Movie App to start reviewing movies.
        </p>
        <hr className=" bg-[#D1D9E0] mb-6" />

        <form className="text-left" onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md mb-2">
              {error}
            </div>
          )}
          <button
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        </div>

        <div className="bg-[#FAFBFC] border border-[#D1D9E0] p-4 rounded-lg shadow-sm">
          <p className="text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline bg-none border-none cursor-pointer"
            >
              Sign In.
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
