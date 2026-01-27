import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, Maximize2, Minimize2, 
  ChevronDown, Sparkles, Zap, Cpu 
} from "lucide-react";

// 模型選項
interface ModelOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const ModelManagement = () => {
  // 輸入框狀態
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Model Selector 狀態
  const [showModelMenu, setShowModelMenu] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState("pro");
  
  const models: ModelOption[] = [
    { id: "flash", name: "Gemini Flash", description: "Fastest & lightweight", icon: Zap, color: "text-amber-500" },
    { id: "pro", name: "Gemini Pro", description: "Best for reasoning", icon: Sparkles, color: "text-indigo-500" },
    { id: "ultra", name: "Gemini Ultra", description: "Most capable model", icon: Cpu, color: "text-fuchsia-500" },
  ];

  // 取得當前選中的模型物件
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setShowModelMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 高度控制 (Pixel Perfect)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto'; 
    const scrollHeight = textarea.scrollHeight;

    if (isExpanded) {
        textarea.style.height = '280px'; 
    } else {
        if (inputValue === "" || scrollHeight <= 42) {
            textarea.style.height = '40px'; 
        } else {
            textarea.style.height = `${Math.min(scrollHeight, 150)}px`;
        }
    }

    if (scrollHeight > 80) setShowExpandBtn(true);
    else setShowExpandBtn(false);
  }, [inputValue, isExpanded]);

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-center overflow-hidden rounded-3xl font-sans">
      
      {/* 訊息顯示區 */}
      <div className="w-full max-w-md flex-1 flex flex-col p-6">
        <div className="mb-4 space-y-1 mt-2">
          <h3 className="text-sm font-medium text-slate-500">Hi, I'm AI Agent</h3>
          <p className="text-xs text-slate-400 font-medium">15:47</p>
        </div>
      </div>

      {/* 底部輸入區 */}
      <div className="w-full max-w-md mx-auto mb-6 px-6">
        
        <div className={`
            relative flex w-full items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 ease-in-out
            ${isExpanded ? "rounded-2xl shadow-lg border-gray-300" : "hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50/50"}
        `}>
            
            {/* 左側按鈕 */}
            <button 
                className={`
                    shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors mb-[2px]
                    ${isExpanded ? "self-end" : ""}
                `}
                title="Upload file"
            >
                <Paperclip size={20} />
            </button>

            {/* 中間輸入框 */}
            <div className="flex-1 relative min-w-0 flex items-end gap-2">
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask any question..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm leading-5 text-slate-700 placeholder:text-slate-400 resize-none outline-none block scrollbar-thin scrollbar-thumb-slate-200 py-2.5 px-1 transition-[height] duration-200 ease-out"
                    // paddingRight 設為 0，因為右側按鈕群組已經處理了間距
                    style={{ paddingRight: '0px' }}
                />
                
                {/* 展開/收起按鈕 (保持在最外側 -right-10) */}
                <button
                    onClick={() => { setIsExpanded(!isExpanded); setTimeout(() => textareaRef.current?.focus(), 50); }}
                    className={`absolute -right-10 top-1 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 ${(showExpandBtn || isExpanded) ? "opacity-100 visible" : "opacity-0 invisible"}`}
                >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
            </div>

            {/* 右側區域 (Model Selector + Send) */}
            <div className={`flex items-center gap-1 shrink-0 mb-[2px] ${isExpanded ? "self-end" : ""}`}>
                
                {/* Model Selector Trigger */}
                <div className="relative" ref={modelMenuRef}>
                    <button
                        onClick={() => setShowModelMenu(!showModelMenu)}
                        className={`
                            flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all duration-200
                            ${showModelMenu 
                                ? "bg-indigo-50 border-indigo-100 text-indigo-700" 
                                : "bg-slate-50 border-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                            }
                        `}
                        title="Change Model"
                    >
                        {/* 顯示當前模型圖示與顏色 */}
                        <currentModel.icon size={12} className={showModelMenu ? "text-indigo-600" : currentModel.color} />
                        <span className="text-xs font-semibold">{currentModel.name.split(" ")[1]}</span> {/* 只顯示 "Pro" 等簡稱 */}
                        <ChevronDown size={10} className={`opacity-50 transition-transform ${showModelMenu ? "rotate-180" : ""}`} />
                    </button>

                    {/* Model Dropdown Menu */}
                    {showModelMenu && (
                        <div className="absolute bottom-[135%] right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
                            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Model</div>
                            <div className="space-y-0.5">
                                {models.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            setSelectedModel(model.id);
                                            setShowModelMenu(false);
                                        }}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
                                            ${selectedModel === model.id ? "bg-slate-50 border border-slate-100 shadow-sm" : "hover:bg-slate-50 border border-transparent"}
                                        `}
                                    >
                                        <div className={`
                                            p-2 rounded-lg 
                                            ${selectedModel === model.id ? "bg-white shadow-sm" : "bg-slate-100"}
                                        `}>
                                            <model.icon size={18} className={model.color} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-semibold ${selectedModel === model.id ? "text-slate-800" : "text-slate-700"}`}>
                                                    {model.name}
                                                </span>
                                                {selectedModel === model.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                                {model.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 發送按鈕 */}
                <button
                    disabled={!inputValue.trim()}
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-full transition-all
                        ${inputValue.trim() 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200" 
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }
                    `}
                >
                    <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};