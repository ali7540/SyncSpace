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
  let validEditorState = null;
  if (
    initialContent &&
    typeof initialContent === "object" &&
    initialContent.root 
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
