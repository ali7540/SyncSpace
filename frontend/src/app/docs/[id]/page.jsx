// "use client";

// import Link from 'next/link';
// import { use, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';
// import { useDebounce } from '@/hooks/useDebounce';

// export default function DocumentPage({ params }) {
//   const { id } = use(params);
//   const router = useRouter();

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
  
//   const [loading, setLoading] = useState(true);
//   const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved', 'Saving...', 'Error'

//   const debouncedTitle = useDebounce(title, 1000);
//   const debouncedContent = useDebounce(content, 1000);

//   useEffect(() => {
//     const fetchDocument = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/docs/${id}`);
//         const doc = response.data;
//         setTitle(doc.title);
//         setContent(doc.content?.text || ''); 
//       } catch (error) {
//         console.error('Error fetching document:', error);
//         setSaveStatus('Error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDocument();
//     }
//   }, [id]); 

  
//   useEffect(() => {
//     if (loading) return;

//     const saveDocument = async () => {
//       setSaveStatus('Saving...');
//       try {
//         await api.put(`/docs/${id}`, {
//           title: debouncedTitle,
//           content: { text: debouncedContent } 
//         });
//         setSaveStatus('Saved');
//       } catch (error) {
//         console.error('Error saving document:', error);
//         setSaveStatus('Error');
//       }
//     };

//     saveDocument();

//   }, [debouncedTitle, debouncedContent, id, loading]); 


//   const handleDelete = async () => {
//     // In a real app, we'd use a modal here instead of just deleting
//     setSaveStatus('Deleting...');
//     try {
//       await api.delete(`/docs/${id}`);
//       setSaveStatus('Deleted');
//       router.push('/dashboard'); 
//     } catch (error) {
//       console.error('Error deleting document:', error);
//       setSaveStatus('Error');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p>Loading document...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen">
//       <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
//         <div className="flex-1">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="text-2xl font-semibold border-none focus:ring-0"
//             placeholder="Untitled Document"
//           />
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-500 italic">{saveStatus}</span>
//           <button
//             onClick={handleDelete}
//             className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
//           >
//             Delete
//           </button>
//           <Link 
//             href="/dashboard"
//             className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
//           >
//             Back to Dashboard
//           </Link>
//         </div>
//       </header>

//       <main className="flex-1 p-8">
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full h-full border-gray-300 rounded-md p-4 text-lg"
//           placeholder="Start typing..."
//         />
//       </main>
//     </div>
//   );
// }


"use client";

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import LexicalEditor from './LexicalEditor'; 

const EMPTY_DOC_STATE = {
  "root": {
    "children": [{
      "children": [],
      "direction": null,
      "format": "",
      "indent": 0,
      "type": "paragraph",
      "version": 1
    }],
    "direction": null,
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
};

export default function DocumentPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null); 
  
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('Saved'); 

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000); 

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/docs/${id}`);
        const doc = response.data;
        setTitle(doc.title);
        
        if (doc.content && doc.content.root) {
          setContent(doc.content);
        } else {
          setContent(EMPTY_DOC_STATE);
        }
        
      } catch (error) {
        console.error('Error fetching document:', error);
        setSaveStatus('Error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  useEffect(() => {
    if (loading || content === null) return;

    const saveDocument = async () => {
      setSaveStatus('Saving...');
      try {
        await api.put(`/docs/${id}`, {
          title: debouncedTitle,
          content: debouncedContent 
        });
        setSaveStatus('Saved');
      } catch (error) {
        console.error('Error saving document:', error);
        setSaveStatus('Error');
      }
    };

    saveDocument();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent, id, loading]); 

  const handleDelete = async () => {
    setSaveStatus('Deleting...');
    try {
      await api.delete(`/docs/${id}`);
      setSaveStatus('Deleted');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting document:', error);
      setSaveStatus('Error');
    }
  };

  if (loading || content === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading document...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold border-none focus:ring-0 p-0"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 italic">{saveStatus}</span>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
          >
            Delete
          </button>
          <Link 
            href="/dashboard"
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <LexicalEditor
          initialContent={content}
          onContentChange={setContent}
        />
      </main>
    </div>
  );
}