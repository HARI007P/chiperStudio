import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import IDE from "./pages/IDE";
import ProjectList from "./pages/ProjectList";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// ----------------------------
// Theme definitions
// ----------------------------
const lightTheme = {
  background: "#f5f5f5",
  sidebarBg: "#ffffff",
  sidebarText: "#333",
  sidebarActiveBg: "#e0e0e0",
  sidebarHoverBg: "#f0f0f0",
  borderColor: "#ddd",
  primary: "#007bff",
  primaryHover: "#0056b3",
  toggleBg: "#e0e0e0",
  toggleText: "#333",
  red: "#ff4d4f",
  disabled: "#ccc",
};

const darkTheme = {
  background: "#1e1e1e",
  sidebarBg: "#2c2c2c",
  sidebarText: "#f5f5f5",
  sidebarActiveBg: "#3a3a3a",
  sidebarHoverBg: "#444",
  borderColor: "#555",
  primary: "#3399ff",
  primaryHover: "#007acc",
  toggleBg: "#444",
  toggleText: "#f5f5f5",
  red: "#ff4d4f",
  disabled: "#666",
};

export default function App() {
  // Manage theme: light or dark
  const [themeMode, setThemeMode] = useState("light");

  // Memoize toggleTheme handler
  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Select theme object based on mode
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  // Suppress ResizeObserver warnings cleanly during development
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("ResizeObserver loop completed")
      ) {
        return; // ignore this specific warning
      }
      originalError(...args);
    };
    return () => {
      console.error = originalError; // clean up to original on unmount
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: "100vh",
          background: theme.background,
          color: theme.sidebarText,
          transition: "background-color 0.3s ease, color 0.3s ease",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <Routes>
          {/* Redirect from root to /projects with auth protection */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/projects" replace />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectList theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <IDE theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route
            path="*"
            element={
              <main
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: theme.sidebarText,
                }}
              >
                <h2>404 - Not Found</h2>
                <p>The page you’re looking for doesn’t exist.</p>
              </main>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}
