import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  FileText, Sparkles, PenTool, ArrowRight 
} from "lucide-react";

interface SampleData {
  title: string;
  previewText: string; // 輕量級輸出
  fullContent: string; // 完整輸出
  status: 'preview' | 'generating' | 'completed';
}

interface Message {
  id: string;
  role: "user" | "ai";
  content?: string;
  sampleData?: SampleData;
}

export const SampleResponse = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef(false);

  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 對話內容(骨架屏設計規範)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Draft a design guideline for using 'Skeleton Loading' states in our mobile app."
    },
    {
      id: "2",
      role: "ai",
      content: "I've drafted an outline for the Skeleton Loading guidelines. Please review the structure before I write the detailed specifications:",
      sampleData: {
        title: "Draft: Skeleton Loading Guidelines",
        status: 'preview',
        previewText: `**Objective:** Improve perceived performance during data fetching.\n\n**Core Principles:**\n1. **Motion:** Use a subtle "shimmer" effect (left-to-right).\n2. **Layout Match:** Skeleton must match the final content structure to prevent layout shifts (CLS).\n3. **Duration:** Only use for wait times exceeding 500ms.\n\n*Should I proceed with these rules?*`,
        fullContent: `**Skeleton Loading Guidelines**\n\nSkeleton screens are essentially a wireframe version of the UI, used to indicate that content is loading. They improve the user's perception of speed by showing the structure of the page immediately.\n\n**1. Animation & Motion**\nInstead of a static gray box, use a "shimmer" animation moving from left to right. This creates a sense of momentum and progress. \n* Recommendation: Use \`bg-slate-200\` with a 1.5s linear gradient animation.\n\n**2. Layout Fidelity (Crucial)**\nThe skeleton structure must match the loaded content layout by at least 90%. If the skeleton is significantly smaller or larger than the actual content, it will cause a Cumulative Layout Shift (CLS) when data loads, creating a jarring experience.\n\n**3. Usage Threshold**\n- **< 500ms:** Use no loading state (instant).\n- **500ms - 2s:** Use Skeleton screens.\n- **> 2s:** Consider a progress bar or spinner with text feedback.`
      }
    }
  ]);

  // 同意並生成完整內容
  const handleGenerateFull = async (messageId: string) => {
    setIsGenerating(true);
    abortControllerRef.current = false;

    // 更新狀態為 generating
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.sampleData) {
        return {
          ...msg,
          sampleData: { ...msg.sampleData, status: 'generating' }
        };
      }
      return msg;
    }));

    // 模擬生成時間 (2.5秒)
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (abortControllerRef.current) {
        setIsGenerating(false);
        // 如果被停止，恢復到 preview 狀態
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId && msg.sampleData) {
              return { ...msg, sampleData: { ...msg.sampleData, status: 'preview' } };
            }
            return msg;
          }));
        return;
    }

    // 更新狀態為 completed
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.sampleData) {
        return {
          ...msg,
          sampleData: { ...msg.sampleData, status: 'completed' }
        };
      }
      return msg;
    }));

    setIsGenerating(false);
  };

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsGenerating(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "Got it. I'll update the guidelines based on your feedback."
        }]);
    }, 1000);
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
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isGenerating]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
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
                
                {/* 一般文字訊息 */}
                {msg.content && (
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`
                      max-w-[90%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                      ${msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                        : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                    `}>
                      {msg.content}
                    </div>
                  </div>
                )}

                {/* Sample Response Card */}
                {msg.role === "ai" && msg.sampleData && (
                  <div className="max-w-[90%] ml-0 mt-2">
                    <div className={`
                        group relative border rounded-2xl overflow-hidden transition-all duration-500
                        ${msg.sampleData.status === 'completed' 
                            ? "bg-white border-slate-200 shadow-sm" 
                            : "bg-white border-indigo-200 shadow-md ring-4 ring-indigo-50/50"}
                    `}>
                        
                        {/* Header */}
                        <div className={`
                            px-5 py-3 flex items-center justify-between border-b transition-colors
                            ${msg.sampleData.status === 'completed' 
                                ? "bg-slate-50 border-slate-100" 
                                : "bg-indigo-50 border-indigo-100"}
                        `}>
                            <div className="flex items-center gap-2">
                                {msg.sampleData.status === 'completed' ? (
                                    <FileText size={16} className="text-slate-500" />
                                ) : (
                                    <PenTool size={16} className="text-indigo-600" />
                                )}
                                <span className={`text-xs font-bold uppercase tracking-wider ${
                                    msg.sampleData.status === 'completed' ? "text-slate-500" : "text-indigo-600"
                                }`}>
                                    {msg.sampleData.status === 'completed' ? "Final Output" : "Sample Draft"}
                                </span>
                            </div>
                            
                            {/* 狀態標籤 */}
                            {msg.sampleData.status === 'preview' && (
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-indigo-600 font-medium shadow-sm">
                                    Preview Mode
                                </span>
                            )}
                        </div>

                        {/* Content Body */}
                        <div className="p-5">
                            {/* 根據狀態顯示不同內容 */}
                            {msg.sampleData.status === 'generating' ? (
                                <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400 animate-pulse">
                                    <Sparkles size={24} />
                                    <span className="text-sm">Generating detailed guidelines...</span>
                                </div>
                            ) : (
                                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                                    {msg.sampleData.status === 'completed' 
                                        ? msg.sampleData.fullContent 
                                        : msg.sampleData.previewText
                                    }
                                </div>
                            )}
                        </div>

                        {/* Action Footer (僅在 Preview 狀態顯示) */}
                        {msg.sampleData.status === 'preview' && (
                            <div className="p-3 bg-slate-50 border-t border-indigo-100 flex gap-2 justify-end">
                                <button className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                                    Discard
                                </button>
                                
                                <button
                                    onClick={() => handleGenerateFull(msg.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all"
                                >
                                    <span>Generate Full Guidelines</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        )}

                    </div>
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
                  placeholder={isGenerating ? "AI is writing..." : "Ask any question..."}
                  className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10"
                />
              </div>

              {/* 右側按鈕邏輯 */}
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