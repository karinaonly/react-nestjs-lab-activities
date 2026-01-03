import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call your backend endpoint to verify email
      await axiosInstance.post("/auth/verify-email", { email });
      setSuccess("Verification link sent to your email");
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Call your backend endpoint to reset password
      await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword,
      });
      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-8 rounded-lg shadow-sm">
        <img
          src="/logo.png"
          alt="Logo"
          className="mx-auto mb-4 w-20 h-20 border rounded-full border-[#D1D9E0] bg-white"
        />
        <h2 className="text-base font-semibold mb-6 text-center">
          Forgot Your Password?
        </h2>
        <hr className=" bg-[#D1D9E0] mb-6" />

        {step === "email" ? (
          <form className="text-left" onSubmit={handleEmailSubmit}>
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

            {error && (
              <div className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md mb-2">
                {error}
              </div>
            )}
            {success && (
              <div className="flex justify-center bg-green-100 border border-green-400 text-green-600 p-1 rounded-md mb-2">
                {success}
              </div>
            )}

            <button
              className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        ) : (
          <form className="text-left" onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="newpassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                className="w-full px-3 py-2 border border-[#D1D9E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex justify-center bg-red-100 border border-red-400 text-red-600 p-1 rounded-md mb-2">
                {error}
              </div>
            )}
            {success && (
              <div className="flex justify-center bg-green-100 border border-green-400 text-green-600 p-1 rounded-md mb-2">
                {success}
              </div>
            )}

            <button
              className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition duration-200 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      <div className="w-96 bg-[#FAFBFC] border border-[#D1D9E0] p-4 rounded-lg shadow-sm">
        <p className="text-center text-sm">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline bg-none border-none cursor-pointer"
          >
            Login.
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
