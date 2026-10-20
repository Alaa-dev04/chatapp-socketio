# Real-Time Chat App 💬

A real-time multi-room chat application built with **Next.js, React, TypeScript, and Socket.IO**. Users can create chat rooms, join existing rooms, and exchange messages instantly with other users in the same room.

## ✨ Features

- **Real-Time Messaging:** Send and receive messages instantly using Socket.IO.
- **Multiple Chat Rooms:** Create new rooms and join existing ones.
- **Dynamic Room List:** Keep the available rooms list updated when new rooms are created.
- **Default Room:** Every user automatically joins the `general` room.
- **Room-Based Messaging:** Messages are delivered only to users in the same room.
- **Connection Handling:** Handle user connections and disconnections.

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and pnpm installed.

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace the placeholders with your GitHub repository URL and project folder name.

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

This project uses a custom Next.js server to integrate Socket.IO. Make sure your `dev` script runs your custom server entry point (such as `server.ts`) rather than the default `next dev` command.

### 4. Open the application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

Open the application in multiple browser tabs to test messaging between users.

## 💬 How It Works

1. Each user connects to the Socket.IO server and joins the `general` room.
2. Users can create a new room or join an existing one.
3. The server broadcasts room list updates to connected clients.
4. When a user sends a message, the server broadcasts it only to members of that user's current room.
5. Users automatically leave their rooms when they disconnect.

## 📁 Project Structure

The project includes a custom server entry point that integrates Next.js with Socket.IO, alongside the Next.js frontend components that handle the chat interface and real-time events.

```text
project/
├── server.ts
├── app/
│   └── ... chat page and other routes
├── package.json
└── ...
```

The exact frontend folder structure may vary depending on your Next.js setup.

## ⚠️ Current Limitations

- Room names are stored in memory and reset when the server restarts.
- Messages are not persisted or loaded as chat history.
- Authentication and user authorization are not implemented.
- This project is intended as a learning project and is not yet production-ready.

## 🎯 Learning Objectives

This project was built to practice:

- Real-time communication between client and server.
- Socket.IO events and event listeners.
- Managing Socket.IO rooms.
- Broadcasting messages to specific rooms.
- React state management with hooks.
- Integrating Socket.IO with a Next.js custom server.

---

**Built with ❤️ to explore real-time web development.**
