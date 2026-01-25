import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Footprints as FootprintsIcon, Send, Paperclip, FileText, Database } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string; 
  footprintData?: {
    title: string;
    log: React.ReactNode;
  };
}

export const Footprints = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const timeoutRef = useRef<any>(null);

  const toggleFootprint = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Explain the core concept behind modern NLP models."
    },
    {
      id: "2",
      role: "ai",
      // AI訊息
      content: "The core concept relies heavily on the Transformer architecture, which introduced the self-attention mechanism. This allows the model to weigh the importance of different words in a sentence regardless of their distance from each other.",
      footprintData: {
        title: "Source Retrieval Log",
        // 在 Log 裡面實作紫色標籤樣式
        log: (
          <div className="flex flex-col gap-2 font-mono text-[10px]">
            <div className="flex items-center gap-2">
                <span className="text-slate-500">{">"}</span>
                <span className="text-slate-300">QUERY: "modern NLP core concepts"</span>
            </div>
            <div className="flex items-start gap-2">
                <span className="text-slate-500 mt-0.5">{">"}</span>
                <div className="flex flex-col gap-1">
                    <span className="text-slate-400">RETRIEVED_SOURCE:</span>
                    {/* 紫色樣式 */}
                    <div className="flex items-center gap-2">
                        <span className="text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer hover:bg-indigo-100 flex items-center gap-1">
                            <FileText size={10} />
                            [1] "Attention Is All You Need" (Vaswani et al.)
                        </span>
                        <span className="text-green-400 text-[9px] border border-green-900 bg-green-900/20 px-1 rounded">98% Match</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-slate-500">{">"}</span>
                <span className="text-slate-300">EXTRACTED: "Self-attention mechanism", "Transformer"</span>
            </div>
          </div>
        )
      }
    }
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsGenerating(true);
    
    // 模擬生成過程
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Based on the Q3 Financial Report, the revenue grew by 15% YoY. However, market analysis suggests a potential slowdown in Q4 due to supply chain constraints.",
        footprintData: {
          title: "Data Verification Trace",
          log: (
            <div className="flex flex-col gap-2 font-mono text-[10px]">
                {/* 第一個來源 */}
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 mt-0.5">{">"}</span>
                    <div className="flex flex-col gap-1">
                        <span className="text-slate-400">SOURCE CHECK 1:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer hover:bg-indigo-100 flex items-center gap-1">
                                <Database size={10} />
                                [1] Internal_DB/Financials/2023_Q3.pdf
                            </span>
                        </div>
                        <span className="text-slate-500 pl-1">↳ Data: "Revenue: +15% YoY"</span>
                    </div>
                </div>

                {/* 第二個來源 */}
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 mt-0.5">{">"}</span>
                    <div className="flex flex-col gap-1">
                        <span className="text-slate-400">SOURCE CHECK 2:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer hover:bg-indigo-100 flex items-center gap-1">
                                <Database size={10} />
                                [2] Bloomberg/Market_Analysis_Oct.json
                            </span>
                        </div>
                        <span className="text-slate-500 pl-1">↳ Data: "Outlook: Bearish (Supply Chain)"</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-800 pt-1 mt-1">
                    <span className="text-green-500">{">"}</span>
                    <span className="text-green-400">FINAL: Cross-reference verification complete.</span>
                </div>
            </div>
          )
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
              <div key={msg.id} className="flex flex-col gap-2">
                
                {/* Footprints Block (Processing Trace) */}
                {msg.role === "ai" && msg.footprintData && (
                  <div className="max-w-[90%]">
                    
                    {/* Header Button */}
                    <button 
                      onClick={() => toggleFootprint(msg.id)}
                      className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors py-1 group"
                    >
                        <div className={`
                            p-1 rounded flex items-center justify-center transition-colors
                            ${expandedIds.includes(msg.id) ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 group-hover:bg-indigo-50"}
                        `}>
                            <FootprintsIcon size={12} />
                        </div>
                        <span>{msg.footprintData.title}</span>
                        {expandedIds.includes(msg.id) ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </button>

                    {/* Expanded Content (Log) - 直接渲染 ReactNode，不再使用 pre */}
                    {expandedIds.includes(msg.id) && (
                        <div className="mt-2 p-3 rounded-lg bg-slate-900 border border-slate-800 animate-in slide-in-from-top-2 fade-in duration-300 shadow-inner">
                             {/* 直接渲染 JSX 內容 */}
                             {msg.footprintData.log}
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