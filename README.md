# 💬 Chat App

A modern, real-time chat application built using **React**, **Express**, **MongoDB**, and **Socket.io**. Designed to provide a seamless and secure messaging experience with features like real-time updates, user authentication, private messaging, and more.

## 🚀 Features

- 🔐 **User Authentication** (Login / Signup)
- 👥 **Create and Join Chats** (One-on-One or Group)
- ⚡ **Real-Time Messaging** via Socket.io
- 🛡️ **Protected Routes** with JWT
- 🔔 Instant Notifications
- 📦 MongoDB for storing users, chats, and messages
- 🎨 Responsive UI with beautiful animations and clean design

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **Tailwind CSS**
- **React Router**
- **Axios**

### Backend
- **Express.js**
- **MongoDB + Mongoose**
- **Socket.io**
- **JWT (JSON Web Token)**
- **bcrypt.js**
- **CORS, Helmet, Morgan**
  
---

## 📂 Project Structure

```

chat-app/
├── client/         # React frontend
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── ...
├── server/         # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── ...
└── README.md

````

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
````

### 2. Setup Backend

```bash
cd server
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Make sure to configure your environment variables for both frontend and backend (e.g., `.env` files).

---

## 🔒 Environment Variables

**Backend `.env`**

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
```

**Frontend `.env`**

```
VITE_API_URL=http://localhost:5000
```

---

## ✨ Future Improvements

* ✅ Dark mode toggle
* ✅ Typing indicators
* ✅ File & image sharing
* ✅ Message reactions
* ✅ Chat archiving

---

## 🧑‍💻 Developed By

**John Wesley**
Aspiring Web Developer & UI/UX Designer
[LinkedIn](https://www.linkedin.com/in/john-wesley-6707ab258/) • [Twitter](https://twitter.com/JohnWesley97513) • [Portfolio](https://johnwesley.vercel.app)

---

## 📜 License

This project is open source and free to use.

---
