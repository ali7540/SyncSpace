"use client";

import { useAuth } from "@/context/AuthContext";
import DocumentList from "./DocumentList"; 

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
      
      <DocumentList />
    </div>
  );
}