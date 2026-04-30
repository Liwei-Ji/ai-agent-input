/**
 * Sidebar.tsx
 * 側邊欄組件：負責處理導覽切換、歷史對話列表分組顯示、對話重新命名與刪除，以及帳戶選單。
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
    PanelLeft, Plus, MessageSquare, MoreVertical, Edit2, Trash2, Check,
    Search, Bot, Settings, HelpCircle, LogOut, ChevronUp
} from 'lucide-react';
import { cn, AGENTS } from './shared';
import type { Agent, Chat, ThemeMode, ViewType, ThemeStyles } from './shared';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
    selectedAgent: Agent | null;
    setSelectedAgent: (agent: Agent | null) => void;
    themeMode: ThemeMode;
    themeStyles: ThemeStyles;
    groupedChats: [string, Chat[]][];
    editingChatId: string | null;
    setEditingChatId: (id: string | null) => void;
    editingTitle: string;
    setEditingTitle: (title: string) => void;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    isAccountMenuOpen: boolean;
    setIsAccountMenuOpen: (open: boolean) => void;
    handleRename: (id: string) => void;
    handleDelete: (id: string) => void;
    onBack: () => void;
    menuRef: React.RefObject<HTMLDivElement | null>;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    activeView,
    setActiveView,
    selectedAgent,
    setSelectedAgent,
    themeMode,
    themeStyles,
    groupedChats,
    editingChatId,
    setEditingChatId,
    editingTitle,
    setEditingTitle,
    activeMenuId,
    setActiveMenuId,
    isAccountMenuOpen,
    setIsAccountMenuOpen,
    handleRename,
    handleDelete,
    onBack,
    menuRef
}) => {
    return (
        <motion.aside
            initial={false}
            animate={{ width: isSidebarOpen ? 220 : 68 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className={cn(
                "relative flex flex-col h-full border-r overflow-hidden z-20 shrink-0 transition-colors duration-300",
                themeMode === 'dark' ? "bg-[#1e1f20] border-[#333537] text-[#c4c7c5]" :
                    themeMode === 'colorful' ? (themeStyles.isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-gray-900") :
                        "bg-[#f0f4f9] border-transparent text-gray-900"
            )}
        >
            <div className={cn("p-4 flex flex-col gap-4 shrink-0", isSidebarOpen ? "items-end" : "items-center")}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={cn("p-2 rounded-full transition-all duration-300 group shrink-0", themeStyles.isDark ? "hover:bg-white/10" : "hover:bg-black/10")}>
                    <PanelLeft size={24} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                </button>

                <button onClick={() => { setActiveView('home'); setSelectedAgent(null); }} className={cn("flex items-center gap-3 p-4 px-5 rounded-full transition-all duration-500 overflow-hidden shadow-sm border shrink-0", themeMode === 'dark' ? "bg-[#333537] hover:bg-[#3c3d3e] border-transparent text-[#c4c7c5]" : themeMode === 'colorful' ? "bg-white/10 hover:bg-white/20 border-white/20 text-inherit" : "bg-white hover:bg-black/5 border-gray-200 text-gray-900", !isSidebarOpen ? "w-10 h-10 p-2 justify-center" : "w-full")}>
                    <Plus size={24} className="shrink-0" />
                    {isSidebarOpen && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-medium whitespace-nowrap">New Chat</motion.span>}
                </button>
            </div>

            <div className={cn("flex-1 overflow-y-auto px-4 py-2 flex flex-col custom-scrollbar transition-all duration-300", isSidebarOpen ? "gap-6" : "gap-1")}>
                {groupedChats.map(([groupName, chats]) => (
                    <div key={groupName} className="flex flex-col gap-1">
                        {isSidebarOpen && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-2 text-[10px] font-bold text-[#8e918f] uppercase tracking-wider">{groupName}</motion.p>}
                        {chats.map((chat) => (
                            <div key={chat.id} className="relative group/item">
                                {editingChatId === chat.id ? (
                                    <div className={cn("flex items-center gap-2 px-2 py-1.5 rounded-lg mx-2 my-1", themeStyles.isDark ? "bg-white/10" : "bg-black/5")}>
                                        <input autoFocus value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} onBlur={() => handleRename(chat.id)} onKeyDown={(e) => { if (e.key === 'Enter') handleRename(chat.id); if (e.key === 'Escape') setEditingChatId(null); }} className="flex-1 bg-transparent border-none text-sm outline-none px-1 py-0.5" />
                                        <button onClick={() => handleRename(chat.id)} className="p-1 hover:text-blue-500 transition-colors"><Check size={14} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => { setActiveView('home'); const agent = AGENTS.find(a => a.id === chat.agentId); if (agent) setSelectedAgent(agent); }} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-left group w-full", themeStyles.isDark ? "hover:bg-white/5 text-inherit opacity-70" : "hover:bg-black/5 text-inherit opacity-70", !isSidebarOpen && "justify-center")}>
                                        <MessageSquare size={18} className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        {isSidebarOpen && <span className="text-sm truncate font-normal flex-1 pr-6">{chat.title}</span>}
                                    </button>
                                )}
                                {isSidebarOpen && editingChatId !== chat.id && (
                                    <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === chat.id ? null : chat.id); }} className={cn("absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all opacity-0 group-hover/item:opacity-100 z-10", themeStyles.isDark ? "hover:bg-white/10" : "hover:bg-black/10")}><MoreVertical size={14} className="opacity-70" /></button>
                                )}
                                {activeMenuId === chat.id && (
                                    <div ref={menuRef} className={cn("absolute right-2 top-10 w-32 rounded-xl shadow-2xl z-50 py-1.5 border backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in duration-200", themeStyles.isDark ? "bg-[#2b2c2e] border-white/10" : "bg-white border-gray-200")}>
                                        <button onClick={() => { setEditingChatId(chat.id); setEditingTitle(chat.title); setActiveMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"><Edit2 size={12} /> Rename</button>
                                        <button onClick={() => handleDelete(chat.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left"><Trash2 size={12} /> Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-inherit mt-auto flex flex-col gap-1 shrink-0">
                {[
                    { icon: Search, label: 'Search', onClick: () => { setActiveView('search'); setSelectedAgent(null); }, active: activeView === 'search' },
                    { icon: Bot, label: 'AI Agents', onClick: () => setActiveView('agents'), active: activeView === 'agents' },
                    { icon: Settings, label: 'Model Training' },
                    { icon: HelpCircle, label: 'Help' },
                    { icon: LogOut, label: 'Back', onClick: onBack, active: false }
                ].map((item, idx) => (
                    <button key={idx} onClick={item.onClick} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group w-full", item.active ? (themeStyles.isDark ? "bg-white/10 text-white" : "bg-black/10 text-gray-900") : (themeStyles.isDark ? "hover:bg-white/5 text-inherit opacity-70" : "hover:bg-black/5 text-inherit opacity-70"), !isSidebarOpen && "justify-center")}>
                        <item.icon size={18} className={cn("shrink-0 transition-opacity", item.active ? "text-[#4d90fe] opacity-100" : "opacity-70 group-hover:opacity-100")} />
                        {isSidebarOpen && <span className="text-sm whitespace-nowrap font-medium">{item.label}</span>}
                    </button>
                ))}

                <div className="relative mt-2" ref={menuRef}>
                    <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className={cn("flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-300 text-left group w-full", themeStyles.isDark ? "hover:bg-white/5 text-inherit" : "hover:bg-black/5 text-inherit", !isSidebarOpen && "justify-center")}>
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#4d90fe] to-[#8e75ff] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg">LW</div>
                        {isSidebarOpen && <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate leading-tight">Liwei Ji</p><p className="text-[10px] opacity-50 truncate leading-tight">liwei_ji@email.com</p></div>}
                        {isSidebarOpen && <ChevronUp size={14} className={cn("opacity-40 transition-transform", isAccountMenuOpen && "rotate-180")} />}
                    </button>
                    {isAccountMenuOpen && (
                        <div className={cn("absolute bottom-full left-0 mb-2 rounded-2xl shadow-2xl z-50 py-1.5 border backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200", isSidebarOpen ? "right-0" : "w-32", themeStyles.isDark ? "bg-[#2b2c2e] border-white/10" : "bg-white border-gray-200")}>
                            <button onClick={() => { setIsAccountMenuOpen(false); onBack(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"><LogOut size={12} /> Log out</button>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
