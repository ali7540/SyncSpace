import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
