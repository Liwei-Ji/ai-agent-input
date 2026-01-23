import { useState, useRef, useEffect } from "react";
import { Send, ShieldCheck, Database, User, Lock, ArrowRight, Check, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export const Consent = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "To provide you with the best personalized experience, I learn from our interactions. Ready to start?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  
  // 控制 Consent 卡片的顯示
  const [showConsent, setShowConsent] = useState(false);
  const [consentStatus, setConsentStatus] = useState<"pending" | "accepted" | "anonymized" | "declined">("pending");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // 1. 先發送 User 訊息
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    
    // 2. 模擬系統檢測到需要收集數據，觸發 Consent 卡片
    // 只有在第一次或特定情境下觸發，這裡為了演示每次發送後觸發 (如果尚未決定)
    if (consentStatus === "pending") {
      setTimeout(() => {
        setShowConsent(true);
      }, 600);
    } else {
      // 如果已經決定過，就正常回覆
      setTimeout(() => {
        const reply = consentStatus === "declined" 
          ? "Understood. I will not use this data for training." 
          : "Thanks! Processing your request with your privacy preferences.";
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: reply
        }]);
      }, 800);
    }
  };

  const handleConsentAction = (type: "accepted" | "anonymized" | "declined") => {
    setConsentStatus(type);
    setShowConsent(false);

    // 根據選擇給予不同回饋
    let responseText = "";
    if (type === "accepted") responseText = "Thank you! Your data helps improve the model for everyone.";
    if (type === "anonymized") responseText = "Got it. We will scrub all PII (Personal Identifiable Information) before aggregation.";
    if (type === "declined") responseText = "No problem. Your data will remain strictly local and private.";

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "ai",
        text: responseText
      }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, showConsent]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 聊天區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-12"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" ? (
                  // AI: 純文字 (無氣泡)
                  <div className="max-w-[95%] text-slate-700 text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                    {msg.text}
                  </div>
                ) : (
                  // User: 基本款藍色氣泡
                  <div className="max-w-[90%] p-4 text-sm leading-7 rounded-2xl rounded-br-sm shadow-sm whitespace-pre-wrap bg-blue-600 text-white">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {/* --- Consent 交互卡片 --- */}
            {showConsent && (
              <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-emerald-500" size={18} />
                      <span className="text-sm font-semibold text-slate-700">Data Usage Consent</span>
                    </div>
                  </div>

                  {/* Body: 視覺化資料流向 */}
                  <div className="p-5">
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      We use conversation data to improve our models. Your personal identifiers are removed before processing.
                    </p>

                    {/* Data Flow Visualization Diagram */}
                    <div className="flex items-center justify-between mb-6 px-2">
                      {/* Step 1: User */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User size={18} />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">You</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex-1 h-px bg-slate-200 mx-2 relative">
                         <ArrowRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                      </div>

                      {/* Step 2: Anonymization */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 relative">
                          <Lock size={16} />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-emerald-100">
                             <Check size={10} className="text-emerald-600" />
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">Anonymize</span>
                      </div>

                      {/* Arrow */}
                      <div className="flex-1 h-px bg-slate-200 mx-2 relative">
                         <ArrowRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                      </div>

                      {/* Step 3: Model */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <Database size={18} />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">Training</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleConsentAction("accepted")}
                        className="w-full py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Allow & Improve Model
                      </button>
                      
                      <div className="flex gap-2">
                        <button 
                           onClick={() => handleConsentAction("anonymized")}
                           className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Anonymize Only
                        </button>
                        <button 
                           onClick={() => handleConsentAction("declined")}
                           className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Don't Use
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部輸入區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 relative z-20">
            {/* 輸入框: 基本款 */}
            <div className="relative flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  // 如果正在顯示 Consent 卡片，可以暫時禁用輸入框，強迫用戶選擇
                  disabled={showConsent}
                  placeholder={showConsent ? "Please select an option above..." : "Type feedback..."}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-8 pl-2 disabled:cursor-not-allowed"
                />

                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || showConsent}
                  className={`
                    p-2 rounded-full transition-all
                    ${inputValue.trim() && !showConsent
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    }
                  `}
                >
                  <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};