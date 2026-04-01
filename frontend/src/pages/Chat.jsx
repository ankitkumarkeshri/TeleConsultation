import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import socket, { useSocket } from "../socket/useSocket";

function Chat() {
  const { appointmentId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  let typingTimeout;

  // 🔥 Load chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${appointmentId}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [appointmentId]);

  // 🔥 Join room
  useEffect(() => {
    socket.emit("join_room", appointmentId);
  }, [appointmentId]);

  // 🔥 Receive messages
  useSocket("receive_message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  // 🔥 Typing listeners
  useSocket("typing", () => {
    setIsTyping(true);
  });

  useSocket("stop_typing", () => {
    setIsTyping(false);
  });

  // 🔥 Handle typing input
  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", appointmentId);

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", appointmentId);
    }, 1000);
  };

  // 🔥 Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      roomId: appointmentId,
      receiver: "RECEIVER_ID", // later dynamic
      message,
      appointment: appointmentId,
    });

    setMessage("");
    socket.emit("stop_typing", appointmentId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat</h2>

      <div style={{ marginBottom: "20px" }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.sender?.name || "User"}:</strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <p style={{ fontStyle: "italic", color: "gray" }}>
          Someone is typing...
        </p>
      )}

      <input
        value={message}
        onChange={handleTyping}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;