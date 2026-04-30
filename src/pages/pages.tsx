/**
 * pages.tsx
 * 頁面主控中心：負責管理應用程式的全域狀態（如對話列表、當前視圖、主題模式等），
 * 並將相關資料與方法分發給各個子組件。
 */
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// 導入共享類型、常量與工具
import { 
    cn, 
    getContrastColor, 
    AGENTS 
} from './shared';
import type { 
    ThemeMode, 
    ViewType, 
    Agent, 
    Chat, 
    ThemeStyles 
} from './shared';

// 導入子組件
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchView } from './SearchView';
import { HomeView } from './HomeView';
import { AgentsView } from './AgentsView';

export default function ApplePage({ onBack }: { onBack: () => void }) {
    // --- 狀態管理 ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');
    const [activeView, setActiveView] = useState<ViewType>('home');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [customColor, setCustomColor] = useState('#6366f1');
    const [inputText, setInputText] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [chats, setChats] = useState<Chat[]>([
        { id: '1', title: 'GMP 規範諮詢', timestamp: new Date().getTime(), agentId: 'gmp' },
        { id: '2', title: 'API 規範與設計', timestamp: new Date().getTime() - 1000 * 60 * 60 * 2, agentId: 'gmp' },
        { id: '3', title: 'GMP 架構圖', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24, agentId: 'dise' },
        { id: '4', title: '產品文檔自動化', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 3, agentId: 'doc' },
        { id: '5', title: '生成高品質圖像技巧', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 5, agentId: 'apple' },
        { id: '6', title: 'GMP認證', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 10, agentId: 'gmp' },
    ]);
    
    const colorInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // --- 副作用處理 ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
                setIsAccountMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setActiveView('search');
                setSelectedAgent(null);
            }
            if (e.key === 'Escape' && activeView === 'search') {
                setActiveView('home');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeView]);

    // --- 業務邏輯 ---
    const createNewChat = (agent: Agent) => {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: `${agent.name} 諮詢 (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            timestamp: new Date().getTime(),
            agentId: agent.id
        };
        setChats(prev => [newChat, ...prev]);
        setSelectedAgent(agent);
        setActiveView('home');
    };

    const handleRename = (id: string) => {
        if (editingTitle.trim()) {
            setChats(prev => prev.map(c => c.id === id ? { ...c, title: editingTitle.trim() } : c));
        }
        setEditingChatId(null);
    };

    const handleDelete = (id: string) => {
        setChats(prev => prev.filter(c => c.id !== id));
        setActiveMenuId(null);
    };

    const getThemeStyles = (): ThemeStyles => {
        switch (themeMode) {
            case 'dark':
                return { backgroundColor: '#131314', color: '#e3e3e3', borderColor: '#333537', isDark: true };
            case 'colorful':
                const textColor = getContrastColor(customColor);
                return { backgroundColor: customColor, color: textColor, borderColor: textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', isDark: textColor === '#ffffff' };
            default:
                return { backgroundColor: '#ffffff', color: '#1f1f1f', borderColor: '#e3e3e3', isDark: false };
        }
    };

    const groupChats = (chatList: Chat[]): [string, Chat[]][] => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterday = today - 1000 * 60 * 60 * 24;
        const lastWeek = today - 1000 * 60 * 60 * 24 * 7;
        const groups: { [key: string]: Chat[] } = { 'Today': [], 'Yesterday': [], '7 Days': [], '30 Days': [] };
        chatList.forEach(chat => {
            if (chat.timestamp >= today) groups['Today'].push(chat);
            else if (chat.timestamp >= yesterday) groups['Yesterday'].push(chat);
            else if (chat.timestamp >= lastWeek) groups['7 Days'].push(chat);
            else groups['30 Days'].push(chat);
        });
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    };

    // --- 渲染準備 ---
    const themeStyles = getThemeStyles();
    const groupedChats = groupChats(chats);
    
    const filteredChats = searchQuery.trim()
        ? chats.filter(chat =>
            chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div
            className="flex h-screen w-screen overflow-hidden font-sans selection:bg-blue-500/30"
            style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.color }}
        >
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeView={activeView}
                setActiveView={setActiveView}
                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}
                themeMode={themeMode}
                themeStyles={themeStyles}
                groupedChats={groupedChats}
                editingChatId={editingChatId}
                setEditingChatId={setEditingChatId}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                isAccountMenuOpen={isAccountMenuOpen}
                setIsAccountMenuOpen={setIsAccountMenuOpen}
                handleRename={handleRename}
                handleDelete={handleDelete}
                onBack={onBack}
                menuRef={menuRef}
            />

            <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
                <Header
                    selectedAgent={selectedAgent}
                    activeView={activeView}
                    themeStyles={themeStyles}
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                    customColor={customColor}
                    setCustomColor={setCustomColor}
                    colorInputRef={colorInputRef}
                />

                <div className={cn(
                    "flex-1 flex flex-col items-center px-8 pb-1 overflow-y-auto transition-colors duration-200",
                    !selectedAgent || activeView === 'search' ? "justify-start pt-20" : "justify-center pt-0"
                )}>
                    <AnimatePresence mode="wait">
                        {activeView === 'search' ? (
                            <SearchView
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                filteredChats={filteredChats}
                                themeStyles={themeStyles}
                                setSelectedAgent={setSelectedAgent}
                                setActiveView={setActiveView}
                            />
                        ) : activeView === 'home' ? (
                            <HomeView
                                selectedAgent={selectedAgent}
                                themeMode={themeMode}
                                themeStyles={themeStyles}
                                createNewChat={createNewChat}
                                inputText={inputText}
                                setInputText={setInputText}
                            />
                        ) : (
                            <AgentsView
                                themeMode={themeMode}
                                themeStyles={themeStyles}
                                createNewChat={createNewChat}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}