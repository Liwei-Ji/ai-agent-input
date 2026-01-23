// src/components/previews/Watermark.tsx
import { useState, useRef, useEffect } from "react";
import { Send, Fingerprint, ShieldCheck, Scan, CheckCircle, FileText } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  // 擴充：訊息可能包含「可驗證的生成內容」
  attachment?: {
    type: "text" | "image";
    title: string;
    content: string;
    watermarkId: string;
  };
}

export const Watermark = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  
  // 驗證狀態
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedIds, setVerifiedIds] = useState<string[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "I can generate watermarked content to ensure authenticity. What do you need today?"
    }
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // 1. User 訊息
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    
    // 2. AI 回覆 (包含帶有水印的附件)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Here is the draft you requested. It includes a digital watermark to verify its origin.",
        attachment: {
          type: "text",
          title: "UX_Audit_Report_2026.txt",
          content: "EXECUTIVE SUMMARY\n\nOur latest usability testing revealed a 15% drop-off at the checkout screen. Users reported confusion regarding the 'Guest Checkout' visibility. \n\nRecommendation: Increase contrast for primary CTA and simplify form fields.",
          watermarkId: `AI-SIG-${Math.floor(Math.random() * 10000)}` // 模擬雜湊值
        }
      }]);
    }, 800);
  };

  // 模擬驗證過程
  const handleVerify = (msgId: string) => {
    if (verifiedIds.includes(msgId)) return; // 已驗證過

    setVerifyingId(msgId);
    
    // 模擬 1.5秒 的掃描過程
    setTimeout(() => {
      setVerifyingId(null);
      setVerifiedIds(prev => [...prev, msgId]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, verifyingId, verifiedIds]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 聊天區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col pt-12">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-2">
                
                {/* 訊息本體 */}
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" ? (
                    // AI: 純文字 (無氣泡)
                    <div className="max-w-[95%] text-slate-700 text-sm leading-7 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                      {msg.text}
                    </div>
                  ) : (
                    // User: 藍色氣泡
                    <div className="max-w-[90%] p-4 text-sm leading-7 rounded-2xl rounded-br-sm shadow-sm whitespace-pre-wrap bg-blue-600 text-white">
                      {msg.text}
                    </div>
                  )}
                </div>

                {/* --- Watermark Attachment (附件卡片) --- */}
                {msg.attachment && (
                  <div className="ml-0 max-w-[95%] animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative overflow-hidden bg-slate-50 border border-slate-200 rounded-xl p-4 group hover:shadow-md transition-shadow">
                      
                      {/* 背景浮水印 (裝飾) */}
                      <div className="absolute -right-6 -bottom-6 text-slate-200 opacity-20 pointer-events-none transform rotate-12">
                        <Fingerprint size={120} />
                      </div>

                      {/* 內容預覽 */}
                      <div className="flex items-start gap-3 mb-3 relative z-10">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-500">
                           <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{msg.attachment.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-mono opacity-80">
                            {msg.attachment.content}
                          </p>
                        </div>
                      </div>

                      {/* 驗證區域 (Interaction Zone) */}
                      <div className="relative z-10 pt-2 border-t border-slate-200/60 mt-2 flex items-center justify-between">
                        
                        {verifiedIds.includes(msg.id) ? (
                          // 狀態：已驗證 (Verified)
                          <div className="flex items-center gap-2 text-emerald-600 animate-in zoom-in duration-300">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-medium tracking-wide">
                              DIGITALLY VERIFIED: {msg.attachment.watermarkId}
                            </span>
                          </div>
                        ) : verifyingId === msg.id ? (
                          // 狀態：驗證中 (Scanning)
                          <div className="flex items-center gap-2 text-indigo-600">
                            <Scan size={14} className="animate-spin" />
                            <span className="text-[10px] font-medium tracking-wide animate-pulse">
                              VERIFYING ORIGIN...
                            </span>
                          </div>
                        ) : (
                          // 狀態：未驗證 (Pending)
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Fingerprint size={14} />
                            <span className="text-[10px] font-medium tracking-wide">
                              AI WATERMARKED CONTENT
                            </span>
                          </div>
                        )}

                        {/* 驗證按鈕 */}
                        {!verifiedIds.includes(msg.id) && (
                          <button 
                            onClick={() => handleVerify(msg.id)}
                            disabled={verifyingId === msg.id}
                            className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                          >
                            {verifyingId === msg.id ? "Scanning..." : "Verify"}
                          </button>
                        )}
                        
                        {/* 驗證成功後的打勾 */}
                        {verifiedIds.includes(msg.id) && (
                           <CheckCircle size={14} className="text-emerald-500" />
                        )}

                      </div>
                      
                      {/* 掃描線動畫 (只在驗證時出現) */}
                      {verifyingId === msg.id && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent z-0 animate-scan pointer-events-none h-[200%] w-full -translate-y-1/2"></div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 relative z-20">
            {/* 基本款輸入框 */}
            <div className="relative flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask to generate a draft..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-8 pl-2"
                />

                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`
                    p-2 rounded-full transition-all
                    ${inputValue.trim() 
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
      
      {/* 定義掃描動畫 Keyframes (如果 Tailwind config 沒設，這裡用 style 補強) */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};