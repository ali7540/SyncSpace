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

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/docs');
        setDocuments(response.data);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError('Failed to load documents.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []); 

  const handleCreateDocument = async () => {
    try {
      const response = await api.post('/docs', { title: 'Untitled Document' });
      const newDocument = response.data;
      router.push(`/docs/${newDocument.id}`);
    } catch (err) {
      console.error("Error creating document:", err);
      setError('Failed to create a new document.');
    }
  };

  const handleDelete = async (docId, e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // In a real app, use a confirmation modal
    try {
      await api.delete(`/docs/${docId}`);
      setDocuments(documents.filter((doc) => doc.id !== docId));
    } catch (err) {
      console.error("Error deleting document:", err);
      setError('Failed to delete document.');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading documents...</div>;
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Link 
              href={`/docs/${doc.id}`} 
              key={doc.id}
              className="group block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
            >
              <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
              </p>
              
              <button
                onClick={(e) => handleDelete(doc.id, e)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                title="Delete document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}