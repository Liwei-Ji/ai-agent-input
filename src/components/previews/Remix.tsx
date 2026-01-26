import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowUp, X, AlignLeft } from "lucide-react";

export const Remix = () => {
  const containerRef = useRef<HTMLDivElement>(null);

// 初始文章內容
  const [blocks, setBlocks] = useState([
    {
      id: "title",
      type: "h1",
      content: "數位極簡主義的藝術"
    },
    {
      id: "p1",
      type: "p",
      content: "數位極簡主義並非完全拒絕科技，而是主張有意識地使用科技。這是一種生活哲學，幫助你重新審視哪些數位工具（以及隨之而來的行為）能真正為你的生活帶來價值。它鼓勵你剝離那些無意義的數位雜訊，找回生活的掌控權。"
    },
    {
      id: "p2",
      type: "p",
      content: "透過清除低價值的數位干擾，你將為更有意義的活動騰出空間。這可能意味著重拾被碎片化的休閒時光、進入更深層的工作心流狀態，或者是單純地更專注於當下，與身邊的人建立真實的連結。"
    },
    {
      id: "p3", 
      type: "p",
      content: "從清理你的設備開始吧。刪除那些你不曾使用的應用程式，關閉非必要的推播通知，並整理你的檔案資料夾。這能創造一個更平靜的數位環境。"
    }
  ]);

  const [aiInput, setAiInput] = useState<{ x: number; y: number; blockId: string } | null>(null);
  const [generatingBlockId, setGeneratingBlockId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  // 監聽文字選取
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed || !containerRef.current?.contains(selection.anchorNode)) {
        return; 
      }

      const anchorNode = selection.anchorNode;
      const targetElement = (anchorNode?.nodeType === 3 ? anchorNode.parentElement : anchorNode) as HTMLElement;
      const blockElement = targetElement?.closest('[data-block-id]');
      
      if (!blockElement) return;
      const blockId = blockElement.getAttribute('data-block-id');
      if (!blockId) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      setAiInput({
        x: rect.left - containerRect.left,
        y: rect.bottom - containerRect.top + 10, 
        blockId: blockId
      });
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.ai-input-popup')) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setAiInput(null);
        }
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

  // 處理發送
  const handleRemix = () => {
    if (!aiInput || !inputValue.trim()) return;

    const targetId = aiInput.blockId;
    
    setAiInput(null);
    setInputValue("");
    window.getSelection()?.removeAllRanges();

    setGeneratingBlockId(targetId);

    // 模擬生成時間
    setTimeout(() => {
      setBlocks(prev => prev.map(block => {
        if (block.id === targetId) {
          return {
            ...block,
            // 生成的新文字：中文版，長度控制在 4-5 行，確保填滿骨架屏
            content: "藉由有意識地移除低價值的數位干擾，你為深度的互動創造了顯著的空間。這種轉變讓你能重拾零碎的休閒時間，加深對高影響力工作的專注，並與身邊的人建立更真誠的連結，從而培養出更豐富、更具質量的人際關係與生活體驗。" 
          };
        }
        return block;
      }));
      setGeneratingBlockId(null); 
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRemix();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center overflow-hidden rounded-3xl">
      
      {/* 編輯器容器 */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-lg h-[85%] bg-white shadow-xl rounded-xl overflow-y-auto px-10 py-12 scrollbar-hide cursor-text"
      >
        
        {/* 維持 space-y-10 (40px) 以保持良好的段落呼吸感 */}
        <div className="space-y-10">
          {blocks.map((block) => {
            
            // --- 骨架屏 ---
            if (generatingBlockId === block.id) {
              return (
                <div key={block.id} className="py-1 animate-in fade-in duration-300 min-h-[140px]">
                    <div className="space-y-3 animate-pulse w-full">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-[98%]"></div>
                        <div className="h-4 bg-slate-200 rounded w-[95%]"></div>
                        <div className="h-4 bg-slate-200 rounded w-[92%]"></div>
                        <div className="h-4 bg-slate-200 rounded w-[60%]"></div>
                    </div>
                </div>
              );
            }

            // 標題
            if (block.type === "h1") {
              return (
                <h1 key={block.id} data-block-id={block.id} className="text-3xl font-bold text-slate-800 leading-tight">
                  {block.content}
                </h1>
              );
            }
            
            // --- 一般段落 ---
            const isActive = aiInput?.blockId === block.id;

            return (
              <p 
                key={block.id} 
                data-block-id={block.id} 
                // 維持 leading-8 (32px) 與 p-2 -m-2 的設定
                className={`
                    text-base leading-8 transition-colors duration-200 rounded-lg p-2 -m-2
                    ${isActive ? "bg-indigo-50 text-indigo-900" : "text-slate-600 hover:bg-slate-50"}
                    selection:bg-indigo-200 selection:text-indigo-900
                `}
              >
                {block.content}
              </p>
            );
          })}
        </div>

        {/* Floating AI Input (懸浮指令框) */}
        {aiInput && (
          <div 
            className="ai-input-popup absolute z-50 w-[320px] animate-in slide-in-from-bottom-2 fade-in duration-200"
            style={{ 
              left: Math.min(Math.max(20, aiInput.x - 140), 160), 
              top: aiInput.y 
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-2 flex flex-col gap-2 ring-1 ring-slate-100">
                <div className="flex items-center gap-2 px-1">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Sparkles size={14} />
                    </div>
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="請 AI 編輯或重新生成..."
                        className="flex-1 text-sm outline-none placeholder:text-slate-400 text-slate-700 h-8"
                        autoFocus 
                    />
                    <button 
                        onClick={() => setAiInput(null)}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-md transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {inputValue.length === 0 && (
                    <div className="border-t border-slate-100 pt-1 flex flex-col gap-0.5">
                         <button onClick={() => { setInputValue("潤飾文筆"); handleRemix(); }} className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors text-left w-full">
                            <Sparkles size={12} className="opacity-50" />
                            潤飾文筆
                         </button>
                         <button onClick={() => { setInputValue("修正拼寫與語法"); handleRemix(); }} className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors text-left w-full">
                            <AlignLeft size={12} className="opacity-50" />
                            修正拼寫與語法
                         </button>
                    </div>
                )}
                
                {inputValue.length > 0 && (
                    <div className="border-t border-slate-100 pt-1 px-1 flex justify-end">
                        <button 
                            onClick={handleRemix}
                            className="w-6 h-6 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-sm"
                        >
                            <ArrowUp size={14} />
                        </button>
                    </div>
                )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};