"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import apiClient from "../../utils/apiClients";
import { useToast } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import PinInputComponent from "@/components/PinInputComponent";

const LoginForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const resetForgotPasswordState = () => {
    setOtp("");
    setNewPassword("");
    setStep(0);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
  
        const response = await apiClient.get("/auth/check-auth");
        if (response.data.isAuthenticated) {
          router.push("/dashboard");
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          console.warn("Access token expired. Logging out user.");
          localStorage.removeItem("authToken");
          router.push("/login");
        } else {
          console.error("Authentication check failed:", error);
        }
      }
    };
  
    checkAuth();
  }, [router]);
  
  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("authToken", response.data.accessToken);
      toast({
        title: "Login successful. Redirecting...",
        status: "success",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);

    try {
      await apiClient.post("/auth/forgot-password", { email });
      setStep(2);
      toast({
        title: "OTP sent to your email!",
        status: "info",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || "Failed to send OTP",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setLoading(true);
    try {
      await apiClient.post("/auth/verify-otp", { email, otp: otpValue });
      setStep(3);
      toast({ title: "OTP verified successfully.", status: "success" });
    } catch (error: any) {
      toast({ title: error.response?.data?.error || "Invalid OTP.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);

    try {
      await apiClient.post("/auth/reset-password", { email, otp, newPassword });
      toast({
        title: "Password reset successful! Redirecting...",
        status: "success",
        duration: 2000,
      });
      setTimeout(() => resetForgotPasswordState(), 3000);
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || "Failed to reset password",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Panel: Image Section */}
      <div className="hidden lg:flex w-1/3 bg-purple-100 items-center justify-center">
        <img
          src="/images/login-page.jpg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Panel: Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-2/3 bg-white px-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-black hover:underline absolute top-4 left-4 lg:top-8 lg:left-8"
        >
          <FaArrowLeft className="mr-2" />
          Home
        </button>

        <div className="w-full max-w-md mt-0 lg:mt-0">
          <h1
            className={`text-2xl font-bold mb-6 text-black text-center ${
              step === 0 ? "mt-40 lg:mt-10" : "mt-60 lg:mt-10"
            }`}
          >
            {step === 0
              ? "Welcome Back!"
              : step === 1
              ? "Forgot Password"
              : step === 2
              ? "Enter OTP"
              : "Reset Password"}
          </h1>

          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={step === 2 || step === 3}
            className={step === 2 || step === 3 ? "mb-0" : ""}
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
              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={handleLogin}
                loading={loading}
              >
                Login
              </Button>

              <p
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-black font-semibold cursor-pointer mt-4"
              >
                Forgot Password?
              </p>
              <div className="flex items-center mt-6 mb-4">
                <div className="border-t border-gray-300 w-full"></div>
                <span className="text-sm text-gray-500 mx-4">or</span>
                <div className="border-t border-gray-300 w-full"></div>
              </div>
              <Button
                className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 flex justify-center items-center"
                onClick={() =>
                  toast({
                    title: "Google Sign-In coming soon!",
                    status: "info",
                    duration: 3000,
                  })
                }
              >
                <img
                  src="/images/google-logo.png"
                  alt="Google Logo"
                  className="w-5 h-5 mr-2"
                />
                Sign in with Google
              </Button>
              <p className="text-sm mt-2 text-center">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-gray-500 hover:text-black font-semibold"
                >
                  Sign up
                </a>
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <Button
                onClick={handleSendOTP}
                loading={loading}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Send OTP
              </Button>
              <button
                onClick={() => resetForgotPasswordState()}
                className="flex items-center text-gray-500 hover:text-black font-semibold cursor-pointer mt-4"
              >
                <FaArrowLeft className="mr-2" /> Back to Login
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-black font-semibold text-sm mb-4"
                >
                  Edit Email
                </button>
              </div>
              <p className="block text-gray-700 font-medium mb-2">OTP</p>
              <PinInputComponent
                value={otp}
                onChange={(value) => setOtp(value)}
                onComplete={(value) => {
                  handleVerifyOTP(value);
                }}
              />
              <Button
                onClick={() => {
                  handleVerifyOTP(otp);
                }}
                loading={loading}
                className="w-full bg-black text-white hover:bg-gray-800 mt-6"
              >
                Verify OTP
              </Button>
              <button
                onClick={() => resetForgotPasswordState()}
                className="flex items-center text-gray-500 hover:text-black font-semibold cursor-pointer mt-4"
              >
                <FaArrowLeft className="mr-2" /> Back to Login
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-black font-semibold text-sm mb-4"
                >
                  Edit Email
                </button>
              </div>
              <InputField
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button
                onClick={handleResetPassword}
                loading={loading}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Reset Password
              </Button>
              <button
                onClick={() => resetForgotPasswordState()}
                className="flex items-center text-gray-500 hover:text-black font-semibold cursor-pointer mt-4"
              >
                <FaArrowLeft className="mr-2" /> Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForgotPassword;
