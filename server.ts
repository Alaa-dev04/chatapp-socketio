import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
//comparison result this stores it
const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev });
const handler = app.getRequestHandler();

const rooms = new Set<string>(["general"]);
const history: Record<string, { name: string; text: string }[]> = {
  general: [],
};
async function startServer() {
  try {
    await app.prepare();
    const httpServer = createServer(handler);
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
      console.log("connected", socket.id);
      //i need to start as general
      socket.join("general");
      socket.data.room = "general";
      socket.emit("rooms", [...rooms]);
      socket.emit("history", history["general"]);
      //helper function for leavving the room
      function switchRooms(room: string) {
        socket.leave(socket.data.room);
        socket.join(room);
        socket.data.room = room;
      }
      //CREATING A ROOM
      socket.on("create", (room, callback) => {
        if (rooms.has(room)) {
          return callback({ ok: false, error: "room already exiets" });
        }
        rooms.add(room);
        history[room] = [];
        switchRooms(room);
        io.emit("rooms", [...rooms]);
        callback({ ok: true, history: history[room] });
      });
      //jion a room
      socket.on("join", (room, callback) => {
        if (!rooms.has(room)) {
          return callback({ ok: false, error: "room doesnt exits" });
        }
        switchRooms(room);
        callback({ ok: true, history: history[room] });
      });
      socket.on("message", (msg) => {
        history[socket.data.room].push(msg);
        io.to(socket.data.room).emit("message", msg);
      });
      socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
      });
    });

    httpServer.listen(port, () => {
      console.log(`ready on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}
startServer();
