import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../service/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: emailOrUsername,
        password,
      });
      
      if (response.data && response.data.access_token) {
        login(response.data.user, response.data.access_token);
        navigate("/movies");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Invalid username/email or password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
    
    return false;
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
          <h2 className="text-base font-semibold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            Sign in to Movie App
          </h2>
          <hr className="mb-6" style={{ backgroundColor: 'var(--border-color)', border: 'none', height: '1px' }} />

          <form className="text-left" onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Username or Email</label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                type="text"
                id="emailOrUsername"
                placeholder="Enter your username or email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Password</label>
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
              <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded-md mb-4 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label className="text-sm" style={{ color: 'var(--text-primary)' }}>Remember me</label>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm hover:underline"
                style={{ color: 'var(--accent-color)' }}
              >
                Forgot password?
              </button>
            </div>
            <button
              className="w-full text-white py-2 rounded-md hover:opacity-90 transition duration-200 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-color)' }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <p className="text-center text-sm" style={{ color: 'var(--text-primary)' }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="hover:underline bg-none border-none cursor-pointer"
              style={{ color: 'var(--accent-color)' }}
            >
              Create an Account.
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
