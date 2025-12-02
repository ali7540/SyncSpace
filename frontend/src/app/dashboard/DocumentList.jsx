// "use client";

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import api from '@/lib/api';
// import { useAuth } from '@/context/AuthContext';
// import { useDebounce } from '@/hooks/useDebounce';

// export default function DocumentList() {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState('all');
//   const [sort, setSort] = useState('modified_desc');

//   const debouncedSearch = useDebounce(search, 500);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get('/docs', {
//           params: {
//             search: debouncedSearch,
//             filter,
//             sort,
//           },
//         });
//         setDocuments(response.data);
//       } catch (err) {
//         console.error("Failed to fetch docs", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDocuments();
//   }, [debouncedSearch, filter, sort]);

//   const handleCreateDocument = async () => {
//     try {
//       const response = await api.post('/docs', { title: 'Untitled Document' });
//       window.location.href = `/docs/${response.data.id}`;
//     } catch (err) {
//       alert("Failed to create document");
//     }
//   };

//   const handleDelete = async (docId, e) => {
//     e.preventDefault(); e.stopPropagation();
//     if(!confirm("Delete this document?")) return;
//     try {
//       await api.delete(`/docs/${docId}`);
//       setDocuments(prev => prev.filter(d => d.id !== docId));
//     } catch (err) {
//       alert("Failed to delete. You might not be the owner.");
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="mb-8 space-y-4">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
//           <button
//             onClick={handleCreateDocument}
//             className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
//             New Document
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//           <div className="flex-1 relative">
//             <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//             <input
//               type="text"
//               placeholder="Search documents..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//             />
//           </div>

//           <div className="flex bg-gray-100 p-1 rounded-lg">
//             <button
//               onClick={() => setFilter('all')}
//               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setFilter('owned')}
//               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'owned' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               Owned
//             </button>
//             <button
//               onClick={() => setFilter('shared')}
//               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'shared' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               Shared
//             </button>
//           </div>

//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
//           >
//             <option value="modified_desc">Last Modified (Newest)</option>
//             <option value="modified_asc">Last Modified (Oldest)</option>
//             <option value="title_asc">Title (A-Z)</option>
//             <option value="title_desc">Title (Z-A)</option>
//           </select>
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {[1,2,3,4].map(i => (
//             <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
//           ))}
//         </div>
//       ) : documents.length === 0 ? (
//         <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
//           <p className="text-gray-500 text-lg">No documents found.</p>
//           {search && <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {documents.map((doc) => {
//             const isOwner = doc.ownerId === user.id;
//             return (
//               <Link
//                 href={`/docs/${doc.id}`} key={doc.id}
//                 className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative"
//               >
//                 <div className="h-32 bg-linear-to-br from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-center group-hover:from-blue-50 group-hover:to-white transition-colors">
//                    <span className="text-4xl shadow-sm">📄</span>
//                 </div>

//                 <div className="p-4 flex-1 flex flex-col">
//                   <h3 className="font-semibold text-gray-900 truncate mb-1" title={doc.title}>
//                     {doc.title}
//                   </h3>

//                   <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
//                     <div className="flex items-center gap-2">
//                       {isOwner ? (
//                         <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">Owner</span>
//                       ) : (
//                         <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
//                           Shared
//                         </span>
//                       )}
//                     </div>
//                     <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
//                   </div>

//                   {!isOwner && doc.owner && (
//                      <p className="text-xs text-gray-400 mt-2 truncate flex items-center gap-1">
//                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
//                        By {doc.owner.name}
//                      </p>
//                   )}
//                 </div>

//                 {isOwner && (
//                   <button
//                     onClick={(e) => handleDelete(doc.id, e)}
//                     className="top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm transform hover:scale-110"
//                     title="Delete"
//                   >
//                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                   </button>
//                 )}
//               </Link>
//             );
//           })}
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
import { useDebounce } from "@/hooks/useDebounce";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("modified_desc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await api.get("/docs", {
          params: {
            search: debouncedSearch,
            filter,
            sort,
            page,
            limit: 8,
          },
        });
        setDocuments(response.data.documents);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Failed to fetch docs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [debouncedSearch, filter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter, sort]);

  const handleCreateDocument = async () => {
    try {
      const response = await api.post("/docs", { title: "Untitled Document" });
      window.location.href = `/docs/${response.data.id}`;
    } catch (err) {
      alert("Failed to create document");
    }
  };

  const handleDelete = async (docId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this document?")) return;
    try {
      await api.delete(`/docs/${docId}`);
      setPage(1);
      setLoading(true);
      const response = await api.get("/docs", {
        params: {
          search: debouncedSearch,
          filter,
          sort,
          page,
          limit: 8,
        },
      });
      setDocuments(response.data.documents);
      setPagination(response.data.pagination);
    } catch (err) {
      alert("Failed to delete. You might not be the owner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Manage your collaborative documents.
          </p>
        </div>
        <button
          onClick={handleCreateDocument}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Document
        </button>
      </div>

      {/* <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        <div className="md:col-span-5 relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-4 flex bg-gray-100 p-1 rounded-lg justify-between md:justify-start">
          {['all', 'owned', 'shared'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="modified_desc">Last Modified (Newest)</option>
            <option value="modified_asc">Last Modified (Oldest)</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
        </div>
      </div> */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="inline-flex bg-gray-100 p-1 rounded-lg shrink-0 mx-auto md:mx-0">
          {["all", "owned", "shared"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[180px] md:max-w-[220px]">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="modified_desc">Last Modified (Newest)</option>
            <option value="modified_asc">Last Modified (Oldest)</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No documents found.</p>
          {search && (
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((doc) => {
              const isOwner = doc.ownerId === user.id;
              return (
                <Link
                  href={`/docs/${doc.id}`}
                  key={doc.id}
                  className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative h-full"
                >
                  <div className="h-32 bg-linear-to-br from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-center group-hover:from-blue-50 group-hover:to-white transition-colors">
                    <span className="text-4xl shadow-sm opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all">
                      📄
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3
                      className="font-semibold text-gray-900 truncate mb-1"
                      title={doc.title}
                    >
                      {doc.title}
                    </h3>

                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {isOwner ? (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase">
                            Owner
                          </span>
                        ) : (
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                            Shared
                          </span>
                        )}
                      </div>
                      <span>
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {!isOwner && doc.owner && (
                      <p className="text-xs text-gray-400 mt-2 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        By {doc.owner.name}
                      </p>
                    )}
                  </div>

                  {isOwner && (
                    <button
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Delete"
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

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-sm text-gray-600 flex items-center">
                Page {page} of {pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
