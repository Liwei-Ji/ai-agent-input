import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput"; 
import { ThumbsUp, ThumbsDown, RotateCw, Copy as CopyIcon, Check } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  rating?: "up" | "down";
}

export const Copy = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      text: "Can you summarize how the new update improves the user experience?"
    },
    {
      id: "2",
      role: "ai",
      text: "Sure! The new update improves the user experience by:\n\n1. Making the interface more intuitive.\n2. Streamlining key user workflows.\n3. Improving overall performance and speed.\n\nLet me know if you’d like more details!",
      rating: undefined
    }
  ]);

  // 用來追蹤哪條訊息被複製
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRate = (id: string, type: "up" | "down") => {
    setMessages((prev) => 
      prev.map((msg) => {
        if (msg.id === id) {
          if (msg.rating === type) return { ...msg, rating: undefined };
          return { ...msg, rating: type };
        }
        return msg;
      })
    );
  };

  // 僅保留視覺點擊效果
  const handleRegenerate = () => {
    console.log("Regenerate clicked (Logic disabled for Copy demo)");
  };

  // 處理複製邏輯
  const handleCopy = async (id: string, text: string) => {
    try {
      // 寫入剪貼簿
      await navigator.clipboard.writeText(text);
      
      // 設定狀態顯示 "Copied!"
      setCopiedId(id);

      // 2秒後恢復原狀
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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
  }, [messages]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 */}
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
                    {msg.text}
                  </div>
                </div>

                {/* 操作按鈕列 */}
                {msg.role === "ai" && (
                  <div className="flex items-center gap-1 ml-2 mt-0 animate-in fade-in duration-500">
                    
                    {/* Thumbs Up */}
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
                        className={`transition-all duration-300 ${msg.rating === "up" ? "fill-current scale-110" : "scale-100"}`} 
                      />
                    </button>

                    {/* Thumbs Down */}
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
                        className={`transition-all duration-300 ${msg.rating === "down" ? "fill-current scale-110" : "scale-100"}`}
                      />
                    </button>

                    {/* Regenerate Button */}
                    <button
                      onClick={handleRegenerate}
                      className="group p-1.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 active:scale-90 transition-all duration-300 ease-spring"
                      title="Regenerate response"
                    >
                      <RotateCw 
                        size={14} 
                        className="group-hover:rotate-180 transition-transform duration-500"
                      />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className={`
                        group p-1.5 rounded-full transition-all duration-300 ease-spring active:scale-90
                        ${copiedId === msg.id
                            ? "text-green-600 bg-green-50" // 複製成功樣式
                            : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100" // 預設樣式
                        }
                      `}
                      title="Copy to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <Check size={14} className="animate-in zoom-in duration-300" />
                      ) : (
                        <CopyIcon size={14} />
                      )}
                    </button>

                    {/* Copied 提示文字 */}
                    {copiedId === msg.id && (
                        <span className="text-[10px] font-medium text-green-600 animate-in fade-in slide-in-from-left-2 ml-1">
                            Copied!
                        </span>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入框 */}
        <div className="shrink-0 pt-2 pb-4 px-4 z-10">
          <ChatInput 
            placeholder="Ask any question..." 
            onSend={handleSend}
          />
        </div>
      </div>

    </div>
  );
};