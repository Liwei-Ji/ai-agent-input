import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput";
import { ThumbsUp, ThumbsDown, X, Check } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  rating?: "up" | "down";
}

const feedbackOptions = [
  "有害或冒犯性",
  "忘記上一個內容",
  "已忽略或已拒絕指示",
  "實際上不正確",
  "遺漏重要資訊"
];

export const Rating = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
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

  const [feedbackModalOpenId, setFeedbackModalOpenId] = useState<string | null>(null);
  const [selectedFeedbackReasons, setSelectedFeedbackReasons] = useState<string[]>([]);

  const handleRate = (id: string, type: "up" | "down") => {
    if (type === "down") {
      const currentMsg = messages.find(m => m.id === id);
      if (currentMsg?.rating === "down") {
         setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, rating: undefined } : msg));
      } else {
         setFeedbackModalOpenId(id);
         setSelectedFeedbackReasons([]); 
      }
      return;
    }

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

  const closeFeedbackModal = () => {
    setFeedbackModalOpenId(null);
    setSelectedFeedbackReasons([]);
  };

  const toggleFeedbackReason = (reason: string) => {
    setSelectedFeedbackReasons(prev => 
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const submitFeedback = () => {
    if (feedbackModalOpenId) {
      setMessages(prev => prev.map(msg => 
        msg.id === feedbackModalOpenId 
          ? { ...msg, rating: "down" } 
          : msg
      ));
      console.log(`Feedback for message ${feedbackModalOpenId}:`, selectedFeedbackReasons);
      closeFeedbackModal();
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
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    // 修改重點：加入 rounded-3xl
    // 配合 overflow-hidden，這樣內部的 absolute 光箱遮罩就會被裁切成圓角
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
        <div className="mb-6 space-y-1 mt-8">
          </div>

          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1">
                
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[90%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm" 
                      : "text-slate-700 rounded-bl-sm"}
                  `}>
                    {msg.text}
                  </div>
                </div>

                {msg.role === "ai" && (
                  <div className="flex items-center gap-2 ml-1 mt-1 animate-in fade-in duration-500">
                    
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
                        size={16} 
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
                        size={16} 
                        className={`
                          transition-all duration-300
                          ${msg.rating === "down" ? "fill-current scale-110" : "scale-100"}
                        `}
                      />
                    </button>

                    {msg.rating === "up" && (
                      <span className="text-[10px] text-slate-400 animate-in fade-in slide-in-from-left-2">
                        Thanks for feedback!
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入框 */}
        <div className="shrink-0 pt-2 pb-1">
          <ChatInput 
            placeholder="Ask any question..." 
            onSend={handleSend}
          />
        </div>
      </div>

      {/* 反饋 Modal */}
      {feedbackModalOpenId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          
          <div className="w-[90%] max-w-[320px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 p-5 text-slate-200 animate-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">Please choose the item for your feedback.</h3>
              <button onClick={closeFeedbackModal} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {feedbackOptions.map((option) => {
                const isSelected = selectedFeedbackReasons.includes(option);
                return (
                  <label 
                    key={option} 
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors group"
                  >
                    <div className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-all
                      ${isSelected 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "border-slate-500 group-hover:border-slate-400 bg-transparent"
                      }
                    `}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => toggleFeedbackReason(option)}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                );
              })}
            </div>

            <button
              onClick={submitFeedback}
              disabled={selectedFeedbackReasons.length === 0} 
              className={`
                w-full py-2.5 rounded-xl text-sm font-medium transition-all
                ${selectedFeedbackReasons.length > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 active:scale-95"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }
              `}
            >
              Submit
            </button>

          </div>
        </div>
      )}

    </div>
  );
};