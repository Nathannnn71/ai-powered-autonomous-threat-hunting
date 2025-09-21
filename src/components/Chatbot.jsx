import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch("https://y1cz1otb8g.execute-api.us-east-1.amazonaws.com/chat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { from: "user", text: input },
        { from: "bot", text: data.reply || "⚠️ No reply from bot" }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: input },
        { from: "bot", text: "⚠️ Error: " + err.message }
      ]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          💬 Chat
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span>AI Chatbot</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  m.from === "user"
                    ? "bg-blue-100 text-blue-900 text-right"
                    : "bg-gray-200 text-gray-800 text-left" 
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm text-black placeholder-gray-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
