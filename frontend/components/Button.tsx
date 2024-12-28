"use client";

import React from "react";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ className = "", onClick, loading = false, disabled = false, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium text-center transition-all ${
        loading ? "cursor-not-allowed opacity-50" : "hover:opacity-80"
      } ${className}`}
      disabled={loading || disabled}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
