import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Maximize2, Minimize2, ChevronDown, ArrowDown } from "lucide-react";

export const Anchoring = () => {
    const [inputValue, setInputValue] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [showExpandBtn, setShowExpandBtn] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 偵測滾動位置
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // 判斷是否在底部 (留 20px 緩衝)
        const { scrollTop, scrollHeight, clientHeight } = container;
        const bottomThreshold = 20;
        const isBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
        setIsAtBottom(isBottom);
    };

    // 一鍵回到底部
    const scrollToBottom = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        });
    };

    // 模擬適量對話以測試滾動
    const mockMessages = [
        { role: "ai", content: "Hi, I'm AI Agent" },
        { role: "user", content: "I need help with analyzing some complex archetypes." },
        { role: "ai", content: "Sure, let's look at the Input UX framework together. It's designed to solve specific human-AI interaction frictions." },
        { role: "user", content: "What is 'Spatial Disorientation' in AI chat?" },
        { role: "ai", content: "Spatial disorientation occurs when long chat histories make users lose track of where they are in the context, especially during intense prototyping. Providing an 'Anchor' helps them return to the active input stream instantly." },
        { role: "user", content: "Can you show me more examples?" },
        { role: "ai", content: "Definitely. Besides Anchoring, we have Source Mining for knowledge solidification and Canvas Previews for maintaining creative flow without context switching." },
    ];

    // 核心邏輯：高度控制
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;

        if (isExpanded) {
            textarea.style.height = '280px';
        } else {
            if (inputValue === "" || scrollHeight <= 42) {
                textarea.style.height = '40px';
            } else {
                textarea.style.height = `${Math.min(scrollHeight, 150)}px`;
            }
        }

        if (scrollHeight > 80) {
            setShowExpandBtn(true);
        } else {
            setShowExpandBtn(false);
        }
    }, [inputValue, isExpanded]);

    // 初始化時滾動到底部
    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <div className="relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden rounded-3xl">

            {/* 1. 訊息顯示區 */}
            <div className="w-full max-w-md flex-1 flex flex-col min-h-0">

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {mockMessages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-3 text-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-sm'
                                : 'text-slate-600 bg-transparent'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. 底部輸入區 */}
            <div className="w-full max-w-md mx-auto mb-6 relative">

                {/* Anchoring 按鈕：回到底部 */}
                <button
                    onClick={scrollToBottom}
                    className={`
                absolute -top-12 left-1/2 -translate-x-1/2 z-10
                flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-700 shadow-lg hover:bg-slate-100 border-1 border-white transition-all duration-300
                ${isAtBottom ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}
            `}
                >
                    <ArrowDown size={20} />
                </button>

                <div className={`
            relative flex w-full items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 ease-in-out
            ${isExpanded ? "rounded-2xl shadow-lg border-gray-300" : "hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50/50"}
        `}>

                    <button className={`
                shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors mb-[2px]
                ${isExpanded ? "self-end" : ""}
            `}>
                        <Paperclip size={20} />
                    </button>

                    <div className="flex-1 relative min-w-0">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask any question..."
                            rows={1}
                            className="w-full bg-transparent text-sm leading-5 text-slate-700 placeholder:text-slate-400 resize-none outline-none block scrollbar-thin scrollbar-thumb-slate-200 py-2.5 px-1 transition-[height] duration-200 ease-out"
                            style={{ paddingRight: '0px' }}
                        />

                        <button
                            onClick={() => {
                                setIsExpanded(!isExpanded);
                                setTimeout(() => textareaRef.current?.focus(), 50);
                            }}
                            className={`
                        absolute -right-10 top-1 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300
                        ${(showExpandBtn || isExpanded) ? "opacity-100 scale-100 visible" : "opacity-0 scale-90 invisible"}
                    `}
                        >
                            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>

                    <button
                        disabled={!inputValue.trim()}
                        className={`
                    flex items-center justify-center shrink-0 w-10 h-10 rounded-full transition-all mb-[1px]
                    ${inputValue.trim()
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }
                `}
                    >
                        <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                    </button>
                </div>
            </div>
        </div>
    );
};
