import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, Maximize2, Minimize2, 
  Globe, Database, Github, Cloud, ChevronDown, Plus 
} from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
}

export const Filters = () => {
  // 狀態管理
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { id: "web", label: "All web sources", icon: Globe, isActive: true },
    { id: "notion", label: "Notion", icon: Database, isActive: false },
    { id: "github", label: "GitHub", icon: Github, isActive: false },
    { id: "drive", label: "Google Drive", icon: Cloud, isActive: false },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (id: string) => {
    setFilterOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, isActive: !opt.isActive } : opt
    ));
  };

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
        
        {/* 標題區：靠左 (預設) */}
        <div className="mb-4 space-y-1 mt-2">
          <h3 className="text-sm font-medium text-slate-500">Hi, I'm AI Agent</h3>
          <p className="text-xs text-slate-400 font-medium">15:47</p>
        </div>

        {/* 篩選器標籤區：保持置中 (justify-center) */}
        <div className="flex justify-center gap-2 flex-wrap w-full">
            {filterOptions.filter(f => f.isActive).map(f => (
                <span key={f.id} className="bg-white border border-slate-200 text-slate-500 text-xs py-1 px-3 rounded-full shadow-sm flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                    <f.icon size={10} />
                    {f.label}
                </span>
            ))}
        </div>
      </div>

      {/* 底部輸入區 */}
      <div className="w-full max-w-md mx-auto mb-6 px-6">
        
        <div className={`
            relative flex w-full items-end gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 ease-in-out
            ${isExpanded ? "rounded-2xl shadow-lg border-gray-300" : "hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50/50"}
        `}>
            
            {/* 左側功能區 */}
            <div className={`flex items-center gap-0.5 shrink-0 mb-[2px] ${isExpanded ? "self-end" : ""}`}>
                <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                    <Paperclip size={20} />
                </button>

                {/* Filters 選單 */}
                <div className="relative" ref={filterMenuRef}>
                    <button 
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className={`flex items-center gap-0.5 p-2 rounded-xl transition-all duration-200 ${showFilterMenu ? "bg-slate-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100 hover:text-indigo-600"}`}
                    >
                        <Globe size={20} />
                        <ChevronDown size={14} className={`transition-transform duration-200 ${showFilterMenu ? "rotate-180" : ""}`} />
                    </button>

                    {showFilterMenu && (
                        <div className="absolute bottom-[135%] left-[-10px] w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-bottom-left">
                            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Sources</div>
                            <div className="space-y-0.5">
                                {filterOptions.map((option) => (
                                    <div key={option.id} onClick={() => toggleFilter(option.id)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors select-none">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center ${option.isActive ? "text-indigo-600" : "text-slate-400"}`}>
                                                <option.icon size={18} />
                                            </div>
                                            <span className={`text-sm ${option.isActive ? "font-medium text-slate-800" : "font-normal text-slate-600"}`}>{option.label}</span>
                                        </div>
                                        <div className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${option.isActive ? "bg-indigo-600" : "bg-slate-200 group-hover:bg-slate-300"}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${option.isActive ? "left-5" : "left-1"}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100">
                                <button className="w-full py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                                    <Plus size={12} />
                                    <span>Connect apps</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 輸入框 */}
            <div className="flex-1 relative min-w-0 flex items-end gap-2">
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm leading-5 text-slate-700 placeholder:text-slate-400 resize-none outline-none block scrollbar-thin scrollbar-thumb-slate-200 py-2.5 px-1 transition-[height] duration-200 ease-out"
                    style={{ paddingRight: '0px' }}
                />
                <button
                    onClick={() => { setIsExpanded(!isExpanded); setTimeout(() => textareaRef.current?.focus(), 50); }}
                    className={`absolute -right-10 top-1 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 ${(showExpandBtn || isExpanded) ? "opacity-100 visible" : "opacity-0 invisible"}`}
                >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
            </div>

            {/* 發送按鈕 */}
            <button
                disabled={!inputValue.trim()}
                className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full transition-all mb-[1px] ${inputValue.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
            >
                <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
            </button>

        </div>
      </div>
    </div>
  );
};