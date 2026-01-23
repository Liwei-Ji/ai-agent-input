import { useState, useRef, useEffect } from "react";
import { Ghost, History, Flame, Send } from "lucide-react"; 

interface Message {
  id: string;
  role: "user" | "ai" | "system";
  text: string;
}

export const ZeroRetention = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // 新增中文輸入狀態 (IME State)
  const [isComposing, setIsComposing] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "I'm ready. How can I help you today?"
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const toggleGhostMode = () => {
    setIsGhostMode(!isGhostMode);
    if (!isGhostMode) {
      setMessages([{ 
        id: Date.now().toString(), 
        role: "system", 
        text: "Ghost mode activated. History is paused." 
      }]);
    } else {
      setMessages([{ 
        id: Date.now().toString(), 
        role: "system", 
        text: "Back to standard mode. Conversations are saved." 
      }]);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: isGhostMode 
          ? "This message will not be stored in your history logs." 
          : "I've saved this preference to your profile."
      }]);
    }, 600);
  };

  // 防止在選字時按下 Enter 觸發發送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const theme = isGhostMode ? {
    bg: "bg-slate-900",
    text: "text-slate-300",
    // border: "border-slate-700", // 已移除外框線邏輯
    inputBg: "bg-slate-800",
    userBubble: "bg-indigo-900 text-indigo-100",
    aiText: "text-slate-300",
  } : {
    bg: "bg-white",
    text: "text-slate-600",
    // border: "border-slate-200", // 已移除外框線邏輯
    inputBg: "bg-white",
    userBubble: "bg-blue-600 text-white",
    aiText: "text-slate-700",
  };

  return (
    // 修改 1: 移除了 border 與 ${theme.border}
    <div className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col transition-colors duration-500 ${theme.bg}`}>
      
      {/* 頂部控制列 */}
      <div className={`shrink-0 px-6 py-4 flex items-center justify-between transition-colors duration-500`}>
        <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full transition-all duration-500 ${isGhostMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-100 text-slate-400'}`}>
                {isGhostMode ? <Ghost size={18} /> : <History size={18} />}
            </div>
            <div>
                <h3 className={`text-sm font-bold transition-colors duration-500 ${isGhostMode ? 'text-white' : 'text-slate-700'}`}>
                    {isGhostMode ? "Zero Retention" : "Standard Chat"}
                </h3>
                <p className="text-[10px] text-slate-400 transition-opacity duration-300">
                    {isGhostMode ? "History paused. No traces left." : "Conversations are saved."}
                </p>
            </div>
        </div>

        <button 
            onClick={toggleGhostMode}
            className={`relative w-12 h-6 rounded-full transition-colors duration-500 ${isGhostMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
        >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-500 ${isGhostMode ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* 聊天區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col relative">
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 pt-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent z-10"
        >
          <div className="space-y-6 px-4">
            {messages.map((msg) => {
              if (msg.role === "system") {
                return (
                  <div key={msg.id} className="flex justify-center my-4 animate-in fade-in zoom-in duration-300">
                    <span className={`text-[10px] font-medium px-3 py-1 rounded-full ${isGhostMode ? 'text-slate-500 bg-slate-800' : 'text-slate-400 bg-slate-100'}`}>
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                   {/* 修改 2: AI 訊息改為純文字 (無氣泡), User 訊息維持氣泡 */}
                   {msg.role === "ai" ? (
                    <div className={`max-w-[95%] text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 ${theme.aiText}`}>
                      {msg.text}
                    </div>
                  ) : (
                    <div className={`
                      max-w-[90%] p-4 text-sm leading-7 rounded-2xl shadow-sm whitespace-pre-wrap transition-colors duration-500 rounded-br-sm
                      ${theme.userBubble}
                    `}>
                      {msg.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部輸入區 */}
        <div className={`shrink-0 pt-2 pb-4 px-4 z-20 transition-colors duration-500 ${theme.bg}`}>
            
            <div className={`
                mb-2 flex items-center justify-center gap-2 text-[10px] font-medium transition-all duration-500 overflow-hidden
                ${isGhostMode ? 'h-6 opacity-100 text-indigo-400' : 'h-0 opacity-0 text-transparent'}
            `}>
                <Flame size={12} className="animate-pulse" />
                <span>Messages will be cleared upon session end</span>
            </div>

            <div className={`
                relative flex w-full items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm transition-colors duration-500
                ${isGhostMode 
                    ? "bg-slate-800 border-slate-700 focus-within:ring-2 focus-within:ring-indigo-900 focus-within:border-indigo-700" 
                    : "bg-white border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400"
                }
            `}>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  // 修改 3: 綁定中文輸入監聽事件 (IME Handlers)
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder={isGhostMode ? "Interact without traces..." : "Ask a question..."}
                  className={`flex-1 bg-transparent text-sm outline-none h-10 transition-colors duration-500 ${isGhostMode ? "text-slate-200 placeholder:text-slate-500" : "text-slate-700 placeholder:text-slate-400"}`}
                />

                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`
                    p-2 rounded-full transition-all duration-300
                    ${inputValue.trim() 
                      ? isGhostMode 
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      : isGhostMode
                          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                          : "bg-slate-200 text-white cursor-not-allowed"
                    }
                  `}
                >
                  <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};