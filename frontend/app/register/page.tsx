"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import apiClient from "../../utils/apiClients";
import { useToast } from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaUsers, FaCheckCircle, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import PinInputComponent from "../../components/PinInputComponent";
import CreateGroupModal from "../../components/CreateGroupModal";
import ProgressBar from "@/components/ProgressBar";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [cooldown, setCooldown] = useState(30);

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

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await apiClient.post("/auth/resend-otp", { email });
      toast({ title: "OTP resent to your email.", status: "info" });
      setCooldown(60);
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || "Failed to resend OTP.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      toast({ title: "Group Code cannot be empty.", status: "error" });
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/groups/join", { groupCode });
      toast({ title: "Joined group successfully!", status: "success" });
      setStep(4);
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || "Failed to join group.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupName: string) => {
    setLoading(true);
    try {
      await apiClient.post("/groups/create", { groupName });
      toast({ title: "Group created successfully!", status: "success" });
      setStep(4); 
    } catch (error: any) {
      toast({
        title: error.response?.data?.error || "Failed to create group.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
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
                      className={`w-14 h-14 flex items-center justify-center rounded-xl text-xl ${
                        step > index ? "bg-black text-white" : "bg-gray-300 text-black"
                      }`}
                    >
                      {stepInfo.icon}
                    </div>
                  </div>

                  <span
                    className={`ml-10 text-lg ${
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
        <div className="flex flex-col justify-center items-center w-full lg:w-2/3 bg-white px-8">
        <button
                  onClick={() => router.push("/")}
                  className="flex items-center text-black hover:underline absolute top-4 left-4 lg:top-8 lg:left-8"
                >
                  <FaArrowLeft className="mr-2" />
                  Home
                </button>
          <div className="w-full max-w-md mt-0 lg:mt-0">

            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6 mt-14 sm:mt-40 lg:mt-0 text-center">Create a Free Account</h2>
                <InputField type="text" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <InputField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputField
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleSignUp} loading={loading} className="w-full mt-0 bg-black text-white">
                  Continue
                </Button>
                <div className="flex items-center mt-6 mb-4">
                      <div className="border-t border-gray-300 w-full"></div>
                      <span className="text-sm text-gray-500 mx-4">or</span>
                      <div className="border-t border-gray-300 w-full"></div>
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
                <p className="text-sm mt-2 text-center">
                Already have an account?{" "}
                <a href="/login" className="text-gray-500 hover:text-black font-semibold">
                  Log In
                </a>
              </p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center mt-40 lg:mt-0">Verify Your Email</h2>
                <p className="block text-gray-700 font-medium mb-2">OTP</p>
                <PinInputComponent
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  onComplete={(value) => {
                    handleVerifyOTP(value)
                  }}
                />

                <Button
                  onClick={() => {
                    handleVerifyOTP(otp);
                  }}
                  loading={loading}
                  className="w-full mt-4 bg-black text-white"
                >
                  Verify OTP
                </Button>

                <div className="text-sm mt-4 text-center">
                  Didn't get the code?{" "}
                  <button
                    onClick={handleResendOtp}
                    disabled={cooldown > 0}
                    className={`text-gray-500 hover:text-black font-semibold ${
                      cooldown > 0 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
                  </button>
                </div>

                <div className="mt-4 flex items-center text-sm ">
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setCooldown(60);
                    }}
                    className="flex items-center text-gray-500 hover:text-black font-semibold"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Edit Details
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center mt-20 lg:mt-0">Join or Create a Group</h2>

                <div className="flex flex-col space-y-4">
                  <InputField
                    type="text"
                    label="Enter Group Code"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                  />
                  <Button
                    onClick={() => handleJoinGroup()}
                    loading={loading}
                    className="bg-black text-white"
                  >
                    Join Group
                  </Button>
                </div>

                <div className="flex items-center mt-6 mb-4">
                <div className="border-t border-gray-300 w-full"></div>
                <span className="text-sm text-gray-500 mx-4">or</span>
                <div className="border-t border-gray-300 w-full"></div>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-black text-white"
                >
                  Create Group
                </Button>

                <CreateGroupModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onCreate={(groupName) => handleCreateGroup(groupName)} 
                />

                <div className="mt-1 flex justify-end font-semibold text-sm">
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center text-gray-500 hover:text-black"
                  >
                    Skip for Now
                    <FaArrowRight className="ml-1 mt-1" />
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-2xl font-bold mb-40 text-center mt-40 lg:mt-0">Welcome to StudyRoom!</h2>
                <Button onClick={handleCompleteRegistration} className="w-full mt-4 mb-10 bg-black text-white">
                  Go to Dashboard
                </Button>
              </>
            )}
               <ProgressBar step={step} totalSteps={4} /> 
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;
