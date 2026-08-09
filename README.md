<div align="center">

# 💬 Chat-Sapphire

### A modern, secure, real-time chat application

Built with the **MERN + Next.js** stack, powered by **Socket.IO** for instant messaging and hardened with production-grade authentication.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://chat-sapphire.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-black?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

</div>

---

## ✨ Overview

**Chat-Sapphire** is a full-stack real-time messaging platform that lets users sign up, find other users, and chat instantly with live delivery, online presence, and image sharing — all secured by a rotating JWT refresh-token authentication system.

It was built as a deep dive into production-level concerns most tutorial chat apps skip: **secure cross-origin cookie auth, token rotation, rate limiting, and strict end-to-end TypeScript.**

---

## 🚀 Features

- 🔐 **Secure Authentication** — JWT access + refresh tokens stored in `httpOnly` cookies, with automatic rotation on refresh
- ⚡ **Real-Time Messaging** — instant message delivery via Socket.IO, sub-100ms latency
- 🟢 **Live Presence** — see which users are online in real time
- 🖼️ **Image Sharing** — upload and send images in chat, stored via Cloudinary
- 🛡️ **Security Hardened**
  - Rate limiting on auth & message endpoints
  - Request validation with **Zod**
  - Security headers via **Helmet**
  - Account lockout after repeated failed login attempts
  - Password hashing with **bcrypt**
- 🎨 **Polished UI** — responsive, theme-able interface (TailwindCSS + DaisyUI)
- 🧾 **Profile Management** — update profile picture and details
- ✅ **Strict TypeScript** — end-to-end type safety across frontend and backend

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS, DaisyUI, Zustand |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB + Mongoose |
| **Real-Time** | Socket.IO |
| **Auth** | JWT (access + rotating refresh tokens), httpOnly cookies |
| **Validation & Security** | Zod, Helmet, express-rate-limit, bcryptjs |
| **Media Storage** | Cloudinary |
| **Deployment** | Vercel (frontend) · Render (backend) |

---

## 🧩 Architecture

```
Chat-Sapphire/
├── client/                 # Next.js frontend
│   └── src/
│       ├── app/            # App router pages
│       ├── components/     # UI components
│       ├── store/          # Zustand state stores
│       └── lib/            # Axios instance, utilities
│
└── server/                 # Express backend
    └── src/
        ├── controllers/    # Route handlers
        ├── middlewares/    # Auth, validation, rate limiting
        ├── models/         # Mongoose schemas
        ├── routes/         # API route definitions
        └── lib/            # DB, socket, token, cloudinary utils
```

The frontend and backend are deployed independently — Next.js on **Vercel**, Express + Socket.IO on **Render** — communicating over authenticated, cross-origin HTTP and WebSocket connections.

---

## 🔑 Authentication Flow

Chat-Sapphire uses a **rotating refresh token** pattern for secure, long-lived sessions:

1. On login/signup, the server issues a short-lived **access token** and a long-lived **refresh token**, both set as `httpOnly` cookies.
2. The access token authorizes API requests via middleware.
3. When the access token expires, the client silently calls `/api/auth/refresh`, which validates the refresh token, **rotates** it (issues a new one, invalidating the old), and issues a fresh access token.
4. Cookies are configured with `Secure` + `SameSite=None` in production to safely support the cross-origin Vercel ↔ Render deployment.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 18
- A MongoDB connection string (local or Atlas)
- A Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/affanraza84/Chat-Sapphire.git
cd Chat-Sapphire
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_random_secret_at_least_32_characters_long
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env.local` file in `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

```bash
npm run dev
```

The app will be running at **http://localhost:3000**, backend at **http://localhost:5001**.

---

## 📡 API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Log in | ❌ |
| `POST` | `/api/auth/refresh` | Rotate access/refresh tokens | ❌ (uses refresh cookie) |
| `POST` | `/api/auth/logout` | Log out (clears cookies) | ❌ |
| `POST` | `/api/auth/logout-all` | Log out from all devices | ✅ |
| `GET` | `/api/auth/check` | Verify current session | ✅ |
| `PUT` | `/api/auth/update-profile` | Update profile picture/details | ✅ |
| `GET` | `/api/message/users` | Get sidebar user list | ✅ |
| `GET` | `/api/message/:id` | Get messages with a user | ✅ |
| `POST` | `/api/message/send/:id` | Send a message | ✅ |

---

## 🖥️ Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Media | [Cloudinary](https://cloudinary.com) |

> **Note:** The backend runs on Render's free tier, which spins down after inactivity — the first request after idle time may take 30–60s to respond.

---

## 🗺️ Roadmap

- [ ] Group chat rooms
- [ ] Message read receipts
- [ ] Typing indicators
- [ ] End-to-end encryption
- [ ] Push notifications

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Built with 🩵 by **[Affan Raza](https://github.com/affanraza84)**

</div>
