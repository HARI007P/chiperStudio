import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { saveProject } from "../api/projectApi";
import { useProject } from "../context/ProjectContext";

// -- Styled Components (same as before, plus DeleteButton) --
const Container = styled.main`
  max-width: 600px;
  margin: 3rem auto;
  padding: 0 1rem;
  background: ${({ theme }) => theme.sidebarBg};
  border-radius: 12px;
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 2.4rem;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.primary};
`;

const ProjectForm = styled.form`
  display: flex;
  margin-bottom: 2.5rem;
  gap: 0.75rem;
`;

const TextInput = styled.input`
  flex-grow: 1;
  padding: 0.75rem 1rem;
  font-size: 1.15rem;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.borderColor};
  outline-offset: 3px;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  background: #f8c8dc;
  color: #65002b;
  border: none;
  border-radius: 8px;
  padding: 0 1.5rem;
  font-size: 1.15rem;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 4px 8px rgb(248 200 220 / 0.4);
  transition: background-color 0.3s ease;
  &:disabled {
    background: #f2a2bf;
    cursor: not-allowed;
    box-shadow: none;
  }
  &:hover:not(:disabled) {
    background: #f484b6;
  }
`;

const LoadButton = styled.button`
  background: #f484b6;
  border: none;
  color: #65002b;
  padding: 0.4rem 0.9rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  &:hover {
    background: #f06292;
    color: white;
  }
`;

const DeleteButton = styled.button`
  background: #ff4d4f;
  border: none;
  color: white;
  padding: 0.4rem 0.9rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  margin-left: 8px;
  box-shadow: 0 2px 8px rgb(255 77 79 / 0.5);
  transition: background-color 0.3s ease;
  &:hover {
    background: #d93638;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  background: ${({ theme }) => theme.sidebarHoverBg};
  color: ${({ theme }) => theme.sidebarText};
  padding: 0.85rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  transition: background-color 0.25s ease;
  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.primary};
    color: white;
    outline: none;
  }
`;

const ProjectName = styled.span`
  flex-grow: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Message = styled.p`
  color: ${({ error, theme }) => (error ? theme.red : theme.primary)};
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1rem;
`;

const AuthControls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const AuthButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 4px 8px rgb(0 123 255 / 0.3);
  transition: background-color 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

// Helpers
const generateProjectId = () => `proj_${Math.random().toString(36).slice(2, 10)}`;

const loadLocalProjects = () => {
  try {
    const raw = localStorage.getItem("cipherstudio-projects");
    const projects = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(projects)) return [];
    return projects.filter(
      (p) =>
        p &&
        typeof p.projectId === "string" &&
        typeof p.name === "string" &&
        Array.isArray(p.files)
    );
  } catch {
    return [];
  }
};

const saveLocalProjects = (projects) => {
  try {
    localStorage.setItem("cipherstudio-projects", JSON.stringify(projects));
  } catch {}
};

export default function ProjectList() {
  const navigate = useNavigate();
  const { setProjectName } = useProject();

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [projects, setProjects] = useState(loadLocalProjects);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    saveLocalProjects(projects);
  }, [projects]);

  const handleCreateProject = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmedName = newName.trim();

      if (!trimmedName) return setErrorMsg("Project name cannot be empty");
      if (projects.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase()))
        return setErrorMsg("Project name already exists");

      setErrorMsg("");
      setLoading(true);

      const projectId = generateProjectId();
      const newProject = {
        projectId,
        name: trimmedName,
        files: [
          {
            filename: "App.js",
            content: `import React from "react";\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Hello from ${trimmedName}!</h1>\n    </div>\n  );\n}`,
          },
        ],
      };

      try {
        await saveProject(newProject);
      } catch {
        // fallback to local
      }

      setProjects((prev) => [...prev, newProject]);
      setNewName("");
      setLoading(false);

      setProjectName(trimmedName);
      navigate(`/project/${projectId}`);
    },
    [newName, projects, navigate, setProjectName]
  );

  const handleLoadProject = useCallback(
    (project) => {
      setProjectName(project.name);
      navigate(`/project/${project.projectId}`);
    },
    [navigate, setProjectName]
  );

  const handleDeleteProject = useCallback(
    (projectIdToDelete) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
        setProjects((prev) =>
          prev.filter((project) => project.projectId !== projectIdToDelete)
        );
        // Optionally, remove project from backend or localStorage
        // For localStorage fallback:
        saveLocalProjects(
          projects.filter((project) => project.projectId !== projectIdToDelete)
        );
      }
    },
    [projects]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Container>
      <Title>CipherStudio</Title>
      {!isLoggedIn ? (
        <AuthControls>
          <AuthButton onClick={() => navigate("/login")}>Login</AuthButton>
          <AuthButton onClick={() => navigate("/register")}>Register</AuthButton>
        </AuthControls>
      ) : (
        <>
          <ProjectForm onSubmit={handleCreateProject} noValidate>
            <TextInput
              aria-label="New project name"
              placeholder="New project name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              disabled={loading}
              spellCheck={false}
              autoComplete="off"
              required
            />
            <Button type="submit" disabled={loading || !newName.trim()}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </ProjectForm>
          {errorMsg && <Message error>{errorMsg}</Message>}

          <List aria-label="Saved projects list">
            {projects.length === 0 && (
              <p style={{ textAlign: "center", color: "#666" }}>
                No saved projects found.
              </p>
            )}
            {projects.map((project) => (
              <ListItem
                key={project.projectId}
                tabIndex={0}
                onClick={() => handleLoadProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleLoadProject(project);
                  }
                }}
                aria-label={`Load project ${project.name}`}
                role="button"
              >
                <ProjectName title={project.name}>{project.name}</ProjectName>
                <div>
                  <LoadButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadProject(project);
                    }}
                    type="button"
                    aria-label={`Load project ${project.name}`}
                  >
                    Open
                  </LoadButton>
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.projectId);
                    }}
                    type="button"
                    aria-label={`Delete project ${project.name}`}
                    title="Delete project"
                  >
                    Delete
                  </DeleteButton>
                </div>
              </ListItem>
            ))}
          </List>

          <AuthControls style={{ marginTop: "2rem", justifyContent: "flex-end" }}>
            <AuthButton onClick={handleLogout}>Logout</AuthButton>
          </AuthControls>
        </>
      )}
    </Container>
  );
}
