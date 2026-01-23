import { useState, useRef, useEffect } from "react";
import { Send, Wand2, Square } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export const InlineAction = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const longText = "React's component-based architecture allows for efficient code reuse. By breaking down complex UIs into smaller, manageable pieces, developers can maintain and scale applications more effectively. This modular approach significantly reduces technical debt over time.";
  const shortText = "React's component-based architecture enables efficient code reuse and scalability by modularizing complex UIs.";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: longText
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectionTooltip, setSelectionTooltip] = useState<{ x: number; y: number } | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // 1. 監聽文字選取
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      
      // 基本檢查：是否有選取、是否在容器內
      if (!selection || selection.isCollapsed || !containerRef.current?.contains(selection.anchorNode)) {
        return; 
      }

      // --- 修改重點：檢查選取內容的來源 ---
      const anchorNode = selection.anchorNode;
      // 獲取元素節點 (如果是文字節點，取其父層)
      const targetElement = (anchorNode?.nodeType === 3 ? anchorNode.parentElement : anchorNode) as HTMLElement;
      
      // 往上尋找帶有 data-role 的容器
      const messageContainer = targetElement?.closest('[data-role]');
      
      // 如果找不到容器，或者容器的角色不是 'ai'，就不顯示工具列
      if (!messageContainer || messageContainer.getAttribute('data-role') !== 'ai') {
        // 如果選到 User 的，順便清除選取以免混淆 (可選)
        // window.getSelection()?.removeAllRanges();
        return;
      }
      // -------------------------------------

      const text = selection.toString().trim();
      if (!text) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      setSelectionTooltip({
        x: rect.left - containerRect.left + (rect.width / 2),
        y: rect.top - containerRect.top - 10, 
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

  // 2. 執行「使其更簡潔」
  const handleMakeConcise = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectionTooltip(null);
    window.getSelection()?.removeAllRanges();

    setIsRegenerating(true);

    timerRef.current = window.setTimeout(() => {
        completeRegeneration();
    }, 1500);
  };

  const completeRegeneration = () => {
      setMessages(prev => prev.map(m => 
          m.role === "ai" ? { ...m, text: shortText } : m
      ));
      setIsRegenerating(false);
      timerRef.current = null;
  };

  const handleStop = () => {
      if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
      }
      completeRegeneration();
  };

  const handleSend = () => {
    if (isRegenerating) {
        handleStop();
        return;
    }

    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500 bg-white">
      
      {/* 捲動區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col">
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-12"
        >
            <div className="space-y-6">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    // --- 修改重點：在這裡加上 data-role 屬性 ---
                    data-role={msg.role}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                
                {msg.role === "ai" ? (
                    <div className="max-w-[95%] w-full">
                        {isRegenerating ? (
                            // 4段骨架屏
                            <div className="space-y-2.5 animate-pulse w-full max-w-[95%] py-2">
                                <div className="h-4 bg-slate-200 rounded-md w-[98%]"></div>
                                <div className="h-4 bg-slate-200 rounded-md w-[95%]"></div>
                                <div className="h-4 bg-slate-200 rounded-md w-[92%]"></div>
                                <div className="h-4 bg-slate-200 rounded-md w-[85%]"></div>
                                <div className="h-4 bg-slate-200 rounded-md w-[80%]"></div>
                            </div>
                        ) : (
                            <div className="text-slate-700 text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500 selection:bg-indigo-100 selection:text-indigo-900">
                                {msg.text}
                            </div>
                        )}
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

        {/* Floating Tooltip */}
        {selectionTooltip && !isRegenerating && (
            <div 
                className="absolute z-50 transform -translate-x-1/2 -translate-y-full px-1 py-1"
                style={{ left: selectionTooltip.x, top: selectionTooltip.y }}
            >
                <button 
                    onClick={handleMakeConcise}
                    className="flex items-center gap-2 bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl hover:bg-slate-700 hover:scale-105 transition-all animate-in zoom-in duration-200 border border-slate-700"
                >
                    <Wand2 size={12} className="text-indigo-300" />
                    <span>使其更簡潔</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </button>
            </div>
        )}

        {/* 底部輸入區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 relative z-20">
            <div className="relative flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    disabled={isRegenerating}
                    placeholder={isRegenerating ? "AI is working..." : "Ask any question..."}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-8 pl-2 disabled:cursor-wait"
                />

                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() && !isRegenerating}
                    className={`
                        p-2 rounded-full transition-all duration-200
                        ${(inputValue.trim() || isRegenerating)
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }
                    `}
                >
                    {isRegenerating ? (
                        <div className="w-[18px] h-[18px] flex items-center justify-center">
                             <Square size={14} fill="currentColor" className="animate-in zoom-in duration-200" />
                        </div>
                    ) : (
                        <Send size={18} className="animate-in zoom-in duration-200" />
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};