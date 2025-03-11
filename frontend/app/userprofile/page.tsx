"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { getUserProfile, updateUserProfile } from "@/utils/apiClients";
import { useToast } from "@chakra-ui/react";
import imageCompression from "browser-image-compression";
import { FaArrowLeft } from "react-icons/fa";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const placeholderImage =
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        const { username, email, profilePicture } = response.data;

        setUsername(username);
        setEmail(email);
        const validProfilePicture =
          profilePicture && profilePicture.trim() !== ""
            ? profilePicture
            : placeholderImage;

        setProfilePicture(validProfilePicture);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({ title: "Failed to load profile.", status: "error" });
        setProfilePicture(placeholderImage);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleUpdateProfile = async () => {
    if (password && password !== confirmPassword) {
      toast({ title: "Passwords do not match.", status: "error" });
      return;
    }
  
    setLoading(true);
    try {
      const updatedData = {
        username,
        password: password || undefined,
        profilePicture: profilePicture || undefined,
      };
  
      await updateUserProfile(updatedData);
  
      toast({ title: "Profile updated successfully.", status: "success" });
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Failed to update profile.", status: "error" });
    } finally {
      setLoading(false);
    }
  };
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };
        const compressed = await imageCompression(file, options);
        const reader = new FileReader();

        reader.onload = () => {
          setProfilePicture(reader.result as string);
          setCompressedFile(reader.result as string);
        };

        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast({ title: "Failed to process image.", status: "error" });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-4 left-4 flex items-center text-black hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Dashboard
      </button>

      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-md w-full max-w-4xl">
        <div className="flex flex-col justify-center items-center lg:w-1/3 p-4 bg-gray-50">
          <img
            src={profilePicture || placeholderImage}
            alt="Profile Picture"
            onError={(e) => {
              e.currentTarget.src = placeholderImage;
            }}
            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {editing && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-center"
              />
            </div>
          )}
        </div>

        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>
          <InputField
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!editing}
          />
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={() => {}}
            disabled={true}
          />
          {editing && (
            <>
              <InputField
                type="password"
                label="Password"
                value={password}
                placeholder="Leave blank to keep current password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputField
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}
          <Button
            className="w-full bg-black text-white mt-4"
            onClick={editing ? handleUpdateProfile : () => setEditing(true)}
            loading={loading}
          >
            {editing ? "Save Changes" : "Edit Profile"}
          </Button>
          {editing && (
            <Button
              className="w-full bg-gray-400 text-white mt-2"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
