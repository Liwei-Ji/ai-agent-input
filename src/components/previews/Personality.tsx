import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  Smile, Briefcase, Terminal, ChevronDown, Check, Settings2
} from "lucide-react";

type PersonalityType = 'friendly' | 'professional' | 'mechanical';

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

// 定義不同個性的設定檔
const PERSONALITY_CONFIG = {
  friendly: {
    id: 'friendly',
    name: 'Friendly',
    description: 'Casual & Enthusiastic',
    icon: <Smile size={16} />,
    themeColor: 'orange',
    bubbleStyle: 'bg-orange-50 text-orange-900 border border-orange-100 rounded-2xl rounded-tl-sm',
    avatarBg: 'bg-orange-500 text-white',
    demoResponse: "Oh no! That sounds super frustrationg. But don't worry, we can definitely fix this together! It sounds like a connection issue. Have you tried checking your wifi? "
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Concise & Objective',
    icon: <Briefcase size={16} />,
    themeColor: 'blue',
    bubbleStyle: 'bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm',
    avatarBg: 'bg-blue-600 text-white',
    demoResponse: "I have analyzed the error log. The connectivity timeout suggests a network latency issue greater than 5000ms. I recommend verifying the firewall settings and retrying the request."
  },
  mechanical: {
    id: 'mechanical',
    name: 'Mechanical',
    description: 'Raw Data & Speed',
    icon: <Terminal size={16} />,
    themeColor: 'emerald',
    bubbleStyle: 'bg-zinc-900 text-emerald-400 border border-zinc-700 rounded-xl rounded-tl-sm font-mono text-xs shadow-sm',
    avatarBg: 'bg-zinc-800 text-emerald-500 border border-zinc-700',
    demoResponse: "ERROR: CONNECTION_TIMED_OUT [Code: 504].\nACTION: CHECK_NETWORK_INTERFACE.\nSTATUS: AWAITING_INPUT..."
  }
};

export const Personality = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<any>(null);

  const [currentPersonality, setCurrentPersonality] = useState<PersonalityType>('friendly');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "My dashboard isn't loading, I'm getting a timeout error."
    },
    {
      id: "2",
      role: "ai",
      content: PERSONALITY_CONFIG['friendly'].demoResponse
    },
    {
      id: "3",
      role: "user",
      content: "Can you help me debug?"
    },
    {
        id: "4",
        role: "ai",
        content: "Processing request..."
    }
  ]);

  useEffect(() => {
    setMessages(prev => prev.map(msg => {
      if (msg.role === 'ai') {
        return { ...msg, content: PERSONALITY_CONFIG[currentPersonality].demoResponse };
      }
      return msg;
    }));
  }, [currentPersonality]);

  const handleSwitchPersonality = (type: PersonalityType) => {
    setCurrentPersonality(type);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsGenerating(true);
    
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm processing that request based on my current configuration."
      }]);
      setIsGenerating(false);
    }, 1000);
  };

  const handleStop = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setIsGenerating(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!isGenerating) handleSend(); }};

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isGenerating, currentPersonality]);

  const activeConfig = PERSONALITY_CONFIG[currentPersonality];

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl shadow-sm flex flex-col">
      
      {/* Header (Fixed Top) */}
      <div className="absolute top-0 left-0 right-0 z-20 ">
        <div className="w-full h-16 flex items-center justify-between px-4">
            
            {/* Dropdown Trigger */}
            <div ref={dropdownRef} className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200"
                >
                    <div className={`
                        w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-300
                        ${activeConfig.avatarBg}
                    `}>
                        {activeConfig.icon}
                    </div>

                    <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                            {activeConfig.name}
                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </span>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 animate-in zoom-in-95 slide-in-from-top-2 duration-200 z-50">
                        <div className="text-[10px] font-bold text-slate-400 px-3 py-2 uppercase tracking-wider flex items-center gap-2">
                            <Settings2 size={10} />
                            Base Style & Tone
                        </div>
                        {(Object.keys(PERSONALITY_CONFIG) as PersonalityType[]).map((type) => {
                            const config = PERSONALITY_CONFIG[type];
                            const isSelected = currentPersonality === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => handleSwitchPersonality(type)}
                                    className={`
                                        w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all
                                        ${isSelected ? "bg-slate-100" : "hover:bg-slate-50"}
                                    `}
                                >
                                    <div className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                        ${isSelected ? config.avatarBg : "bg-slate-100 text-slate-400"}
                                    `}>
                                        {config.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-semibold ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                                                {config.name}
                                            </span>
                                            {isSelected && <Check size={14} className="text-indigo-600" />}
                                        </div>
                                        <p className="text-[10px] text-slate-500 truncate">
                                            {config.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Right Action Placeholder */}
            <div></div>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-20 pb-24"
      >
        {/* 內層維持 max-w-md 並居中 */}
        <div className="w-full max-w-md mx-auto px-4 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-2">
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                
                  {/* Avatar */}
                  {msg.role === "ai" && (
                      <div className={`
                          mr-2 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 mt-1
                          ${activeConfig.avatarBg}
                      `}>
                          {activeConfig.icon}
                      </div>
                  )}

                  {/* Bubble */}
                  <div className={`
                      max-w-[85%] p-4 text-sm leading-6 whitespace-pre-wrap transition-all duration-500
                      ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-sm shadow-sm rounded-2xl" 
                      : activeConfig.bubbleStyle} 
                  `}>
                      {msg.content}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area (Fixed Bottom) */}
      {/* 外層全寬 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 ">
          {/* 內層維持 max-w-md 並居中 */}
          <div className="w-full max-w-md mx-auto pt-2 pb-4 px-4">
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all duration-300
                ${isGenerating 
                    ? "border-slate-200 bg-white" 
                    : "border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
                }
            `}>
                
                <button disabled={isGenerating} className="transition-colors shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                <Paperclip size={20} />
                </button>
                <input ref={fileInputRef} type="file" className="hidden" />

                <div className="flex-1 relative h-10 flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isGenerating}
                    placeholder="Ask any question..."
                    className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10 font-sans" 
                />
                </div>

                {isGenerating ? (
                    <button onClick={handleStop} className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 active:scale-90 shadow-sm">
                    <span className="w-3 h-3 bg-current"></span>
                    </button>
                ) : (
                    <button onClick={handleSend} disabled={!inputValue.trim()} className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 ${inputValue.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}>
                    <Send size={18} />
                    </button>
                )}

            </div>
          </div>
      </div>

    </div>
  );
};