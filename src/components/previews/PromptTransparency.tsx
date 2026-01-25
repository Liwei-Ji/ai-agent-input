import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Brain, Send, Paperclip } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  transparencyData?: {
    title: string;
    content: string;
  };
}

export const PromptTransparency = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref 用於停止生成
  const timeoutRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      text: "Write a polite decline email for a job offer."
    },
    {
      id: "2",
      role: "ai",
      text: "Subject: Withdrawal of Application - [Your Name]\n\nDear [Hiring Manager's Name],\n\nThank you so much for offering me the position. I greatly appreciate the time you took to interview me. However, after careful consideration, I have decided to decline the offer...",
      transparencyData: {
        title: "Prompt Engineering Context",
        content: `SYSTEM: You are an expert career coach.
TASK: Write a professional email.
TONE: Polite, gratitude-filled, yet firm.
CONSTRAINTS: Keep it concise. Do not burn bridges.
USER_INTENT: Decline job offer.`
      }
    }
  ]);

  const toggleTransparency = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsGenerating(true);
    
    // 模擬生成過程
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "To fix the React useEffect dependency warning, you should include 'userId' in the dependency array. Here is the corrected code snippet...",
        transparencyData: {
          title: "Chain of Thought",
          content: `> Analyzing User Input... "Fix useEffect warning"
> Identifying Context... React Hooks (React 18+)
> Detecting Issue... Missing dependency in dependency array.
> Formulating Solution... Add variable to array or use useRef.
> Selected Approach... Standard dependency fix (safest).`
        }
      }]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) handleSend();
    }
  };

  // 自動捲動
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isGenerating, expandedIds]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500 ">
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                
                {/* Prompt Transparency Block */}
                {msg.role === "ai" && msg.transparencyData && (
                  // 確保與下方文字靠左對齊
                  <div className="max-w-[90%]"> 
                    
                    {/* Header Button */}
                    <button 
                      onClick={() => toggleTransparency(msg.id)}
                      className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors py-1 group"
                    >
                        <div className={`
                            p-1 rounded flex items-center justify-center transition-colors
                            ${expandedIds.includes(msg.id) ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 group-hover:bg-indigo-50"}
                        `}>
                            <Brain size={12} />
                        </div>
                        <span>{msg.transparencyData.title}</span>
                        {expandedIds.includes(msg.id) ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </button>

                    {/* Expanded Content */}
                    {expandedIds.includes(msg.id) && (
                        // 保留 pre 內容
                        <div className="mt-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono leading-relaxed overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300 shadow-inner">
                            <pre className="whitespace-pre-wrap font-mono">
                                {msg.transparencyData.content}
                            </pre>
                        </div>
                    )}
                  </div>
                )}

                {/* 訊息本體 */}
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[90%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                      : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                  `}>
                    {msg.text}
                  </div>
                </div>

              </div>
            ))}
            
          </div>
        </div>

        {/* 底部輸入控制區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 z-10">
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all duration-300
                ${isGenerating 
                    ? "border-slate-200 bg-white" 
                    : "border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
                }
            `}>
              
              {/* 左側按鈕 (Paperclip) */}
              <button
                type="button"
                className="transition-colors shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                disabled={isGenerating}
              >
                <Paperclip size={20} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
              />

              {/* 輸入框 */}
              <div className="flex-1 relative h-10 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  placeholder="Ask any question..."
                  className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10"
                />
              </div>

              {/* 右側按鈕 */}
              {isGenerating ? (
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 active:scale-90 shadow-sm"
                    title="Stop generating"
                  >
                    <span className="w-3 h-3 bg-current"></span>
                  </button>
              ) : (
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={`
                      flex items-center justify-center
                      w-10 h-10 rounded-full transition-all shrink-0
                      ${
                        inputValue.trim()
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      }
                    `}
                  >
                    <Send size={18} />
                  </button>
              )}

            </div>
        </div>
      </div>

    </div>
  );
};