import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import CodeEditor from "../components/CodeEditor";
import LivePreview from "../components/LivePreview";
import FileExplorer from "../components/FileExplorer";
import ThemeSwitcher from "../components/ThemeSwitcher";

import { saveProject, loadProject } from "../api/projectApi";
import useLocalStorage from "../hooks/useLocalStorage";

import { useProject } from "../context/ProjectContext"; // Import ProjectContext hook


// ----------------------------
// Styled Components
// ----------------------------

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.background};
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Sidebar = styled.aside`
  flex-shrink: 0;
  width: 280px;
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  background: ${({ theme }) => theme.sidebarBg};
`;

const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const Header = styled.header`
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.sidebarBg};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ProjectTitleInput = styled.input`
  font-size: 1.5rem;
  font-weight: 700;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
  max-width: 50vw;
  outline: none;
  padding: 0;

  &::placeholder {
    color: ${({ theme }) => theme.disabled};
  }
`;

const SaveStatus = styled.span`
  font-size: 0.9rem;
  color: ${({ theme, error }) => (error ? theme.red : theme.primary)};
  font-weight: 500;
  min-width: 180px;
  text-align: right;

  @media (max-width: 600px) {
    text-align: left;
    min-width: auto;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const FileTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  overflow-x: auto;
  background: ${({ theme }) => theme.sidebarBg};

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.primary} transparent;

  &::-webkit-scrollbar {
    height: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.primary};
    border-radius: 5px;
  }
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${({ active, theme }) =>
    active ? theme.sidebarActiveBg : "transparent"};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  border-bottom: ${({ active, theme }) =>
    active ? `3px solid ${theme.primary}` : "none"};
  transition: background-color 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.sidebarHoverBg};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.primary};
    outline-offset: -3px;
  }
`;

const EditorPreviewWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EditorWrapper = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  border-right: 1px solid ${({ theme }) => theme.borderColor};

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    min-height: 300px;
  }
`;

const PreviewWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`;


// ----------------------------
// IDE Component
// ----------------------------

export default function IDE({ theme, toggleTheme }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Access project name and setter globally via context
  const { projectName: contextProjectName, setProjectName } = useProject();

  // Persist loaded project in local storage by projectId
  const [project, setProject] = useLocalStorage(`cipherstudio-project-${projectId}`, null);

  // Files state
  const [files, setFiles] = useState(() =>
    project?.files || [
      {
        filename: "App.js",
        content: `import React from "react";\n\nexport default function App() {\n  return <div><h1>Welcome to CipherStudio!</h1></div>;\n}`,
      },
    ]
  );

  // Local project name state initialized from local storage or context
  const [localProjectName, setLocalProjectName] = useState(() => project?.name || contextProjectName || "Untitled Project");

  // Currently active file state
  const [activeFile, setActiveFile] = useState(() => files[0]?.filename || "");

  // Save status states
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Load project from remote API and local fallback
  useEffect(() => {
    if (!projectId) return;
    let isMounted = true;

    const fetchProject = async () => {
      try {
        const data = await loadProject(projectId);
        if (!isMounted) return;
        if (data?.project) {
          const loadedFiles = data.project.files?.length ? data.project.files : files;
          setFiles(loadedFiles);
          setActiveFile(loadedFiles[0].filename);
          setLocalProjectName(data.project.name || "Untitled Project");
          setProjectName(data.project.name || "Untitled Project");
          setProject(data.project);
        }
      } catch (err) {
        console.warn("Failed to load project, using local data.", err);
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Sync local project name to context to keep global state updated
  useEffect(() => {
    if (localProjectName !== contextProjectName) {
      setProjectName(localProjectName);
    }
  }, [localProjectName, contextProjectName, setProjectName]);

  // Debounced auto-save on changes
  useEffect(() => {
    if (!projectId) return;

    const save = async () => {
      setSaving(true);
      setSaveError("");
      try {
        await saveProject({ projectId, name: localProjectName, files });
        setProject({ projectId, name: localProjectName, files });
        setSaving(false);
      } catch (err) {
        setSaving(false);
        setSaveError(err.message || "Error saving project");
      }
    };

    const timer = setTimeout(save, 800);
    return () => clearTimeout(timer);
  }, [files, localProjectName, projectId, setProject]);

  // File handlers
  const handleAddFile = (filename) => {
    if (files.some(f => f.filename === filename)) return;
    const newFiles = [...files, { filename, content: "" }];
    setFiles(newFiles);
    setActiveFile(filename);
  };

  const handleDeleteFile = (filename) => {
    if (files.length <= 1) {
      alert("Cannot delete the last file");
      return;
    }
    const newFiles = files.filter(f => f.filename !== filename);
    setFiles(newFiles);
    if (activeFile === filename) setActiveFile(newFiles[0].filename);
  };

  const handleSelectFile = (filename) => setActiveFile(filename);

  const handleCodeChange = (newCode) => {
    setFiles(prev =>
      prev.map(f => f.filename === activeFile ? { ...f, content: newCode } : f)
    );
  };

  const handleProjectNameChange = (e) => setLocalProjectName(e.target.value);

  const handleBack = () => navigate("/");

  const activeFileContent = useMemo(
    () => files.find(f => f.filename === activeFile)?.content || "",
    [files, activeFile]
  );

  return (
    <Container>
      <Sidebar>
        <FileExplorer
          files={files}
          activeFile={activeFile}
          onAddFile={handleAddFile}
          onDeleteFile={handleDeleteFile}
          onSelectFile={handleSelectFile}
        />
      </Sidebar>

      <MainContent>
        <Header>
          <ProjectTitleInput
            type="text"
            value={localProjectName}
            onChange={handleProjectNameChange}
            placeholder="Project name"
            aria-label="Project name"
          />

          <HeaderControls>
            <SaveStatus error={!!saveError}>
              {saving ? "Saving…" : saveError ? `Error: ${saveError}` : "All changes saved ✅"}
            </SaveStatus>
            <ThemeSwitcher themeMode={theme} onToggleTheme={toggleTheme} />
            <button
              onClick={handleBack}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.5rem",
                color: "inherit",
              }}
              aria-label="Back to projects"
              title="Back to projects"
            >
              ←
            </button>
          </HeaderControls>
        </Header>

        <FileTabs>
          {files.map(f => (
            <Tab
              key={f.filename}
              active={f.filename === activeFile}
              onClick={() => handleSelectFile(f.filename)}
              aria-selected={f.filename === activeFile}
            >
              {f.filename}
            </Tab>
          ))}
        </FileTabs>

        <EditorPreviewWrapper>
          <EditorWrapper>
            <CodeEditor
              code={activeFileContent}
              language="javascript"
              onChange={handleCodeChange}
              themeMode={theme}
            />
          </EditorWrapper>

          <PreviewWrapper>
            <LivePreview files={files} activeFile={activeFile} theme={theme} />
          </PreviewWrapper>
        </EditorPreviewWrapper>
      </MainContent>
    </Container>
  );
}
