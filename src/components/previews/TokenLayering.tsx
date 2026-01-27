import { useState, useRef } from "react";
import { Plus, X, Play, Puzzle, User, Zap, LayoutTemplate, ArrowRight } from "lucide-react";

// 定義 Token 類型
type TokenType = "role" | "action" | "format" | "tone";

interface Token {
  id: string;
  label: string;
  type: TokenType;
  content: string; // 實際對應的 Prompt 內容
  icon: React.ReactNode;
  color: string;
}

export const TokenLayering = () => {
  // 1. 定義可用的 Token 庫 (設計師專屬模組)
  const library: Token[] = [
    // --- 角色 (Role) ---
    { 
        id: "t1", label: "資深 UX 研究員", type: "role", 
        content: "Act as a Senior UX Researcher with expertise in user psychology.", 
        icon: <User size={12} />, color: "bg-purple-100 text-purple-700 border-purple-200" 
    },
    { 
        id: "t2", label: "介面設計師", type: "role", 
        content: "Act as a Lead UI Designer focused on accessibility and design systems.", 
        icon: <User size={12} />, color: "bg-purple-100 text-purple-700 border-purple-200" 
    },
    
    // --- 動作 (Action) ---
    { 
        id: "t3", label: "分析用戶痛點", type: "action", 
        content: "Analyze potential user pain points and friction in this flow.", 
        icon: <Zap size={12} />, color: "bg-blue-100 text-blue-700 border-blue-200" 
    },
    { 
        id: "t4", label: "優化微文案", type: "action", 
        content: "Refine the microcopy to be more human-centric and clear.", 
        icon: <Zap size={12} />, color: "bg-blue-100 text-blue-700 border-blue-200" 
    },
    { 
        id: "t5", label: "撰寫測試腳本", type: "action", 
        content: "Create a usability testing script for this scenario.", 
        icon: <Zap size={12} />, color: "bg-blue-100 text-blue-700 border-blue-200" 
    },

    // --- 格式 (Format) ---
    { 
        id: "t6", label: "啟發式評估表", type: "format", 
        content: "Output as a Heuristic Evaluation table with severity ratings.", 
        icon: <LayoutTemplate size={12} />, color: "bg-emerald-100 text-emerald-700 border-emerald-200" 
    },
    { 
        id: "t7", label: "用戶旅程圖", type: "format", 
        content: "Format the output as a text-based User Journey Map.", 
        icon: <LayoutTemplate size={12} />, color: "bg-emerald-100 text-emerald-700 border-emerald-200" 
    },
    { 
        id: "t8", label: "JSON 屬性", type: "format", 
        content: "Output component properties in valid JSON format.", 
        icon: <LayoutTemplate size={12} />, color: "bg-emerald-100 text-emerald-700 border-emerald-200" 
    },
  ];

  // 2. 狀態：已選取的積木 (預設範例：UX 研究員 -> 分析痛點 -> 旅程圖)
  const [activeStack, setActiveStack] = useState<Token[]>([library[0], library[2], library[6]]);

  // 添加積木
  const addToken = (token: Token) => {
    if (!activeStack.find(t => t.id === token.id)) {
      setActiveStack([...activeStack, token]);
    }
  };

  // 移除積木
  const removeToken = (id: string) => {
    setActiveStack(activeStack.filter(t => t.id !== id));
  };

  // 模擬執行
  const [isRunning, setIsRunning] = useState(false);
  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1500);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center p-6 overflow-hidden rounded-3xl">
      
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* --- A. 構建區 (The Builder Area) --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-600">
                    <Puzzle size={16} className="text-indigo-500" />
                    <span className="text-sm font-bold">AI 指令構建器 (Prompt Builder)</span>
                </div>
                <button 
                    onClick={handleRun}
                    className={`
                        flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all shadow-sm
                        ${isRunning ? "bg-slate-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:scale-105"}
                    `}
                >
                    {isRunning ? "生成中..." : (
                        <>
                            <Play size={12} fill="currentColor" />
                            執行指令
                        </>
                    )}
                </button>
            </div>

            {/* 積木放置區 (Drop Zone) */}
            <div className="p-6 min-h-[120px] bg-slate-50/30">
                
                {activeStack.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl py-8">
                        <Plus size={24} className="mb-2 opacity-50" />
                        <span className="text-xs">點擊積木構建指令</span>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-3">
                        {activeStack.map((token, index) => (
                            <div key={token.id} className="flex items-center animate-in zoom-in slide-in-from-bottom-2 duration-300">
                                
                                {/* 箭頭連接符 (除了第一個) */}
                                {index > 0 && (
                                    <ArrowRight size={14} className="text-slate-300 mr-3" />
                                )}

                                {/* Token 本體 */}
                                <div className={`
                                    group relative flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm select-none cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform
                                    ${token.color}
                                `}>
                                    {token.icon}
                                    <span className="text-xs font-bold tracking-wide">{token.label}</span>
                                    
                                    {/* 刪除按鈕 (Hover時出現) */}
                                    <button 
                                        onClick={() => removeToken(token.id)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 即時預覽區 (Live Prompt Preview) */}
            {activeStack.length > 0 && (
                <div className="border-t border-slate-100 p-4 bg-slate-50">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">已生成的系統指令 (System Prompt)</p>
                    <div className="text-xs text-slate-600 font-mono bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                        {activeStack.map(t => t.content).join(" ")}
                    </div>
                </div>
            )}
        </div>


        {/* --- B. 積木庫 (Token Library) --- */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">可用模組 (Available Tokens)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {library.map((token) => {
                    const isActive = activeStack.some(t => t.id === token.id);
                    return (
                        <button
                            key={token.id}
                            onClick={() => addToken(token)}
                            disabled={isActive}
                            className={`
                                flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-200
                                ${isActive 
                                    ? "bg-slate-100 border-slate-100 opacity-40 cursor-not-allowed grayscale" 
                                    : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md hover:scale-[1.02] active:scale-95"
                                }
                            `}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${token.color.split(' ')[0]} ${token.color.split(' ')[1]}`}>
                                {token.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">{token.label}</span>
                                {/* 根據 type 顯示對應的中文標籤 */}
                                <span className="text-[10px] text-slate-400 capitalize">
                                    {token.type === 'role' ? '角色設定' : token.type === 'action' ? '執行動作' : '輸出格式'}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};