import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";

import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ----------------------------
// Validate MongoDB Connection String
// ----------------------------
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

// ----------------------------
// MongoClient ping check (optional)
// ----------------------------
const runMongoPing = async () => {
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Ping failed:", err);
    throw err;
  } finally {
    await client.close();
  }
};

// ----------------------------
// Middleware Setup
// ----------------------------
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// ----------------------------
// Public Routes (Authentication)
// ----------------------------
app.use("/api/auth", authRoutes);

// ----------------------------
// Protected Routes (JWT Authorization)
// ----------------------------
app.use("/api/projects", verifyToken, projectRoutes);

// ----------------------------
// Base Route (Test API Status)
// ----------------------------
app.get("/", (req, res) => {
  res.send("CipherStudio API is running");
});

// ----------------------------
// Handle 404 Not Found
// ----------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------------
// Global Error Handling Middleware
// ----------------------------
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ----------------------------
// MongoDB Atlas Connection and Server Start
// ----------------------------
const startServer = async () => {
  try {
    // Optional ping to test connection before mongoose connect
   // await runMongoPing();

    // Connect mongoose
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Atlas connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
