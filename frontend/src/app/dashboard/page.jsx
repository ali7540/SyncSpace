"use client";

import { useAuth } from "@/context/AuthContext";
import DocumentList from "./DocumentList"; 
import Navbar from "@/components/ui/Navbar"; 


export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="p-8">
        <DocumentList />
      </main>
    </div>
  );
}