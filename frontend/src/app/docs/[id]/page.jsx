"use client";

import Link from "next/link";
import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import LexicalEditor from "./LexicalEditor";
import { useSocket } from "@/hooks/useSocket";
import ShareModal from "./ShareModal";
import { useAuth } from "@/context/AuthContext";

const EMPTY_DOC_STATE = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

export default function DocumentPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth(); // Get current user for socket
  const socket = useSocket(id, user); // Pass user to socket

  const [role, setRole] = useState("VIEWER");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Synced"); // Changed default to 'Synced'
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  // Use a ref to track if this is the first load
  const isFirstLoad = useRef(true);

  // Debounce values
  const debouncedTitle = useDebounce(title, 1000);
  // Important: We only debounce content for DB saving, not for socket
  const debouncedContent = useDebounce(content, 1000);

  // 1. Listen for Active Users from Socket
  useEffect(() => {
    if (!socket) return;
    socket.on("room-users", (users) => {
      setActiveUsers(users);
    });
    return () => socket.off("room-users");
  }, [socket]);

  // 2. Fetch Document & Role
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/docs/${id}`);
        const doc = response.data;

        setTitle(doc.title);
        setRole(doc.userRole); // Set Role (OWNER, EDITOR, VIEWER)
        setOwnerName(doc.owner?.name || "Unknown");

        if (doc.content && doc.content.root) setContent(doc.content);
        else setContent(EMPTY_DOC_STATE);
      } catch (error) {
        setSaveStatus("Error loading");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDocument();
  }, [id]);

  // 2. Auto-Save Logic (DB Persistence)
  // useEffect(() => {
  //   // CRITICAL GUARD CLAUSES
  //   // 1. Don't save if we are still fetching data
  //   if (loading) return;
  //   // 2. Don't save if content is null (prevents wiping DB)
  //   if (content === null) return;
  //   // 3. Don't save immediately on mount (wait for user action)
  //   if (isFirstLoad.current) return;

  //   const saveDocument = async () => {
  //     setSaveStatus("Saving...");
  //     try {
  //       await api.put(`/docs/${id}`, {
  //         title: debouncedTitle,
  //         content: debouncedContent,
  //       });
  //       setSaveStatus("Saved");
  //     } catch (error) {
  //       console.error("Error saving document:", error);
  //       setSaveStatus("Error saving");
  //     }
  //   };

  //   saveDocument();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [debouncedTitle, debouncedContent, id]);

  // 3. Auto-Save (Only if EDITOR/OWNER)
  useEffect(() => {
    if (loading || content === null || role === "VIEWER") return;

    const saveDocument = async () => {
      setSaveStatus("Saving...");
      try {
        await api.put(`/docs/${id}`, {
          title: debouncedTitle,
          content: debouncedContent,
        });
        setSaveStatus("Saved");
      } catch (error) {
        setSaveStatus("Error saving");
      }
    };
    saveDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    setSaveStatus("Deleting...");
    try {
      await api.delete(`/docs/${id}`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting document:", error);
      setSaveStatus("Error deleting");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
          <p className="text-gray-500">Loading document...</p>
        </div>
      </div>
    );
  }
  const isReadOnly = role === "VIEWER";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4 flex-1">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => !isReadOnly && setTitle(e.target.value)}
              disabled={isReadOnly}
              className="text-lg font-bold text-gray-800 border-none focus:ring-0 p-0 bg-transparent w-full disabled:cursor-default"
              placeholder="Untitled"
            />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {role === "OWNER" ? "Owner" : `Shared by ${ownerName}`}
              {role === "VIEWER" && (
                <span className="bg-gray-100 text-gray-600 px-1.5 rounded border border-gray-200">
                  Read Only
                </span>
              )}
              <span>• {saveStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Active Users Avatars */}
          <div className="flex -space-x-2 mr-4">
            {activeUsers.map((u) => (
              <div
                key={u.id}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold shadow-sm"
                style={{ backgroundColor: u.color }}
                title={u.name}
              >
                {u.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>

          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Share
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl min-h-[800px] border border-gray-200">
          <LexicalEditor
            initialContent={content}
            onContentChange={setContent}
            socket={socket}
            documentId={id}
            isReadOnly={isReadOnly} // Pass read-only flag
          />
        </div>
      </main>

      <ShareModal
        documentId={id}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
