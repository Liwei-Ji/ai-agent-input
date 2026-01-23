import { useState } from "react";
import { Sparkles, ImageIcon, Loader2 } from "lucide-react";

export const Transform = () => {
  // 狀態機: 'idle' (閒置) -> 'generating' (生成中) -> 'completed' (完成)
  const [status, setStatus] = useState<"idle" | "generating" | "completed">("idle");
  
  // 當前輸入框的值
  const [inputValue, setInputValue] = useState("");
  
  // 已發送出去的提示詞 (用於顯示氣泡)
  const [submittedPrompt, setSubmittedPrompt] = useState("");

  // IME (中文輸入法) 狀態偵測
  const [isComposing, setIsComposing] = useState(false);
  
  // 模擬生成的圖片 URL
  const generatedImageUrl = "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1000&auto=format&fit=crop";

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
    <div className="relative w-full h-full min-h-[500px] flex flex-col overflow-hidden rounded-3xl">
      
      {/* --- 顯示區域 (Canvas / Chat Area) --- */}
      <div className="flex-1 w-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
        
        {/* 修改重點 1: 加上 max-w-md mx-auto */}
        {/* 這樣可以確保內容區域的寬度與下方的輸入框一致，且水平置中，文字就不會貼在最左邊 */}
        <div className="min-h-full flex flex-col max-w-md mx-auto w-full">
            
            {/* A. 等待狀態 (Idle Placeholder) */}
            {status === "idle" && (
                <div className="flex flex-col animate-in fade-in duration-500">
                    <div className="mb-6 space-y-1 mt-2">
                        <h3 className="text-sm font-medium text-slate-500">Generate images based on the prompt.</h3>
                        <p className="text-xs text-slate-400 font-medium">15:47</p>
                    </div>
                </div>
            )}

            {/* B. 生成中或完成狀態 (Active State) */}
            {(status === "generating" || status === "completed") && (
                // 這裡原本有 max-w-md，現在外層加了，這裡可以移除或保留(繼承)
                // 為了保險起見，我們讓它單純是 flex-col 即可
                <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500 pt-4">
                    
                    {/* 1. 使用者氣泡 (User Bubble) - 靠右 */}
                    <div className="self-end max-w-[90%]">
                        <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed break-words">
                            {submittedPrompt}
                        </div>
                    </div>

                    {/* 2. AI 圖片容器 (Image Container) - 靠左 */}
                    <div className={`
                        relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white transition-all duration-500
                        ${status === "completed" ? "shadow-xl" : ""}
                    `}>
                        
                        {/* 骨架屏 */}
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

                        {/* 完成圖片 */}
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
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    disabled={status === "generating"}
                    placeholder={status === "generating" ? "等待生成..." : "輸入提示詞..."}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-10 pl-2 disabled:cursor-wait disabled:text-slate-400"
                />

                <button
                    onClick={handleGenerate}
                    disabled={!inputValue.trim() || status === "generating"}
                    className={`
                        p-2.5 rounded-full transition-all duration-200 flex items-center justify-center
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