

# 🚀 SyncSpace — Real-Time Collaborative Workspace

**SyncSpace** is a next-generation digital workspace that empowers teams to collaborate seamlessly in real time — like **Notion meets Figma**. It enables users to write, edit, and brainstorm together on shared documents, notes, or whiteboards with **instant synchronization** and **version control**.

---

## 🧩 Problem Statement

Teams often struggle with collaboration when ideas, notes, and project updates are scattered across multiple tools. Traditional platforms fail to provide **smooth, real-time editing** or **multi-user collaboration**.

**SyncSpace** solves this problem by offering a **shared digital workspace** where teams can:

* Write and edit together in real time
* See changes instantly across all devices
* Track and restore past document versions

---

## 🏗️ System Architecture

**Flow:**

```
Frontend → Backend (API + WebSocket) → Database
```

### **Frontend**

* **Next.js** – Dynamic routing & server-rendered UI
* **Zustand** – Lightweight state management
* **TailwindCSS** – Clean and responsive styling
* **Socket.io-client** – Real-time communication

### **Backend**

* **Node.js + Express.js** – RESTful APIs
* **Socket.io** – Real-time collaboration & user presence handling

### **Database**

* **PostgreSQL (via Prisma ORM)** – Structured and relational data storage

### **Authentication**

* **JWT-based Auth** – Role-based access: `Owner`, `Editor`, `Viewer`

### **Hosting**

* **Frontend** → [Vercel](https://vercel.com)
* **Backend** → [Render](https://render.com)
* **Database** → [Railway](https://railway.app) / [Neon.tech](https://neon.tech)

---

## ⚙️ Key Features

| **Category**                | **Features**                                                                   |
| --------------------------- | ------------------------------------------------------------------------------ |
| **Authentication & Roles**  | Secure JWT authentication with role-based access (`owner`, `editor`, `viewer`) |
| **CRUD Operations**         | Create, edit, and delete documents, notes, and whiteboards                     |
| **Real-Time Collaboration** | Multiple users can edit simultaneously using WebSockets                        |
| **Version History**         | Track and restore previous versions of any document                            |
| **Searching**               | Find documents by title, tags, or collaborators                                |
| **Filtering**               | Filter by owner, tags, or date                                                 |
| **Sorting & Pagination**    | Sort by name or last updated; load limited results per page                    |
| **Routing & Hosting**       | Dynamic project/team pages with deployed URLs for frontend & backend           |

---

## 🧠 Tech Stack

| **Layer**          | **Technologies Used**                           |
| ------------------ | ----------------------------------------------- |
| **Frontend**       | Next.js, Zustand, TailwindCSS, Socket.io-client |
| **Backend**        | Node.js, Express.js, Socket.io                  |
| **Database**       | PostgreSQL (via Prisma ORM)                     |
| **Authentication** | JWT (JSON Web Tokens)                           |
| **Hosting**        | Vercel (Frontend), Render (Backend)             |

---

## 🔗 API Overview

| **Endpoint**            | **Method** | **Purpose**                     | **Access** |
| ----------------------- | ---------- | ------------------------------- | ---------- |
| `/api/auth/signup`      | `POST`     | Register new user               | Public     |
| `/api/auth/login`       | `POST`     | User login                      | Public     |
| `/api/docs`             | `GET`      | Get all documents for user/team | Private    |
| `/api/docs`             | `POST`     | Create a new document           | Private    |
| `/api/docs/:id`         | `PUT`      | Update document content         | Private    |
| `/api/docs/:id`         | `DELETE`   | Delete a document               | Private    |
| `/api/docs/version/:id` | `GET`      | Fetch version history           | Private    |

---

## 🌟 Why SyncSpace Stands Out

SyncSpace isn’t just another CRUD app — it’s a **real-time collaborative platform** built to feel like a startup-ready MVP.

✨ **Highlights:**

* Live multi-user editing with presence indicators
* Secure and scalable system architecture
* Version tracking for every document change
* Designed for teams, by developers who understand teamwork

---

## 🧰 Future Enhancements

* Real-time whiteboard with drawing tools
* AI-based summarization and note suggestions
* Team-level analytics dashboard

---

## 📦 Deployment

| **Service**             | **Used For**         |
| ----------------------- | -------------------- |
| **Vercel**              | Hosting the frontend |
| **Render**              | Hosting the backend  |
| **Railway / Neon.tech** | PostgreSQL database  |

---

## 🧑‍💻 Author

**Asad Ali**
