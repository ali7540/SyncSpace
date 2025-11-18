// "use client";

// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   $getSelection,
//   $isRangeSelection,
//   FORMAT_TEXT_COMMAND,
//   UNDO_COMMAND,
//   REDO_COMMAND,
// } from 'lexical';
// import { $isLinkNode } from '@lexical/link';
// import { $isAtNodeEnd } from '@lexical/selection';

// // A helper to get the selected node
// function getSelectedNode(selection) {
//   const anchor = selection.anchor;
//   const focus = selection.focus;
//   const anchorNode = selection.anchor.getNode();
//   const focusNode = selection.focus.getNode();
//   if (anchorNode === focusNode) {
//     return anchorNode;
//   }
//   const isBackward = selection.isBackward();
//   if (isBackward) {
//     return $isAtNodeEnd(focus) ? anchorNode : focusNode;
//   } else {
//     return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
//   }
// }

// // Our Toolbar component
// export default function Toolbar() {
//   const [editor] = useLexicalComposerContext();
//   const [activeEditor, setActiveEditor] = useState(editor);
//   const [isBold, setIsBold] = useState(false);
//   const [isItalic, setIsItalic] = useState(false);
//   const [isUnderline, setIsUnderline] = useState(false);

//   // This function is called on every editor update
//   const updateToolbar = useCallback(() => {
//     const selection = $getSelection();
//     if ($isRangeSelection(selection)) {
//       // Update the state of the toolbar buttons
//       setIsBold(selection.hasFormat('bold'));
//       setIsItalic(selection.hasFormat('italic'));
//       setIsUnderline(selection.hasFormat('underline'));

//       // Check for links (we won't implement a link button, but this is good)
//       const node = getSelectedNode(selection);
//       const parent = node.getParent();
//       if ($isLinkNode(parent) || $isLinkNode(node)) {
//         // isLink = true;
//       } else {
//         // isLink = false;
//       }
//     }
//   }, []);

//   // Register an listener to update the toolbar
//   useEffect(() => {
//     return activeEditor.registerUpdateListener(({ editorState }) => {
//       editorState.read(() => {
//         updateToolbar();
//       });
//     });
//   }, [updateToolbar, activeEditor]);

//   return (
//     <div className="flex items-center gap-2 p-2 border-b border-gray-200">
//       <button
//         onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND)}
//         className="p-2 rounded hover:bg-gray-100"
//         title="Undo (Cmd+Z)"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4"></path></svg>
//       </button>
//       <button
//         onClick={() => activeEditor.dispatchCommand(REDO_COMMAND)}
//         className="p-2 rounded hover:bg-gray-100"
//         title="Redo (Cmd+Y)"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-4-4m4 4l-4 4"></path></svg>
//       </button>
      
//       <span className="w-px h-6 bg-gray-200 mx-2"></span>

//       <button
//         onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
//         className={`p-2 rounded ${isBold ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         title="Bold (Cmd+B)"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
//       </button>
//       <button
//         onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
//         className={`p-2 rounded ${isItalic ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         title="Italic (Cmd+I)"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4L7 20m8-16l-4 16"></path></svg>
//       </button>
//       <button
//         onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
//         className={`p-2 rounded ${isUnderline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
//         title="Underline (Cmd+U)"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11v-5a3 3 0 013-3h8a3 3 0 013 3v5m-1 0v5a3 3 0 01-3 3h-8a3 3 0 01-3-3v-5m16 0h-14"></path></svg>
//       </button>
//     </div>
//   );
// }



"use client";

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND, // For alignment
  UNDO_COMMAND,
  REDO_COMMAND,
} from 'lexical';
import { $isLinkNode } from '@lexical/link';
import { $setBlocksType } from '@lexical/selection'; // For block types
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'; // For block types
import { $createParagraphNode } from 'lexical'; // For block types

// --- Helper function (unchanged) ---
function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

// --- Our Toolbar component ---
export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  
  // --- New State for new features ---
  const [blockType, setBlockType] = useState('paragraph');
  const [textAlign, setTextAlign] = useState('left');
  
  // --- State for bold, italic, etc. (unchanged) ---
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // --- This function is now much more powerful ---
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text formats (bold, italic, etc.)
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update block type and alignment
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElement();
      
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        // Get block type
        if ($isHeadingNode(element)) {
          const tag = element.getTag();
          setBlockType(tag); // e.g., 'h1', 'h2'
        } else {
          setBlockType('paragraph');
        }
        // Get text alignment
        setTextAlign(element.getFormat());
      }
    }
  }, [activeEditor]);

  // --- Listeners (unchanged) ---
  useEffect(() => {
    return activeEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [updateToolbar, activeEditor]);

  // --- NEW: Function to format block type ---
  const formatBlock = (type) => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (type === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (type === 'h1' || type === 'h2') {
          $setBlocksType(selection, () => $createHeadingNode(type));
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200 flex-wrap">
      {/* Undo/Redo */}
      <button
        onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND)}
        className="p-2 rounded hover:bg-gray-100" title="Undo (Cmd+Z)"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4L7 4C4.79086 4 3 5.79086 3 8V8C3 10.2091 4.79086 12 7 12H17" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8L3 12L7 16" /></svg>
      </button>
      <button
        onClick={() => activeEditor.dispatchCommand(REDO_COMMAND)}
        className="p-2 rounded hover:bg-gray-100" title="Redo (Cmd+Y)"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 4L17 4C19.2091 4 21 5.79086 21 8V8C21 10.2091 19.2091 12 17 12H7" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8L21 12L17 16" /></svg>
      </button>
      
      <span className="w-px h-6 bg-gray-200 mx-2"></span>

      {/* --- NEW: Block Type Dropdown --- */}
      <select
        value={blockType}
        onChange={(e) => formatBlock(e.target.value)}
        className="p-2 rounded bg-gray-50 border border-gray-200 text-sm"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
      </select>

      <span className="w-px h-6 bg-gray-200 mx-2"></span>

      {/* Text Formats (Bold, Italic, Underline) */}
      <button
        onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`p-2 rounded ${isBold ? 'bg-gray-200' : 'hover:bg-gray-100'}`} title="Bold (Cmd+B)"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
      </button>
      <button
        onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`p-2 rounded ${isItalic ? 'bg-gray-200' : 'hover:bg-gray-100'}`} title="Italic (Cmd+I)"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 4h8 M8 20h8 M10 4L14 20" /></svg>
      </button>
      <button
        onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`p-2 rounded ${isUnderline ? 'bg-gray-200' : 'hover:bg-gray-100'}`} title="Underline (Cmd+U)"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 4v7a6 6 0 006 6 6 6 0 006-6V4 M4 20h16" /></svg>
      </button>
      
      <span className="w-px h-6 bg-gray-200 mx-2"></span>

      {/* --- NEW: Alignment Buttons --- */}
      <button
        onClick={() => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className={`p-2 rounded ${textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'}`} title="Align Left"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18 M3 10h12 M3 14h18 M3 18h12" /></svg>
      </button>
      <button
        onClick={() => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className={`p-2 rounded ${textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'}`} title="Align Center"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18 M6 10h12 M3 14h18 M6 18h12" /></svg>
      </button>
      <button
        onClick={() => activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        className={`p-2 rounded ${textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'}`} title="Align Right"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18 M9 10h12 M3 14h18 M9 18h12" /></svg>
      </button>
    </div>
  );
}