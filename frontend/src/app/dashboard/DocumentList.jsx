// "use client";

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import api from '@/lib/api';
// import { useRouter } from 'next/navigation';

// export default function DocumentList() {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const response = await api.get('/docs');
//         setDocuments(response.data);
//       } catch (err) {
//         console.error("Error fetching documents:", err);
//         setError('Failed to load documents.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDocuments();
//   }, []);

//   const handleCreateDocument = async () => {
//     try {
//       const response = await api.post('/docs', { title: 'Untitled Document' });
//       const newDocument = response.data;

//       router.push(`/docs/${newDocument.id}`);
//     } catch (err) {
//       console.error("Error creating document:", err);
//       setError('Failed to create a new document.');
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-500">Loading documents...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-semibold">Your Documents</h2>
//         <button
//           onClick={handleCreateDocument}
//           className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
//         >
//           + New Document
//         </button>
//       </div>

//       {documents.length === 0 ? (
//         <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
//           <p>You don&apos;t have any documents yet.</p>
//           <p>Click &quot;New Document&quot; to get started.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {documents.map((doc) => (
//             <Link
//               href={`/docs/${doc.id}`}
//               key={doc.id}
//               className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//             >
//               <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
//               <p className="text-sm text-gray-500 mt-2">
//                 Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
//               </p>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get("/docs");
        setDocuments(response.data);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleCreateDocument = async () => {
    try {
      const response = await api.post("/docs", { title: "Untitled Document" });
      const newDocument = response.data;
      router.push(`/docs/${newDocument.id}`);
    } catch (err) {
      console.error("Error creating document:", err);
      setError("Failed to create a new document.");
    }
  };

  const handleDelete = async (docId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this document?")) return;
    try {
      await api.delete(`/docs/${docId}`);
      setDocuments(documents.filter((doc) => doc.id !== docId));
    } catch (err) {
      alert("Failed to delete. You might not be the owner.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Your Documents</h2>
        <button
          onClick={handleCreateDocument}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          + New Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <p>You don&apos;t have any documents yet.</p>
          <p>Click &quot;New Document&quot; to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {documents.map((doc) => {
            const isOwner = doc.ownerId === user.id;

            return (
              <Link
                href={`/docs/${doc.id}`}
                key={doc.id}
                className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Card Top / Thumbnail placeholder */}
                <div className="h-32 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                  <span className="text-4xl text-gray-200">📄</span>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-gray-900 truncate mb-1"
                    title={doc.title}
                  >
                    {doc.title}
                  </h3>

                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      {/* Icon to distinguish Owner/Shared */}
                      {isOwner ? (
                        <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                          Owner
                        </span>
                      ) : (
                        <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Shared
                        </span>
                      )}
                    </span>
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>

                  {!isOwner && doc.owner && (
                    <p className="text-xs text-gray-400 mt-2 truncate">
                      By {doc.owner.name}
                    </p>
                  )}
                </div>

                {/* Delete Button (Only for owner) */}
                {isOwner && (
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className=" top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
