"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ title, showBackToDashboard }) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-30 relative">
        <div className="flex items-center gap-4">
          {showBackToDashboard && (
            <Link
              href="/dashboard"
              className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
          )}
          
          <Link href="/dashboard" className="text-2xl font-bold tracking-tight">
            <span className="text-blue-600">Sync</span>Space
          </Link>
          
          {title && (
            <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
          )}
          {title}
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          title="Open Profile"
        >
          {initials}
        </button>
      </nav>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Account</h3>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-inner">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500 mb-6">{user?.email}</p>

          <div className="w-full h-px bg-gray-100 mb-6"></div>

          <div className="w-full space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-500">Plan</span>
                <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Free</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium text-gray-700">
                    {new Date().getFullYear()} 
                </span>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100">
          <button
            onClick={() => {
                setIsSidebarOpen(false);
                logout();
            }}
            className="w-full py-2.5 px-4 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}