"use client";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* ... (Same JSX content as above) ... */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Account</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 flex-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
          <div className="w-full space-y-2">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-500">Plan</span>
              <span className="text-blue-600 font-medium">Free</span>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 flex justify-center gap-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
