// "use client";

// import { useState } from 'react';
// import api from '@/lib/api';

// export default function ShareModal({ documentId, isOpen, onClose }) {
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('EDITOR');
//   const [status, setStatus] = useState('idle'); // idle, loading, success, error
//   const [message, setMessage] = useState('');

//   if (!isOpen) return null;

//   const handleShare = async (e) => {
//     e.preventDefault();
//     setStatus('loading');
//     setMessage('');

//     try {
//       await api.post(`/docs/${documentId}/share`, { email, role });
//       setStatus('success');
//       setMessage(`Successfully shared with ${email}`);
//       setEmail(''); // Clear input
      
//       // Close modal after 1.5 seconds on success
//       setTimeout(() => {
//         setStatus('idle');
//         setMessage('');
//         onClose();
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setStatus('error');
//       setMessage(err.response?.data?.errors?.[0]?.msg || 'Failed to share');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
//         <h3 className="text-xl font-bold mb-4">Share Document</h3>
        
//         <form onSubmit={handleShare} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="friend@example.com"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="EDITOR">Editor (Can edit)</option>
//               <option value="VIEWER">Viewer (Read only)</option>
//             </select>
//           </div>

//           {message && (
//             <div className={`text-sm p-2 rounded ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//               {message}
//             </div>
//           )}

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={status === 'loading' || status === 'success'}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//             >
//               {status === 'loading' ? 'Sharing...' : 'Invite'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from 'react';
import api from '@/lib/api';

export default function ShareModal({ documentId, isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('EDITOR');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleShare = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post(`/docs/${documentId}/share`, { email, role });
      setStatus('success');
      setMessage(`Invite sent to ${email}`);
      setEmail('');
      setTimeout(() => { setStatus('idle'); setMessage(''); onClose(); }, 1500);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.errors?.[0]?.msg || 'Failed to share');
    }
  };

  return (
    // Use backdrop-blur and semi-transparent black for a glass effect
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Share Document</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <form onSubmit={handleShare} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permission</label>
              <div className="relative">
                <select
                  value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="EDITOR">Editor (Can view and edit)</option>
                  <option value="VIEWER">Viewer (Read only)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button type="submit" disabled={status === 'loading' || status === 'success'}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                {status === 'loading' ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-xs text-gray-500">
          People with &quot;Editor&quot; access can modify content. &quot;Viewers&quot; can only read.
        </div>
      </div>
    </div>
  );
}