/**
 * Sidebar.tsx
 * 側邊欄組件：負責處理導覽切換、歷史對話列表分組顯示、對話重新命名與刪除，以及帳戶選單。
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PanelLeft, Plus, MessageSquare, MoreVertical, Edit2, Trash2, Check,
    Search, Bot, Settings, HelpCircle, LogOut, ChevronUp, Pin, Palette, CalendarDays, ChevronRight, Layout,
    Folder, X, Undo2, FileText
} from 'lucide-react';
import { cn, AGENTS } from './shared';
import type { Agent, Chat, ThemeMode, ViewType, ThemeStyles, Project } from './shared';

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
    handleTogglePin: (id: string) => void;
    onBack: () => void;
    menuRef: React.RefObject<HTMLDivElement | null>;
    accountMenuRef: React.RefObject<HTMLDivElement | null>;
    isMobile: boolean;
    showDateGrouping: boolean;
    setShowDateGrouping: (show: boolean) => void;
    isSidebarFloating: boolean;
    setIsSidebarFloating: (isFloating: boolean) => void;
    showChatIcons: boolean;
    setShowChatIcons: (show: boolean) => void;
    setThemeMode: (mode: ThemeMode) => void;
    customColor: string;
    setCustomColor: (color: string) => void;
    colorInputRef: React.RefObject<HTMLInputElement | null>;
    onResetToHome: () => void;
    chats: Chat[];
    projects: Project[];
    onCreateProject: (name: string) => void;
    onDeleteProject: (id: string) => void;
    onMoveChatToProject: (chatId: string, projectId?: string) => void;
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
    handleTogglePin,
    onBack,
    menuRef,
    accountMenuRef,
    isMobile,
    showDateGrouping,
    setShowDateGrouping,
    isSidebarFloating,
    setIsSidebarFloating,
    showChatIcons,
    setShowChatIcons,
    setThemeMode,
    customColor,
    setCustomColor,
    colorInputRef,
    onResetToHome,
    chats,
    projects,
    onCreateProject,
    onDeleteProject,
    onMoveChatToProject
}) => {
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isThemeSectionOpen, setIsThemeSectionOpen] = React.useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = React.useState(false);
    const [newProjectName, setNewProjectName] = React.useState('');
    const [draggedChatId, setDraggedChatId] = React.useState<string | null>(null);
    const settingsRef = React.useRef<HTMLDivElement>(null);
    const [menuPlacement, setMenuPlacement] = React.useState<'up' | 'down'>('down');
    const [menuPosition, setMenuPosition] = React.useState<{ top: number; left: number } | null>(null);

    const handleMenuClick = (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;

        setMenuPosition({ top: rect.top, left: rect.left });
        setMenuPlacement(spaceBelow < 180 ? 'up' : 'down');
        setActiveMenuId(activeMenuId === chatId ? null : chatId);
    };

    // 監聽捲動，捲動時關閉選單以防止選單位置偏移
    // --- 副作用處理 ---
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
        const handleScroll = () => {
            if (activeMenuId) setActiveMenuId(null);
        };
        const scrollContainer = document.querySelector('.custom-scrollbar');
        scrollContainer?.addEventListener('scroll', handleScroll);
        return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, [activeMenuId, setActiveMenuId]);

    return (
        <>
            <motion.aside
                initial={false}
                animate={{
                    width: isMobile ? (isSidebarOpen ? 280 : 0) : (isSidebarOpen ? 220 : 68),
                    x: isMobile && !isSidebarOpen ? -280 : 0,
                    top: !isMobile && isSidebarFloating ? 16 : 0,
                    bottom: !isMobile && isSidebarFloating ? 16 : 0,
                    left: !isMobile && isSidebarFloating ? 16 : 0,
                    borderRadius: !isMobile && isSidebarFloating ? 24 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className={cn(
                    "fixed z-50 flex flex-col transition-colors duration-300",
                    !isMobile && !isSidebarFloating && "border-r",
                    isMobile && "inset-y-0 left-0 shadow-2xl overflow-hidden h-full",
                    !isMobile && isSidebarFloating && "shadow-2xl border",
                    themeMode === 'dark' ? "bg-[#1e1f20] border-[#333537] text-[#c4c7c5]" :
                        themeMode === 'colorful' ? (themeStyles.isDark ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-gray-900") :
                            "bg-[#f0f4f9] border-transparent text-gray-900"
                )}
            >
                <div className={cn("p-4 flex flex-col gap-4 shrink-0", isSidebarOpen ? "items-end" : "items-center")}>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={cn("p-2 rounded-full transition-all duration-300 group shrink-0", themeStyles.isDark ? "hover:bg-white/10" : "hover:bg-black/10")}>
                        <PanelLeft size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                        onClick={() => {
                            onResetToHome();
                            if (isMobile) setIsSidebarOpen(false);
                        }}
                        className={cn("flex items-center gap-2 p-2 px-10 rounded-full transition-all duration-300 overflow-hidden shadow-sm border shrink-0", themeMode === 'dark' ? "bg-[#333537] hover:bg-[#3c3d3e] border-transparent text-[#c4c7c5]" : themeMode === 'colorful' ? "bg-white/10 hover:bg-white/20 border-white/20 text-inherit" : "bg-white hover:bg-black/5 border-gray-200 text-gray-900", !isSidebarOpen ? "w-10 h-10 p-2 justify-center" : "w-full")}
                    >
                        <Plus size={18} className="shrink-0" />
                        {isSidebarOpen && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-medium whitespace-nowrap">New Chat</motion.span>}
                    </button>
                </div>

                <div className={cn("flex-1 overflow-y-auto px-4 py-2 flex flex-col custom-scrollbar transition-all duration-300", isSidebarOpen ? "gap-6" : "gap-1")}>
                    {activeView === 'notebook' ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-4 py-2 group">
                                {isSidebarOpen && <span className="text-[10px] font-bold text-[#8e918f] uppercase tracking-wider">Sources</span>}
                                {isSidebarOpen && (
                                    <button className={cn("p-1 rounded-md transition-opacity", themeStyles.isDark ? "hover:bg-white/10" : "hover:bg-black/10")}>
                                        <Plus size={12} />
                                    </button>
                                )}
                            </div>
                            <div className={cn(
                                "px-4 py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 opacity-40 mx-2",
                                themeStyles.isDark ? "border-white/10" : "border-black/10"
                            )}>
                                <FileText size={24} />
                                {isSidebarOpen && <span className="text-[10px] font-medium">Add source files</span>}
                            </div>

                            <div className="flex items-center justify-between px-4 py-2 group mt-4">
                                {isSidebarOpen && <span className="text-[10px] font-bold text-[#8e918f] uppercase tracking-wider">Notes</span>}
                                {isSidebarOpen && (
                                    <button className={cn("p-1 rounded-md transition-opacity", themeStyles.isDark ? "hover:bg-white/10" : "hover:bg-black/10")}>
                                        <Plus size={12} />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 px-2">
                                <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg opacity-60 transition-colors cursor-pointer", themeStyles.isDark ? "hover:bg-white/5" : "hover:bg-black/5")}>
                                    <FileText size={14} className="shrink-0" />
                                    {isSidebarOpen && <span className="text-xs truncate">Research Summary</span>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Projects Section */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between px-4 py-2 group">
                                    {isSidebarOpen && <span className="text-[10px] font-bold text-[#8e918f] uppercase tracking-wider">Projects</span>}
                                    {isSidebarOpen && (
                                        <button
                                            onClick={() => setIsAddProjectModalOpen(true)}
                                            className={cn("p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity", themeStyles.isDark ? "hover:bg-white/10" : "hover:bg-black/10")}
                                        >
                                            <Plus size={12} />
                                        </button>
                                    )}
                                </div>
                                {projects.map(project => (
                                    <div key={project.id} className="flex flex-col">
                                        <div
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => {
                                                if (!draggedChatId) return;
                                                const chat = chats.find(c => c.id === draggedChatId);
                                                if (chat?.isPinned) return; // Prevent pinned chats from being moved to projects
                                                onMoveChatToProject(draggedChatId, project.id);
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 text-left group w-full",
                                                themeStyles.isDark ? "hover:bg-white/5 text-inherit opacity-70" : "hover:bg-black/5 text-inherit opacity-70",
                                                !isSidebarOpen && "justify-center"
                                            )}
                                        >
                                            <Folder size={18} className="shrink-0 opacity-70" />
                                            {isSidebarOpen && <span className="text-sm truncate font-medium">{project.name}</span>}
                                            {isSidebarOpen && (
                                                <button
                                                    onClick={() => onDeleteProject(project.id)}
                                                    className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                        {/* Chats inside Project */}
                                        {isSidebarOpen && chats.filter(c => c.projectId === project.id).map(chat => (
                                            <div key={chat.id} className="ml-6 relative group/subitem">
                                                <button
                                                    draggable
                                                    onDragStart={() => setDraggedChatId(chat.id)}
                                                    onClick={() => {
                                                        setActiveView('home');
                                                        const agent = AGENTS.find(a => a.id === chat.agentId);
                                                        if (agent) setSelectedAgent(agent);
                                                    }}
                                                    className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 text-left w-full", themeStyles.isDark ? "hover:bg-white/5 opacity-60" : "hover:bg-black/5 opacity-60")}
                                                >
                                                    {showChatIcons && <MessageSquare size={14} className="shrink-0" />}
                                                    <span className="text-xs truncate">{chat.title}</span>
                                                </button>
                                                <button
                                                    onClick={() => onMoveChatToProject(chat.id, undefined)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover/subitem:opacity-100 hover:text-blue-500 transition-all"
                                                    title="Move back to Recent"
                                                >
                                                    <Undo2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div
                                className="flex flex-col gap-1"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => draggedChatId && onMoveChatToProject(draggedChatId, undefined)}
                            >
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
                                                    <button
                                                        draggable
                                                        onDragStart={() => setDraggedChatId(chat.id)}
                                                        onClick={() => {
                                                            setActiveView('home');
                                                            const agent = AGENTS.find(a => a.id === chat.agentId);
                                                            if (agent) setSelectedAgent(agent);
                                                            if (isMobile) setIsSidebarOpen(false); // 手機端點擊後自動收回
                                                        }}
                                                        className={cn("flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-left group w-full", themeStyles.isDark ? "hover:bg-white/5 text-inherit opacity-70" : "hover:bg-black/5 text-inherit opacity-70", !isSidebarOpen && "justify-center")}
                                                    >
                                                        {showChatIcons && <MessageSquare size={18} className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />}
                                                        {isSidebarOpen && (
                                                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                                                <span className="text-sm truncate font-normal">{chat.title}</span>
                                                                {chat.isPinned && <Pin size={10} className="shrink-0 text-blue-500 rotate-45" />}
                                                            </div>
                                                        )}
                                                    </button>
                                                )}
                                                {isSidebarOpen && editingChatId !== chat.id && (
                                                    <button onClick={(e) => handleMenuClick(e, chat.id)} className={cn("absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all opacity-0 group-hover/item:opacity-100 z-10", themeStyles.isDark ? "hover:bg-white/10" : "hover:bg-black/10")}><MoreVertical size={14} className="opacity-70" /></button>
                                                )}
                                                {activeMenuId === chat.id && menuPosition && (
                                                    <div
                                                        ref={menuRef}
                                                        style={{
                                                            position: 'fixed',
                                                            top: menuPlacement === 'up' ? 'auto' : `${menuPosition.top + 32}px`,
                                                            bottom: menuPlacement === 'up' ? `${window.innerHeight - menuPosition.top}px` : 'auto',
                                                            left: `${menuPosition.left - 100}px`, // 稍微向左偏移對齊按鈕
                                                        }}
                                                        className={cn(
                                                            "w-36 rounded-xl shadow-2xl z-[100] py-1.5 border backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in duration-200",
                                                            themeStyles.isDark ? "bg-[#2b2c2e]/95 border-white/10" : "bg-white/95 border-gray-200"
                                                        )}
                                                    >
                                                        <button onClick={() => handleTogglePin(chat.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left font-medium">
                                                            <Pin size={14} className={chat.isPinned ? "fill-current" : ""} />
                                                            {chat.isPinned ? 'Unpin' : 'Pin'}
                                                        </button>
                                                        <button onClick={() => { setEditingChatId(chat.id); setEditingTitle(chat.title); setActiveMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left font-medium"><Edit2 size={14} /> Rename</button>
                                                        <button onClick={() => handleDelete(chat.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"><Trash2 size={14} /> Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-3 border-t border-inherit mt-auto flex flex-col gap-1 shrink-0">
                    {[
                        { icon: Search, label: 'Search', onClick: () => { setActiveView('search'); setSelectedAgent(null); if (isMobile) setIsSidebarOpen(false); }, active: activeView === 'search' },
                        { icon: Bot, label: 'AI Agents', onClick: () => { setActiveView('agents'); if (isMobile) setIsSidebarOpen(false); }, active: activeView === 'agents' },
                        { icon: Settings, label: 'Model Training' },
                        { icon: LogOut, label: 'Back', onClick: onBack, active: false }
                    ].map((item, idx) => (
                        <button key={idx} onClick={item.onClick} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group w-full", item.active ? (themeStyles.isDark ? "bg-white/10 text-white" : "bg-black/10 text-gray-900") : (themeStyles.isDark ? "hover:bg-white/5 text-inherit opacity-70" : "hover:bg-black/5 text-inherit opacity-70"), !isSidebarOpen && "justify-center")}>
                            <item.icon size={18} className={cn("shrink-0 transition-opacity", item.active ? "text-[#4d90fe] opacity-100" : "opacity-70 group-hover:opacity-100")} />
                            {isSidebarOpen && <span className="text-sm whitespace-nowrap font-medium">{item.label}</span>}
                        </button>
                    ))}

                    <div className="relative mt-2" ref={accountMenuRef}>
                        <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className={cn("flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-300 text-left group w-full", themeStyles.isDark ? "hover:bg-white/5 text-inherit" : "hover:bg-black/5 text-inherit", !isSidebarOpen && "justify-center")}>
                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#4d90fe] to-[#8e75ff] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg">LW</div>
                            {isSidebarOpen && <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate leading-tight">Liwei Ji</p><p className="text-[10px] opacity-50 truncate leading-tight">liwei_ji@email.com</p></div>}
                        </button>
                        {isAccountMenuOpen && (
                            <div
                                className={cn(
                                    "absolute bottom-full left-0 mb-2 rounded-2xl shadow-2xl z-50 p-2 border backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200",
                                    isSidebarOpen ? "right-0" : "w-56",
                                    themeMode === 'colorful' ? "border-white/10" : (themeStyles.isDark ? "bg-[#2b2c2e]/95 border-white/10" : "bg-white/95 border-gray-200")
                                )}
                                style={themeMode === 'colorful' ? { backgroundColor: `${customColor}f2` } : {}}
                            >
                                {/* 主題切換 (Click Fly-out) */}
                                <div
                                    onClick={(e) => { e.stopPropagation(); setIsThemeSectionOpen(!isThemeSectionOpen); }}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative cursor-pointer"
                                >
                                    <Palette size={14} className="opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs font-medium flex-1 opacity-70 group-hover:opacity-100 text-left">Theme</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full border border-inherit shadow-sm",
                                            themeMode === 'light' ? "bg-white border-gray-200" :
                                                themeMode === 'dark' ? "bg-black border-white/20" :
                                                    "bg-gradient-to-tr from-[#4d90fe] to-[#f472b6] border-transparent"
                                        )} style={themeMode === 'colorful' ? { backgroundColor: customColor } : {}} />
                                        <ChevronRight size={12} className={cn("opacity-40 transition-transform", isThemeSectionOpen && "rotate-90")} />
                                    </div>

                                    {/* Fly-out Submenu (Absolute) */}
                                    <AnimatePresence>
                                        {isThemeSectionOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className={cn(
                                                    "absolute left-full top-0 ml-2 w-48 p-2 rounded-2xl shadow-2xl border backdrop-blur-xl z-[60] flex flex-col gap-1",
                                                    themeMode === 'colorful' ? "border-white/10" : (themeStyles.isDark ? "bg-[#2b2c2e]/95 border-white/10" : "bg-white/95 border-gray-200")
                                                )}
                                                style={themeMode === 'colorful' ? { backgroundColor: `${customColor}f2` } : {}}
                                            >
                                                <button onClick={() => setThemeMode('light')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/sub w-full text-left">
                                                    <div className={cn("w-3 h-3 rounded-full bg-white border shrink-0", themeMode === 'light' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200")} />
                                                    <span className={cn("text-xs font-medium", themeMode === 'light' ? "text-blue-500" : "opacity-70")}>Light Mode</span>
                                                </button>
                                                <button onClick={() => setThemeMode('dark')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/sub w-full text-left">
                                                    <div className={cn("w-3 h-3 rounded-full bg-black border shrink-0", themeMode === 'dark' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-white/20")} />
                                                    <span className={cn("text-xs font-medium", themeMode === 'dark' ? "text-blue-500" : "opacity-70")}>Dark Mode</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setThemeMode('colorful'); colorInputRef.current?.click(); }}
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/sub w-full text-left relative"
                                                >
                                                    <div className={cn("w-3 h-3 rounded-full bg-gradient-to-tr from-[#4d90fe] to-[#f472b6] border shrink-0", themeMode === 'colorful' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent")} style={themeMode === 'colorful' ? { backgroundColor: customColor } : {}} />
                                                    <span className={cn("text-xs font-medium", themeMode === 'colorful' ? "text-blue-500" : "opacity-70")}>Colorful Mode</span>
                                                    <input type="color" ref={colorInputRef} className="absolute opacity-0 pointer-events-none w-0 h-0" value={customColor} onChange={(e) => setCustomColor(e.target.value)} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 對話圖標開關 */}
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg group">
                                    <MessageSquare size={14} className="opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs font-medium flex-1 opacity-70 group-hover:opacity-100 text-left">Show Icons</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowChatIcons(!showChatIcons); }}
                                        className={cn("w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0", showChatIcons ? "bg-[#4d90fe]" : "bg-gray-400")}
                                    >
                                        <div className={cn("w-3 h-3 bg-white rounded-full transition-transform shadow-sm", showChatIcons ? "translate-x-4" : "translate-x-0")} />
                                    </button>
                                </div>

                                {/* 日期分組 */}
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg group">
                                    <CalendarDays size={14} className="opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs font-medium flex-1 opacity-70 group-hover:opacity-100 text-left">Group by Date</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowDateGrouping(!showDateGrouping); }}
                                        className={cn("w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0", showDateGrouping ? "bg-[#4d90fe]" : "bg-gray-400")}
                                    >
                                        <div className={cn("w-3 h-3 bg-white rounded-full transition-transform shadow-sm", showDateGrouping ? "translate-x-4" : "translate-x-0")} />
                                    </button>
                                </div>

                                {/* 側邊欄樣式 (懸浮切換) */}
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg group">
                                    <Layout size={14} className="opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs font-medium flex-1 opacity-70 group-hover:opacity-100 text-left">Sidebar</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsSidebarFloating(!isSidebarFloating); }}
                                        className={cn("w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 shrink-0", isSidebarFloating ? "bg-[#4d90fe]" : "bg-gray-400")}
                                    >
                                        <div className={cn("w-3 h-3 bg-white rounded-full transition-transform shadow-sm", isSidebarFloating ? "translate-x-4" : "translate-x-0")} />
                                    </button>
                                </div>

                                {/* 幫助 */}
                                <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left font-medium rounded-lg group">
                                    <HelpCircle size={14} className="opacity-70 group-hover:opacity-100" />
                                    <span className="opacity-70 group-hover:opacity-100">Help</span>
                                </button>

                                <div className="h-px bg-inherit my-1 opacity-10" />

                                {/* 登出 (僅 UI 呈現) */}
                                <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium rounded-lg cursor-default">
                                    <LogOut size={14} /> Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Add Project Modal */}
            <AnimatePresence>
                {isAddProjectModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsAddProjectModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                "relative w-full max-w-sm rounded-3xl p-6 shadow-2xl border backdrop-blur-xl",
                                themeStyles.isDark ? "bg-[#2b2c2e]/95 border-white/10" : "bg-white/95 border-gray-200"
                            )}
                        >
                            <h3 className="text-lg font-semibold mb-4">Create Project</h3>
                            <input
                                autoFocus
                                placeholder="Name"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newProjectName.trim()) {
                                        onCreateProject(newProjectName.trim());
                                        setNewProjectName('');
                                        setIsAddProjectModalOpen(false);
                                    }
                                    if (e.key === 'Escape') setIsAddProjectModalOpen(false);
                                }}
                                className={cn(
                                    "w-full px-4 py-3 rounded-xl border outline-none transition-all mb-6",
                                    themeStyles.isDark ? "bg-white/5 border-white/10 focus:border-blue-500" : "bg-black/5 border-gray-200 focus:border-blue-500"
                                )}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsAddProjectModalOpen(false)}
                                    className={cn("flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors", themeStyles.isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10")}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (newProjectName.trim()) {
                                            onCreateProject(newProjectName.trim());
                                            setNewProjectName('');
                                            setIsAddProjectModalOpen(false);
                                        }
                                    }}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
