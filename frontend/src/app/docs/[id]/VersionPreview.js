"use client";

import LexicalEditor from './LexicalEditor';

export default function VersionPreview({ version, onClose, onRestore, isReadOnly }) {
  if (!version) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center p-8">
      {/* Top Bar for Preview */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 shadow-sm z-50">
        <div className="flex items-center gap-4">
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">PREVIEW MODE</span>
            <span className="text-sm text-gray-600">
                Viewing version from <b>{new Date(version.createdAt).toLocaleString()}</b>
            </span>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium"
            >
                Close Preview
            </button>
            {!isReadOnly && (
                <button 
                    onClick={onRestore}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm"
                >
                    Restore This Version
                </button>
            )}
        </div>
      </div>

      {/* The Editor Preview (Read Only) */}
      <div className="w-full max-w-4xl h-full mt-16 bg-white shadow-2xl rounded-lg border border-gray-300 overflow-hidden">
         <LexicalEditor 
            initialContent={version.content} 
            onContentChange={() => {}} // No-op
            isReadOnly={true} // Always read-only in preview
            documentId="preview" // Dummy ID so it doesn't join socket room
         />
      </div>
    </div>
  );
}