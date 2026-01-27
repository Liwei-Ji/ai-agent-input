import { useState, useRef, useEffect } from "react";
import { FileText, Sparkles, ArrowRight, Quote } from "lucide-react";

// 定義資料結構：原始段落
interface SourceBlock {
  id: number;
  text: string;
}

// 定義資料結構：摘要論點
interface SummaryPoint {
  id: string;
  sourceId: number;
  content: string;
}

export const Summary = () => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  // 模擬原始長文件：關於交互體驗設計的報告
  const sourceData: SourceBlock[] = [
    {
      id: 1,
      text: "「微交互（Micro-interactions）」在現代介面設計中扮演著無聲溝通者的角色。研究顯示，透過細微的動畫回饋（如按鈕按下的狀態變化或載入時的動態骨架屏），能有效降低使用者的不確定感，並顯著提升操作的愉悅度與流暢性。"
    },
    {
      id: 2,
      text: "「認知負荷（Cognitive Load）」的管理是決定產品易用性的關鍵。過多的資訊密度會導致使用者決策癱瘓。設計師應採用「漸進式揭露（Progressive Disclosure）」的策略，僅在使用者需要時才顯示次要資訊，以保持介面的清爽與專注。"
    },
    {
      id: 3,
      text: "「一致性（Consistency）」是建立使用者信任的基石。當產品在不同頁面間維持統一的視覺語言與操作邏輯（如統一的導航位置、色彩系統與元件行為）時，能大幅降低使用者的學習曲線，使操作轉化為直覺的肌肉記憶。"
    },
    {
      id: 4,
      text: "「無障礙設計（Accessibility）」不僅是為了合規，更是為了包容性體驗。優化色彩對比度、支援螢幕閱讀器及完善的鍵盤導航，不僅服務了視障或行動不便的使用者，也改善了在強光環境下或單手操作時的一般使用者體驗。"
    }
  ];

  // 模擬AI生成的摘要
  const summaryPoints: SummaryPoint[] = [
    {
      id: "s1",
      sourceId: 1,
      content: "微交互透過即時的動畫回饋，有效降低操作不確定感並提升愉悅度。"
    },
    {
      id: "s2",
      sourceId: 2,
      content: "採用「漸進式揭露」策略來管理認知負荷，避免使用者決策癱瘓。"
    },
    {
      id: "s3",
      sourceId: 3,
      content: "統一的視覺與操作邏輯能降低學習成本，將操作轉化為直覺記憶。"
    },
    {
      id: "s4",
      sourceId: 4,
      content: "無障礙設計提升包容性，同時優化了特殊情境下的一般使用體驗。"
    }
  ];

  // 手動計算 scrollTop，避免影響外層卷軸
  useEffect(() => {
    if (activeId !== null && sourceRef.current) {
      const container = sourceRef.current;
      const targetElement = container.querySelector(`[data-source-id="${activeId}"]`) as HTMLElement;
      
      if (targetElement) {
        // 計算目標元素相對於容器頂部的距離
        const elementTop = targetElement.offsetTop;
        const elementHeight = targetElement.clientHeight;
        const containerHeight = container.clientHeight;

        // 計算置中位置
        const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);

        container.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [activeId]);

  return (
    <div className="relative w-full h-full min-h-[600px] flex gap-4 p-4 overflow-hidden rounded-3xl animate-in fade-in zoom-in duration-500">
      
      {/* 左側：原始資料 (Source Document) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <FileText size={16} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">交互設計研究報告</span>
        </div>
        
        {/* Content - 加上 relative 以確保 offsetTop 計算正確 */}
        <div ref={sourceRef} className="relative flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
            {sourceData.map((block) => (
                <div 
                    key={block.id}
                    data-source-id={block.id}
                    className={`
                        transition-all duration-300 rounded-lg p-3 -mx-3 border-l-4
                        ${activeId === block.id 
                            ? "bg-indigo-50 border-indigo-500 text-slate-800 shadow-sm scale-[1.01]" 
                            : "border-transparent text-slate-500"
                        }
                        ${activeId !== null && activeId !== block.id ? "opacity-40 blur-[0.5px]" : "opacity-100"}
                    `}
                >
                    <p className="text-sm leading-7">{block.text}</p>
                </div>
            ))}
            {/* 底部留白，確保最後一段也能被捲動到中間 */}
            <div className="h-40"></div>
        </div>
      </div>

      {/* 右側：AI 摘要 (Summary Card) */}
      <div className="w-[320px] shrink-0 flex flex-col bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-indigo-200" />
                <h3 className="font-bold text-base">AI 智能摘要</h3>
            </div>
            <p className="text-[11px] text-indigo-100 opacity-90">
                已提煉出 4 個 UX 設計洞察，懸浮以驗證來源。
            </p>
        </div>

        {/* Summary Points List */}
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
            <div className="space-y-2">
                {summaryPoints.map((point) => (
                    <div
                        key={point.id}
                        onMouseEnter={() => setActiveId(point.sourceId)}
                        onMouseLeave={() => setActiveId(null)}
                        className={`
                            group relative p-3 rounded-xl border transition-all duration-200 cursor-default
                            ${activeId === point.sourceId 
                                ? "bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50" 
                                : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                            }
                        `}
                    >
                        {/* 引用標籤 */}
                        <div className="flex items-start gap-3">
                            <div className={`
                                shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                                ${activeId === point.sourceId 
                                    ? "bg-indigo-600 text-white" 
                                    : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                                }
                            `}>
                                {point.sourceId}
                            </div>
                            
                            <div className="space-y-1">
                                <p className={`text-xs leading-5 transition-colors ${activeId === point.sourceId ? "text-slate-800" : "text-slate-600"}`}>
                                    {point.content}
                                </p>
                            </div>
                        </div>

                        {/* Hover Indicator */}
                        <div className={`
                            absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 transition-all duration-300
                            ${activeId === point.sourceId ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                        `}>
                            <ArrowRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};