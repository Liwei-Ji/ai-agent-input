// src/components/previews/Madlibs.tsx
import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput";
import { ChevronDown, ChevronUp, Send, Paperclip } from "lucide-react";

interface FormData {
  recipient: string;
  background: string;
  tone: string;
  purpose: string;
  keyPoints: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  type: "text" | "madlib_result";
  text?: string;
  data?: FormData;
}

export const Madlibs = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<"initial" | "form">("initial");
  
  const [formData, setFormData] = useState<FormData>({
    recipient: "",
    background: "",
    tone: "",
    purpose: "",
    keyPoints: ""
  });

  const isFormValid = Object.values(formData).every(val => val.trim() !== "");

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = () => {
    setMode("form");
    setFormData({
      recipient: "",
      background: "",
      tone: "",
      purpose: "",
      keyPoints: ""
    });
  };

  const handleSend = () => {
    if (mode === "form" && isFormValid) {
      // 1. 使用者發送「摘要卡片」
      const newUserMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        type: "madlib_result", 
        data: { ...formData } 
      };
      
      setMessages((prev) => [...prev, newUserMsg]);
      setMode("initial");

      // 2. AI 回覆「完整的信件草稿」
      // 這裡使用了與截圖完全一致的排版
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: "text",
          text: `Hi ${formData.recipient},
很高興上週有機會向你介紹我們的產品。
想跟進看看你是否有興趣親自體驗一下。我們目前提供 ${formData.keyPoints}，期間也可以隨時取消，沒有任何壓力。

如果你有任何問題，或想進一步了解，隨時告訴我！
Best,
AI Agent`
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormValid) {
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-md h-[500px] flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 訊息顯示區 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 pb-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
      >

        <div className="space-y-6">
          {messages.map((msg) => {
            // 渲染使用者的摘要卡片
            if (msg.type === "madlib_result" && msg.data) {
              return <MadlibResultCard key={msg.id} data={msg.data} />;
            }
            // 渲染 AI 的信件草稿
            return (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`
                  max-w-[90%] p-4 text-sm leading-7 rounded-2xl shadow-sm whitespace-pre-wrap
                  ${msg.sender === "user" 
                    ? "bg-blue-600 text-white rounded-br-sm" 
                    : "bg-slate-100 text-slate-700 rounded-bl-sm"}
                `}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* 表單區域 (Mode = Form) */}
        {mode === "form" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-3 mb-4 mt-6 px-1">
             <div className="flex items-center flex-wrap gap-2 text-sm text-slate-700">
              <input
                type="text"
                placeholder="[Name]"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                onKeyDown={handleKeyDown}
                className="bg-purple-100 text-purple-700 placeholder:text-purple-300 px-2 py-1 rounded w-24 text-center focus:outline-none focus:ring-2 focus:ring-purple-200"
                autoFocus
              />
              <span>Who is the recipient?</span>
            </div>
            
            <div className="flex items-center flex-wrap gap-2 text-sm text-slate-700">
              <input
                type="text"
                placeholder="[Text field]"
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                onKeyDown={handleKeyDown}
                className="bg-purple-100 text-purple-700 placeholder:text-purple-300 px-2 py-1 rounded w-32 text-center focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <span>What is the background of this email?</span>
            </div>

             <div className="flex items-center flex-wrap gap-2 text-sm text-slate-700">
              <input
                type="text"
                placeholder="[Tone]"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                onKeyDown={handleKeyDown}
                className="bg-purple-100 text-purple-700 placeholder:text-purple-300 px-2 py-1 rounded w-20 text-center focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <span>Tone</span>
            </div>

             <div className="flex items-center flex-wrap gap-2 text-sm text-slate-700">
              <input
                type="text"
                placeholder="[Text field]"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                onKeyDown={handleKeyDown}
                className="bg-purple-100 text-purple-700 placeholder:text-purple-300 px-2 py-1 rounded w-32 text-center focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <span>Purpose</span>
            </div>

             <div className="flex items-center flex-wrap gap-2 text-sm text-slate-700">
              <input
                type="text"
                placeholder="[Text field]"
                value={formData.keyPoints}
                onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                onKeyDown={handleKeyDown}
                className="bg-purple-100 text-purple-700 placeholder:text-purple-300 px-2 py-1 rounded w-32 text-center focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <span>Key Points</span>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作區 */}
      <div className="shrink-0 pt-2 pb-1">
        
        {mode === "initial" && (
          <div className="flex flex-wrap gap-2 mb-3 px-1 animate-in slide-in-from-bottom-2 fade-in duration-500">
            <button
              onClick={handleSuggestionClick}
              className="
                text-sm font-medium text-slate-700 bg-purple-100/50 
                border border-purple-100
                px-4 py-2 rounded-2xl
                hover:bg-purple-100 hover:border-purple-200 hover:scale-105
                transition-all cursor-pointer
              "
            >
              Write a follow-up email
            </button>
          </div>
        )}

        {mode === "form" ? (
          <div className="relative flex w-full items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
             <button disabled className="p-2 rounded-xl text-slate-300 cursor-not-allowed">
               <Paperclip size={20} />
             </button>
             
             <div className="flex-1 relative h-10 flex items-center">
                <input 
                  type="text" 
                  disabled 
                  placeholder="請填寫上方表單..." 
                  className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 cursor-default"
                />
             </div>

             <button
               onClick={handleSend}
               disabled={!isFormValid}
               className={`
                 flex items-center justify-center
                 w-10 h-10 rounded-full transition-all shrink-0
                 ${
                   isFormValid
                     ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
                     : "bg-slate-100 text-slate-300 cursor-not-allowed"
                 }
               `}
             >
               <Send size={18} />
             </button>
          </div>
        ) : (
          <ChatInput 
            placeholder={messages.length > 0 ? "Reply to continue..." : "Ask any question..."}
            onSend={(text) => console.log(text)}
          />
        )}
      </div>
    </div>
  );
};

// 摘要卡片組件
const MadlibResultCard = ({ data }: { data: FormData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex justify-end animate-in slide-in-from-bottom-2 duration-500">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-md cursor-pointer overflow-hidden max-w-[90%] transition-all duration-300"
      >
        <div className="p-3 px-4 flex items-center justify-between gap-3">
            <span className="text-sm font-medium">
              寫一封 {data.background} 的跟進信給 {data.recipient} ({data.tone})
            </span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {isExpanded && (
          <div className="bg-blue-600 p-4 pt-0 space-y-1 text-xs text-blue-50 border-t border-blue-500/30 pt-3 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-[60px_1fr] gap-1">
              <span className="opacity-70">收件人:</span>
              <span>{data.recipient}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr] gap-1">
              <span className="opacity-70">背景:</span>
              <span>{data.background}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr] gap-1">
              <span className="opacity-70">語氣:</span>
              <span>{data.tone}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr] gap-1">
              <span className="opacity-70">目的:</span>
              <span>{data.purpose}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr] gap-1">
              <span className="opacity-70">重點:</span>
              <span>{data.keyPoints}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};