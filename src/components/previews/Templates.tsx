import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput";
import { LayoutTemplate, Send } from "lucide-react"; 

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export const Templates = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 模式狀態
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  
  // 表單數據
  const [formData, setFormData] = useState({
    name: "",
    product: ""
  });

  const isFormValid = formData.name.trim() !== "" && formData.product.trim() !== "";

  const handleSend = (text?: string) => {
    const finalContent = isTemplateMode 
      ? `Hi, ${formData.name} I noticed your recent update on ${formData.product} and it looks like your team is focused on improving the user experience.`
      : text;

    if (!finalContent) return;

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      text: finalContent,
      sender: "user",
    }]);

    setIsTemplateMode(false);
    setFormData({ name: "", product: "" });

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text: "Generating a response based on the input",
        sender: "ai"
      }]);
    }, 800);
  };

  // Template 模式下的鍵盤事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 如果按下 Enter 且表單有效，就直接發送
    if (e.key === "Enter" && isFormValid) {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTemplateMode]);

  return (
    <div className="w-full max-w-md h-[500px] flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 訊息顯示區 */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <div className="mb-6 space-y-1 mt-2">
          <h3 className="text-sm font-medium text-slate-500">Hi, I'm AI Agent</h3>
          <p className="text-xs text-slate-400 font-medium">15:47</p>
        </div>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`
                max-w-[85%] p-4 text-sm leading-relaxed rounded-2xl whitespace-pre-wrap
                ${msg.sender === "user" 
                  ? "bg-blue-600 text-white rounded-br-sm shadow-md" 
                  : "text-slate-500 rounded-bl-sm"}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* 輸入框區域 */}
      <div className="shrink-0 pt-4 pb-1 flex flex-col justify-end">
        
        {/* 邏輯判斷 */}
        {isTemplateMode ? (
          /* Template 編輯模式 */
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all flex flex-col gap-2">
            
            {/* Template 文件區域 */}
            <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm text-slate-700 leading-8 font-medium animate-in zoom-in-95 duration-200">
              <span>Hi, </span>
              <input 
                type="text" 
                placeholder="[Name]" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                // 綁定鍵盤事件
                onKeyDown={handleKeyDown}
                className="
                  inline-flex w-24 px-2 mx-1 h-7 rounded-lg
                  bg-purple-100 text-slate-700 placeholder:text-purple-300
                  border border-purple-200 focus:ring-2 focus:ring-purple-200 outline-none
                  text-center transition-all align-middle
                "
                autoFocus
              />
              <span> I noticed your recent update on </span>
              <input 
                type="text" 
                placeholder="[Product Update]" 
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                // 綁定鍵盤事件
                onKeyDown={handleKeyDown}
                className="
                  inline-flex w-36 px-2 mx-1 h-7 rounded-lg
                  bg-purple-100 text-slate-700 placeholder:text-purple-300
                  border border-purple-200 focus:ring-2 focus:ring-purple-200 outline-none
                  text-center transition-all align-middle
                "
              />
              <span> and it looks like your team is focused on improving the user experience.</span>
            </div>

            {/* 底部工具列 */}
            <div className="flex items-center justify-between">
              
              {/* 左側 Templates 按鈕 */}
              <button
                onClick={() => setIsTemplateMode(false)}
                className="flex items-center justify-center h-10 rounded-xl px-3 bg-slate-100 text-slate-700 transition-all hover:bg-slate-200"
              >
                <LayoutTemplate size={20} />
                <span className="ml-2 text-sm font-semibold whitespace-nowrap animate-in slide-in-from-left-2 fade-in duration-300">
                  Templates
                </span>
              </button>

              {/* 右側 發送按鈕 */}
              <button
                onClick={() => handleSend()}
                disabled={!isFormValid}
                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-full transition-all shrink-0
                  ${isFormValid
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }
                `}
              >
                <Send size={18} />
              </button>
            </div>

          </div>
        ) : (
          /* ChatInput */
          <ChatInput 
            leftIcon={<LayoutTemplate size={20} />}
            onLeftIconClick={() => setIsTemplateMode(true)}
            uploadButtonClass="text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
            onSend={handleSend}
            placeholder="Ask any question..."
          />
        )}

        {/* 狀態提示 */}
        <div className={`
          text-[10px] text-slate-400 font-medium text-center mt-2 
          min-h-[20px] transition-opacity duration-300
          ${isTemplateMode ? "opacity-100" : "opacity-0"}
        `}>
          Fill in the purple tags to complete the message.
        </div>

      </div>
    </div>
  );
};