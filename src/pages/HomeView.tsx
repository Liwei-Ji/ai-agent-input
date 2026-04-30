/**
 * HomeView.tsx
 * 主視圖組件：包含未選擇 Agent 時的歡迎畫面（及 Agent 快速選擇網格），以及選擇 Agent 後的對話輸入區域。
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send } from 'lucide-react';
import { cn, AGENTS } from './shared';
import type { Agent, ThemeMode, ThemeStyles } from './shared';

interface HomeViewProps {
    selectedAgent: Agent | null;
    themeMode: ThemeMode;
    themeStyles: ThemeStyles;
    createNewChat: (agent: Agent) => void;
    inputText: string;
    setInputText: (text: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
    selectedAgent,
    themeMode,
    themeStyles,
    createNewChat,
    inputText,
    setInputText
}) => {
    return (
        <motion.div key="home-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className={cn("max-w-5xl w-full flex flex-col items-center", selectedAgent ? "min-h-[calc(100vh-80px)]" : "")}>
            {!selectedAgent ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full">
                    <div className="text-left w-full mb-12">
                        <h2 className={cn("text-5xl md:text-6xl font-display font-medium mb-4 leading-tight transition-all duration-500", themeMode === 'colorful' ? "text-inherit" : "bg-clip-text text-transparent bg-gradient-to-r from-[#4d90fe] via-[#8e75ff] to-[#f472b6]")}>Hello, Designer</h2>
                        <p className="text-2xl md:text-3xl opacity-50 font-display">How can I help you today?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {AGENTS.map((agent) => (
                            <motion.div key={agent.id} whileHover={{ y: -5 }} onClick={() => createNewChat(agent)} className={cn("p-6 rounded-3xl cursor-pointer transition-all duration-300 group shadow-lg backdrop-blur-md", themeMode === 'colorful' ? (themeStyles.isDark ? "bg-white/15 hover:bg-white/20" : "bg-black/10 hover:bg-black/15") : (themeStyles.isDark ? "bg-white/10 hover:bg-[#4d90fe]/5" : "bg-white text-gray-900 shadow-sm hover:shadow-xl"))}>
                                <div className="flex items-center gap-3 mb-4"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0", agent.color)}><agent.icon size={20} /></div><h3 className="text-lg font-medium font-display tracking-tight leading-tight">{agent.name}</h3></div><p className="text-sm opacity-60 leading-relaxed line-clamp-2">{agent.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full flex flex-col items-center mt-auto px-4">
                    <div className="w-full relative group mb-6">
                        <div className={cn(
                            "relative flex w-full items-end gap-2 p-2 rounded-2xl border transition-all duration-300",
                            "focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50",
                            themeMode === 'colorful'
                                ? (themeStyles.isDark ? "bg-white/15 border-white/20" : "bg-black/10 border-black/10")
                                : (themeStyles.isDark ? "bg-[#2b2c2e] border-white/10" : "bg-white border-gray-200 shadow-lg shadow-indigo-100/20")
                        )}>
                            <button className={cn(
                                "p-2.5 rounded-xl transition-colors shrink-0",
                                themeStyles.isDark ? "hover:bg-white/10 text-white/40 hover:text-white/80" : "hover:bg-black/5 text-slate-400 hover:text-indigo-600"
                            )}>
                                <Paperclip size={20} />
                            </button>
                            <textarea
                                rows={1}
                                placeholder="Ask me anything..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className={cn(
                                    "flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-1 text-base outline-none transition-colors duration-200",
                                    themeStyles.isDark ? "placeholder-white/30 text-white" : "placeholder-slate-400 text-slate-700"
                                )}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setInputText(''); } }}
                            />
                            <button className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shrink-0",
                                inputText.trim()
                                    ? cn("bg-indigo-600 text-white shadow-lg scale-100 hover:bg-indigo-700 active:scale-95", themeMode === 'light' ? "shadow-indigo-200" : "shadow-indigo-950/50")
                                    : (themeStyles.isDark ? "bg-white/5 text-white/20 scale-95" : "bg-slate-100 text-slate-300 scale-95 cursor-not-allowed")
                            )}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};
