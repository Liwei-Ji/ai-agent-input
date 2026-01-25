import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput"; 
import { ThumbsUp, ThumbsDown, RotateCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  rating?: "up" | "down";
}

// 模擬不同的回答 (字數差異大，用來測試固定高度)
const alternateResponses = [
  "The update brings top-tier security patches, a modern sleek interface, and blazing fast reporting speeds.",
  "Here is a refined version: The update focuses on security, UI overhaul, and performance optimization.",
  "To put it simply: 1. Better Security. 2. New Look. 3. Faster Reports."
];

export const Regenerate = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      text: "Can you summarize the key features of the new update?"
    },
    {
      id: "2",
      role: "ai",
      text: "Sure! The new update includes:\n\n1. Enhanced security protocols.\n2. A completely redesigned user interface.\n3. Faster load times for reports.\n\nLet me know if you need more details!",
      rating: undefined
    }
  ]);

  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const handleRate = (id: string, type: "up" | "down") => {
    setMessages((prev) => 
      prev.map((msg) => {
        if (msg.id === id) {
          if (msg.rating === type) {
            return { ...msg, rating: undefined };
          }
          return { ...msg, rating: type };
        }
        return msg;
      })
    );
  };

  const handleRegenerate = (id: string) => {
    setRegeneratingId(id);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === id) {
          const randomResponse = alternateResponses[Math.floor(Math.random() * alternateResponses.length)];
          return {
            ...msg,
            text: randomResponse,
            rating: undefined 
          };
        }
        return msg;
      }));
      
      setRegeneratingId(null);
    }, 1500); 
  };

  const handleSend = (text: string) => {
    const newMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, newMsg]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "I've noted that down. Is there anything else I can help you with?",
        rating: undefined
      }]);
    }, 600);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, regeneratingId]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 設定 flex-1 讓它佔據所有剩餘空間，確保輸入框被推到底部 */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1">
                
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[90%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                      : "bg-transparent text-slate-700 rounded-bl-sm"} 
                  `}>
                    
                    {regeneratingId === msg.id ? (
                      <div className="w-[240px] space-y-2 animate-pulse py-1">
                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    ) : (
                      msg.text
                    )}
                    
                  </div>
                </div>

                {/* 操作按鈕列 */}
                {msg.role === "ai" && regeneratingId !== msg.id && (
                  <div className="flex items-center gap-1 ml-2 mt-0 animate-in fade-in duration-500">
                    
                    <button
                      onClick={() => handleRate(msg.id, "up")}
                      className={`
                        group p-1.5 rounded-full transition-all duration-300 ease-spring
                        hover:bg-slate-100 active:scale-90
                        ${msg.rating === "up" 
                          ? "text-green-600 bg-green-50 ring-1 ring-green-200" 
                          : "text-slate-400 hover:text-green-600"              
                        }
                      `}
                    >
                      <ThumbsUp 
                        size={14} 
                        className={`
                          transition-all duration-300
                          ${msg.rating === "up" ? "fill-current scale-110" : "scale-100"}
                        `} 
                      />
                    </button>

                    <button
                      onClick={() => handleRate(msg.id, "down")}
                      className={`
                        group p-1.5 rounded-full transition-all duration-300 ease-spring
                        hover:bg-slate-100 active:scale-90
                        ${msg.rating === "down" 
                          ? "text-red-500 bg-red-50 ring-1 ring-red-200" 
                          : "text-slate-400 hover:text-red-500"
                        }
                      `}
                    >
                      <ThumbsDown 
                        size={14} 
                        className={`
                          transition-all duration-300
                          ${msg.rating === "down" ? "fill-current scale-110" : "scale-100"}
                        `}
                      />
                    </button>

                    <button
                      onClick={() => handleRegenerate(msg.id)}
                      className="group p-1.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 active:scale-90 transition-all duration-300 ease-spring"
                    >
                      <RotateCw 
                        size={14} 
                        className="group-hover:rotate-180 transition-transform duration-500"
                      />
                    </button>

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入框 shrink-0 防止被壓縮 */}
        <div className="shrink-0 pt-2 pb-4 px-4 z-10">
          <ChatInput 
            placeholder="Ask any question..." 
            onSend={handleSend}
            disabled={regeneratingId !== null} 
          />
        </div>
      </div>

    </div>
  );
};