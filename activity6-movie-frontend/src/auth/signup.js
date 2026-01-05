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
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <div className="p-8 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate('/movies')}
              className="text-sm px-3 py-1 rounded hover:opacity-80"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              ← Back to Movies
            </button>
            <div className="flex-1"></div>
          </div>
          <div className="flex justify-center mb-4">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-20 h-20 border rounded-full"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
            />
          </div>
        <h2 className="text-base font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
          Create Your Account
        </h2>
        <p className="text-xs mb-6 text-center" style={{ color: 'var(--text-muted)' }}>
          Join the Movie App to start reviewing movies.
        </p>
        <hr className="mb-6" style={{ backgroundColor: 'var(--border-color)', border: 'none', height: '1px' }} />

        <form className="text-left" onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Password <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
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
            className="w-full text-white py-2 rounded-md hover:opacity-90 transition duration-200 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-color)' }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        </div>

        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <p className="text-center text-sm" style={{ color: 'var(--text-primary)' }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="hover:underline bg-none border-none cursor-pointer"
              style={{ color: 'var(--accent-color)' }}
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
