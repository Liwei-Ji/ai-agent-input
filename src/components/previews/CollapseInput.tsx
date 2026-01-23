import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Maximize2, Minimize2 } from "lucide-react";

export const CollapseInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- 核心邏輯：高度控制 (保留不變) ---
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 1. 重置高度
    textarea.style.height = 'auto'; 
    const scrollHeight = textarea.scrollHeight;

    // 2. 設定高度
    if (isExpanded) {
        // [展開模式] 固定高度
        textarea.style.height = '280px'; 
    } else {
        // [收起模式 - 自動增高]
        // 42px 是容錯值，確保單行時強制維持 40px (h-10)
        if (inputValue === "" || scrollHeight <= 42) {
            textarea.style.height = '40px'; 
        } else {
            // 自動增高，上限 150px
            textarea.style.height = `${Math.min(scrollHeight, 150)}px`;
        }
    }

    // 3. 判斷是否顯示「展開按鈕」
    if (scrollHeight > 80) {
        setShowExpandBtn(true);
    } else {
        setShowExpandBtn(false);
    }

  }, [inputValue, isExpanded]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-50 flex flex-col items-center justify-center overflow-hidden rounded-3xl">
      
      {/* 1. 訊息顯示區 (已清空文字) */}
      <div className="w-full max-w-md flex-1 flex flex-col p-6">
        <div className="mb-6 space-y-1 mt-2">
          <h3 className="text-sm font-medium text-slate-500">Hi, I'm AI Agent</h3>
          <p className="text-xs text-slate-400 font-medium">15:47</p>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 space-y-4">
            {/* 這裡原本的對話紀錄已刪除 */}
        </div>
      </div>

      {/* 2. 底部輸入區 */}
      <div className="w-full max-w-md mx-auto mb-6 px-6">
        
        {/* 容器：rounded-2xl 風格 */}
        <div className={`
            relative flex w-full items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 ease-in-out
            ${isExpanded ? "rounded-2xl shadow-lg border-gray-300" : "hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50/50"}
        `}>
            
            {/* 左側按鈕：rounded-xl 風格 */}
            <button className={`
                shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors mb-[2px]
                ${isExpanded ? "self-end" : ""}
            `}>
                <Paperclip size={20} />
            </button>

            {/* 中間輸入框容器 */}
            <div className="flex-1 relative min-w-0">
                
                {/* Textarea 樣式維持不變 (Pixel Perfect Logic) */}
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask any question..."
                    rows={1}
                    className={`
                        w-full bg-transparent text-sm leading-5 text-slate-700 placeholder:text-slate-400 
                        resize-none outline-none block scrollbar-thin scrollbar-thumb-slate-200
                        py-2.5 px-1
                        transition-[height] duration-200 ease-out
                    `}
                    style={{
                        // 這裡可以根據按鈕位置微調，因為按鈕現在移到外面了 (-right-10)，
                        // 所以輸入框內部其實不需要留這麼多白，可以改回 0 或少一點。
                        // 但為了保險起見，如果按鈕還是在附近，保留一點也無妨。
                        paddingRight: '0px' 
                    }}
                />

                {/* 右上角展開/收起按鈕 (位置改為 -right-10) */}
                <button
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                        setTimeout(() => textareaRef.current?.focus(), 50);
                    }}
                    className={`
                        absolute -right-10 top-1 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300
                        ${(showExpandBtn || isExpanded) ? "opacity-100 scale-100 visible" : "opacity-0 scale-90 invisible"}
                    `}
                    title={isExpanded ? "收起" : "展開全螢幕"}
                >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

            </div>

            {/* 右側發送按鈕 (rounded-full) */}
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
  );
};