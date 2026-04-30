/**
 * SearchView.tsx
 * 搜尋視圖組件：提供全域對話關鍵字搜尋功能，支援結果即時高亮顯示，並可直接跳轉至對應對話。
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn, AGENTS } from './shared';
import type { Agent, Chat, ThemeStyles } from './shared';

interface SearchViewProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredChats: Chat[];
    themeStyles: ThemeStyles;
    setSelectedAgent: (agent: Agent | null) => void;
    setActiveView: (view: any) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
    searchQuery,
    setSearchQuery,
    filteredChats,
    themeStyles,
    setSelectedAgent,
    setActiveView
}) => {
    return (
        <motion.div key="search-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="max-w-3xl w-full flex flex-col">
            <div className="text-left w-full mb-8">
                <h2 className="text-4xl font-display font-medium mb-2">Search</h2>
                <p className="opacity-50">Search your history and conversations</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="relative mb-8">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className={cn(
                        "w-full pl-12 pr-12 py-4 rounded-3xl outline-none border text-lg transition-all duration-300",
                        themeStyles.isDark ? "bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/20" : "bg-white border-gray-200 focus:border-blue-500/50"
                    )}
                />
                {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                        <X size={20} className="opacity-50 hover:opacity-80" />
                    </button>
                )}
            </form>

            <div className="flex-1">
                {searchQuery.trim() === '' ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
                        <p className="text-lg">Type to start searching...</p>
                    </div>
                ) : filteredChats.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredChats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    const agent = AGENTS.find(a => a.id === chat.agentId);
                                    if (agent) {
                                        setSelectedAgent(agent);
                                        setActiveView('home');
                                    }
                                    setSearchQuery('');
                                }}
                                className={cn(
                                    "w-full text-left p-6 rounded-3xl transition-all duration-300 group border shadow-sm",
                                    themeStyles.isDark ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" : "bg-white border-gray-100 hover:shadow-md hover:border-blue-500/30"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">{chat.agentId}</span>
                                    <span className="text-xs opacity-30">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="font-medium text-lg mb-1 group-hover:text-blue-500 transition-colors">
                                    {chat.title.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part: string, i: number) =>
                                        part.toLowerCase() === searchQuery.toLowerCase() ? <span key={i} className="bg-blue-500/20 text-blue-500 rounded px-1">{part}</span> : part
                                    )}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 gap-4">
                        <p className="text-lg">No results found for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
