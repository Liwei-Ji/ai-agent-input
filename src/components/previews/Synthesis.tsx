import { useState, useRef } from "react";
import { Sparkles, MousePointer2, Layers, X, Wand2 } from "lucide-react";

// 定義便利貼資料結構
interface Note {
  id: string;
  content: string;
  color: string;
  // 散亂位置
  initialX: number;
  initialY: number;
  rotation: number;
  // 分類後的位置
  groupedX: number;
  groupedY: number;
  category?: string; // 分類標籤
}

export const Synthesis = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 定義 6 張便利貼 (關於 UX 研究)
  const notesData: Note[] = [
    { 
      id: "n1", content: "使用者覺得結帳流程太繁瑣，步驟過多", color: "bg-yellow-100", 
      initialX: 40, initialY: 60, rotation: -2,
      groupedX: 40, groupedY: 100, category: "痛點分析"
    },
    { 
      id: "n2", content: "希望能支援 Apple Pay 或 Line Pay 快速付款", color: "bg-green-100", 
      initialX: 200, initialY: 40, rotation: 3,
      groupedX: 220, groupedY: 100, category: "功能需求"
    },
    { 
      id: "n3", content: "目前的字體太小，在手機上閱讀很吃力", color: "bg-yellow-100", 
      initialX: 340, initialY: 80, rotation: -1,
      groupedX: 40, groupedY: 220, category: "痛點分析"
    },
    { 
      id: "n4", content: "建議增加「我的收藏」功能，方便稍後購買", color: "bg-green-100", 
      initialX: 100, initialY: 200, rotation: 4,
      groupedX: 220, groupedY: 220, category: "功能需求"
    },
    { 
      id: "n5", content: "找不到客服入口，遇到問題無法即時解決", color: "bg-yellow-100", 
      initialX: 280, initialY: 240, rotation: -3,
      groupedX: 40, groupedY: 340, category: "痛點分析"
    },
    { 
      id: "n6", content: "希望有訂單狀態的即時推播通知", color: "bg-green-100", 
      initialX: 420, initialY: 180, rotation: 2,
      groupedX: 220, groupedY: 340, category: "功能需求"
    },
  ];

  // 狀態機: 'idle' (閒置) -> 'selected' (已框選) -> 'processing' (AI處理中) -> 'synthesized' (已分類)
  const [status, setStatus] = useState<"idle" | "selected" | "processing" | "synthesized">("idle");

  // 模擬框選動作
  const handleSelect = () => {
    if (status === "idle") {
      setStatus("selected");
    }
  };

  // 執行 Synthesis
  const handleSynthesis = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus("processing");

    // 模擬 AI 處理時間 (2秒)
    setTimeout(() => {
      setStatus("synthesized");
    }, 2000);
  };

  // 重置 (方便重複測試)
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
  };

  return (
    <div 
      className="relative w-full h-full min-h-[500px] bg-slate-50 overflow-hidden rounded-3xl select-none cursor-default group"
      onClick={handleSelect} // 點擊畫布任意處模擬「框選完成」
    >
      
      {/* 背景網格裝飾 */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }}></div>

      {/* 提示文字 */}
      {status === "idle" && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-slate-400 text-xs animate-pulse pointer-events-none">
          點擊畫布以模擬「框選便利貼」
        </div>
      )}

      {/* --- 1. 便利貼渲染層 --- */}
      <div className="relative w-full h-full">
        {notesData.map((note) => {
          // 決定位置：根據狀態切換 initialX 或 groupedX
          const x = status === "synthesized" ? note.groupedX : note.initialX;
          const y = status === "synthesized" ? note.groupedY : note.initialY;
          const rotate = status === "synthesized" ? 0 : note.rotation; // 分類後轉正

          return (
            <div
              key={note.id}
              className={`
                absolute w-[160px] p-4 shadow-md transition-all duration-700 ease-in-out border border-black/5
                ${status === "selected" ? "ring-2 ring-indigo-400 ring-offset-2" : ""}
                ${note.color}
              `}
              style={{
                left: x,
                top: y,
                transform: `rotate(${rotate}deg)`,
              }}
            >
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {note.content}
              </p>
            </div>
          );
        })}

        {/* --- 分類標題 (僅在 Synthesized 狀態顯示) --- */}
        {status === "synthesized" && (
            <>
                <div className="absolute left-[40px] top-[70px] animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold border border-yellow-200">
                        🔥 痛點分析
                    </span>
                </div>
                <div className="absolute left-[220px] top-[70px] animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold border border-green-200">
                        ✨ 功能需求
                    </span>
                </div>
            </>
        )}
      </div>

      {/* --- 2. 模擬框選範圍 (Bounding Box) --- */}
      {status === "selected" && (
        <div className="absolute border-2 border-indigo-500 border-dashed rounded-xl pointer-events-none bg-indigo-500/5 animate-in fade-in duration-200"
             style={{ left: 30, top: 30, width: 480, height: 350 }}
        >
            {/* 模擬滑鼠游標 */}
            <div className="absolute -bottom-6 -right-6 text-indigo-600 drop-shadow-md">
                <MousePointer2 size={24} fill="currentColor" />
            </div>
        </div>
      )}

      {/* --- 3. 懸浮工具列 (Floating Toolbar) --- */}
      {status === "selected" && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="bg-white rounded-full shadow-2xl border border-slate-200 p-1.5 flex items-center gap-1">
                <div className="px-3 py-1.5 border-r border-slate-100 text-xs font-medium text-slate-500">
                    已選取 6 個物件
                </div>
                
                <button 
                    onClick={handleSynthesis}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-medium transition-colors shadow-sm"
                >
                    <Sparkles size={12} />
                    Synthesis
                </button>
                
                <button onClick={handleReset} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={14} />
                </button>
            </div>
        </div>
      )}

      {/* --- 4. AI 處理面板 (Processing State) --- */}
      {status === "processing" && (
        <div 
            className="absolute z-50 w-[240px] bg-white rounded-xl shadow-2xl border border-indigo-100 p-4 animate-in fade-in zoom-in duration-300"
            // 讓它出現在便利貼群組的右側
            style={{ left: 360, top: 100 }}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 animate-spin-slow">
                    <Wand2 size={14} />
                </div>
                <span className="text-xs font-bold text-slate-700">正在整理與分類...</span>
            </div>

            {/* 骨架屏 (Skeleton) */}
            <div className="space-y-3">
                {/* 模擬正在生成分類 1 */}
                <div className="space-y-1.5">
                    <div className="h-2 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-12 bg-slate-100 rounded border border-slate-100 animate-pulse"></div>
                </div>
                {/* 模擬正在生成分類 2 */}
                <div className="space-y-1.5">
                    <div className="h-2 bg-slate-200 rounded w-1/3 animate-pulse delay-100"></div>
                    <div className="h-12 bg-slate-100 rounded border border-slate-100 animate-pulse delay-100"></div>
                </div>
            </div>
        </div>
      )}

      {/* Reset Button (分類完成後出現) */}
      {status === "synthesized" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-in fade-in delay-1000">
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-500 rounded-full text-xs hover:bg-slate-50 transition-colors"
            >
                <Layers size={14} />
                重置畫布
            </button>
        </div>
      )}

    </div>
  );
};