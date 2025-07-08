import React, { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../index";
import MarkdownRenderer from "../components/GrokComponent/MarkdownRenderer";
import Sidebar from "../components/Sidebar";
import grokImage from "../Grok_image.png";
const GrokAiChat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef();

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get("grok-ai/grok-chatrooms/");
      setChatRooms(res.data || []);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  const fetchRoomMessages = async (roomId) => {
    try {
      const res = await axiosInstance.get(`grok-ai/grok-chatrooms/${roomId}/`);
      setMessages(res.data.messages);
      setSelectedRoom(res.data);
    } catch (err) {
      console.error("Error fetching room messages", err);
      setMessages([]);
    }
  };

  const sendPrompt = async () => {
    if (!userInput.trim() || !selectedRoom) return;

    const userMsg = { sender: "user", message: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        `grok-ai/grok-chatrooms/${selectedRoom.id}/prompt/`,
        { prompt: userInput },
        { timeout: 20000 }
      );
      const aiMsg = { sender: "ai", message: res.data.response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", message: "❌ AI Error occurred." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="d-flex" style={{ height: "100vh", backgroundColor: "#0d1117", color: "white" }}>
      {/* Sidebar */}
      <Sidebar onLogout={() => alert("Logout")} />

      {/* Center Chat Area */}
      <div
        className="d-flex flex-column justify-content-between p-3 "
        style={{ width: "65%", borderLeft: "1px solid #222", borderRight: "1px solid #222" }}
      >
        <div className="overflow-auto " style={{ flexGrow: 1 }}>
          {(!selectedRoom || messages.length === 0) ? (
            <div className="d-flex justify-content-center align-items-center h-100 ">
              <img
                src={grokImage}
                alt="Grok AI"
                style={{ maxWidth: "350px", filter: "invert(1)" }}
              />
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-center"}`}>
                  <div
                    className={`p-3 rounded ${msg.sender === "user" ? "pl-2" : "pl-4"}`}
                    style={{
                      width: msg.sender === "user" ? "60%" : "100%",
                      backgroundColor: msg.sender === "user" ? "#1e1e2f" : "#161b22",
                      color: "#f1f1f1",
                      borderRadius: "16px",
                    }}
                  >
                    <MarkdownRenderer>{msg.message}</MarkdownRenderer>
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-light text-center">Generating...</div>}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Box */}
        {selectedRoom && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt();
            }}
            className="d-flex gap-2 mt-3"
          >
            <input
              type="text"
              className="form-control bg-dark text-white border-0 rounded-pill"
              placeholder="Ask Grok anything..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
            />
            <button className="btn rounded-pill ml-2 " type="submit" disabled={isLoading} style={{ background: "#c2184e", color: "white" }} >

              {isLoading ? <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span> : <i class="bi bi-arrow-up"></i>}

            </button>
          </form>
        )}
      </div>

      {/* Right Chat Room List */}
      <div className="p-3" style={{ width: "20%", backgroundColor: "#161b22" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="d-flex align-items-center gap-2">
            <h5>History</h5>
            <img src={grokImage} alt="Grok AI" style={{ width: "30px", filter: "invert(1)" }} className="text-center d-flex justify-content-center " />
          </span>
          <button
            className="btn btn-sm "
            style={{ backgroundColor: "#c2184e", color: "white" }}
            onClick={async () => {
              const name = window.prompt("Enter new room name:");
              if (!name) return;
              try {
                const res = await axiosInstance.post("grok-ai/grok-chatrooms/", { name });
                await fetchRooms();
                fetchRoomMessages(res.data.id);
              } catch (err) {
                alert("Failed to create room");
              }
            }}
          >
            New Chat
          </button>
        </div>
        <ul className="list-group list-group-flush">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              className="list-group-item text-white border-0"
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                marginBottom: "4px",
                padding: "10px 12px",
                transition: "all 0.2s ease-in-out",
                backgroundColor: selectedRoom?.id === room.id ? "#c2184e" : "transparent",
              }}
              onClick={() => fetchRoomMessages(room.id)}
            >
              {room.name}
            </li>

          ))}
        </ul>
      </div>
    </div >
  );
};

export default GrokAiChat;
