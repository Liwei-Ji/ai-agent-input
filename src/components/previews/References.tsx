import { useState } from "react";
import { 
  BookOpen, Link as LinkIcon, FileText, 
  PanelRightOpen, PanelRightClose,
  Globe, Clock, Send 
} from "lucide-react";

// --- 模擬參考資料數據 ---
const MOCK_REFERENCES = [
  {
    id: 1,
    title: "Understanding Large Language Models",
    source: "arxiv.org",
    type: "pdf",
    time: "2 mins ago",
    summary: "A comprehensive overview of transformer architectures and attention mechanisms."
  },
  {
    id: 2,
    title: "The Future of Generative AI in 2026",
    source: "techcrunch.com",
    type: "web",
    time: "5 mins ago",
    summary: "Analysis of market trends and the emergence of autonomous agents."
  },
  {
    id: 3,
    title: "React 19 Server Components Guide",
    source: "react.dev",
    type: "web",
    time: "10 mins ago",
    summary: "Official documentation regarding the new server component patterns."
  },
];

export const References = () => {
  // --- Layout 狀態 ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- 輸入框狀態 (僅 UI 展示) ---
  const [inputValue, setInputValue] = useState("");

  // --- 靜態訊息內容 ---
  const aiMessage = (
    <div className="space-y-4">
        <p>
            Based on the analysis of recent papers and articles, here is a summary of the current state of LLMs. 
            The <span className="text-indigo-600 font-medium bg-indigo-50 px-1 rounded cursor-pointer hover:underline" onClick={() => setIsSidebarOpen(true)}>[1] transformer architecture</span> remains the backbone of modern AI, ensuring robust context understanding.
        </p>
        <p>
            Furthermore, looking at market trends <span className="text-indigo-600 font-medium bg-indigo-50 px-1 rounded cursor-pointer hover:underline" onClick={() => setIsSidebarOpen(true)}>[2]</span>, we can see a significant shift towards autonomous agents that can plan and execute complex tasks with minimal human intervention.
        </p>
        <p>
            Recent updates in web frameworks also suggest a move towards more integrated AI capabilities directly within the rendering lifecycle <span className="text-indigo-600 font-medium bg-indigo-50 px-1 rounded cursor-pointer hover:underline" onClick={() => setIsSidebarOpen(true)}>[3]</span>.
        </p>
    </div>
  );

  return (
    // 外層容器設定
    <div className="flex h-[600px] w-full min-h-[500px] overflow-hidden font-sans rounded-3xl">
      
      {/* --- 1. 左側主區域 (Main Content) --- */}
      <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300 ease-in-out relative">
        
        {/* 懸浮觸發開關 */}
        <div className="absolute top-4 right-4 z-30">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`
                    p-2 rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all
                    ${isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"} 
                `}
                title="Show references"
            >
                <PanelRightOpen size={20} />
            </button>
        </div>

        {/* --- 內容卷軸區 (Static Content) --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-200">
            <div className="max-w-md mx-auto w-full pb-10 pt-10 space-y-8">
                
                {/* AI Message */}
                <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="max-w-full text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                        {aiMessage}
                    </div>
                </div>

            </div>
        </div>

        {/* --- 底部輸入框區 (Visual Only) --- */}
        <div className="shrink-0 p-4 z-20">
            <div className="max-w-md mx-auto w-full">
                <div className="relative flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-300">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask any question..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-10 pl-2 min-w-0"
                    />
                    <button
                        className={`
                            p-2.5 rounded-full transition-all duration-200 flex items-center justify-center shrink-0
                            ${inputValue.trim() 
                                ? "bg-indigo-600 text-white shadow-md" 
                                : "bg-slate-100 text-slate-300"
                            }
                        `}
                    >
                        <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                    </button>
                </div>
            </div>
        </div>

      </div>

      {/* --- 2. 右側邊欄 (References Sidebar - 懸浮卡片版) --- */}
      <div 
        className={`
            shrink-0 bg-white flex flex-col
            transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            
            /* 2. 修改這裡：將 vh 改為 % 以適應父容器高度 */
            ${isSidebarOpen 
                ? "w-80 opacity-100 translate-x-0 m-4 rounded-2xl shadow-2xl border border-slate-200 h-[calc(100%-2rem)]" 
                : "w-0 opacity-0 translate-x-10 m-0 h-[calc(100%-2rem)] overflow-hidden" 
            }
        `}
      >
          {/* Sidebar Header */}
          <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2 text-slate-700">
                  <BookOpen size={18} className="text-indigo-600" />
                  <span className="font-semibold text-sm">References</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full">{MOCK_REFERENCES.length}</span>
              </div>
              
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                title="Close sidebar"
              >
                  <PanelRightClose size={16} />
              </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_REFERENCES.map((ref) => (
                  <div key={ref.id} className="group relative bg-white border border-slate-100 rounded-xl p-3 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                              <div className={`
                                  p-1.5 rounded-lg 
                                  ${ref.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}
                              `}>
                                  {ref.type === 'pdf' ? <FileText size={14} /> : <Globe size={14} />}
                              </div>
                              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{ref.source}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock size={10} /> {ref.time}
                          </span>
                      </div>
                      <h4 className="text-sm font-medium text-slate-700 leading-snug group-hover:text-indigo-600 transition-colors mb-1.5">
                          {ref.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {ref.summary}
                      </p>
                      <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0">
                          <LinkIcon size={12} className="text-indigo-400" />
                      </div>
                  </div>
              ))}
              
              <button className="w-full py-3 text-xs font-medium text-slate-500 border border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                  View all resources
              </button>
          </div>
      </div>

    </div>
  );
};