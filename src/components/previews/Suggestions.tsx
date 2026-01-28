import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export const Suggestions = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始建議標籤
  const suggestionTags = ["Help you analyze data", "生成財務報表", "市場趨勢分析"];

  const handleSend = (text: string) => {
    // 使用者訊息
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMsg]);

    // 模擬回應
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Generating a response based on the input${text}`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, newAiMsg]);
    }, 800);
  };

  // 自動滾動
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-md h-[600px] flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 訊息區 */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        
        {/* 歡迎標題 */}
        <div className="mb-6 space-y-1 mt-12">
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
                      ? "bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-100"
                      : "text-slate-700 rounded-bl-sm"
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
      <div className="shrink-0 pt-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-3 px-1 animate-in slide-in-from-bottom-2 fade-in duration-500">
            {suggestionTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSend(tag)}
                className="
                  text-sm font-medium text-slate-700 bg-purple-100/50 
                  border border-purple-100
                  px-4 py-2 rounded-2xl
                  hover:bg-purple-100 hover:border-purple-200 hover:scale-105
                  transition-all cursor-pointer
                "
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* 輸入框 */}
        <ChatInput 
          placeholder="Ask any question..." 
          onSend={handleSend} 
        />
      </div>
    </div>
  );
};