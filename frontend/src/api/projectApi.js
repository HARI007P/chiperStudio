import axios from "axios";

// Use environment variable with fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://chiperstudio1.onrender.com";

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // backend API prefix
  timeout: 10000, // 10 seconds
});

// Interceptor to automatically add Authorization header if token exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------
// Project APIs
// ----------------------------
export async function saveProject(projectData) {
  if (!projectData || typeof projectData !== "object") {
    throw new Error("Invalid project data");
  }

  try {
    const response = await apiClient.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("saveProject error:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Unable to save project"
    );
  }
}

export async function loadProject(projectId) {
  if (!projectId || typeof projectId !== "string") {
    throw new Error("Invalid projectId");
  }

  try {
    const response = await apiClient.get(`/projects/${encodeURIComponent(projectId)}`);
    return response.data;
  } catch (error) {
    console.error("loadProject error:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Unable to load project"
    );
  }
}

// ----------------------------
// Auth APIs
// ----------------------------
export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  try {
    const response = await apiClient.post("/auth/register", { name, email, password });
    return response.data; // Expect token and user info here
  } catch (error) {
    console.error("registerUser error:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data; // Expect token and user info here
  } catch (error) {
    console.error("loginUser error:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Login failed"
    );
  }
}

export default apiClient;
