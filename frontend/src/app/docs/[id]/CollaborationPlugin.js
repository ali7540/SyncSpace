"use client";

import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function CollaborationPlugin({ socket, documentId }) {
  const [editor] = useLexicalComposerContext();
  
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!socket || !documentId) return;

    const handleReceiveChanges = (newContent) => {
      isRemoteUpdate.current = true;

      try {
        const editorState = editor.parseEditorState(JSON.stringify(newContent));
        
        editor.setEditorState(editorState);
      } catch (e) {
        console.error("Failed to parse remote editor state", e);
      } finally {
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

  useEffect(() => {
    if (!socket || !documentId) return;

    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      if (isRemoteUpdate.current) {
        return;
      }

      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      editorState.read(() => {
        const jsonState = editorState.toJSON();
        
        socket.emit('send-changes', {
          documentId,
          newContent: jsonState
        });
      });
    });
  }, [socket, documentId, editor]);

  return null;
}