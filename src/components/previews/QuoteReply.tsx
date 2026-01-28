import { useState, useRef, useEffect } from "react";
import { Send, MessageSquarePlus, X, Quote } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export const QuoteReply = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "設計直觀的交互流程可以大幅提升用戶體驗。通過將複雜的操作拆分為清晰、簡單的步驟，設計師能夠幫助用戶快速理解系統，提高完成任務的效率."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  
  // 狀態：選取工具列的位置與內容
  const [selectionTooltip, setSelectionTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  
  // 狀態：被引用的文字
  const [activeQuote, setActiveQuote] = useState<string | null>(null);

  const [isComposing, setIsComposing] = useState(false);

  // 監聽文字選取
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || !containerRef.current?.contains(selection.anchorNode)) {
        return; 
      }

      const text = selection.toString().trim();
      if (!text) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      setSelectionTooltip({
        x: rect.left - containerRect.left + (rect.width / 2),
        y: rect.top - containerRect.top - 10, 
        text: text
      });
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectionTooltip(null);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleMouseUp);
    }
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      if (container) container.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  // 點擊「詢問 AI」
  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectionTooltip) {
      setActiveQuote(selectionTooltip.text);
      setSelectionTooltip(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() && !activeQuote) return;
    
    let fullText = inputValue;
    if (activeQuote) {
        fullText = `> ${activeQuote}\n\n${inputValue}`;
    }

    const newMsg: Message = { id: Date.now().toString(), role: "user", text: fullText };
    setMessages(prev => [...prev, newMsg]);
    
    setInputValue("");
    setActiveQuote(null);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "這個問題很重要：為什麼要拆分操作？原因在於，用戶的認知負荷有限。將界面拆成易於理解的小模塊，可以讓用戶在使用時感到流暢，而不是被信息量淹沒."
      }]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, activeQuote]);

  return (
    //  Flexbox 結構 (flex flex-col)
    <div ref={containerRef} className="relative w-full h-full min-h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 捲動區域：自動佔滿剩餘空間 */}
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

          {/* Floating Tooltip (位置跟隨文字，所以放哪裡都可以，放這裡結構清晰) */}
          {selectionTooltip && (
            <div 
                className="absolute z-50 transform -translate-x-1/2 -translate-y-full px-1 py-1"
                style={{ left: selectionTooltip.x, top: selectionTooltip.y }}
            >
                <button 
                    onClick={handleQuoteClick}
                    className="flex items-center gap-2 bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl hover:bg-slate-700 hover:scale-105 transition-all animate-in zoom-in duration-200"
                >
                    <Quote size={12} className="text-slate-300" />
                    <span>詢問 AI</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </button>
            </div>
          )}

          {/* 底部輸入區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 relative z-20">
            
            {/* 外層容器：
               1. 負責 Border, Shadow, Rounded
               2. flex-col: 讓引用區塊和輸入框垂直排列
               3. focus-within: 當點擊輸入框時，整個大框框發光
            */}
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
                
                {/* A. 引用卡片區塊 (移到內部) */}
                {activeQuote && (
                    <div className="relative flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5 pr-8 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        {/* icon */}
                        <div className="shrink-0 mt-0.5 text-slate-400">
                            <MessageSquarePlus size={16} />
                        </div>
                        {/* text content */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-slate-500 mb-0.5 uppercase tracking-wide">
                                Referencing
                            </div>
                            <p className="text-xs text-slate-700 line-clamp-2 italic font-medium">
                                "{activeQuote}"
                            </p>
                        </div>
                        {/* close button */}
                        <button 
                          onClick={() => setActiveQuote(null)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* B. 輸入行 (Input + Button) */}
                <div className="flex items-center gap-2 ">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      placeholder={activeQuote ? "Ask about this text..." : "Ask any question..."}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-8 pl-2"
                    />

                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() && !activeQuote}
                      className={`
                        p-2 rounded-full transition-all
                        ${(inputValue.trim() || activeQuote)
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
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
    </div>
  );
};