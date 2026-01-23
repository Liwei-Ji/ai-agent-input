import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export const FollowUp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setShowSuggestions(true);
    }, 600);
  };

  const handleTagClick = (tag: string) => {
    handleSend(tag);
    setShowSuggestions(false);
  };

  // 自動滾動
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showSuggestions]);

  return (
    <div className="w-full max-w-md h-[450px] flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 訊息區 */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        
        <div className="mb-6 space-y-1 mt-2">
          <h3 className="text-sm font-medium text-slate-500">Hi, I'm AI Agent</h3>
          <p className="text-xs text-slate-400 font-medium">15:47</p>
        </div>

        {/* 訊息列表 */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[85%] p-4 text-sm leading-relaxed rounded-2xl animate-in slide-in-from-bottom-2
                  ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-slate-100 text-slate-700 rounded-bl-sm"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* 底部固定區 */}
      <div className="shrink-0 pt-4">
        <ChatInput 
          placeholder="Ask any question..." 
          onSend={handleSend} 
        />

        <div className="min-h-[60px] flex items-start pt-3">
          {showSuggestions && (
           
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-500 px-1">
              {["Budget details", "Risk analysis"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="
                    text-sm font-medium text-slate-700 bg-purple-100/50 
                    border border-purple-100
                    px-4 py-2 rounded-xl 
                    hover:bg-purple-100 hover:border-purple-200 hover:scale-105
                    transition-all cursor-pointer
                  "
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};