"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";
import apiClient from "../../utils/apiClients";

const LoginForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const resetForgotPasswordState = () => {
    setOtp("");
    setNewPassword("");
    setStep(0);
    setMessage("");
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("authToken", response.data.token);
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      setStep(2); 
      setMessage("OTP sent to your email!");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage("");

    try {
      setStep(3);
      setMessage("OTP verified successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/auth/reset-password", { email, otp, newPassword });
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        resetForgotPasswordState();
      }, 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-6">
          {step === 0 ? "Welcome Back!" : "Forgot Password"}
        </h1>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <div className="w-full max-w-md">
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {step === 0 && (
            <>
              <InputField
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button onClick={handleLogin} loading={loading} className="w-full mt-4">
                Login
              </Button>
              <p
                onClick={() => setStep(1)}
                className="text-blue-500 hover:underline cursor-pointer text-sm mt-4"
              >
                Forgot Password?
              </p>
              <p className="text-sm mt-6">
                Don’t have an account?{" "}
                <a href="/register" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <Button onClick={handleSendOTP} loading={loading} className="w-full mt-4">
                Send OTP
              </Button>
              <p
                onClick={() => resetForgotPasswordState()}
                className="text-blue-500 hover:underline cursor-pointer text-sm mt-4"
              >
                Back to Login
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <InputField
                type="text"
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button onClick={handleVerifyOTP} loading={loading} className="w-full mt-4">
                Verify OTP
              </Button>
              <p
                onClick={() => resetForgotPasswordState()}
                className="text-blue-500 hover:underline cursor-pointer text-sm mt-4"
              >
                Back to Login
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <InputField
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button onClick={handleResetPassword} loading={loading} className="w-full mt-4">
                Reset Password
              </Button>
              <p
                onClick={() => resetForgotPasswordState()}
                className="text-blue-500 hover:underline cursor-pointer text-sm mt-4"
              >
                Back to Login
              </p>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginForgotPassword;
