import { useState, useRef, useEffect } from "react";
import { Send, Database, Lock, Info, ShieldCheck } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export const DataOwnership = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 狀態：是否同意分享數據 (預設開啟)
  const [isDataShared, setIsDataShared] = useState(true);
  
  // 狀態：是否顯示詳細說明文字
  const [showInfo, setShowInfo] = useState(false);
  
  // 中文輸入狀態 (IME State)
  const [isComposing, setIsComposing] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hello! I'm ready to help. You have full control over your data privacy settings below."
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: isDataShared 
          ? "I've processed that with our standard models." 
          : "I've processed that locally/privately. No data was used for training."
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

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 聊天區域 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-75 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          <div className="mb-6 space-y-1 mt-24">
          </div>

          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" ? (
                  // AI 訊息無氣泡
                  <div className="max-w-[95%] text-slate-700 text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                    {msg.text}
                  </div>
                ) : (
                  // User 訊息藍色氣泡
                  <div className={`
                    max-w-[90%] p-4 text-sm leading-7 rounded-2xl shadow-sm whitespace-pre-wrap transition-colors duration-500 rounded-br-sm
                    ${isDataShared 
                        ? "bg-blue-600 text-white" 
                        : "bg-emerald-600 text-white"
                    }
                  `}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作區 */}
        <div className="shrink-0 pt-2 pb-0 z-10 bg-transparent px-1">
          
          {/* Data Ownership Control Bar */}
          <div className="mb-3 flex flex-col items-end gap-2">
            
            {/* 上方開關列 */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm transition-all">
              
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
                {isDataShared ? <Database size={14} className="text-blue-500" /> : <Lock size={14} className="text-emerald-500" />}
                <span>Share Data</span>
                <Info size={12} className="text-slate-400 hover:text-slate-600" />
              </div>

              <div className="w-px h-3 bg-slate-200 mx-1"></div>

              <button 
                onClick={() => setIsDataShared(!isDataShared)}
                className={`
                  relative w-9 h-5 rounded-full transition-colors duration-300 focus:outline-none
                  ${isDataShared ? 'bg-blue-600' : 'bg-slate-300'}
                `}
              >
                <div className={`
                  absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
                  ${isDataShared ? 'translate-x-4' : 'translate-x-0'}
                `} />
              </button>
            </div>

            {/* 詳細說明 */}
            {showInfo && (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 leading-relaxed animate-in slide-in-from-bottom-2 fade-in shadow-sm">
                <p className="font-semibold mb-1 text-slate-700">Data Usage Consent</p>
                <p>
                  Do you consent to us using your data to improve our AI models? 
                  <span className="block mt-1 text-slate-400">
                    Turn this setting <strong className="text-slate-600">OFF</strong> if you wish to exclude your data from this process.
                  </span>
                </p>
              </div>
            )}
          </div>


          {/* 輸入框 (根據狀態改變樣式) */}
          <div className={`
            relative flex w-full items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm transition-all duration-500
            ${isDataShared 
              ? "bg-white border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400" 
              : "bg-emerald-50/50 border-emerald-200 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-400" 
            }
          `}>
            
            {/* 私密模式圖標提示 */}
            {!isDataShared && (
              <div className="animate-in zoom-in duration-300 text-emerald-500 mr-1" title="Private Mode Active">
                 <ShieldCheck size={18} />
              </div>
            )}

            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              // 綁定中文輸入監聽事件 (IME Handlers)
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={isDataShared ? "Ask any question..." : "Private mode enabled. Ask safely..."} 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-10"
            />
            
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`
                p-2 rounded-full transition-all duration-300
                ${inputValue.trim() 
                  ? isDataShared 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200"
                  : "bg-slate-200 text-white cursor-not-allowed"
                }
              `}
            >
              <Send size={18} />
            </button>
          </div>

          {/* 底部狀態字 */}
          <div className="flex justify-center mt-2">
            <span className={`text-[10px] font-medium transition-colors duration-500 ${isDataShared ? 'text-slate-300' : 'text-emerald-600'}`}>
              {isDataShared ? "AI Model Training: Active" : "Incognito Mode: Data will not be saved"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};