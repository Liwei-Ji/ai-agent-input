import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  Briefcase, Smile, Zap, MessageSquare 
} from "lucide-react";

// 定義語調類型
type ToneType = 'default' | 'professional' | 'witty' | 'concise';

interface ToneOption {
  id: ToneType;
  label: string;
  icon: React.ReactNode;
}

// 模擬同一問題的不同語調回覆
const VARIATIONS = {
  default: "Sleep is essential for your body and mind to recharge. It helps with memory consolidation, muscle repair, and regulating hormones that control appetite and stress. Without enough sleep, your brain cannot function properly.",
  
  professional: "Sleep is a critical biological process required for the maintenance of cognitive and physiological health. It facilitates memory consolidation, neural waste clearance via the glymphatic system, and metabolic regulation. Chronic sleep deprivation is correlated with significant long-term health risks.",
  
  witty: "Think of sleep as your body's nightly software update. It fixes bugs (muscle repair), saves files (memories), and clears the cache (toxins). If you skip it, your system starts lagging and might eventually crash. Don't be a zombie—go to bed!",
  
  concise: "• Restores energy.\n• Consolidates memory.\n• Repairs tissue.\n• Regulates hormones.\n• Essential for brain function."
};

const TONE_OPTIONS: ToneOption[] = [
  { id: 'default', label: 'Standard', icon: <MessageSquare size={14} /> },
  { id: 'professional', label: 'Professional', icon: <Briefcase size={14} /> },
  { id: 'witty', label: 'Witty', icon: <Smile size={14} /> },
  { id: 'concise', label: 'Concise', icon: <Zap size={14} /> },
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  // 僅 AI 訊息有語調狀態
  toneState?: {
    current: ToneType;
    isRewriting: boolean;
  };
}

export const PersonalVoice = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Why do we need sleep?"
    },
    {
      id: "2",
      role: "ai",
      content: VARIATIONS.default,
      toneState: {
        current: 'default',
        isRewriting: false
      }
    }
  ]);

  // 切換語調
  const handleToneChange = async (msgId: string, newTone: ToneType) => {
    // 1. 設定為改寫中狀態 (顯示 Loading 或骨架屏)
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.toneState) {
        // 如果已經是這個語調，就不做動作
        if (msg.toneState.current === newTone) return msg;
        return {
          ...msg,
          toneState: { ...msg.toneState, isRewriting: true, current: newTone }
        };
      }
      return msg;
    }));

    // 模擬 API 延遲 (600ms)
    await new Promise(resolve => setTimeout(resolve, 600));

    // 2. 更新內容並結束改寫狀態
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.toneState) {
        return {
          ...msg,
          content: VARIATIONS[newTone],
          toneState: { ...msg.toneState, isRewriting: false }
        };
      }
      return msg;
    }));
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsGenerating(true);
    
    // 模擬生成
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I've noted that. Is there anything else you'd like to adjust regarding the tone?",
        toneState: {
          current: 'default',
          isRewriting: false
        }
      }]);
      setIsGenerating(false);
    }, 1000);
  };

  const handleStop = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) handleSend();
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isGenerating]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500 ">
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                
                {/* 訊息氣泡 */}
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[95%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap transition-all duration-300
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                      : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                  `}>
                    
                    {/* 改寫中的 Loading 狀態 */}
                    {msg.role === "ai" && msg.toneState?.isRewriting ? (
                        <div className="space-y-2 animate-pulse py-1 w-[280px]">
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                        </div>
                    ) : (
                        msg.content
                    )}

                  </div>
                </div>

                {/* Tone Switcher Chips (僅 AI 訊息顯示) */}
                {msg.role === "ai" && msg.toneState && (
                    <div className="flex flex-wrap gap-2 pl-0 animate-in fade-in slide-in-from-top-1 duration-500">
                        {TONE_OPTIONS.map((option) => {
                            const isActive = msg.toneState?.current === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleToneChange(msg.id, option.id)}
                                    disabled={msg.toneState?.isRewriting}
                                    className={`
                                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                                        ${isActive
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                        }
                                        disabled:cursor-not-allowed disabled:opacity-70
                                    `}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入控制區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 z-10">
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all duration-300
                ${isGenerating 
                    ? "border-slate-200 bg-white" 
                    : "border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
                }
            `}>
              
              <button
                type="button"
                className="transition-colors shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                disabled={isGenerating}
              >
                <Paperclip size={20} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
              />

              <div className="flex-1 relative h-10 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  placeholder="Ask any question..."
                  className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10"
                />
              </div>

              {isGenerating ? (
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 active:scale-90 shadow-sm"
                    title="Stop Generating"
                  >
                    <span className="w-3 h-3 bg-current"></span>
                  </button>
              ) : (
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={`
                      flex items-center justify-center
                      w-10 h-10 rounded-full transition-all shrink-0
                      ${
                        inputValue.trim()
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      }
                    `}
                  >
                    <Send size={18} />
                  </button>
              )}

            </div>
        </div>
      </div>

    </div>
  );
};