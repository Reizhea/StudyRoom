import React from "react";
import Sidebar from "../../components/Sidebar";

const Dashboard: React.FC = () => {
  return (
    <div className="relative h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Center Section (Chat) */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 border-r border-gray-300">
        <p>Select a group to view its chat.</p>
      </div>

      {/* Right Section (Shared Resources) */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center">
        <p>Shared resources placeholder</p>
      </div>
    </div>
  );
};

export default Dashboard;
