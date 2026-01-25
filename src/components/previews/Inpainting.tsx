import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  Wand2, X, RotateCw, MoveHorizontal, AlignLeft
} from "lucide-react";

// 定義 Inpainting 的狀態介面
interface InpaintingState {
  messageId: string;       // 正在編輯哪條訊息
  selectedText: string;    // 選取的文字內容
  startIndex: number;      // 選取文字在原文中的起始位置
  endIndex: number;        // 選取文字在原文中的結束位置
  popoverPosition: { top: number; left: number } | null; // 浮動工具列位置
  isRegeneratingSlice: boolean; // 是否正在重生選取區塊
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

// 模擬針對特定片段的重寫結果
const MOCK_REWRITES: Record<string, string> = {
  "It features a robust aluminum chassis designed for durability.": 
  "It is encased in a aerospace-grade aluminum unibody for unmatched structural rigidity.",
  
  "The battery lasts for about 20 hours on a single charge.":
  "Enjoy all-day freedom with staggering 20-hour battery life that keeps up with your busiest days.",
};

export const Inpainting = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 用來計算選取位置的 Ref
  const messageTextRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<any>(null);

  // Inpainting 核心狀態
  const [inpaintingState, setInpaintingState] = useState<InpaintingState | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Write a short product description for a new premium laptop."
    },
    {
      id: "2",
      role: "ai",
      // 這是一段故意寫得有點平淡，讓使用者想修改的文字
      content: "Introducing the ApexBook Pro. It features a robust aluminum chassis designed for durability. The display is a stunning 4K OLED panel with vibrant colors. The battery lasts for about 20 hours on a single charge. It's the ultimate tool for professionals."
    }
  ]);

  // --- 核心邏輯：處理文字選取 ---
  const handleTextSelection = (messageId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !messageTextRef.current) {
      // 如果沒選到東西，或點擊了其他地方，關閉工具列 (除非正在生成中)
      if (inpaintingState && !inpaintingState.isRegeneratingSlice) {
          setInpaintingState(null);
      }
      return;
    }

    const text = selection.toString();
    if (text.trim().length < 5) return; // 太短不處理

    // 取得選取範圍的座標，用於定位工具列
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = scrollContainerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;

    // 計算相對於容器的座標
    const top = rect.top - containerRect.top - 50; // 往上偏移顯示工具列
    const left = rect.left - containerRect.left + (rect.width / 2); // 水平置中

    // 找出選取文字在原始完整字串中的位置
    // 注意：這是一個簡化的查找方式，實際專案可能需要更複雜的 DOM Range 對應
    const fullText = messages.find(m => m.id === messageId)?.content || "";
    const startIndex = fullText.indexOf(text);
    
    if (startIndex === -1) return;

    setInpaintingState({
      messageId,
      selectedText: text,
      startIndex: startIndex,
      endIndex: startIndex + text.length,
      popoverPosition: { top, left },
      isRegeneratingSlice: false
    });
  };

  // --- 核心邏輯：執行局部重繪 ---
  const handleInpaintRegenerate = async () => {
    if (!inpaintingState) return;

    // 1. 設定為局部生成狀態 (隱藏工具列，顯示行內骨架屏)
    setInpaintingState(prev => prev ? ({ ...prev, isRegeneratingSlice: true, popoverPosition: null }) : null);
    // 清除瀏覽器的選取反白，避免視覺干擾
    window.getSelection()?.removeAllRanges();

    // 模擬 API 延遲 (1.5秒)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMessages(prev => {
      const targetMsg = prev.find(m => m.id === inpaintingState.messageId);
      if (!targetMsg) return prev;

      const originalContent = targetMsg.content;
      const prefix = originalContent.substring(0, inpaintingState.startIndex);
      const suffix = originalContent.substring(inpaintingState.endIndex);
      
      // 取得模擬的新片段，如果沒有對應的就用一個預設的
      const newSlice = MOCK_REWRITES[inpaintingState.selectedText.trim()] || " (Rewritten clearer and more engagingly) ";

      // 組合新訊息
      const newContent = prefix + newSlice + suffix;

      return prev.map(msg => msg.id === inpaintingState.messageId ? { ...msg, content: newContent } : msg);
    });

    // 2. 重置 Inpainting 狀態
    setInpaintingState(null);
  };

  const cancelInpainting = () => {
    setInpaintingState(null);
    window.getSelection()?.removeAllRanges();
  };

  // --- 標準聊天邏輯 ---
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
            content: "I received your request."
        }]);
        setIsGenerating(false);
    }, 1000);
  };
  const handleStop = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setIsGenerating(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!isGenerating) handleSend(); }};

  useEffect(() => {
    if (scrollContainerRef.current && !inpaintingState?.isRegeneratingSlice) {
      scrollContainerRef.current.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isGenerating, inpaintingState?.isRegeneratingSlice]);


  // --- 渲染輔助函數：處理行內骨架屏 ---
  const renderAiMessageContent = (msg: Message) => {
    // 如果這條訊息正在進行局部重繪
    if (inpaintingState && inpaintingState.messageId === msg.id && inpaintingState.isRegeneratingSlice) {
      const prefix = msg.content.substring(0, inpaintingState.startIndex);
      const suffix = msg.content.substring(inpaintingState.endIndex);

      return (
        <span>
          {prefix}
          {/* 行內骨架屏 (Inline Skeleton) */}
          <span className="inline-flex items-center mx-1 bg-indigo-50 px-2 py-0.5 rounded animate-pulse text-transparent relative top-[2px]">
            <span className="h-3 w-24 bg-indigo-200/50 rounded inline-block"></span>
          </span>
          {suffix}
        </span>
      );
    }
    // 否則顯示正常文字
    return msg.content;
  };


  return (
    // 外層需要 relative 以便定位浮動工具列
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500 ">
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col relative">
        
        {/* 訊息顯示區 */}
        <div 
          ref={scrollContainerRef}
          // 綁定 onMouseUp 到容器上來偵測選取行為
          onMouseUp={() => handleTextSelection("2")} // 這裡簡化：假設只偵測 ID 為 "2" 的 AI 訊息
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8 relative"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {/* AI 訊息容器，加上 ref 用於計算位置 */}
                  <div 
                    ref={msg.role === "ai" ? messageTextRef : null}
                    className={`
                    max-w-[95%] p-4 text-sm leading-8 rounded-2xl whitespace-pre-wrap
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                      : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0 selection:bg-indigo-100 selection:text-indigo-900"} 
                  `}>
                    {/* 使用自訂渲染函數來處理行內骨架屏 */}
                    {renderAiMessageContent(msg)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Floating Inpainting Toolbar (浮動工具列) --- */}
          {inpaintingState && inpaintingState.popoverPosition && (
            <div 
              className="absolute z-20 flex items-center gap-1 p-1 bg-white rounded-xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200"
              style={{
                top: inpaintingState.popoverPosition.top,
                left: inpaintingState.popoverPosition.left,
                transform: "translateX(-50%)" // 讓 left 定位在元素中心
              }}
            >
              {/* 主要動作：Regenerate */}
              <button
                onClick={handleInpaintRegenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Wand2 size={14} />
                Regenerate selection
              </button>

              {/* 其他模擬動作 (僅展示 UI) */}
              <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
              <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Make longer">
                <MoveHorizontal size={16} />
              </button>
              <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Change tone">
                <AlignLeft size={16} />
              </button>

              {/* 關閉按鈕 */}
              <button 
                onClick={cancelInpainting}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-1"
              >
                <X size={16} />
              </button>

            </div>
          )}

        </div>

        {/* 底部輸入控制區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 z-10">
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all duration-300
                ${isGenerating || inpaintingState?.isRegeneratingSlice
                    ? "border-slate-200 bg-white" 
                    : "border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
                }
            `}>
              <button disabled={isGenerating} className="transition-colors shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600"><Paperclip size={20} /></button>
              <input ref={fileInputRef} type="file" className="hidden" />
              <div className="flex-1 relative h-10 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating || inpaintingState?.isRegeneratingSlice}
                  placeholder={(isGenerating || inpaintingState?.isRegeneratingSlice) ? "AI is modifying..." : "Ask any question..."}
                  className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10"
                />
              </div>
              {isGenerating ? (<button onClick={handleStop} className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 active:scale-90 shadow-sm"><span className="w-3 h-3 bg-current"></span></button>) : (<button onClick={handleSend} disabled={!inputValue.trim()} className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 ${inputValue.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}><Send size={18} /></button>)}
            </div>
        </div>
      </div>

    </div>
  );
};