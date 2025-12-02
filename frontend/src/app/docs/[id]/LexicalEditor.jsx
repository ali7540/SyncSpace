// "use client";

// import { LexicalComposer } from '@lexical/react/LexicalComposer';
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
// import { ContentEditable } from '@lexical/react/LexicalContentEditable';
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
// import { ListPlugin } from '@lexical/react/LexicalListPlugin';
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
// import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';

// // Nodes
// import { HeadingNode, QuoteNode } from '@lexical/rich-text';
// import { ListItemNode, ListNode } from '@lexical/list';
// import { LinkNode } from '@lexical/link';

// // Our custom components
// import Toolbar from './Toolbar';
// import './lexical.css'; // Import the theme CSS

// // This is the theme object for Lexical.
// const theme = {
//   paragraph: 'editor-paragraph',
//   bold: 'editor-text-bold',
//   italic: 'editor-text-italic',
//   underline: 'editor-text-underline',
//   strikethrough: 'editor-text-strikethrough',
//   link: 'editor-link',
//   list: {
//     ol: 'editor-list-ol',
//     ul: 'editor-list-ul',
//   },
//   listitem: 'editor-listitem',
//   // ... add other styles as needed
// };

// // This function handles errors
// function onError(error) {
//   console.error(error);
// }

// /**
//  * @param {object} props
//  * @param {object | null} props.initialContent - The initial editor state as a JSON object.
//  * @param {function(object): void} props.onContentChange - Callback to update parent with new state.
//  */
// export default function LexicalEditor({ initialContent, onContentChange }) {
//   // Convert the initial content (JSON object) to a string for Lexical
//   const initialEditorState = initialContent ? JSON.stringify(initialContent) : null;

//   const initialConfig = {
//     namespace: 'MyEditor',
//     theme,
//     onError,
//     nodes: [
//       HeadingNode,
//       QuoteNode,
//       ListNode,
//       ListItemNode,
//       LinkNode,
//     ],
//     // Set the initial state
//     editorState: initialEditorState,
//   };

//   const handleOnChange = (editorState) => {
//     // Convert the EditorState to a plain JSON object
//     const editorStateJSON = editorState.toJSON();
//     // Call the parent's update function
//     onContentChange(editorStateJSON);
//   };

//   return (
//     <LexicalComposer initialConfig={initialConfig}>
//       <div className="editor-container">
//         <Toolbar />
//         <div className="editor-inner">
//           <RichTextPlugin
//             contentEditable={<ContentEditable className="editor-input" />}
//             placeholder={<div className="editor-placeholder">Start typing...</div>}
//             ErrorBoundary={LexicalErrorBoundary}
//           />
//           <HistoryPlugin />
//           <ListPlugin />
//           <LinkPlugin />
//           <OnChangePlugin onChange={handleOnChange} />
//         </div>
//       </div>
//     </LexicalComposer>
//   );
// }

"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import Toolbar from "./Toolbar";
import "./lexical.css";
import CollaborationPlugin from "./CollaborationPlugin";

const theme = {
  paragraph: "editor-paragraph",
  bold: "editor-text-bold",
  italic: "editor-text-italic",
  underline: "editor-text-underline",
  strikethrough: "editor-text-strikethrough",
  link: "editor-link",
  list: {
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  listitem: "editor-listitem",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
  },

  text: {
    alignleft: "editor-align-left",
    aligncenter: "editor-align-center",
    alignright: "editor-align-right",
  },
};

function onError(error) {
  console.error(error);
}

export default function LexicalEditor({
  initialContent,
  onContentChange,
  socket,
  documentId,
  isReadOnly,
}) {
  // FIX: Validate the structure before stringifying
  let validEditorState = null;
  if (
    initialContent &&
    typeof initialContent === "object" &&
    initialContent.root // Must have a root
  ) {
    validEditorState = JSON.stringify(initialContent);
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode].filter(
      Boolean
    ),
    editorState: validEditorState,
    editable: !isReadOnly,
  };

  const handleOnChange = (editorState) => {
    const editorStateJSON = editorState.toJSON();
    onContentChange(editorStateJSON);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`editor-container ${isReadOnly ? "opacity-80" : ""}`}>
        {!isReadOnly && <Toolbar />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                style={{ outline: "none" }}
              />
            }
            placeholder={
              !isReadOnly ? (
                <div className="editor-placeholder">Start typing...</div>
              ) : null
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin onChange={handleOnChange} />
          {socket && documentId !== "preview" && (
            <CollaborationPlugin socket={socket} documentId={documentId} />
          )}{" "}
        </div>
      </div>
    </LexicalComposer>
  );
}
