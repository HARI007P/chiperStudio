

# 🚀 CipherStudio – Browser-Based React IDE

![CipherStudio Banner](https://img.shields.io/badge/CipherStudio-React%20Browser%20IDE-blueviolet?style=for-the-badge&logo=react)

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge)

> ✨ **CipherStudio** is a full-stack browser-based IDE built with React, Node.js, and MongoDB.  
> Create, edit, and preview your React apps **right inside your browser**, just like CodeSandbox.

---

## 🌐 Overview

**CipherStudio** lets users:
- 🧱 Create and manage React projects.
- ✍️ Write and edit code directly in the browser.
- ⚡ Preview live output instantly.
- 🔐 Register & Login securely using MongoDB backend.
- ☁️ Save and load projects with persistence.

It’s a **React + Node.js + MongoDB** based IDE built for developers, learners, and experimenters.

---

## ⚙️ Features

| Feature | Description |
|----------|--------------|
| 💻 Browser IDE | Live React code editing and preview |
| 🧭 File Explorer | Manage files and folders visually |
| 🧠 Auto Save | Save projects directly to MongoDB |
| 🔐 Authentication | Secure Register/Login using JWT |
| ☁️ API Backend | Node.js + Express REST API |
| 🧩 Modern UI | Built with React + Vite + Bootstrap/Tailwind |

---

## 🧠 Architecture


flowchart TD
A[React Frontend (Vite)] -->|Axios Requests| B[Express Backend]
B -->|Mongoose| C[(MongoDB)]
A --> D[Monaco Editor]
D --> A
B --> E[JWT Authentication]
E --> A


| Layer              | Technology                     |
| ------------------ | ------------------------------ |
| **Frontend**       | React (Vite), Axios, Bootstrap |
| **Backend**        | Node.js, Express.js            |
| **Database**       | MongoDB                        |
| **Authentication** | JWT, bcrypt.js                 |
| **Editor**         | Monaco Editor                  |
| **Deployment**     | Render / Vercel                |



CipherStudio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Editor, Explorer, Preview
│   │   ├── pages/          # Login, Register, IDE
│   │   ├── api/            # Axios services
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── routes/             # Express routes
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # Business logic
│   ├── middleware/         # JWT verification
│   └── server.js
│
├── .env                    # Environment variables
└── README.md



📈 Future Enhancements

🧠 AI-based Code Suggestions

💾 Version Control & Autosave

🌍 Multi-user Collaboration

🧩 Drag & Drop Components

🔍 Code Formatter & Debugger

