"use client";

import React from "react";

interface InputFieldProps {
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  forgotPasswordLink?: boolean;
  onForgotPasswordClick?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = "",
  forgotPasswordLink = false,
  onForgotPasswordClick,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-gray-700 font-medium">{label}</label>
        {forgotPasswordLink && (
          <span
            onClick={onForgotPasswordClick}
            className="text-sm text-blue-500 hover:underline cursor-pointer"
          >
            Forgot?
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border border-gray-300 transition-all focus:outline-0 focus:shadow-[0_0_8px_2px_rgba(252,176,243,0.7)] hover:shadow-[0_0_8px_2px_rgba(252,176,243,0.7)] ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
      />
    </div>
  );
};

export default InputField;
