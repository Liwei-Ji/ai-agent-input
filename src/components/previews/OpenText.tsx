import { useState, useRef, useEffect } from "react";
import { Send, Upload, Globe, Microscope } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export const OpenText = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "I have access to real-time data, research tools, and file analysis. How can I assist you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // 修改 2: 預設為空陣列 (沒有按鈕被點擊)
  const [activeTools, setActiveTools] = useState<string[]>([]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "I'm processing your request using the selected tools..."
      }]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTool = (tool: string) => {
    setActiveTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500 bg-white">
      
      {/* 捲動區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-12"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" ? (
                  <div className="max-w-[95%] text-slate-700 text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 selection:bg-indigo-200 selection:text-indigo-900">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[90%] p-4 text-sm leading-7 rounded-2xl rounded-br-sm shadow-sm whitespace-pre-wrap bg-blue-600 text-white">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入區 */}
        <div className="shrink-0 pt-2 pb-6 px-4 relative z-20">
            
            {/* 加高的輸入框容器 */}
            <div className={`
                flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-300
                ${inputValue.trim() || activeTools.length > 0 ? "border-indigo-200 ring-2 ring-indigo-50" : "border-gray-200"}
                focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400
            `}>
                
                {/* 1. 上層：文字輸入區 */}
                <div className="p-3">
                    <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        placeholder="Ask anything..."
                        className="w-full min-h-[60px] max-h-[120px] bg-transparent text-sm outline-none placeholder:text-slate-400 resize-none scrollbar-none"
                        rows={2}
                    />
                </div>

                {/* 2. 下層：工具按鈕列 */}
                <div className="flex items-center justify-between px-2 pb-2">
                    
                    {/* 左側：三個功能按鈕 */}
                    <div className="flex items-center gap-1">
                        
                        {/* Button 1: Upload */}
                        <button 
                            onClick={() => toggleTool("upload")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 border ${activeTools.includes("upload") ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-white text-slate-500 border-transparent hover:bg-slate-100"}`}
                        >
                            <Upload size={14} />
                            <span>Upload</span>
                        </button>

                        {/* Button 2: Research */}
                        <button 
                            onClick={() => toggleTool("research")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 border ${activeTools.includes("research") ? "bg-sky-50 text-sky-600 border-sky-100" : "bg-white text-slate-500 border-transparent hover:bg-slate-100"}`}
                        >
                            <Microscope size={14} />
                            <span>Research</span>
                        </button>

                        {/* Button 3: All Sources */}
                        <button 
                            onClick={() => toggleTool("sources")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 border ${activeTools.includes("sources") ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-slate-500 border-transparent hover:bg-slate-100"}`}
                        >
                            <Globe size={14} />
                            <span>All sources</span>
                        </button>

                    </div>

                    {/* 右側：發送按鈕 */}
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className={`
                            p-2 rounded-full transition-all duration-200
                            ${inputValue.trim() 
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }
                        `}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};