/**
 * AgentsView.tsx
 * Agent 選擇頁面：以網格形式展示所有可用的 AI Agents，點擊後可快速發起新對話。
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cn, AGENTS } from './shared';
import type { Agent, ThemeMode, ThemeStyles } from './shared';

interface AgentsViewProps {
    themeMode: ThemeMode;
    themeStyles: ThemeStyles;
    createNewChat: (agent: Agent) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
    themeMode,
    themeStyles,
    createNewChat
}) => {
    return (
        <motion.div key="agents" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl w-full py-12">
            <div className="mb-12"><h2 className="text-4xl font-display font-medium mb-4">Choose your Agent</h2><p className="text-xl opacity-60 font-display">Select the one that fits your needs.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {AGENTS.map((agent) => (
                    <motion.div key={agent.id} whileHover={{ y: -5 }} onClick={() => createNewChat(agent)} className={cn("p-6 rounded-3xl cursor-pointer transition-all duration-300 group shadow-lg backdrop-blur-md", themeMode === 'colorful' ? (themeStyles.isDark ? "bg-white/15 hover:bg-white/20" : "bg-black/10 hover:bg-black/15") : (themeStyles.isDark ? "bg-white/10 hover:bg-[#4d90fe]/5" : "bg-white text-gray-900 shadow-sm hover:shadow-xl"))}>
                        <div className="flex items-center gap-3 mb-4"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0", agent.color)}><agent.icon size={20} /></div><h3 className="text-lg font-medium font-display tracking-tight leading-tight">{agent.name}</h3></div><p className="text-sm opacity-60 leading-relaxed line-clamp-2">{agent.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
