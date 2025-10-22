import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

// ----------------------------
// Animations
// ----------------------------
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ----------------------------
// Styled Components
// ----------------------------
const Container = styled.div`
  background: ${({ theme }) => theme.sidebarBg};
  color: ${({ theme }) => theme.sidebarText};
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1.5px solid ${({ theme }) => theme.borderColor};
  padding: 16px 14px;
  box-sizing: border-box;
  box-shadow: inset 2px 0 8px rgb(0 0 0 / 0.05);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

// Wrapper around file list to scroll independently
const FileListWrap = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 12px; /* space between list and form */
`;

const FileList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const FileItem = styled.li.attrs((props) => ({
  "data-active": props.$active ? true : undefined,
}))`
  padding: 10px 12px;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.sidebarActiveBg : "transparent"};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: background-color 0.25s ease, transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.sidebarHoverBg};
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

const Filename = styled.span`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  font-size: 0.95rem;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.sidebarText};
  cursor: pointer;
  padding: 0 8px;
  font-size: 18px;
  user-select: none;
  border-radius: 6px;
  transition: color 0.3s ease, background-color 0.3s ease;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.red};
    background-color: ${({ theme }) => theme.red}22; /* subtle red background */
    outline: none;
  }
`;

// Form container fixed below the file list, does not shrink
const FormBottom = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.sidebarBg};
`;

const AddFileForm = styled.form`
  display: flex;
  gap: 10px;
  animation: ${fadeIn} 0.35s ease;
`;

const AddFileInput = styled.input`
  flex-grow: 1;
  padding: 10px 16px;
  border: 2px solid ${({ theme }) => theme.borderColor};
  border-radius: 24px;
  background: ${({ theme }) => theme.sidebarBg};
  color: ${({ theme }) => theme.sidebarText};
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 8px ${({ theme }) => theme.primary}55;
  }
`;

const AddFileButton = styled.button`
  background: ${({ theme }) => theme.primary};
  border: none;
  color: white;
  padding: 10px 18px;
  font-size: 0.95rem;
  border-radius: 24px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 4px 10px rgb(0 123 255 / 0.4);
  transition: background 0.25s ease, transform 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryHover};
    transform: scale(1.08);
  }

  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red || "red"};
  margin-top: 8px;
  font-size: 13px;
  user-select: none;
  text-align: center;
  font-weight: 600;
`;

// ----------------------------
// Validators
// ----------------------------
const isValidFilename = (filename) => /^[\w-.]+$/.test(filename);

// ----------------------------
// Main Component
// ----------------------------
export default function FileExplorer({
  files = [],
  onAddFile,
  onDeleteFile,
  onSelectFile,
  activeFile,
}) {
  const [newFilename, setNewFilename] = useState("");
  const [error, setError] = useState("");

  const handleAddFile = (e) => {
    e.preventDefault();
    const trimmed = newFilename.trim();

    if (!trimmed) return setError("Filename cannot be empty");
    if (!isValidFilename(trimmed))
      return setError(
        "Invalid filename: only letters, numbers, underscores, hyphens, and dots are allowed"
      );
    if (files.some((f) => f.filename === trimmed))
      return setError("Filename already exists");

    onAddFile(trimmed);
    setNewFilename("");
    setError("");
  };

  return (
    <Container>
      <FileListWrap>
        <FileList>
          {files.length === 0 && (
            <li style={{ padding: "10px 0", fontStyle: "italic", color: "#888" }}>
              No files yet.
            </li>
          )}
          {files.map((file) => (
            <FileItem
              key={file.filename}
              $active={file.filename === activeFile}
              onClick={() => onSelectFile(file.filename)}
              title={file.filename}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectFile(file.filename);
                }
              }}
              role="button"
            >
              <Filename>{file.filename}</Filename>
              <DeleteButton
                aria-label={`Delete file ${file.filename}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete file "${file.filename}"?`))
                    onDeleteFile(file.filename);
                }}
              >
                &times;
              </DeleteButton>
            </FileItem>
          ))}
        </FileList>
      </FileListWrap>

      <FormBottom>
        <AddFileForm onSubmit={handleAddFile} noValidate>
          <AddFileInput
            type="text"
            value={newFilename}
            onChange={(e) => {
              setNewFilename(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter new filename..."
            aria-label="New filename input"
            autoComplete="off"
            spellCheck={false}
          />
          <AddFileButton type="submit" disabled={!newFilename.trim()}>
            Add
          </AddFileButton>
        </AddFileForm>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      </FormBottom>
    </Container>
  );
}
