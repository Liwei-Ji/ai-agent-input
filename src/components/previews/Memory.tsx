import { useState, useRef, useEffect } from "react";
import { Send, Brain, Sparkles, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

interface MemoryItem {
  id: string;
  content: string;
}

export const Memory = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [justRemembered, setJustRemembered] = useState<string | null>(null);
  
  // 修改 1: 新增中文輸入狀態 (IME State)
  const [isComposing, setIsComposing] = useState(false);
  
  const [memories, setMemories] = useState<MemoryItem[]>([
    { id: "1", content: "Name: Alex" },
    { id: "2", content: "Role: Product Designer" },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hi Alex! I remember you're a Product Designer. What are we working on today?"
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const checkAndExtractMemory = (text: string) => {
    const lowerText = text.toLowerCase();
    let newMemory = "";

    // 1. 喜好 (Likes)
    if (lowerText.includes("like") || lowerText.includes("love")) {
      newMemory = `Likes: ${text.replace(/.*(like|love)/i, "").trim()}`;
    } else if (text.includes("喜歡") || text.includes("愛")) {
      newMemory = `Likes: ${text.replace(/.*(喜歡|愛)/, "").trim()}`;
    }
    
    // 2. 厭惡 (Dislikes)
    else if (lowerText.includes("hate") || lowerText.includes("don't like")) {
      newMemory = `Dislikes: ${text.replace(/.*(hate|don't like)/i, "").trim()}`;
    } else if (text.includes("討厭") || text.includes("不喜歡")) {
      newMemory = `Dislikes: ${text.replace(/.*(討厭|不喜歡)/, "").trim()}`;
    }
    
    // 3. 地點/背景 (Location/Context)
    else if (lowerText.includes("live in") || lowerText.includes("from")) {
      newMemory = `Location: ${text.replace(/.*(live in|from)/i, "").trim()}`;
    } else if (text.includes("住在") || text.includes("來自")) {
      newMemory = `Location: ${text.replace(/.*(住在|來自)/, "").trim()}`;
    }

    if (newMemory) {
      const memoryObj = { id: Date.now().toString(), content: newMemory };
      setMemories(prev => [...prev, memoryObj]);
      setJustRemembered(newMemory);
      setTimeout(() => setJustRemembered(null), 3000);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    
    checkAndExtractMemory(inputValue);
    
    // 清空輸入框
    setInputValue("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Got it. I'll keep that in mind for future conversations."
      }]);
    }, 800);
  };

  // 修改 2: 防止在選字時按下 Enter 觸發發送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col border-slate-200 animate-in fade-in zoom-in duration-500">
      
      {/* 頂部標題與記憶面板 */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto"></div>
        
        {showMemoryPanel && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-purple-100 shadow-xl rounded-2xl p-3 w-48 animate-in slide-in-from-top-2 fade-in duration-300 mr-2 mt-8">
             <div className="flex justify-between items-center mb-2 border-b border-purple-100 pb-1">
               <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                 <Brain size={12} /> Memory Bank
               </span>
               <button onClick={() => setShowMemoryPanel(false)} className="text-slate-400 hover:text-purple-600">
                 <X size={12} />
               </button>
             </div>
             <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-none">
               {memories.length === 0 ? (
                 <p className="text-[10px] text-slate-400 italic">No memories yet.</p>
               ) : (
                 memories.map(m => (
                   <div key={m.id} className="group flex justify-between items-center text-[11px] text-slate-600 bg-purple-50 px-2 py-1 rounded-md">
                      <span className="truncate max-w-[120px]">{m.content}</span>
                      <button onClick={() => handleDeleteMemory(m.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity">
                        <X size={10} />
                      </button>
                   </div>
                 ))
               )}
             </div>
          </div>
        )}
      </div>

      {/* 聊天區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col pt-12">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" ? (
                  // 修改重點：AI 訊息改為純文字 (無背景氣泡)
                  <div className="max-w-[95%] text-slate-700 text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                    {msg.text}
                  </div>
                ) : (
                  // User 訊息維持紫色氣泡
                  <div className="max-w-[90%] p-4 text-sm leading-7 rounded-2xl rounded-br-sm shadow-sm whitespace-pre-wrap bg-purple-600 text-white">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 relative z-20">
            
            {/* 動態回饋提示 */}
            <div className="relative min-h-[28px] mb-1 flex items-end justify-center pointer-events-none">
                {justRemembered && (
                  <div className="animate-in slide-in-from-bottom-2 fade-in duration-500 absolute bottom-0 flex items-center gap-1.5 bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full shadow-sm z-30">
                      <Sparkles size={12} className="animate-pulse text-purple-500" />
                      <span className="text-[10px] font-semibold">已記住:</span>
                      <span className="text-[10px]">{justRemembered}</span>
                  </div>
                )}
            </div>

            <div className="relative flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-400 transition-all">
                
                <button 
                  onClick={() => setShowMemoryPanel(!showMemoryPanel)}
                  className={`
                    p-2 rounded-xl transition-all duration-300 relative
                    ${showMemoryPanel || justRemembered ? 'bg-purple-100 text-purple-600' : 'text-slate-400 hover:bg-slate-100'}
                  `}
                  title="View Memories"
                >
                  <Brain size={20} className={justRemembered ? "animate-bounce" : ""} />
                  {memories.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full border border-white"></span>
                  )}
                </button>

                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  // 修改 3: 綁定中文輸入監聽事件 (IME Handlers)
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="輸入『我喜歡喝咖啡』來測試..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-8"
                />

                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`
                    p-2 rounded-full transition-all
                    ${inputValue.trim() 
                      ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200" 
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
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