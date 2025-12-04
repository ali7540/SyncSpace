"use client";

import Link from "next/link";
import { use, useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import LexicalEditor from "./LexicalEditor";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/AuthContext";
import ShareModal from "./ShareModal";
import HistorySidebar from "./HistorySidebar";
import VersionPreview from "./VersionPreview";
import ProfileSidebar from "@/components/ui/ProfileSidebar";

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
  const { user } = useAuth();
  const socket = useSocket(id, user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Synced");

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [previewVersion, setPreviewVersion] = useState(null);

  const [role, setRole] = useState("VIEWER");
  const [ownerName, setOwnerName] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  const [isProfileOpen, setIsProfileOpen] = useState(false); 

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  const initialContentRef = useRef(null);
  const initialTitleRef = useRef(null);



  useEffect(() => {
    if (!socket) return;
    socket.on("room-users", (users) => {
      setActiveUsers(users);
    });
    return () => socket.off("room-users");
  }, [socket]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/docs/${id}`);
        const doc = response.data;
        setTitle(doc.title);
        setRole(doc.userRole);
        setOwnerName(doc.owner?.name || "Unknown");

        let loadedContent = EMPTY_DOC_STATE;
        if (doc.content && doc.content.root) {
          loadedContent = doc.content;
        }

        setContent(loadedContent);
        initialContentRef.current = JSON.stringify(loadedContent);
        initialTitleRef.current = doc.title;
      } catch (error) {
        setSaveStatus("Error loading");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDocument();
  }, [id]);

  useEffect(() => {
    if (loading || content == null || role === "VIEWER" || previewVersion)
      return;

    const currentContentString = JSON.stringify(debouncedContent);

    const titleChanged = debouncedTitle !== initialTitleRef.current;
    const contentChanged = currentContentString !== initialContentRef.current;

    if (!contentChanged && !titleChanged) {
      return;
    }

    const saveDocument = async () => {
      setSaveStatus("Saving...");
      try {
        // console.log(content);
        await api.put(`/docs/${id}`, {
          title: debouncedTitle,
          content: debouncedContent,
        });
        setSaveStatus("Saved");
        initialContentRef.current = currentContentString;
        initialTitleRef.current = debouncedTitle;
      } catch (error) {
        console.error("Save failed", error);
        setSaveStatus("Error saving");
      }
    };
    saveDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  const handleRestore = async (version) => {
    if (!confirm("Restore this version? Current changes will be overwritten."))
      return;

    try {
      setContent(version.content);

      await api.put(`/docs/${id}`, {
        title: title,
        content: version.content,
      });

      if (socket) {
        socket.emit("send-changes", {
          documentId: id,
          newContent: version.content,
        });
      }

      setPreviewVersion(null);
      setIsHistoryOpen(false);
      setSaveStatus("Restored");
      initialContentRef.current = JSON.stringify(version.content);
    } catch (err) {
      alert("Failed to restore version");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  const isReadOnly = role === "VIEWER";
  const isOwner = role === 'OWNER'
  return (
    <div className="flex flex-col h-screen bg-gray-50 relative overflow-hidden">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-20">
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
              {isReadOnly && (
                <span className="bg-gray-100 text-gray-600 px-1.5 rounded border border-gray-200">
                  Read Only
                </span>
              )}
              <span>• {saveStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
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

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
            title="Version History"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            Share
          </button>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow hover:shadow-md transition-all ml-2"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 flex justify-center relative z-0">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl min-h-[800px] border border-gray-200">
          <LexicalEditor
            initialContent={content}
            onContentChange={setContent}
            socket={socket}
            documentId={id}
            isReadOnly={isReadOnly}
          />
        </div>
      </main>

      <ShareModal
        documentId={id}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <HistorySidebar
        documentId={id}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onPreview={(version) => setPreviewVersion(version)} 
        isReadOnly={isReadOnly}
        Content={content}
        isOwner={isOwner}
      />

      {previewVersion && (
        <VersionPreview
          version={previewVersion}
          isReadOnly={isReadOnly}
          onClose={() => setPreviewVersion(null)}
          onRestore={() => handleRestore(previewVersion)}
        />
      )}
    </div>
  );
}
