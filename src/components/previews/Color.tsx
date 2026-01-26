import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  Search, Globe, ChevronRight, BookOpen
} from "lucide-react";

// 定義來源卡片結構
interface SourceCard {
  id: string;
  sourceName: string; // 例如: NN/g, Wikipedia
  title: string;
  url: string;
  snippet: string;
  icon?: React.ReactNode;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: React.ReactNode; // 支援 JSX 以呈現 Highlight
  sources?: SourceCard[];   // 來源卡片
}

export const Color = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "What is the 'F-Shaped Pattern' in web design?"
    },
    {
      id: "2",
      role: "ai",
      content: (
        <span>
          The F-Shaped Pattern describes the most common user eye-scanning patterns when it comes to blocks of content. Users first read in a <span className="bg-purple-100 text-slate-900 border-b-2 border-purple-300 px-1 mx-0.5 rounded-sm font-medium">horizontal movement across the upper part</span> of the content area. Next, they move down the page a bit and read across in a second horizontal movement. Finally, users scan the content's left side in a vertical movement.
        </span>
      ),
      sources: [
        {
          id: "s1",
          sourceName: "Nielsen Norman Group",
          title: "F-Shaped Pattern For Reading Web Content",
          url: "nngroup.com",
          snippet: "Eyetracking visualizations show that users often read Web pages in an F-shaped pattern...",
          icon: <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] font-bold text-black">N</div>
        },
        {
          id: "s2",
          sourceName: "Interaction Design Org",
          title: "Visual Hierarchy and F-Patterns",
          url: "interaction-design.org",
          snippet: "Understanding how the F-pattern works allows designers to create better visual hierarchy...",
          icon: <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white">Ix</div>
        }
      ]
    }
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsGenerating(true);
    
    // 模擬生成過程 (搜尋 -> 整理 -> 回覆)
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        // 這裡展示另一個 UX 相關的範例：Hick's Law
        content: (
            <span>
                Hick's Law states that <span className="bg-purple-100 text-slate-900 border-b-2 border-purple-300 px-1 mx-0.5 rounded-sm font-medium">the time it takes to make a decision increases with the number and complexity of choices</span>. In UI design, this implies that simplifying options can reduce the cognitive load for users.
            </span>
        ),
        sources: [
          {
            id: "s3",
            sourceName: "Laws of UX",
            title: "Hick's Law - Laws of UX",
            url: "lawsofux.com",
            snippet: "The time it takes to make a decision increases with the number and complexity of choices.",
            icon: <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-[8px] font-bold text-white">L</div>
          },
           {
            id: "s4",
            sourceName: "Wikipedia",
            title: "Hick's law - Wikipedia",
            url: "wikipedia.org",
            snippet: "Hick's law, or the Hick–Hyman law, describes the time it takes for a person to make a decision...",
            icon: <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-700">W</div>
          }
        ]
      }]);
      setIsGenerating(false);
    }, 2000);
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
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8"
        >
          <div className="space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                
                {/* 1. 訊息本體 */}
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[95%] p-4 text-sm leading-7 rounded-2xl
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                      : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                  `}>
                    {msg.content}
                  </div>
                </div>

                {/* 2. 來源卡片 (Source Cards) - 僅 AI 且有來源時顯示 */}
                {msg.role === "ai" && msg.sources && (
                    <div className="ml-0 w-full overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
                        {/* 這裡使用橫向捲動容器，模仿搜尋結果卡片 */}
                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent snap-x">
                            {msg.sources.map((source) => (
                                <a 
                                    key={source.id}
                                    href="#" // 實際應為 source.url
                                    className="snap-start shrink-0 w-[240px] bg-slate-50 border border-slate-100 rounded-2xl p-3 hover:bg-slate-100 hover:border-slate-200 transition-all group cursor-pointer"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center gap-2 mb-2">
                                        {source.icon || <Globe size={14} className="text-slate-400" />}
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-[10px] font-semibold text-slate-700 truncate">{source.sourceName}</span>
                                            <span className="text-[9px] text-slate-400 truncate">{source.url}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Card Title */}
                                    <div className="mb-1">
                                        <h4 className="text-xs font-medium text-blue-600 group-hover:underline line-clamp-1">
                                            {source.title}
                                        </h4>
                                    </div>

                                    {/* Card Snippet */}
                                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                                        {source.snippet}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

              </div>
            ))}
            
            {/* 模擬生成中的狀態 (顯示正在搜尋) */}
            {isGenerating && (
                <div className="flex items-center gap-2 text-slate-400 text-xs ml-0 animate-pulse">
                    <Search size={14} className="animate-bounce" />
                    <span>Searching for information...</span>
                </div>
            )}
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