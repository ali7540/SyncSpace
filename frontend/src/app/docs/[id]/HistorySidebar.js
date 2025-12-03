"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function HistorySidebar({
  documentId,
  isOpen,
  onClose,
  onPreview,
  isReadOnly,
  Content,
  isOwner
}) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .get(`/docs/${documentId}/versions`)
        .then((res) => {
          setVersions(res.data);
          // console.log(versions)
        })
        .catch((err) => console.error("Failed to load history", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, documentId]);

  const handleSaveSnapshot = async () => {
    try {
      setLoading(true);
      await api.post(`/docs/${documentId}/versions`, {
        content: Content,
      });
      const res = await api.get(`/docs/${documentId}/versions`);
      setVersions(res.data);
    } catch (err) {
      alert("Failed to save version. You may not have permission.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVersion = async (versionId) => {
    if (
      !confirm(
        "Are you sure you want to delete this version snapshot? This cannot be undone."
      )
    )
      return;

    try {
      setLoading(true);
      await api.delete(`/docs/${documentId}/versions/${versionId}`);
      setVersions((prev) => prev.filter((v) => v.id !== versionId));
    } catch (err) {
      alert("Failed to delete version.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col transform transition-transform">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-700">Version History</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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

      {!isReadOnly && (
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleSaveSnapshot}
            className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Current Version
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 text-sm">
            Loading history...
          </p>
        ) : versions.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No history yet.</p>
        ) : (
          versions.map((v) => (
            <div
              key={v.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              {isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVersion(v.id);
                  }}
                  className="top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Version"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-gray-600">
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(v.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Saved by{" "}
                <span className="text-gray-700">
                  {v.author?.name || "Unknown"}
                </span>
              </p>

              <button
                onClick={() => onPreview(v)}
                className="w-full py-1.5 bg-gray-50 text-gray-600 text-xs rounded hover:bg-gray-100 font-medium border border-gray-200"
              >
                View Version
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
