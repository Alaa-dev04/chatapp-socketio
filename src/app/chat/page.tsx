"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
type Message = {
  name: string;
  text: string;
};
const ChatPage = () => {
  const [name, setName] = useState("");
  // an array of this obj
  const [message, setMessage] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [room, setRoom] = useState("general");
  const [rooms, setRooms] = useState<string[]>(["general"]);
  const [roomInput, setRoomInput] = useState("");
  const [error, setError] = useState("");
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    setName(`Guest ${Math.floor(Math.random() * 1000)}`);
    const socket = io();
    socketRef.current = socket;
    socket.on("message", (msg) => {
      console.log("received", msg);
      setMessage((prev) => [...prev, msg]);
    });
    socket.on("rooms", (list: string[]) => {
      setRooms(list);
    });
    socket.on("history", (list: Message[]) => {
      setMessage(list);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  //cerate and add room
  function ChangeRoom(action: "create" | "join", roomName = roomInput) {
    const target = roomName.trim();
    if (!target) return;
    if (action === "join" && target === room) return;
    setError("");
    socketRef.current?.emit(
      action,
      target,
      (res: { ok: boolean; error?: string; history?: Message[] }) => {
        if (res.ok) {
          setRoom(target);
          setMessage(res.history ?? []);
          setRoomInput("");
        } else {
          setError(res.error || "something went wrong ");
        }
      },
    );
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) return;
    socketRef.current?.emit("message", { name, text });
    console.log("sending", { name, text });
    setText("");
  }
  return (
    <div className=" flex ">
      {" "}
      <aside className="w-48 border-r p-3">
        <h2 className="mb-2 font-bold">Rooms</h2>
        <ul className="flex flex-col gap-1">
          {rooms.map((r) => (
            <li key={r}>
              <button
                onClick={() => ChangeRoom("join", r)}
                className={`w-full rounded px-2 py-1 text-left ${
                  r === room ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className=" flex h-screen flex-col gap-4 p-4  justify-center  w-full ">
        <h1 className="text-xl font-bold">
          Chat as {name} in {room}
        </h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder=" enter room name ..."
            className="flex-1 rounded border p-2"
          />
          <button
            onClick={() => ChangeRoom("create")}
            className="rounded bg-blue-600 px-4 py-2"
          >
            create
          </button>
          <button
            onClick={() => ChangeRoom("join")}
            className="rounded bg-purple-400 px-4 py-2"
          >
            join
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <ul className="flex-1 overflow-y-auto rounded border p-2 ">
          {message.map((msg, i) => (
            <li key={i} className="py-1 ">
              <span className="font-semibold">{msg.name}: </span>
              {msg.text}
            </li>
          ))}
        </ul>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="type something ..."
            className="flex-1 rounded border p-2"
          />
          <button type="submit" className="rounded bg-blue-600 px-4 py-2">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
