import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  ScanEye, Zap, Coins, BarChart3, Info 
} from "lucide-react";

// 定義 Token 結構
interface Token {
  id: number;
  text: string;
  colorIndex: number; // 用於決定交替顏色
  logProb: string;    // 模擬信心分數
}

interface TokenStats {
  count: number;
  timeMs: number;
  cost: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  // AI 訊息包含 Token 資料
  tokenData?: {
    tokens: Token[];
    stats: TokenStats;
    isViewActive: boolean; // 是否開啟 Token 視圖
  };
}

// 模擬 Token 切分工具
const mockTokenize = (text: string): Token[] => {
  // 簡單模擬：將單字拆開，或將長單字拆成兩半，以模擬真實 Tokenizer 行為
  const words = text.split(/(\s+)/); // 保留空格
  let tokens: Token[] = [];
  let counter = 0;

  words.forEach((word) => {
    if (word.length > 5 && !word.includes(" ")) {
      // 模擬長單字被切分 (例如 "Tokenization" -> "Token" + "ization")
      const mid = Math.floor(word.length / 2);
      tokens.push({ id: counter++, text: word.slice(0, mid), colorIndex: counter % 5, logProb: "-0.02" });
      tokens.push({ id: counter++, text: word.slice(mid), colorIndex: counter % 5, logProb: "-0.15" });
    } else {
      tokens.push({ id: counter++, text: word, colorIndex: counter % 5, logProb: "-0.01" });
    }
  });
  return tokens;
};

export const TokenTransparency = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Explain how LLMs process text inputs."
    },
    {
      id: "2",
      role: "ai",
      content: "LLMs don't read text like humans do. Instead, they break down text into smaller units called 'tokens'. These tokens can be words, characters, or sub-words.",
      tokenData: {
        tokens: mockTokenize("LLMs don't read text like humans do. Instead, they break down text into smaller units called 'tokens'. These tokens can be words, characters, or sub-words."),
        stats: { count: 32, timeMs: 450, cost: "$0.0004" },
        isViewActive: false
      }
    }
  ]);

  // 切換 Token 視圖
  const toggleTokenView = (msgId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.tokenData) {
        return {
          ...msg,
          tokenData: {
            ...msg.tokenData,
            isViewActive: !msg.tokenData.isViewActive
          }
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
      const responseText = "Tokenization is the first step in the NLP pipeline. It converts raw text strings into numerical vectors that the model can process mathematically.";
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: responseText,
        tokenData: {
          tokens: mockTokenize(responseText),
          stats: { count: 28, timeMs: 320, cost: "$0.0003" },
          isViewActive: false // 預設關閉
        }
      }]);
      setIsGenerating(false);
    }, 1500);
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

  // Token 顏色映射 (OpenAI 風格的柔和色調)
  const getTokenColor = (index: number) => {
    const colors = [
      "bg-red-100 text-red-700 hover:bg-red-200",       // 0
      "bg-orange-100 text-orange-700 hover:bg-orange-200", // 1
      "bg-amber-100 text-amber-700 hover:bg-amber-200",    // 2
      "bg-green-100 text-green-700 hover:bg-green-200",    // 3
      "bg-blue-100 text-blue-700 hover:bg-blue-200",       // 4
      "bg-indigo-100 text-indigo-700 hover:bg-indigo-200", // 5 (fallback logic usually mod 5)
    ];
    return colors[index % 5];
  };

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
                
                {/* 訊息本體 */}
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[95%] p-4 text-sm leading-7 rounded-2xl
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                      : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                  `}>
                    
                    {/* 一般視圖 vs Token 視圖 */}
                    {msg.role === "ai" && msg.tokenData && msg.tokenData.isViewActive ? (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            {/* Token Heatmap */}
                            <div className="flex flex-wrap items-center leading-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-inner">
                                {msg.tokenData.tokens.map((token, idx) => (
                                    <span 
                                        key={idx}
                                        className={`
                                            inline-block px-0.5 mx-[1px] rounded cursor-help transition-colors duration-200
                                            ${token.text.trim() === "" ? "min-w-[4px]" : ""}
                                            ${getTokenColor(token.colorIndex)}
                                        `}
                                        title={`Token ID: ${token.id}\nLogProb: ${token.logProb}`}
                                    >
                                        {token.text.replace("\n", "↵")}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Token Stats Panel */}
                            <div className="flex items-center gap-4 text-xs text-slate-500 px-2">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <BarChart3 size={14} className="text-indigo-500" />
                                    <span className="font-mono font-medium text-slate-700">{msg.tokenData.stats.count}</span>
                                    <span>tokens</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <Zap size={14} className="text-amber-500" />
                                    <span className="font-mono font-medium text-slate-700">{msg.tokenData.stats.timeMs}ms</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <Coins size={14} className="text-green-500" />
                                    <span className="font-mono font-medium text-slate-700">{msg.tokenData.stats.cost}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // 普通文字模式
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}

                  </div>
                </div>

                {/* Token Toggle Button (僅 AI 訊息顯示) */}
                {msg.role === "ai" && msg.tokenData && (
                    <div className="flex justify-start px-0">
                        <button
                            onClick={() => toggleTokenView(msg.id)}
                            className={`
                                flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-lg transition-all
                                ${msg.tokenData.isViewActive 
                                    ? "bg-indigo-100 text-indigo-600 ring-1 ring-indigo-200" 
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}
                            `}
                        >
                            <ScanEye size={12} />
                            {msg.tokenData.isViewActive ? "Hide Tokens" : "Inspect Tokens"}
                        </button>
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