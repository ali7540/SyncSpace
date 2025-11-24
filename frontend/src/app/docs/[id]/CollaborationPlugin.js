"use client";

import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function CollaborationPlugin({ socket, documentId }) {
  const [editor] = useLexicalComposerContext();
  
  // Ref to track if the current update came from the socket
  const isRemoteUpdate = useRef(false);

  // 1. Listen for incoming changes (Remote)
  useEffect(() => {
    if (!socket || !documentId) return;

    const handleReceiveChanges = (newContent) => {
      // Mark this update as remote so the other listener ignores it
      isRemoteUpdate.current = true;

      try {
        const editorState = editor.parseEditorState(JSON.stringify(newContent));
        
        // Apply the state. 
        // This WILL trigger the 'registerUpdateListener' below, 
        // but our ref will stop the emit.
        editor.setEditorState(editorState);
      } catch (e) {
        console.error("Failed to parse remote editor state", e);
      } finally {
        // Reset the flag after a short delay to ensure the cycle completes
        setTimeout(() => {
            isRemoteUpdate.current = false;
        }, 50);
      }
    };

    socket.on('receive-changes', handleReceiveChanges);

    return () => {
      socket.off('receive-changes', handleReceiveChanges);
    };
  }, [socket, documentId, editor]);

  // 2. Listen for local changes (User)
  useEffect(() => {
    if (!socket || !documentId) return;

    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      // EDGE CASE: Stop Infinite Loop
      // If this change came from the socket (isRemoteUpdate), IGNORE it.
      if (isRemoteUpdate.current) {
        return;
      }

      // EDGE CASE: Empty Updates
      // Don't emit if nothing actually changed
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      editorState.read(() => {
        const jsonState = editorState.toJSON();
        
        // Emit to server
        socket.emit('send-changes', {
          documentId,
          newContent: jsonState
        });
      });
    });
  }, [socket, documentId, editor]);

  return null;
}