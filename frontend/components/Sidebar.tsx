"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import CreateGroupModal from "./CreateGroupModal";
import JoinGroupModal from "./JoinGroupModal";
import { mockGroups, Group } from "../utils/mockData";
import { getUserProfile } from "@/utils/apiClients";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const placeholderImage ="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        const { profilePicture } = response.data;
        setProfilePicture(
          profilePicture || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
        );
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDropdown]);

  const handleLogout = (): void => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const filteredGroups = mockGroups.filter((group: Group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`bg-gray-50 text-gray-800 ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 h-screen fixed z-10 border-r shadow-md overflow-hidden`}
      onMouseEnter={() => {
        setIsCollapsed(false);
        setShowDropdown(false); 
      }}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-300 relative">
        {!isCollapsed && (
          <input
            type="text"
            placeholder="Search groups..."
            className="bg-gray-200 text-sm text-gray-800 px-2 py-1 rounded"
            style={{ width: "75%" }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
        <div ref={dropdownRef} className="relative flex items-center justify-center">
          <button
            className="bg-blue-500 p-2 rounded text-white flex items-center justify-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FiPlus size={16} />
          </button>
          {showDropdown && (
            <div className="absolute top-full mt-2 right-0 w-40 bg-white border border-gray-300 rounded shadow-md z-20">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Group
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsJoinModalOpen(true)}
              >
                Join Group
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="p-2 flex items-center hover:bg-gray-100 cursor-pointer relative"
          >
            <img
              src={group.image}
              alt={group.name}
              className="w-10 h-10 rounded-full"
            />
            {group.unreadCount > 0 && (
              <span
                className={`absolute ${
                  isCollapsed
                    ? "top-2 right-2"
                    : "top-1/2 right-4 -translate-y-1/2"
                } bg-red-500 w-2 h-2 rounded-full`}
              />
            )}
            {!isCollapsed && (
              <div className="ml-4 flex justify-between items-center w-full">
                <span className="truncate">{group.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 flex items-center justify-between border-t border-gray-300 absolute bottom-4 w-full">
        <img
          src={profilePicture}
          alt="User Avatar"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
          className="w-10 h-10 rounded-full"
          onClick={() => router.push("/userprofile")}
        />
        {!isCollapsed && (
          <button
            className="bg-red-500 text-white text-sm px-3 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(groupName) => console.log(`Group Created: ${groupName}`)}
      />
      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={(groupCode) => console.log(`Joined Group: ${groupCode}`)}
      />
    </div>
  );
};

export default Sidebar;
