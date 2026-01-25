import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput"; 
import { Check, Sparkles, Split } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text?: string;
  // 變體相關資料
  variations?: string[]; // 存放兩個不同的回覆
  selectedVariationIndex?: number | null; // 使用者選擇了哪一個 (0 或 1)
}

export const Variations = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 模擬預設對話
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      text: "Draft a short tweet about launching a new design tool."
    },
    {
      id: "2",
      role: "ai",
      text: "Here are two options for your tweet:",
      variations: [
        "🚀 Launch Day! Introducing our new design tool that helps you build faster and better. #Design #Tech",
        "Say hello to the future of UI design. ✨ Minimalist, fast, and powerful. Try it out today! #UXUI"
      ],
      selectedVariationIndex: null
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  // 處理選擇變體
  const handleSelectVariation = (messageId: string, index: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        // 如果已經選擇了同一個，可以取消選擇 (toggle)，或者保持選中
        // 這裡設定為：點擊即選中，可以切換
        return { ...msg, selectedVariationIndex: index };
      }
      return msg;
    }));
  };

  const handleSend = (text: string) => {
    const newMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages(prev => [...prev, newMsg]);
    setIsGenerating(true);
    
    // 模擬 AI 生成雙版本
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "I've drafted two versions based on that tone:",
        variations: [
          "Option A focuses on professional efficiency. It highlights the workflow improvements and ROI.",
          "Option B is more casual and community-driven. It focuses on creativity and collaboration features."
        ],
        selectedVariationIndex: null
      }]);
      setIsGenerating(false);
    }, 1500);
  };

  // 自動捲動
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
          <div className="space-y-8"> {/* 增加間距，因為雙卡片佔空間較大 */}
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                
                {/* 訊息本體 (User 或 AI 的引言) */}
                {msg.text && (
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`
                      max-w-[90%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                      ${msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                        : "bg-transparent text-slate-700 px-0 py-0"} 
                    `}>
                      {msg.text}
                    </div>
                  </div>
                )}

                {/* 變體選擇區 (Variations Grid) - 僅 AI 且有變體時顯示 */}
                {msg.role === "ai" && msg.variations && (
                  <div className="grid grid-cols-2 gap-3 mt-1 pl-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {msg.variations.map((variation, index) => {
                      const isSelected = msg.selectedVariationIndex === index;
                      const isOtherSelected = msg.selectedVariationIndex !== null && !isSelected;

                      return (
                        <div 
                          key={index}
                          onClick={() => handleSelectVariation(msg.id, index)}
                          className={`
                            relative p-4 rounded-xl border text-sm leading-6 cursor-pointer transition-all duration-300
                            flex flex-col gap-3 group
                            ${isSelected 
                              ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 z-10 scale-[1.02] shadow-md" 
                              : isOtherSelected 
                                ? "border-slate-100 bg-slate-50 opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                                : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                            }
                          `}
                        >
                          {/* 標籤 Header */}
                          <div className="flex items-center justify-between">
                            <span className={`
                              text-[10px] font-bold uppercase tracking-wider
                              ${isSelected ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}
                            `}>
                              Option {index === 0 ? "A" : "B"}
                            </span>
                            
                            {/* 選中狀態的圖標 */}
                            <div className={`
                              w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
                              ${isSelected 
                                ? "bg-indigo-600 text-white scale-100" 
                                : "bg-slate-100 text-transparent scale-0 group-hover:scale-100 group-hover:bg-slate-200 group-hover:text-slate-400"}
                            `}>
                              <Check size={12} strokeWidth={3} />
                            </div>
                          </div>

                          {/* 內容 */}
                          <p className={`
                             ${isSelected ? "text-slate-800" : "text-slate-600"}
                          `}>
                            {variation}
                          </p>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            ))}

            {/* 生成中狀態 (Skeleton) */}
            {isGenerating && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400 text-xs ml-1">
                        <Sparkles size={12} className="animate-pulse" />
                        <span>Generating variations...</span>
                    </div>
                    {/* 雙卡片骨架屏 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-32 rounded-xl border border-slate-100 bg-slate-50 animate-pulse" />
                        <div className="h-32 rounded-xl border border-slate-100 bg-slate-50 animate-pulse delay-150" />
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* 底部輸入框 */}
        <div className="shrink-0 pt-2 pb-4 px-4 z-10">
            {/* 提示文字 (可選) */}
            {messages.length > 0 && messages[messages.length - 1].role === "ai" && !isGenerating && (
                 <div className="flex justify-center mb-3">
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 flex items-center gap-1">
                        <Split size={10} />
                        Select the better response to continue
                    </span>
                 </div>
            )}

          <ChatInput 
            placeholder="Ask AI to draft something..." 
            onSend={handleSend}
            disabled={isGenerating}
          />
        </div>
      </div>

    </div>
  );
};