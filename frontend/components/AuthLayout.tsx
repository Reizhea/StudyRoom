import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl shadow-lg rounded-lg bg-white p-8 md:p-12">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
