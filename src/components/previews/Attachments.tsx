import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Maximize2, Minimize2, FileText, X, Database } from "lucide-react";

export const Attachments = () => {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  
  // 模擬已上傳的來源檔案
  const [sources, setSources] = useState<string[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 模擬上傳檔案的動作
  const handleUpload = () => {
    // 模擬：每次點擊迴紋針，就增加一個檔案
    const newFile = `Report_202${sources.length + 6}.pdf`;
    setSources([...sources, newFile]);
  };

  // 移除某個來源
  const removeSource = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發輸入框聚焦
    const newSources = [...sources];
    newSources.splice(index, 1);
    setSources(newSources);
  };

  // 高度控制邏輯
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

    if (scrollHeight > 80) {
        setShowExpandBtn(true);
    } else {
        setShowExpandBtn(false);
    }
  }, [inputValue, isExpanded]);

  return (
    <div className="flex w-full h-[600px] rounded-3xl overflow-hidden ">
      
      {/* 左側：來源管理區 (模擬 NotebookLM 側邊欄) */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">

            {/* 標題與圖標 */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Database size={18} className="text-indigo-600" />
            <h3 className="font-semibold text-slate-700">Sources</h3>

            {/* Add 按鈕 */}
            <button 
                    onClick={handleUpload} 
                    className="ml-auto text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                >
                    + Add
                </button>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {sources.length === 0 ? (
                <div className="text-center mt-10 text-slate-400 text-sm px-4">
                    <p>No sources yet.</p>
                    <p className="text-xs mt-2">Click the paperclip to add a PDF.</p>
                </div>
            ) : (
                sources.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl animate-in slide-in-from-left-2 duration-300">
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-500 flex items-center justify-center shrink-0">
                            <FileText size={16} />
                        </div>
                        <span className="text-xs font-medium text-slate-600 truncate flex-1">{file}</span>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* 右側：對話區 */}
      <div className="flex-1 flex flex-col relative">
          
          {/* Header */}
          <div className="h-14 flex items-center px-6 justify-between">
          </div>

          {/* 訊息顯示區 (空白) */}
          <div className="flex-1 overflow-y-auto p-6">
             {sources.length > 0 && (
                 <div className="flex justify-center">
                     <span className="bg-slate-100 text-slate-500 text-xs py-1 px-3 rounded-full">
                        AI has access to {sources.length} source{sources.length > 1 ? 's' : ''}
                     </span>
                 </div>
             )}
          </div>

          {/* 底部輸入區 (Attachments 核心) */}
          <div className="w-full max-w-2xl mx-auto mb-6 px-6">
            
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 ease-in-out
                ${isExpanded 
                    ? "rounded-2xl shadow-lg border-gray-300" 
                    : "hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50/50"
                }
            `}>
                
                {/* 左側按鈕：上傳觸發點 */}
                <button 
                    onClick={handleUpload}
                    className={`
                    shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors mb-[2px]
                    ${isExpanded ? "self-end" : ""}
                `}>
                    <Paperclip size={20} />
                </button>

                {/* 中間容器：包含輸入框 + 來源標籤 */}
                <div className="flex-1 relative min-w-0 flex items-end gap-2">
                    
                    {/* 輸入框 */}
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={sources.length > 0 ? "Ask questions about these sources..." : "Ask any question..."}
                        rows={1}
                        className={`
                            flex-1 bg-transparent text-sm leading-5 text-slate-700 placeholder:text-slate-400 
                            resize-none outline-none block scrollbar-thin scrollbar-thumb-slate-200
                            py-2.5 px-1
                            transition-[height] duration-200 ease-out
                        `}
                        style={{
                            paddingRight: (showExpandBtn || isExpanded) ? '2rem' : '0px'
                        }}
                    />

                    {/* 來源標籤 (Source Chip) */}
                    {/* 顯示條件：有來源檔案 && 未展開模式 */}
                    {sources.length > 0 && !isExpanded && (
                        <div className="shrink-0 mb-[6px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100">
                                <FileText size={12} />
                                <span className="text-xs font-medium max-w-[80px] truncate">
                                    {sources.length} source{sources.length > 1 ? 's' : ''}
                                </span>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSources([]); // 清空
                                    }}
                                    className="hover:bg-indigo-100 rounded-full p-0.5 ml-1 transition-colors"
                                >
                                    <X size={10} />
                                </button>
                             </div>
                        </div>
                    )}

                    {/* 右上角展開/收起按鈕 */}
                    <button
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                            setTimeout(() => textareaRef.current?.focus(), 50);
                        }}
                        className={`
                            absolute -right-10 top-1 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300
                            ${(showExpandBtn || isExpanded) ? "opacity-100 scale-100 visible" : "opacity-0 scale-90 invisible"}
                        `}
                    >
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>

                </div>

                {/* 右側發送按鈕 */}
                <button
                    disabled={!inputValue.trim()}
                    className={`
                        flex items-center justify-center shrink-0
                        w-10 h-10 rounded-full transition-all mb-[1px]
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