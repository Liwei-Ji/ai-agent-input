import { useState } from "react";
import {
    BookOpen, Link as LinkIcon, FileText,
    PanelRightOpen, PanelRightClose,
    Globe, Clock, Send, ExternalLink
} from "lucide-react";
import { useTranslation } from "react-i18next";

// --- 模擬參考資料數據 ---
const MOCK_REFERENCES = [
    {
        id: 1,
        title: "Understanding Large Language Models",
        source: "ARXIV.ORG",
        type: "pdf",
        time: "2 mins ago",
        image: "https://images.unsplash.com/photo-1774342814458-0d82cca937b9",
        summary: "A comprehensive overview of transformer architectures and attention mechanisms. This paper explores how self-attention layers allow models to process sequences in parallel, significantly improving training efficiency and context retention compared to traditional RNNs."
    },
    {
        id: 2,
        title: "The Future of Generative AI in 2026",
        source: "TECHCRUNCH.COM",
        type: "web",
        time: "5 mins ago",
        image: "https://images.unsplash.com/photo-1774342814458-0d82cca937b9",
        summary: "Analysis of market trends and the emergence of autonomous agents. The industry is moving from chatbots to 'Action Bots'—agents that don't just talk but execute complex across multiple APIs with zero human intervention."
    },
    {
        id: 3,
        title: "React 19 Server Components Guide",
        source: "REACT.DEV",
        type: "web",
        time: "10 mins ago",
        image: "https://images.unsplash.com/photo-1774342814458-0d82cca937b9",
        summary: "Official documentation regarding the new server component patterns. React 19 introduces a fundamental shift in how we think about data fetching, moving the logic entirely to the server to reduce bundle sizes and improve perceived performance."
    },
];

export const ContextualExpansion = () => {
    const { t } = useTranslation();

    // --- Layout 狀態 ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeRef, setActiveRef] = useState(MOCK_REFERENCES[0]);

    // --- 輸入框狀態 (僅 UI 展示) ---
    const [inputValue, setInputValue] = useState("");

    const handleOpenPreview = (id: number) => {
        const ref = MOCK_REFERENCES.find(r => r.id === id);
        if (ref) setActiveRef(ref);
        setIsSidebarOpen(true);
    };

    // --- 靜態訊息內容 ---
    const aiMessage = (
        <div className="space-y-4">
            <p>
                {t('contextual_expansion.msg_1')}
                The <span className="text-indigo-600 font-medium bg-indigo-50 px-1 rounded cursor-pointer hover:underline inline-flex items-center gap-1" onClick={() => handleOpenPreview(1)}>[1] transformer architecture</span> remains the backbone of modern AI.
            </p>
            <p>
                {t('contextual_expansion.msg_2')} <span className="text-indigo-600 font-medium bg-indigo-50 px-1 rounded cursor-pointer hover:underline" onClick={() => handleOpenPreview(2)}>[2]</span>, we can see a significant shift towards autonomous agents.
            </p>
            <p>
                Recent updates in web frameworks suggest a move towards more integrated AI capabilities <span className="text-indigo-600 font-medium bg-indigo-50 px-1 rounded cursor-pointer hover:underline" onClick={() => handleOpenPreview(3)}>[3]</span>.
            </p>
        </div>
    );

    return (
        <div className="flex h-[600px] w-full min-h-[500px] overflow-hidden font-sans rounded-3xl relative">

            {/* 左側主區域 (Main Content) */}
            <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300 ease-in-out relative">

                {/* 懸浮觸發開關 */}
                <div className="absolute top-4 right-4 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`
                    p-2 rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all
                    ${isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"} 
                `}
                        title="Show Preview"
                    >
                        <PanelRightOpen size={20} />
                    </button>
                </div>

                {/* 內容卷軸區 */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                    <div className="max-w-md mx-auto w-full pb-10 pt-10 space-y-8">

                        {/* AI Message */}
                        <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <div className="max-w-full text-sm leading-7 text-slate-700">
                                {aiMessage}
                            </div>
                        </div>

                    </div>
                </div>

                {/* 底部輸入框區 */}
                <div className="shrink-0 p-4 z-20">
                    <div className="max-w-md mx-auto w-full">
                        <div className="relative flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-300">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask any question..."
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-10 pl-2 min-w-0"
                            />
                            <button
                                className={`
                            p-2.5 rounded-full transition-all duration-200 flex items-center justify-center shrink-0
                            ${inputValue.trim()
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-slate-100 text-slate-300"
                                    }
                        `}
                            >
                                <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* 右側預覽畫布 (Context Preview Sidebar) - 懸浮樣式 */}
            <div
                className={`
            shrink-0 bg-white flex flex-col
            transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            ${isSidebarOpen
                        ? "w-[340px] opacity-100 translate-x-0 m-4 rounded-2xl shadow-2xl border border-slate-200 h-[calc(100%-2rem)]"
                        : "w-0 opacity-0 translate-x-10 m-0 h-[calc(100%-2rem)] overflow-hidden"
                    }
        `}
            >
                {/* Sidebar Header */}
                <div className="h-14 flex items-center justify-end px-4 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    >
                        <PanelRightClose size={18} />
                    </button>
                </div>

                {/* Sidebar Content: Photo on Top, Details Below */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {/* Photo Area */}
                    <div className="w-full h-48 bg-slate-100 relative overflow-hidden">
                        <img
                            src={activeRef.image}
                            alt={activeRef.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Details Area */}
                    <div className="p-6 space-y-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                                {activeRef.source}
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 leading-tight">
                                {activeRef.title}
                            </h4>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            {activeRef.summary}
                        </p>

                        <div className="pt-4">
                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <ExternalLink size={14} />
                                Open Full Source
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
