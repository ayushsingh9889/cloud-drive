# ☁️ Cloud Drive

A full-stack cloud storage platform that allows users to securely upload, manage, download, organize, share, and delete files through a modern web interface.

Built with **React, Node.js, Express, PostgreSQL, Supabase, and JWT authentication**.

---

## 🌐 Live Demo

### 🚀 Frontend

**https://cloud-drive-lovat.vercel.app/**

### ⚙️ Backend API

**https://cloud-drive-backend-j6oy.onrender.com**

### 💻 GitHub Repository

**https://github.com/ayushsingh9889/cloud-drive**

---

## 📌 Project Overview

Cloud Drive is a full-stack cloud storage application inspired by platforms such as Google Drive.

The application provides users with a secure dashboard where they can:

* Create an account
* Login securely
* Upload files
* Download files
* Create folders
* Organize files
* Search and manage files
* Move files to Trash
* Restore deleted files
* Permanently delete files
* Share files with other registered users
* Create public sharing links
* Protect public links with passwords
* Set link expiration dates
* View recently uploaded files
* Manage shared files and folders

The project demonstrates how a modern frontend communicates with a REST API backend and a cloud database/storage system.

---

# ✨ Features

## 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Automatic authentication handling
* Logout functionality

---

## 📁 File Management

Users can:

* Upload files
* Download files
* View uploaded files
* Delete files
* Restore deleted files
* Permanently delete files
* View recent files
* Organize files inside folders

---

## 📂 Folder Management

Users can:

* Create folders
* View folders
* Open folders
* Organize files
* Navigate through folders
* Delete folders

---

## 🤝 File & Folder Sharing

Users can share resources with other registered users using their email address.

Supported permissions:

* 👁️ **Viewer**
* ✏️ **Editor**

Users can also:

* View shared resources
* Update sharing permissions
* Remove access
* View resources shared with them

---

## 🔗 Public Sharing Links

Cloud Drive supports public file/folder sharing.

Users can generate a public link that can include:

* 🔐 Password protection
* ⏰ Expiration date
* 🌍 Public access

Example:

```text
https://cloud-drive-lovat.vercel.app/share/<token>
```

---

## 🗑️ Trash Management

Deleted files can be moved to Trash instead of being immediately removed.

Users can:

* View Trash
* Restore files
* Permanently delete files

---

## 📊 Dashboard

The dashboard provides a centralized interface for managing cloud storage.

It includes:

* Recent files
* Folders
* Shared files
* Trash
* Upload functionality
* File actions
* Folder actions
* Sharing controls

---

## 🎨 Modern Dark UI

The frontend uses a modern dark-themed interface with:

* Responsive layout
* Dark background
* Clean cards
* Modern navigation
* File icons
* Folder icons
* Action buttons
* Toast notifications
* Responsive components

---

# 🛠️ Technologies Used

## Frontend

| Technology   | Purpose                  |
| ------------ | ------------------------ |
| React        | Frontend UI              |
| Vite         | Development & build tool |
| React Router | Client-side routing      |
| Axios        | API communication        |
| CSS          | Styling                  |
| Lucide React | Icons                    |

---

## Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | Backend runtime         |
| Express.js | REST API framework      |
| PostgreSQL | Database                |
| Supabase   | Database/cloud services |
| JWT        | Authentication          |
| bcryptjs   | Password hashing        |
| Multer     | File upload handling    |
| dotenv     | Environment variables   |
| Nodemon    | Development server      |

---

## Deployment

| Component   | Platform |
| ----------- | -------- |
| Frontend    | Vercel   |
| Backend     | Render   |
| Database    | Supabase |
| Source Code | GitHub   |

---

# 🏗️ Project Architecture

```text
Cloud Drive
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   ├── hooks
│   │   └── App.jsx
│   │
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── utils
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

# 🔄 Application Flow

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React Frontend      │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                               │ Axios / REST API
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐
          │   PostgreSQL    │   │     Supabase    │
          │    Database     │   │ Storage/Cloud   │
          └─────────────────┘   └─────────────────┘
```

---

# 🔐 Authentication Flow

The authentication system works using JWT.

```text
User
 │
 ▼
Register / Login
 │
 ▼
Backend Authentication
 │
 ▼
Password Verification
 │
 ▼
JWT Token Generated
 │
 ▼
Frontend Stores Token
 │
 ▼
Axios Sends Authorization Header
 │
 ▼
Protected Backend Routes
```

Authenticated API requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📡 API

The production backend is available at:

**https://cloud-drive-backend-j6oy.onrender.com**

API base URL:

```text
https://cloud-drive-backend-j6oy.onrender.com/api
```

---

## 🔑 Authentication APIs

### Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "Ayush Singh",
  "email": "user@example.com",
  "password": "your-password"
}
```

---

### Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

---

## 📁 File APIs

### Upload File

```http
POST /api/files/upload
```

Requires authentication.

---

### Get Files

```http
GET /api/files/folder/:folderId
```

---

### Get Recent Files

```http
GET /api/files/recent
```

---

### Get Trash

```http
GET /api/files/trash
```

---

### Download File

```http
GET /api/files/:id/download
```

---

### Delete File

```http
DELETE /api/files/:id
```

---

### Restore File

```http
PATCH /api/files/:id/restore
```

---

# 📂 Folder APIs

### Create Folder

```http
POST /api/folders
```

---

### Get Folder Contents

```http
GET /api/folders/parent/:parentId
```

---

### Delete Folder

```http
DELETE /api/folders/:id
```

---

# 🤝 Sharing APIs

### Share File or Folder

```http
POST /api/shares
```

Example:

```json
{
  "resourceType": "file",
  "resourceId": "FILE_ID",
  "granteeEmail": "user@example.com",
  "role": "viewer"
}
```

Available roles:

```text
viewer
editor
```

---

### Get Resource Shares

```http
GET /api/shares/:resourceType/:resourceId
```

---

### Get Shared With Me

```http
GET /api/shares/shared-with-me
```

---

### Remove Share

```http
DELETE /api/shares/:shareId
```

---

# 🔗 Public Link APIs

### Create Public Link

```http
POST /api/links
```

Example:

```json
{
  "resourceType": "file",
  "resourceId": "FILE_ID",
  "expiresAt": null,
  "password": "optional-password"
}
```

---

### Get My Public Links

```http
GET /api/links
```

---

### Delete Public Link

```http
DELETE /api/links/:linkId
```

---

# ⚙️ Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
NODE_ENV=development

JWT_SECRET=your-jwt-secret
JWT_EXPIRY=1h

REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=7d

SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

DATABASE_URL=your-database-url
```

> Never commit your `.env` file to GitHub.

---

## Frontend

Create:

```text
frontend/.env
```

For production:

```env
VITE_API_URL=https://cloud-drive-backend-j6oy.onrender.com/api
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

After changing Vite environment variables, restart the development server.

---

# 💻 Local Installation

## 1. Clone Repository

```bash
git clone https://github.com/ayushsingh9889/cloud-drive.git
```

Go into the project:

```bash
cd cloud-drive
```

---

# 🚀 Backend Setup

Open a terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```text
backend/.env
```

Add your database, Supabase, and JWT configuration.

Start development server:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

API:

```text
http://localhost:5000/api
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

---

# 🧪 Testing

You can verify the backend using:

```text
GET /health
```

Local:

```text
http://localhost:5000/health
```

Production:

```text
https://cloud-drive-backend-j6oy.onrender.com/health
```

---

# 🔒 Security

The project implements several security practices:

* JWT authentication
* Password hashing using bcrypt
* Protected backend routes
* Authorization middleware
* User ownership checks
* Share permission checks
* Password-protected public links
* Public link expiration
* Environment variables for secrets
* No sensitive credentials committed to Git

---

# 📦 Important Dependencies

### Frontend

```text
react
react-dom
react-router-dom
axios
lucide-react
```

### Backend

```text
express
jsonwebtoken
bcryptjs
multer
pg
dotenv
cors
nodemon
```

---

# 🌍 Deployment

## Frontend — Vercel

Production frontend:

```text
https://cloud-drive-lovat.vercel.app/
```

The frontend is deployed using Vercel.

---

## Backend — Render

Production backend:

```text
https://cloud-drive-backend-j6oy.onrender.com
```

API:

```text
https://cloud-drive-backend-j6oy.onrender.com/api
```

Health check:

```text
https://cloud-drive-backend-j6oy.onrender.com/health
```

---

## Database — Supabase

The application uses PostgreSQL/Supabase for database services.

Database credentials should be stored in environment variables and should never be committed to GitHub.

---

# 🧑‍💻 Development

Run frontend and backend separately.

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd frontend
npm run dev
```

---

# 🐛 Error Handling

The backend uses centralized error-handling utilities to provide consistent API responses.

Examples include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

The frontend displays user-friendly notifications for important operations.

---

# 📈 Future Improvements

Possible future improvements include:

* 📊 Storage usage dashboard
* ⭐ Favorite files
* 🔍 Advanced file search
* 🖼️ Image previews
* 🎬 Video previews
* 📄 Document previews
* 📦 Multiple file upload
* ⬇️ Folder download as ZIP
* 📱 Improved mobile interface
* 🔔 Real-time notifications
* 👥 Advanced team collaboration
* 📜 File version history
* 🔐 Two-factor authentication
* ☁️ Additional cloud storage providers

---

# 🎯 Learning Objectives

This project helped demonstrate practical knowledge of:

* React development
* Component-based architecture
* React Router
* REST APIs
* Node.js
* Express.js
* PostgreSQL
* Supabase
* JWT authentication
* Password hashing
* File uploads
* Authorization
* API integration
* Axios
* Environment variables
* Git and GitHub
* Vercel deployment
* Render deployment
* Debugging frontend/backend issues

---

# 📸 Application Features

### Authentication

Users can securely register and login to access their cloud storage.

### Dashboard

A centralized dashboard provides access to files, folders, shared resources, and Trash.

### File Management

Users can upload, download, delete, and restore files.

### Folder Management

Files can be organized into folders for easier management.

### Sharing

Files and folders can be shared with other registered users.

### Public Links

Users can generate public links with optional password protection and expiration.

---

# 📊 Project Status

| Feature                  | Status      |
| ------------------------ | ----------- |
| User Registration        | ✅ Completed |
| User Login               | ✅ Completed |
| JWT Authentication       | ✅ Completed |
| File Upload              | ✅ Completed |
| File Download            | ✅ Completed |
| File Delete              | ✅ Completed |
| File Restore             | ✅ Completed |
| Trash                    | ✅ Completed |
| Folder Creation          | ✅ Completed |
| Folder Management        | ✅ Completed |
| User Sharing             | ✅ Completed |
| Viewer Permission        | ✅ Completed |
| Editor Permission        | ✅ Completed |
| Public Links             | ✅ Completed |
| Password Protected Links | ✅ Completed |
| Link Expiration          | ✅ Completed |
| Frontend Deployment      | ✅ Completed |
| Backend Deployment       | ✅ Completed |

---

# 🗂️ Git Workflow

Initialize Git:

```bash
git init
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial commit"
```

Set main branch:

```bash
git branch -M main
```

Add remote:

```bash
git remote add origin https://github.com/ayushsingh9889/cloud-drive.git
```

Push:

```bash
git push -u origin main
```

For future updates:

```bash
git add .
git commit -m "Update Cloud Drive"
git push
```

---

# 🚫 Files That Should Not Be Committed

Make sure your `.gitignore` contains:

```gitignore
node_modules/
.env
.env.local
dist/
build/
*.log
```

Never upload:

```text
.env
database passwords
JWT secrets
Supabase private keys
API keys
```

---

# 👨‍💻 Author

**Ayush Singh**

B.Tech Computer Science Engineering Student

---

# 🔗 Project Links

| Resource         | Link                                          |
| ---------------- | --------------------------------------------- |
| 🌐 Live Frontend | https://cloud-drive-lovat.vercel.app/         |
| ⚙️ Backend API   | https://cloud-drive-backend-j6oy.onrender.com |
| 💻 GitHub        | https://github.com/ayushsingh9889/cloud-drive |

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📜 License

This project is created for educational and portfolio purposes.
