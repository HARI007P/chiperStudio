import React, { useRef, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";

export default function CodeEditor({ code = "", language = "javascript", onChange, themeMode = "light" }) {
  const editorRef = useRef(null);

  // Sync external code changes with editor
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== code) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  const handleEditorChange = (value) => {
    if (typeof onChange === "function") onChange(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div style={{
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      border: `1px solid ${(themeMode === 'light') ? '#ccc' : '#555'}`,
      height: "100%",
    }}>
      <MonacoEditor
        height="100%"
        language={language}
        theme={themeMode === "light" ? "vs-light" : "vs-dark"}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          tabSize: 2,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          formatOnType: true,
          bracketPairColorization: { enabled: true },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          cursorSmoothCaretAnimation: true,
          lineNumbers: "on",
          lineDecorationsWidth: 4,
          folding: true,
          renderIndentGuides: true,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            arrowSize: 16,
          },
        }}
      />
    </div>
  );
}
