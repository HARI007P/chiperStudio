import React, { useMemo } from "react";
import styled from "styled-components";

import FileExplorer from "./FileExplorer";
import CodeEditor from "./CodeEditor";
import LivePreview from "./LivePreview";
import ThemeSwitcher from "./ThemeSwitcher";

// ---------------- Layout ----------------
const Shell = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const SidebarWrap = styled.aside`
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.sidebarBg};
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  /* Smooth scrollbar for better UX */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.primary} transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for flex container */
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.sidebarBg};
  flex-shrink: 0;
  font-weight: 600;
  font-size: 1.1rem;
  user-select: none;
`;

const Title = styled.div`
  max-width: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
`;

const EditorPreview = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  min-height: 0; /* Important for internal scroll on children */

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 320px;
  }
`;

const EditorPane = styled.div`
  min-height: 0; /* Key for flex child's scroll to work */
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.borderColor};
`;

const PreviewPane = styled.div`
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
`;

const Empty = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.disabled};
  padding: 1rem;
  text-align: center;
  font-style: italic;
`;

// Mobile header shown for small screens
const MobileTop = styled.div`
  display: none;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  align-items: center;
  justify-content: space-between;

  @media (max-width: 900px) {
    display: flex;
  }
`;

// ---------------- Component ----------------
export default function EditorLayout({
  projectName,
  onProjectNameChange,
  files = [],
  activeFile,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  code = "",
  language = "javascript",
  onCodeChange,
  onBack,
  themeMode,
  toggleTheme,
}) {
  const hasFiles = useMemo(() => files.length > 0, [files]);
  const displayName = projectName || "Untitled Project";

  return (
    <Shell>
      {/* Sidebar */}
      <SidebarWrap>
        {/* Mobile header */}
        <MobileTop>
          <Title title={displayName}>{displayName}</Title>
          <ActionGroup>
            <ThemeSwitcher themeMode={themeMode} onToggleTheme={toggleTheme} />
          </ActionGroup>
        </MobileTop>

        {/* Desktop header */}
        <Header>
          <Title title={displayName}>{displayName}</Title>
          <ActionGroup>
            <ThemeSwitcher themeMode={themeMode} onToggleTheme={toggleTheme} />
            <button
              onClick={onBack}
              aria-label="Back to projects"
              title="Back to Projects"
              type="button"
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: "22px",
                fontWeight: "bold",
                lineHeight: "1",
                userSelect: "none",
                padding: "0",
                marginLeft: "12px",
              }}
            >
              ←
            </button>
          </ActionGroup>
        </Header>

        {/* File explorer */}
        <FileExplorer
          files={files}
          onAddFile={onAddFile}
          onDeleteFile={onDeleteFile}
          onSelectFile={onSelectFile}
          activeFile={activeFile}
        />
      </SidebarWrap>

      {/* Editor + Preview */}
      <Main>
        <EditorPreview>
          <EditorPane>
            {hasFiles ? (
              <CodeEditor
                code={code}
                language={language}
                themeMode={themeMode}
                onChange={onCodeChange}
              />
            ) : (
              <Empty>No files yet — add one in the sidebar</Empty>
            )}
          </EditorPane>
          <PreviewPane>
            <LivePreview files={files} activeFile={activeFile} />
          </PreviewPane>
        </EditorPreview>
      </Main>
    </Shell>
  );
}
