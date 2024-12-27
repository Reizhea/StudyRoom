"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";
import apiClient from "../../utils/apiClients";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [canEditDetails, setCanEditDetails] = useState(true);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post("/auth/register", {
        username,
        email,
        password,
      });
      setStep(2);
      setCanEditDetails(false);
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
      const response = await apiClient.post("/auth/verify-otp", { email, otp });
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDetails = () => {
    setCanEditDetails(true);
    setStep(1);
    setOtp("");
    setMessage("");
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-6">Create Your Account</h1>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <div className="w-full max-w-md">
          <InputField
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!canEditDetails}
            required
          />
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!canEditDetails}
            required
          />
          <InputField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!canEditDetails}
            required
          />
          {!canEditDetails && (
            <p
              onClick={handleEditDetails}
              className="text-blue-500 hover:underline cursor-pointer text-sm mb-4"
            >
              Edit Details?
            </p>
          )}

          {step === 2 && (
            <InputField
              type="text"
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          <div className="mt-4">
            {step === 1 && (
              <Button onClick={handleSignUp} loading={loading} className="w-full">
                Sign Up
              </Button>
            )}
            {step === 2 && (
              <Button onClick={handleVerifyOTP} loading={loading} className="w-full">
                Verify OTP
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
