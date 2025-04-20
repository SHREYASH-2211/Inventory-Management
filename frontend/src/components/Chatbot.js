"use client"
import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with a welcome message
    setMessages([
      {
        text: "Hello! I'm StockWise, your AI assistant for inventory management. How can I help you optimize your stock or navigate the system today?",
        sender: "bot"
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      console.log("Sending message to backend...");
      const response = await fetch('http://192.168.252.193:4000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId
        }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response:", data);
      setMessages(prev => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error('Full error details:', error);
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message || "Failed to connect to server"}`, 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">StockWise Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}