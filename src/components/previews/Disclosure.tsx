import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  Tag, X, Plus, Sparkles, AlertCircle 
} from "lucide-react";

// 定義標籤結構
interface CategoryTag {
  id: string;
  label: string;
  confidence: 'high' | 'medium' | 'low';
  isAiSuggested: boolean;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  // AI 訊息附帶的標籤建議
  disclosureData?: {
    tags: CategoryTag[];
  };
}

// 模擬一些預定義的標籤庫，用於"添加"功能
const AVAILABLE_TAGS = [
  { id: 'refund', label: 'Refund Request' },
  { id: 'shipping', label: 'Shipping Issue' },
  { id: 'ux', label: 'UX Feedback' },
  { id: 'urgent', label: 'Urgent' },
];

export const Disclosure = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<any>(null);

  // 用來控制"添加標籤"選單的顯示 (簡單模擬)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Here is a customer email: 'I received my order #12345 yesterday, but the package was damaged and the item is broken. I need a replacement or my money back immediately.'"
    },
    {
      id: "2",
      role: "ai",
      content: "I've analyzed the customer's sentiment and intent. Here are the suggested categories for this ticket:",
      disclosureData: {
        tags: [
          { id: 't1', label: 'Damaged Item', confidence: 'high', isAiSuggested: true },
          { id: 't2', label: 'Refund Request', confidence: 'high', isAiSuggested: true },
          { id: 't3', label: 'High Priority', confidence: 'medium', isAiSuggested: true },
        ]
      }
    }
  ]);

  // 移除標籤
  const handleRemoveTag = (msgId: string, tagId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.disclosureData) {
        return {
          ...msg,
          disclosureData: {
            tags: msg.disclosureData.tags.filter(t => t.id !== tagId)
          }
        };
      }
      return msg;
    }));
  };

  // 添加標籤
  const handleAddTag = (msgId: string, tagLabel: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId && msg.disclosureData) {
        // 避免重複
        if (msg.disclosureData.tags.some(t => t.label === tagLabel)) return msg;
        
        return {
          ...msg,
          disclosureData: {
            tags: [
              ...msg.disclosureData.tags,
              { 
                id: Date.now().toString(), 
                label: tagLabel, 
                confidence: 'high', 
                isAiSuggested: false // 手動添加的不算 AI 建議
              }
            ]
          }
        };
      }
      return msg;
    }));
    setIsAddMenuOpen(null);
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
        content: "Based on the text, I've identified the following key topics:",
        disclosureData: {
          tags: [
            { id: 'new1', label: 'Product Feedback', confidence: 'high', isAiSuggested: true },
            { id: 'new2', label: 'Feature Request', confidence: 'medium', isAiSuggested: true }
          ]
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
                    max-w-[95%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                      : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                  `}>
                    {msg.content}
                  </div>
                </div>

                {/* Disclosure Area (AI 建議標籤區) */}
                {msg.role === "ai" && msg.disclosureData && (
                    <div className="ml-0 max-w-[95%] animate-in fade-in slide-in-from-top-1 duration-500">
                        {/* 容器：帶有背景色與邊框，強調這是"附加資訊" */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                            
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <Sparkles size={12} className="text-indigo-500" />
                                    <span>Suggested Categories</span>
                                </div>
                                {/* 提示 icon */}
                                <div className="group relative">
                                    <AlertCircle size={14} className="text-slate-400 cursor-help" />
                                    <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        These tags were generated by AI. Please review and modify as needed.
                                    </div>
                                </div>
                            </div>

                            {/* Tags Grid */}
                            <div className="flex flex-wrap gap-2">
                                {msg.disclosureData.tags.map((tag) => (
                                    <div 
                                        key={tag.id}
                                        className={`
                                            group flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-xs font-medium border transition-all duration-200
                                            ${tag.isAiSuggested 
                                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300" 
                                                : "bg-white text-slate-700 border-slate-200"}
                                        `}
                                    >
                                        {/* Tag Label */}
                                        <span>{tag.label}</span>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveTag(msg.id, tag.id)}
                                            className={`
                                                p-0.5 rounded-full hover:bg-black/10 transition-colors
                                                ${tag.isAiSuggested ? "text-indigo-400 hover:text-indigo-800" : "text-slate-400 hover:text-slate-600"}
                                            `}
                                            title="Remove tag"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}

                                {/* Add Tag Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsAddMenuOpen(isAddMenuOpen === msg.id ? null : msg.id)}
                                        className="flex items-center gap-1 pl-2 pr-3 py-1 rounded-full text-xs font-medium border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 transition-all"
                                    >
                                        <Plus size={12} />
                                        Add
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isAddMenuOpen === msg.id && (
                                        <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-20 animate-in zoom-in-95 duration-200">
                                            <div className="p-1">
                                                {AVAILABLE_TAGS.map(option => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleAddTag(msg.id, option.label)}
                                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors flex items-center gap-2"
                                                    >
                                                        <Tag size={12} className="text-slate-400" />
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

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