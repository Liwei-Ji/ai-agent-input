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
    ThemeStyles,
    Project,
    NotebookSource
} from './shared';

// 導入子組件
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchView } from './SearchView';
import { HomeView } from './HomeView';
import { AgentsView } from './AgentsView';
import { TrainingView } from './Training';
import { Pet } from './petdex/Pet';

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showDateGrouping, setShowDateGrouping] = useState(() => {
        const saved = localStorage.getItem('ag_show_date_grouping');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [showChatIcons, setShowChatIcons] = useState(() => {
        const saved = localStorage.getItem('ag_show_chat_icons');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isSidebarFloating, setIsSidebarFloating] = useState(() => {
        const saved = localStorage.getItem('ag_is_sidebar_floating');
        return saved !== null ? JSON.parse(saved) : false;
    });
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [notebookSources, setNotebookSources] = useState<NotebookSource[]>([]);
    const [showPet, setShowPet] = useState(false);
    
    const handleResetToHome = () => {
        setSelectedAgent(null);
        setActiveView('home');
    };

    const colorInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    // 監聽視窗大小變化
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile && !isSidebarOpen) setIsSidebarOpen(true);
            if (mobile && isSidebarOpen) setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    // --- 副作用處理 ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (menuRef.current && !menuRef.current.contains(target)) {
                setActiveMenuId(null);
            }
            if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
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
            title: agent.id === 'notebook' ? `New Notebook (${new Date().toLocaleDateString()})` : `${agent.name} 諮詢 (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            timestamp: new Date().getTime(),
            agentId: agent.id
        };
        setChats(prev => [newChat, ...prev]);
        setSelectedAgent(agent);
        setActiveView(agent.id === 'notebook' ? 'notebook' : 'home');
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

    const handleTogglePin = (id: string) => {
        setChats(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
        setActiveMenuId(null);
    };

    const handleCreateProject = (name: string) => {
        const newProject: Project = {
            id: Date.now().toString(),
            name
        };
        setProjects(prev => [...prev, newProject]);
    };

    const handleDeleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        setChats(prev => prev.map(c => c.projectId === id ? { ...c, projectId: undefined } : c));
    };

    const handleMoveChatToProject = (chatId: string, projectId?: string) => {
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, projectId } : c));
    };

    const handleAddSource = () => {
        const name = prompt("Enter source name:");
        if (name) {
            const newSource: NotebookSource = {
                id: Date.now().toString(),
                name: name,
                type: 'pdf'
            };
            setNotebookSources(prev => [...prev, newSource]);
        }
    };

    const handleRenameSource = (id: string, newName: string) => {
        setNotebookSources(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
    };

    const handleDeleteSource = (id: string) => {
        setNotebookSources(prev => prev.filter(s => s.id !== id));
    };

    const handleToggleSourceSelection = (id: string) => {
        setNotebookSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
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
        const availableChats = chatList.filter(c => !c.projectId);
        const pinned = availableChats.filter(c => c.isPinned);
        const unpinned = availableChats.filter(c => !c.isPinned);
        
        const result: [string, Chat[]][] = [];
        if (pinned.length > 0) result.push(['Pinned', pinned]);

        if (!showDateGrouping) {
            if (unpinned.length > 0) result.push(['Recent', unpinned]);
            return result;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterday = today - 1000 * 60 * 60 * 24;
        const lastWeek = today - 1000 * 60 * 60 * 24 * 7;
        
        const groups: { [key: string]: Chat[] } = { 'Today': [], 'Yesterday': [], '7 Days': [], '30 Days': [] };
        
        unpinned.forEach(chat => {
            if (chat.timestamp >= today) groups['Today'].push(chat);
            else if (chat.timestamp >= yesterday) groups['Yesterday'].push(chat);
            else if (chat.timestamp >= lastWeek) groups['7 Days'].push(chat);
            else groups['30 Days'].push(chat);
        });

        Object.entries(groups).forEach(([name, items]) => {
            if (items.length > 0) result.push([name, items]);
        });
        
        return result;
    };

    // 監控設定變化並儲存
    useEffect(() => {
        localStorage.setItem('ag_show_date_grouping', JSON.stringify(showDateGrouping));
    }, [showDateGrouping]);

    useEffect(() => {
        localStorage.setItem('ag_is_sidebar_floating', JSON.stringify(isSidebarFloating));
    }, [isSidebarFloating]);

    useEffect(() => {
        localStorage.setItem('ag_show_chat_icons', JSON.stringify(showChatIcons));
    }, [showChatIcons]);

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
            className="flex h-screen w-screen overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300"
            style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.color }}
        >
            {/* Sidebar 佔位容器：恆定佔位，確保右側內容永不跳動 */}
            <div 
                className="hidden md:block transition-all duration-300 shrink-0"
                style={{ width: isSidebarOpen ? (activeView === 'notebook' ? 300 : 220) : 68 }}
            />
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
                handleTogglePin={handleTogglePin}
                onBack={onBack}
                onResetToHome={handleResetToHome}
                menuRef={menuRef}
                accountMenuRef={accountMenuRef}
                isMobile={isMobile}
                showDateGrouping={showDateGrouping}
                setShowDateGrouping={setShowDateGrouping}
                showChatIcons={showChatIcons}
                setShowChatIcons={setShowChatIcons}
                isSidebarFloating={isSidebarFloating}
                setIsSidebarFloating={setIsSidebarFloating}
                setThemeMode={setThemeMode}
                customColor={customColor}
                setCustomColor={setCustomColor}
                colorInputRef={colorInputRef}
                chats={chats}
                projects={projects}
                onCreateProject={handleCreateProject}
                onDeleteProject={handleDeleteProject}
                onMoveChatToProject={handleMoveChatToProject}
                notebookSources={notebookSources}
                onAddSource={handleAddSource}
                onRenameSource={handleRenameSource}
                onDeleteSource={handleDeleteSource}
                onToggleSourceSelection={handleToggleSourceSelection}
                showPet={showPet}
                setShowPet={setShowPet}
            />

            {/* 全局寵物 (Clippy 模式) */}
            {showPet && <Pet containerRef={{ current: document.body as any }} />}

            {/* 手機端遮罩 */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
                {activeView !== 'training' && (
                    <Header
                        selectedAgent={selectedAgent}
                        activeView={activeView}
                        themeStyles={themeStyles}
                        themeMode={themeMode}
                        setThemeMode={setThemeMode}
                        customColor={customColor}
                        setCustomColor={setCustomColor}
                        colorInputRef={colorInputRef}
                        isMobile={isMobile}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                )}

                <div className={cn(
                    "flex-1 flex flex-col items-center px-8 pb-1 transition-colors duration-200",
                    activeView === 'training' ? "pt-0 overflow-hidden" : (!selectedAgent || activeView === 'search' ? "pt-20 overflow-y-auto" : "justify-center pt-0 overflow-y-auto")
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
                        ) : activeView === 'home' || activeView === 'notebook' ? (
                            <HomeView
                                selectedAgent={selectedAgent}
                                themeMode={themeMode}
                                themeStyles={themeStyles}
                                createNewChat={createNewChat}
                                inputText={inputText}
                                setInputText={setInputText}
                            />
                        ) : activeView === 'training' ? (
                            <TrainingView themeStyles={themeStyles} />
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