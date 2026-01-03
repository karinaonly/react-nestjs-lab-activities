import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../service/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      
      if (response.data && response.data.token) {
        login(response.data.token, response.data.user);
        navigate("/movies");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          <h2 className="text-base font-semibold mb-6 text-center">
            Sign in to Movie App
          </h2>
          <hr className=" bg-[#D1D9E0] mb-6" />

          <form className="text-left" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
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
              <label className="block text-sm font-medium mb-2">Password</label>
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label className="text-sm">Remember me</label>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <button
              className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="bg-[#FAFBFC] border border-[#D1D9E0] p-4 rounded-lg shadow-sm">
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:underline bg-none border-none cursor-pointer"
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
