import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, ImageIcon, Loader2, 
  Palette, Frame, X 
} from "lucide-react";

// 定義參數介面
interface StyleOption {
  id: string;
  label: string;
  color: string;
}

interface RatioOption {
  id: string;
  label: string;
  value: string;
}

export const Parameters = () => {
  // 原有狀態
  const [status, setStatus] = useState<"idle" | "generating" | "completed">("idle");
  const [inputValue, setInputValue] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  
  // 風格與比例狀態
  // Style
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const styleMenuRef = useRef<HTMLDivElement>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  
  const styleOptions: StyleOption[] = [
    { id: "anime", label: "Anime", color: "bg-pink-100 text-pink-600" },
    { id: "photo", label: "Realism", color: "bg-blue-100 text-blue-600" },
    { id: "cyberpunk", label: "Cyberpunk", color: "bg-purple-100 text-purple-600" },
    { id: "oil", label: "Oil Paint", color: "bg-amber-100 text-amber-600" },
  ];

  // Ratio
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const ratioMenuRef = useRef<HTMLDivElement>(null);
  const [selectedRatio, setSelectedRatio] = useState<RatioOption | null>(null);
  
  const ratioOptions: RatioOption[] = [
    { id: "1:1", label: "Square (1:1)", value: "1:1" },
    { id: "2:3", label: "Portrait (2:3)", value: "2:3" },
    { id: "3:2", label: "Landscape (3:2)", value: "3:2" },
    { id: "16:9", label: "Wide (16:9)", value: "16:9" },
  ];

  const generatedImageUrl = "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1000&auto=format&fit=crop";

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (styleMenuRef.current && !styleMenuRef.current.contains(target)) setShowStyleMenu(false);
      if (ratioMenuRef.current && !ratioMenuRef.current.contains(target)) setShowRatioMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerate = () => {
    if (!inputValue.trim()) return;

    setSubmittedPrompt(inputValue);
    setInputValue("");
    setStatus("generating");

    setTimeout(() => {
      setStatus("completed");
    }, 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col overflow-hidden rounded-3xl font-sans">
      
      {/* 顯示區域 (Canvas / Chat Area)*/}
      <div className="flex-1 w-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="min-h-full flex flex-col max-w-md mx-auto w-full">
            
            {/* 等待狀態 */}
            {status === "idle" && (
                <div className="flex flex-col animate-in fade-in duration-500">
                    <div className="mb-6 space-y-1 mt-2">
                        <h3 className="text-sm font-medium text-slate-500">Generate images based on the prompt.</h3>
                        <p className="text-xs text-slate-400 font-medium">15:47</p>
                    </div>
                </div>
            )}

            {/* 生成中或完成狀態 */}
            {(status === "generating" || status === "completed") && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500 pt-4">
                    {/* 1. 使用者氣泡 */}
                    <div className="self-end max-w-[90%]">
                        <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed break-words">
                            {submittedPrompt}
                            {/* 如果有選風格，可以在這裡顯示出來 (可選) */}
                            {(selectedStyle || selectedRatio) && (
                                <div className="mt-2 pt-2 border-t border-blue-500/30 flex gap-2 text-xs text-blue-100">
                                    {selectedStyle && <span>#{selectedStyle.label}</span>}
                                    {selectedRatio && <span>{selectedRatio.value}</span>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI 圖片容器 */}
                    <div className={`
                        relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white transition-all duration-500
                        ${status === "completed" ? "shadow-xl" : ""}
                    `}>
                        {status === "generating" && (
                            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                                <div className="absolute inset-0 bg-indigo-50/50 animate-pulse"></div>
                                <div className="relative flex flex-col items-center gap-4 z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-20 duration-1000"></div>
                                        <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-indigo-100">
                                            <ImageIcon size={28} className="text-indigo-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                                        <span>正在繪製夢境...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === "completed" && (
                            <div className="relative w-full h-full group animate-in fade-in zoom-in duration-700 ease-out">
                                <img 
                                    src={generatedImageUrl} 
                                    alt="Generated Result"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                                    <span className="text-white/90 text-sm font-medium truncate drop-shadow-md">{inputValue || submittedPrompt}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* 輸入區域 (Bottom Input) */}
      <div className="shrink-0 pt-2 pb-6 px-6 relative z-20">
        <div className="max-w-md mx-auto">
            <div className={`
                relative flex w-full items-center gap-2 rounded-2xl border bg-white px-2 py-2 shadow-sm transition-all duration-300
                ${status === "generating" ? "border-indigo-200 ring-2 ring-indigo-50" : "border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"}
            `}>
                
                {/* 輸入框 */}
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    disabled={status === "generating"}
                    placeholder={status === "generating" ? "等待生成..." : "輸入提示詞..."}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-10 pl-2 disabled:cursor-wait disabled:text-slate-400 min-w-0"
                />

                {/* 風格參數按鈕群組 */}
                <div className="flex items-center gap-1 shrink-0">
                    
                    {/* Style Parameter */}
                    <div className="relative" ref={styleMenuRef}>
                        <button
                            onClick={() => setShowStyleMenu(!showStyleMenu)}
                            disabled={status === "generating"}
                            className={`
                                flex items-center gap-1 px-2 py-1.5 rounded-full text-[11px] font-medium transition-all
                                ${selectedStyle 
                                    ? `${selectedStyle.color} border border-transparent` 
                                    : "bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100 hover:text-slate-700"
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            <Palette size={14} />
                            <span className="hidden sm:inline">{selectedStyle ? selectedStyle.label : "Style"}</span>
                            {selectedStyle && (
                                <span onClick={(e) => { e.stopPropagation(); setSelectedStyle(null); }} className="ml-0.5 hover:text-slate-900 p-0.5 rounded-full">
                                    <X size={10} />
                                </span>
                            )}
                        </button>
                        
                        {showStyleMenu && (
                            <div className="absolute bottom-[140%] right-[-20px] w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Image Style</div>
                                {styleOptions.map(option => (
                                    <button key={option.id} onClick={() => { setSelectedStyle(option); setShowStyleMenu(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs text-slate-700 transition-colors text-left">
                                        <span className={`w-2 h-2 rounded-full ${option.color.split(" ")[0]}`}></span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Ratio Parameter */}
                    <div className="relative" ref={ratioMenuRef}>
                        <button
                            onClick={() => setShowRatioMenu(!showRatioMenu)}
                            disabled={status === "generating"}
                            className={`
                                flex items-center gap-1 px-2 py-1.5 rounded-full text-[11px] font-medium transition-all
                                ${selectedRatio 
                                    ? "bg-indigo-100 text-indigo-600 border border-transparent" 
                                    : "bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100 hover:text-slate-700"
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            <Frame size={14} />
                            <span className="hidden sm:inline">{selectedRatio ? selectedRatio.value : "Ratio"}</span>
                            {selectedRatio && (
                                <span onClick={(e) => { e.stopPropagation(); setSelectedRatio(null); }} className="ml-0.5 hover:text-indigo-900 p-0.5 rounded-full">
                                    <X size={10} />
                                </span>
                            )}
                        </button>

                        {showRatioMenu && (
                            <div className="absolute bottom-[140%] right-[-10px] w-36 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Aspect Ratio</div>
                                {ratioOptions.map(option => (
                                    <button key={option.id} onClick={() => { setSelectedRatio(option); setShowRatioMenu(false); }} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs text-slate-700 transition-colors text-left">
                                        <span>{option.label}</span>
                                        {selectedRatio?.id === option.id && <Sparkles size={10} className="text-indigo-600"/>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* 生成按鈕 */}
                <button
                    onClick={handleGenerate}
                    disabled={!inputValue.trim() || status === "generating"}
                    className={`
                        p-2.5 rounded-full transition-all duration-200 flex items-center justify-center shrink-0
                        ${inputValue.trim() && status !== "generating"
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:scale-105 active:scale-95" 
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }
                    `}
                >
                    {status === "generating" ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Sparkles size={18} fill="currentColor" />
                    )}
                </button>
            </div>
        </div>
      </div>

    </div>
  );
};