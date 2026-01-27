import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip 
} from "lucide-react";

// 定義訊息類型
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  isStopped?: boolean;
}

export const Controls = () => {
  // 邏輯狀態
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I can help you generate code, write emails, or analyze data. Just type below."
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref
  const generationTimeoutRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自動捲動邏輯
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isGenerating]);

  // 發送邏輯
  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsGenerating(true);

    // 模擬 AI 生成 (3秒)
    generationTimeoutRef.current = setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Here is the generated content based on your request. I have analyzed the parameters and optimized the workflow for better efficiency."
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 3000);
  };

  // 停止邏輯
  const handleStop = () => {
    if (generationTimeoutRef.current) {
      clearTimeout(generationTimeoutRef.current);
    }

    const stoppedMessage: Message = {
      id: Date.now().toString(),
      role: "ai",
      content: "Generation stopped by user.",
      isStopped: true
    };

    setMessages(prev => [...prev, stoppedMessage]);
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) handleSend();
    }
  };

  const handleLeftClick = () => {
    fileInputRef.current?.click();
  };

  return (
    // 外層容器 (Widget 模式)
    <div className="flex h-[500px] w-full min-h-[600px] overflow-hidden font-sans rounded-3xl relative flex-col">
      
      {/* 訊息列表區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col relative overflow-hidden">
          
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 w-full"
          >
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {/* 氣泡容器 */}
                <div className="max-w-[85%]">
                  
                  {/* Message Bubble */}
                  <div className={`
                    text-sm leading-relaxed
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white p-3.5 rounded-2xl rounded-br-sm shadow-sm"
                      : "bg-transparent text-slate-700 px-0 py-1"
                    }
                  `}>
                    {msg.content}
                  </div>

                </div>
              </div>
            ))}

            {/* 生成動畫 (無氣泡版) */}
            {isGenerating && (
              <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="max-w-[80%] px-0 py-2">
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

      </div>

      {/* 底部輸入控制區 */}
      <div className="shrink-0 p-4 z-10 w-full">
        <div className="max-w-md mx-auto w-full">
            
            {/* UI 容器 */}
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all duration-300
                ${isGenerating 
                    ? "border-slate-200 bg-white" 
                    : "border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
                }
            `}>
              
              {/* 左側按鈕 */}
              <button
                type="button"
                onClick={handleLeftClick}
                disabled={isGenerating}
                className="transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
              >
                <Paperclip size={20} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
              />

              {/* 輸入框 */}
              <div className="flex-1 relative h-10 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  placeholder={isGenerating ? "Generating..." : "Ask any question..."}
                  className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10"
                />
              </div>

              {/* 右側按鈕 (發送 / 停止) */}
              {isGenerating ? (
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 shadow-sm group"
                    title="Stop generating"
                  >
                    <span className="w-3 h-3 bg-current rounded-[1px] group-hover:scale-90 transition-transform"></span>
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