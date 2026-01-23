import { useState, useEffect } from "react";
import { ChatInput } from "../ChatInput";
import { X, Sparkles } from "lucide-react";

export const Nudges = () => {
  const [showNudge, setShowNudge] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // 模擬情境 使用者進入頁面後，閒置1.5秒，AI偵測到猶豫於是彈出 Nudge
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setShowNudge(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNudge(false);
    setIsDismissed(true);
  };

  const handleNudgeClick = () => {
    console.log("User accepted the nudge");
    setShowNudge(false);
  };

  return (
    <div className="w-full max-w-md h-[300px] flex flex-col justify-end animate-in fade-in zoom-in duration-500 pb-4">
      
      {/* 說明區域 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
        <div className="text-sm text-slate-400">
          <i className="fa-regular fa-clock text-xl" />
        </div>
        <p className="text-sm text-slate-400">
          keep it idle<br/>
        </p>
      </div>

      {/* 底部區域 Nudge+輸入框 */}
      <div className="relative">
        
        {/* Nudge 絕對定位在輸入框正上方*/}
        {showNudge && (
          <div 
            onClick={handleNudgeClick}
            className="
              absolute bottom-full left-0 mb-3 ml-2
              flex items-center gap-2 
              bg-slate-900 text-white text-xs font-medium
              px-3 py-2 rounded-xl shadow-xl shadow-slate-200
              cursor-pointer
              animate-in slide-in-from-bottom-2 fade-in duration-700
              transition-transform z-20
            "
          >
            {/* 裝飾圖標 */}
            <Sparkles size={14} className="text-yellow-400" />
            
            <span>Not sure what to ask? Try “Year in Review.”</span>

            {/* 分隔線 */}
            <div className="w-[1px] h-3 bg-slate-700 mx-1" />

            {/* 關閉按鈕 */}
            <button 
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
            >
              <X size={12} />
            </button>
            
            {/* 指向下方小箭頭，增加提示感 */}
            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        )}

        {/* 輸入框 */}
        <ChatInput 
          placeholder="Ask any question..." 
          onSend={(t) => console.log(t)} 
        />
      </div>
    </div>
  );
};