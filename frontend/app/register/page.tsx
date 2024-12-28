"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import apiClient from "../../utils/apiClients";
import { useToast } from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaUsers, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import PinInputComponent from "../../components/PinInputComponent";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const [resendBlocked, setResendBlocked] = useState(false);
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await apiClient.post("/auth/resend-otp", { email });
      toast({ title: "OTP resent to your email.", status: "info" });

      setResendBlocked(true);
      setTimeout(() => setResendBlocked(false), 60000);
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || "Failed to resend OTP.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // API Calls and Handlers
  const handleSignUp = async () => {
    setLoading(true);
    try {
      await apiClient.post("/auth/register", { username, email, password });
      setStep(2);
      toast({ title: "OTP sent to your email.", status: "info" });
    } catch (error: any) {
      toast({ title: error.response?.data?.error || "Error during registration.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      await apiClient.post("/auth/verify-otp", { email, otp });
      setStep(3);
      toast({ title: "OTP verified successfully.", status: "success" });
    } catch (error: any) {
      toast({ title: error.response?.data?.error || "Invalid OTP.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelection = () => {
    setStep(4);
    toast({ title: "Group selection complete.", status: "success" });
  };

  const handleCompleteRegistration = () => {
    toast({ title: "Redirecting to dashboard...", status: "success" });
    router.push("/dashboard");
  };

  return (
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Panel: Flow */}
        <div className="hidden lg:flex w-1/3 bg-gray-50 border-r justify-center">
          <div className="flex flex-col justify-center items-center h-full p-8 relative">
            <h1 className="text-4xl font-bold mb-12">StudyRoom</h1>
            <div className="relative flex flex-col items-center w-full">
              {[
                { label: "Provide your details", icon: <FaUser /> },
                { label: "Verify your email", icon: <FaEnvelope /> },
                { label: "Join or create a group", icon: <FaUsers /> },
                { label: "Welcome to StudyRoom", icon: <FaCheckCircle /> },
              ].map((stepInfo, index) => (
                <div key={index} className="flex items-center w-full relative mb-8">

                  {index < 3 && (
                            <div
                              className={`absolute top-full left-[1.7rem] h-12 w-0.5 ${
                                step > index+1 ? "bg-black" : "bg-gray-300"
                              } z-0`}
                            ></div>
                          )}

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-full text-xl ${
                        step > index ? "bg-black text-white" : "bg-gray-300 text-black"
                      }`}
                    >
                      {stepInfo.icon}
                    </div>
                  </div>

                  <span
                    className={`ml-4 text-lg ${
                      step > index ? "font-semibold text-black" : "text-gray-500"
                    }`}
                  >
                    {stepInfo.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-12 bg-white">
          <div className="w-full max-w-lg">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6 mt-20 lg:mt-0">Create a Free Account</h2>
                <InputField type="text" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <InputField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputField
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleSignUp} loading={loading} className="w-full mt-4 bg-black text-white">
                  Continue
                </Button>
                <div className="flex items-center my-6">
                  <div className="flex-grow h-px bg-gray-300"></div>
                  <span className="mx-4 text-gray-500">or</span>
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                <Button
                  className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 flex justify-center items-center"
                  onClick={() =>
                    toast({
                      title: "Google Sign-Up coming soon!",
                      status: "info",
                      duration: 3000,
                    })
                  }
                >
                  <img src="/images/google-logo.png" alt="Google Logo" className="w-5 h-5 mr-2" />
                  Sign up with Google
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Verify Your Email</h2>
                <p className="text-sm mb-4">
                  We sent a code to <span className="font-bold">{email}</span>
                </p>

                <PinInputComponent
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  onComplete={handleVerifyOTP}
                />

                <Button
                  onClick={handleVerifyOTP}
                  loading={loading}
                  className="w-full mt-4 bg-black text-white"
                >
                  Verify OTP
                </Button>

                <div className="text-sm mt-4 text-center">
                  Didn't get the code?{" "}
                  <button
                    onClick={handleResendOtp}
                    disabled={resendBlocked}
                    className={`font-bold ${
                      resendBlocked ? "text-gray-500 cursor-not-allowed" : "text-blue-500 hover:underline"
                    }`}
                  >
                    Resend
                  </button>
                </div>

                <div className="mt-4 flex items-center text-sm">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center text-gray-500 hover:text-black"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Edit Details
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Join or Create a Group</h2>
                <InputField
                  type="text"
                  label="Enter Group Code (if joining)"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                />
                <p className="text-center my-4 font-bold">OR</p>
                <InputField
                  type="text"
                  label="Create a New Group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button onClick={handleGroupSelection} loading={loading} className="w-full mt-4 bg-black text-white">
                  Continue
                </Button>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Welcome to StudyRoom!</h2>
                <Button onClick={handleCompleteRegistration} className="w-full mt-4 bg-black text-white">
                  Go to Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;
