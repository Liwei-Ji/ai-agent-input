import { useState, useRef, useEffect } from "react";
import { Send, Info, ShieldAlert } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

const SENSITIVE_KEYWORDS = {
  medical: ["痛", "藥", "醫生", "症狀", "治療", "醫院", "pain", "doctor", "medicine"],
  financial: ["股票", "投資", "銀行", "轉帳", "比特幣", "stock", "invest", "bank"],
  legal: ["合約", "法律", "起訴", "律師", "犯罪", "law", "sue", "crime"],
};

export const Caveat = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hello! I can help you draft emails, summarize documents, or chat about general topics. How can I help today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [warningType, setWarningType] = useState<"default" | "medical" | "financial" | "legal">("default");
  const [showTooltip, setShowTooltip] = useState(false);
  
  // 中文輸入狀態 (IME State)
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const lowerText = inputValue.toLowerCase();
    
    if (SENSITIVE_KEYWORDS.medical.some(k => lowerText.includes(k))) {
      setWarningType("medical");
    } else if (SENSITIVE_KEYWORDS.financial.some(k => lowerText.includes(k))) {
      setWarningType("financial");
    } else if (SENSITIVE_KEYWORDS.legal.some(k => lowerText.includes(k))) {
      setWarningType("legal");
    } else {
      setWarningType("default");
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    
    setInputValue(""); 
    setWarningType("default");

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "I understand. Please note that for professional advice, you should consult with a qualified expert."
      }]);
    }, 800);
  };

  // 防止在選字時按下 Enter 觸發發送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const getCaveatContent = () => {
    switch (warningType) {
      case "medical":
        return {
          text: "AI 不是醫生。請勿依賴此資訊進行醫療診斷。",
          icon: <ShieldAlert size={14} />,
          color: "text-red-500 bg-red-50 border-red-100 hover:bg-red-100",
          tooltip: "大型語言模型可能會產生錯誤的醫療建議。如果有身體不適，請務必諮詢專業醫師。"
        };
      case "financial":
        return {
          text: "AI 資訊可能過時。投資前請諮詢專業財務顧問。",
          icon: <ShieldAlert size={14} />,
          color: "text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100",
          tooltip: "市場資訊瞬息萬變，AI 的知識截止日期可能無法反映最新行情，投資請自行評估風險。"
        };
      case "legal":
        return {
          text: "AI 無法提供法律建議。請諮詢合格律師。",
          icon: <ShieldAlert size={14} />,
          color: "text-orange-600 bg-orange-50 border-orange-100 hover:bg-orange-100",
          tooltip: "法律條文因地區與案例而異，AI 可能會引用不存在的法條或錯誤解讀。"
        };
      default:
        return {
          text: "AI 可能會產生錯誤資訊。請查核重要事實。",
          icon: <Info size={14} />,
          color: "text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-transparent",
          tooltip: "生成式 AI 可能會產生「幻覺」，捏造看似真實但錯誤的內容，請務必查核來源。"
        };
    }
  };

  const caveatStyle = getCaveatContent();

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          <div className="mb-6 space-y-1 mt-64">
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" ? (
                  <div className="max-w-[95%] text-slate-700 text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[90%] p-4 text-sm leading-7 rounded-2xl rounded-br-sm shadow-sm whitespace-pre-wrap bg-blue-600 text-white">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 pt-2 pb-4 z-10 bg-transparent">
          
          {/* 修改部分：更新輸入框樣式以符合設計系統 */}
          <div className="relative flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="試著輸入『醫生』或『股票』..." 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-8 pl-2"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`
                p-2 rounded-full transition-all
                ${inputValue.trim() 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }
              `}
            >
              <Send size={18} />
            </button>
          </div>

          <div className="flex justify-center mt-3 min-h-[40px] relative">
            <div 
              className="relative group"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <div className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border cursor-help transition-all duration-300
                ${caveatStyle.color}
              `}>
                <span className={warningType !== 'default' ? 'animate-pulse' : ''}>
                  {caveatStyle.icon}
                </span>
                <span>{caveatStyle.text}</span>
              </div>

              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-slate-100 text-xs p-3 rounded-lg shadow-xl z-50 animate-in zoom-in-95 duration-200">
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                  <p>{caveatStyle.tooltip}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};