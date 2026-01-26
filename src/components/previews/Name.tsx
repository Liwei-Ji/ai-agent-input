import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  Bot, Info, Cpu, ShieldCheck, Calendar, Edit3, Check, X
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

// 系統身份資訊
const SYSTEM_IDENTITY = {
  defaultName: "AI Agnet",
  modelName: "Gemini",
  type: "Large Language Model",
  knowledgeCutoff: "Jan 2026",
  organization: "Googloe / Demo Corp",
  safetyLevel: "Standard Filtering"
};

export const Name = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<any>(null);

  // 狀態：是否開啟身份卡片
  const [isIdentityOpen, setIsIdentityOpen] = useState(false);
  
  // 狀態：自訂名稱 (Nickname)
  const [customName, setCustomName] = useState(SYSTEM_IDENTITY.defaultName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(SYSTEM_IDENTITY.defaultName);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I am AI Agnet, a virtual assistant powered by large language models. How can I help you today?"
    }
  ]);

  // 點擊外部關閉 Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsIdentityOpen(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setCustomName(tempName);
    }
    setIsEditingName(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsGenerating(true);
    
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "As an AI, I don't have personal feelings, but I'm functioning within optimal parameters to assist you."
      }]);
      setIsGenerating(false);
    }, 1000);
  };

  const handleStop = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) handleSend();
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isGenerating]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500 ">
      
      {/* Header with Identity Interaction */}
      <div className="relative z-20 shrink-0 h-16 backdrop-blur-md flex items-center px-4 justify-between">
        
        {/* Name & Identity Trigger */}
        <div ref={dropdownRef} className="relative">
            <button 
                onClick={() => setIsIdentityOpen(!isIdentityOpen)}
                className={`
                    flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200
                    ${isIdentityOpen ? "bg-slate-100" : "hover:bg-slate-50"}
                `}
            >

                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-800">{customName}</span>
                        {/* Bot Badge */}
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            BOT
                        </span>
                    </div>
                </div>
            </button>

            {/* Identity Card / Model Card (身份證) */}
            {isIdentityOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in zoom-in-95 slide-in-from-top-2 duration-200 overflow-hidden z-50">
                    
                    {/* 背景裝飾 */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4 relative">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Identity</h3>
                        <Info size={14} className="text-slate-300" />
                    </div>

                    {/* Editable Name Section */}
                    <div className="mb-4 pb-4 border-b border-slate-100">
                        <label className="text-[10px] text-slate-500 font-medium mb-1 block">Display Name</label>
                        {isEditingName ? (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="flex-1 text-sm border border-indigo-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-100"
                                    autoFocus
                                />
                                <button onClick={handleSaveName} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14}/></button>
                                <button onClick={() => setIsEditingName(false)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14}/></button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between group">
                                <span className="text-sm font-semibold text-slate-800">{customName}</span>
                                <button 
                                    onClick={() => { setTempName(customName); setIsEditingName(true); }}
                                    className="p-1 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit3 size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Technical Specs (Transparency) */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg shrink-0"><Cpu size={14} /></div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">Model Architecture</p>
                                <p className="text-xs text-slate-700 font-medium">{SYSTEM_IDENTITY.modelName}</p>
                                <p className="text-[10px] text-slate-500">{SYSTEM_IDENTITY.type}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg shrink-0"><Calendar size={14} /></div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">Knowledge Cutoff</p>
                                <p className="text-xs text-slate-700 font-medium">{SYSTEM_IDENTITY.knowledgeCutoff}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg shrink-0"><ShieldCheck size={14} /></div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">Safety Protocols</p>
                                <p className="text-xs text-slate-700 font-medium">{SYSTEM_IDENTITY.safetyLevel}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Notice */}
                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-tight">
                        You are interacting with an AI system created by {SYSTEM_IDENTITY.organization}. Output may be inaccurate.
                    </div>

                </div>
            )}
        </div>
        
        {/* Right side actions (Placeholder) */}
        <div className="flex gap-2">
            {/* ... settings icons etc */}
        </div>
      </div>

      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8"
        >
          <div className="space-y-6">
            
            {/* System Notice (系統通知) */}
            <div className="flex justify-center mb-6">
                <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                    <Info size={14} className="text-indigo-500" />
                    <span className="text-[10px] text-slate-500">
                        This chat is powered by <strong>{SYSTEM_IDENTITY.modelName}</strong>.
                    </span>
                </div>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    

                    <div className={`
                        max-w-[90%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                        ${msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                        : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                    `}>
                        {msg.content}
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
              
              <button disabled={isGenerating} className="transition-colors shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                <Paperclip size={20} />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" />

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

              {isGenerating ? (
                  <button onClick={handleStop} className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 active:scale-90 shadow-sm">
                    <span className="w-3 h-3 bg-current"></span>
                  </button>
              ) : (
                  <button onClick={handleSend} disabled={!inputValue.trim()} className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 ${inputValue.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}>
                    <Send size={18} />
                  </button>
              )}

            </div>
        </div>
      </div>

    </div>
  );
};