"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="p-8">
      <nav className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">
          <span className="text-blue-600">Sync</span>Space
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Welcome, <span className="font-medium">{user.name}</span>!
          </p>
          <button
            onClick={logout}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="text-center">
        <h2 className="text-3xl font-semibold">Your Dashboard</h2>
        <p className="mt-4 text-gray-600">Your documents will appear here.</p>
      </div>
    </div>
  );
}