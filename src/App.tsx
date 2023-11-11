import { ChangeEvent, useEffect, useState } from "react";
import { Message, MessageType, Task, useStore } from "./store";

function App() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const { socket, closeSocket } = useStore();
  useEffect(() => {
    // Listen for messages
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data) as Message;
      setMessageList((prev) => [...prev, message]);
    });

    return () => {
      closeSocket();
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  return (
    <>
      <div>
        <input type="text" onChange={handleChange} />
        <button
          type="submit"
          onClick={() => {
            socket?.send(message);
          }}
        >
          send
        </button>
      </div>
    </>
  );
}

export default App;
