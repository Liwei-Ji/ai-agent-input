import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../ChatInput";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
}

export const ConversationSidebar = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "I'm drafting an initial proposal for the project.", sender: "user" },
        { id: "2", text: "That sounds like a great start. Do you need help with the structure?", sender: "ai" },
        { id: "3", text: "Yes, please focus on the executive summary and the technical roadmap.", sender: "user" },
        { id: "4", text: "Understood. I'll include a high-level overview of our architecture.", sender: "ai" },
        { id: "5", text: "Should we also mention the budget constraints?", sender: "user" },
        { id: "6", text: "It might be better to keep the initial proposal focused on the value proposition.", sender: "ai" },
        { id: "7", text: "Good point. Let's stick to the core features for now.", sender: "user" },
        { id: "8", text: "I've updated the draft. You can review the new sections in the doc.", sender: "ai" },
        { id: "9", text: "Thanks! Can you also generate a summary for the stakeholders?", sender: "user" },
        { id: "10", text: "Of course. I'll prepare a slide-ready summary by this afternoon.", sender: "ai" },
        { id: "11", text: "Great. I'll check back in an hour.", sender: "user" },
        { id: "12", text: "Perfect. I'll have the summary ready for your review then.", sender: "ai" },
    ]);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleSend = (text: string) => {
        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: "user",
        };
        setMessages((prev) => [...prev, newUserMsg]);

        setTimeout(() => {
            const newAiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `Got it. I'll look into "${text}" and provide some insights.`,
                sender: "ai",
            };
            setMessages((prev) => [...prev, newAiMsg]);
        }, 1000);
    };

    const scrollToMessage = (index: number) => {
        const elements = scrollContainerRef.current?.querySelectorAll(".message-item");
        if (elements && elements[index]) {
            elements[index].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    return (
        <div className="relative w-full max-w-lg h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-700">

            {/* 訊息區 */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto pl-6 py-6 pr-10 space-y-6 hide-scrollbar relative"
            >
                <div className="pt-8">
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.id}
                            className={`message-item flex flex-col mb-4 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                        >
                            <div
                                className={`
                  max-w-[90%] text-sm leading-relaxed transition-all
                  ${msg.sender === "user"
                                        ? "bg-blue-600 text-slate-50 shadow-lg rounded-br-sm shadow-slate-200 p-4 rounded-2xl"
                                        : "text-slate-700 py-2 px-1"
                                    }
                `}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* 右側導航控制項 (Wayfinders/Navigation Bars) */}
            {/* absolute right-5 調整邊緣間距 */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-">
                {messages.slice(0, 12).map((msg, idx) => (
                    <div
                        key={`nav-${idx}`}
                        className="flex items-center justify-end group transition-all"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => scrollToMessage(idx)}
                    >
                        {/* 預覽氣泡 */}
                        {hoveredIndex === idx && (
                            <div className="mr-3 p-3 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-xl rounded-xl animate-in slide-in-from-right-2 fade-in duration-200 max-w-[180px]">
                                <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                                    {msg.text}
                                </p>
                            </div>
                        )}

                        {/* 導航條 */}
                        <div
                            className={`
                w-4 h-1 rounded-full transition-all duration-300 cursor-pointer
                ${hoveredIndex === idx ? "bg-slate-400 w-4" : "bg-slate-200 hover:bg-slate-300"}
              `}
                        />
                    </div>
                ))}
            </div>

            {/* 底部輸入框 */}
            <div className="p-6 pt-2">
                <ChatInput
                    placeholder="Ask any question..."
                    onSend={handleSend}
                />
            </div>

            {/* 裝飾性遮罩 (頂部) */}
        </div>
    );
};
