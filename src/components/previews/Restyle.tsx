import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Briefcase, Coffee, Zap, Feather } from "lucide-react";

export const Restyle = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始文章內容
  const [blocks, setBlocks] = useState([
    {
      id: "title",
      type: "h1",
      content: "高效團隊溝通指南"
    },
    {
      id: "p1",
      type: "p",
      content: "在現代工作環境中，溝通不僅僅是交換訊息，更是建立信任的基石。一個高效的團隊懂得如何精準地表達想法，同時也能夠專注聆聽他人的意見，確保每個人的聲音都被聽見。"
    },
    {
      id: "p2", // 演示主要段落
      type: "p",
      content: "當我們遇到意見分歧時，不要急著反駁。試著先理解對方的出發點，這能有效降低衝突的發生率。記住，我們的目標是解決問題，而不是贏得爭論。保持開放的心態對於團隊協作至關重要。"
    },
    {
      id: "p3",
      type: "p",
      content: "最後，定期給予回饋是必要的。無論是正面的鼓勵還是建設性的批評，只要出於善意並表達得當，都能幫助成員成長，讓整個團隊變得更強大。"
    }
  ]);

  // 狀態：AI 選單位置
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; blockId: string } | null>(null);
  
  // 狀態：正在生成的區塊
  const [generatingBlockId, setGeneratingBlockId] = useState<string | null>(null);

  // 定義風格選項
  const tones = [
    { id: "professional", label: "更專業", icon: <Briefcase size={12} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "casual", label: "更親切", icon: <Coffee size={12} />, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "concise", label: "更簡潔", icon: <Zap size={12} />, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { id: "literary", label: "更優雅", icon: <Feather size={12} />, color: "bg-purple-50 text-purple-600 border-purple-100" },
  ];

  // 1. 監聽選取
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !containerRef.current?.contains(selection.anchorNode)) return;

      const anchorNode = selection.anchorNode;
      const targetElement = (anchorNode?.nodeType === 3 ? anchorNode.parentElement : anchorNode) as HTMLElement;
      const blockElement = targetElement?.closest('[data-block-id]');
      
      if (!blockElement) return;
      const blockId = blockElement.getAttribute('data-block-id');
      if (!blockId) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      setMenuPosition({
        x: rect.left - containerRect.left,
        y: rect.bottom - containerRect.top + 12, // 距離文字下方 12px
        blockId: blockId
      });
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.restyle-menu')) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setMenuPosition(null);
        }
      }
    };

    const container = containerRef.current;
    if (container) container.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      if (container) container.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  // 2. 處理風格轉換 (Restyle Logic)
  const handleRestyle = (toneId: string) => {
    if (!menuPosition) return;
    const targetId = menuPosition.blockId;

    // 隱藏選單，清除選取
    setMenuPosition(null);
    window.getSelection()?.removeAllRanges();

    // 開始生成骨架屏
    setGeneratingBlockId(targetId);

    // 模擬 AI 生成不同風格的文本
    setTimeout(() => {
      setBlocks(prev => prev.map(block => {
        if (block.id === targetId) {
          let newContent = block.content;
          
          // 根據選擇的風格回傳不同的內容
          switch (toneId) {
            case "professional":
              newContent = "面對意見分歧時，應避免急於反駁。優先理解對方的觀點，能顯著降低潛在衝突。請銘記，我們的共同目標在於解決問題而非爭論勝負，維持開放的協作心態是團隊成功的關鍵要素。";
              break;
            case "casual":
              newContent = "大家意見不同的時候，先別急著說不嘛！試著站在對方的角度想一想，這樣比較不會吵架。記得喔，我們是來解決問題的，不是來吵贏的。保持輕鬆開放的心情，團隊合作才會順利！";
              break;
            case "concise":
              newContent = "遇分歧時勿急於反駁，應先理解對方以減少衝突。目標是解決問題而非爭辯，保持開放心態對協作至關重要。";
              break;
            case "literary":
              newContent = "紛爭起時，切勿急於唇槍舌戰。試著涵容他人的視角，衝突便能消弭於無形。切記，我們追尋的是問題的解答，而非勝負的快感；唯有如水般開放的心境，方能成就團隊的和諧與共榮。";
              break;
            default:
              break;
          }

          return { ...block, content: newContent };
        }
        return block;
      }));
      setGeneratingBlockId(null);
    }, 1200); // 1.2秒後完成
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-50 flex items-center justify-center overflow-hidden rounded-3xl">
      
      {/* 編輯器區域 */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-lg h-[85%] bg-white shadow-lg rounded-xl overflow-y-auto px-10 py-12 scrollbar-hide cursor-text border border-slate-100"
      >
        <div className="space-y-8">
          {blocks.map((block) => {
            
            // --- 骨架屏 (針對 Restyle 優化) ---
            if (generatingBlockId === block.id) {
              return (
                // min-h-[100px]: 因為 Restyle 通常不會大幅改變長度，所以高度設定比較保守
                <div key={block.id} className="py-1 animate-in fade-in duration-300 min-h-[100px]">
                    <div className="space-y-3 animate-pulse w-full">
                         <div className="h-4 bg-slate-200 rounded w-full"></div>
                         <div className="h-4 bg-slate-200 rounded w-[95%]"></div>
                         <div className="h-4 bg-slate-200 rounded w-[90%]"></div>
                         <div className="h-4 bg-slate-200 rounded w-[60%]"></div>
                    </div>
                </div>
              );
            }

            if (block.type === "h1") {
              return <h1 key={block.id} data-block-id={block.id} className="text-3xl font-bold text-slate-800 leading-tight">{block.content}</h1>;
            }

            const isActive = menuPosition?.blockId === block.id;

            return (
              <p 
                key={block.id} 
                data-block-id={block.id} 
                className={`
                    text-base leading-7 transition-colors duration-200 rounded-lg p-2 -m-2
                    ${isActive ? "bg-indigo-50 text-indigo-900" : "text-slate-600 hover:bg-slate-50"}
                `}
              >
                {block.content}
              </p>
            );
          })}
        </div>

        {/* --- Restyle Menu (風格選擇懸浮窗) --- */}
        {menuPosition && (
          <div 
            className="restyle-menu absolute z-50 w-[340px] animate-in slide-in-from-bottom-2 fade-in duration-200"
            style={{ 
              left: Math.min(Math.max(20, menuPosition.x - 150), 140), 
              top: menuPosition.y 
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-3 ring-1 ring-slate-100 flex flex-col gap-3">
                
                {/* 標題與關閉 */}
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Sparkles size={14} className="text-indigo-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider">調整語調</span>
                    </div>
                    <button onClick={() => setMenuPosition(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={14} />
                    </button>
                </div>

                {/* 風格選擇器 (Tone Chips) */}
                <div className="grid grid-cols-2 gap-2">
                    {tones.map((tone) => (
                        <button
                            key={tone.id}
                            onClick={() => handleRestyle(tone.id)}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all hover:scale-[1.02] active:scale-95
                                ${tone.color} bg-opacity-50 hover:bg-opacity-100 border-opacity-50 hover:border-opacity-100
                            `}
                        >
                            {tone.icon}
                            {tone.label}
                        </button>
                    ))}
                </div>

                {/* 底部輸入框 (保留自定義空間) */}
                <div className="border-t border-slate-100 pt-2 mt-1">
                    <input 
                        type="text" 
                        placeholder="或輸入自定義指令..."
                        className="w-full text-xs bg-slate-50 border-none rounded-md px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-200 placeholder:text-slate-400"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                // 這裡可以觸發自定義生成的邏輯，目前演示我們就預設用 professional
                                handleRestyle("professional"); 
                            }
                        }}
                    />
                </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};