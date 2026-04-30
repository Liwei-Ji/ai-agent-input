import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PanelLeft,
    MessageSquare,
    Plus,
    Settings,
    HelpCircle,
    History,
    Send,
    Bot,
    ShieldCheck,
    Cpu,
    FileText,
    Image,
    Paperclip,
    MoreVertical,
    Trash2,
    Edit2,
    Check,
    LogOut,
    ChevronUp
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type ThemeMode = 'light' | 'dark' | 'colorful';
type ViewType = 'home' | 'agents';

interface Agent {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
}

const AGENTS: Agent[] = [
    { id: 'gmp', name: 'GMP AI Agent', description: '致力於 GMP 相關規範與品質管理流程諮詢。', icon: ShieldCheck, color: 'bg-blue-600' },
    { id: 'dise', name: 'DISE AI Agent', description: '專業提供 DISE 相關技術支援與系統開發指引。', icon: Cpu, color: 'bg-blue-600' },
    { id: 'doc', name: 'DOC AI', description: '智慧文檔管理專家，精通各類文件處理與自動化流程。', icon: FileText, color: 'bg-blue-600' },
    { id: 'apple', name: 'Nano Apple', description: '創意生成式 AI，能將您的想法轉化為精美豐富的圖像。', icon: Image, color: 'bg-blue-600' },
];

export default function ApplePage({ onBack }: { onBack: () => void }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');
    const [activeView, setActiveView] = useState<ViewType>('home');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [customColor, setCustomColor] = useState('#6366f1');
    const [inputText, setInputText] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [chats, setChats] = useState([
        { id: '1', title: 'GMP 規範諮詢', timestamp: new Date().getTime(), agentId: 'gmp' },
        { id: '2', title: 'API 規範與設計', timestamp: new Date().getTime() - 1000 * 60 * 60 * 2, agentId: 'gmp' },
        { id: '3', title: 'GMP 架構圖', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24, agentId: 'dise' },
        { id: '4', title: '產品文檔自動化', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 3, agentId: 'doc' },
        { id: '5', title: '生成高品質圖像技巧', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 5, agentId: 'apple' },
        { id: '6', title: 'GMP認證', timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 10, agentId: 'gmp' },
    ]);
    const colorInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

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

    const createNewChat = (agent: Agent) => {
        const newChat = {
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

    const getContrastColor = (hex: string) => {
        const cleanHex = hex.replace('#', '');
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#1f1f1f' : '#ffffff';
    };

    const getThemeStyles = () => {
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

    const groupChats = (chatList: typeof chats) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterday = today - 1000 * 60 * 60 * 24;
        const lastWeek = today - 1000 * 60 * 60 * 24 * 7;
        const groups: { [key: string]: typeof chats } = { 'Today': [], 'Yesterday': [], '7 Days': [], '30 Days': [] };
        chatList.forEach(chat => {
            if (chat.timestamp >= today) groups['Today'].push(chat);
            else if (chat.timestamp >= yesterday) groups['Yesterday'].push(chat);
            else if (chat.timestamp >= lastWeek) groups['7 Days'].push(chat);
            else groups['30 Days'].push(chat);
        });
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    };

    const groupedChats = groupChats(chats);
    const themeStyles = getThemeStyles();

    return (
        <div
            className="flex h-screen w-screen overflow-hidden font-sans selection:bg-blue-500/30"
            style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.color }}
        >
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 220 : 68 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className={cn(
                    "relative flex flex-col h-full border-r overflow-hidden z-20 shrink-0",
                    themeMode === 'dark' ? "bg-[#1e1f20] border-[#333537]" : themeMode === 'colorful' ? (themeStyles.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10") : "bg-[#f0f4f9] border-transparent"
                )}
            >
                <div className={cn("p-4 flex flex-col gap-6 shrink-0", isSidebarOpen ? "items-end" : "items-center")}>
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

            <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
                <header className={cn(
                    "h-20 px-8 flex items-center z-10 shrink-0 transition-colors duration-200",
                    selectedAgent && activeView === 'home' ? "justify-between" : "justify-end"
                )}>
                    <AnimatePresence>
                        {selectedAgent && activeView === 'home' && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300", themeStyles.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10 text-gray-900")}>
                                <div className={cn("w-2 h-2 rounded-full", selectedAgent.color)} /><span className="opacity-70 uppercase tracking-widest">{selectedAgent.name}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex items-center gap-4">
                        <div className={cn("p-1 rounded-full flex items-center gap-2 backdrop-blur-xl border transition-all duration-500 ease-in-out", themeStyles.isDark ? "bg-black/40 border-white/10" : "bg-white/40 border-black/10")}>
                            <button onClick={() => setThemeMode('light')} className={cn("w-6 h-6 rounded-full transition-all hover:scale-110 bg-white", themeMode === 'light' ? "border-2 border-gray-400" : "border border-gray-200")} />
                            <button onClick={() => setThemeMode('dark')} className={cn("w-6 h-6 rounded-full transition-all hover:scale-110 bg-black", themeMode === 'dark' ? "border-2 border-white/40" : "border border-gray-800")} />
                            <div className="relative flex items-center justify-center">
                                <button onClick={() => { setThemeMode('colorful'); colorInputRef.current?.click(); }} className={cn("w-6 h-6 rounded-full transition-all hover:scale-110 bg-gradient-to-tr from-[#4d90fe] via-[#8e75ff] to-[#f472b6]", themeMode === 'colorful' ? "border-2 border-white/40" : "")} style={themeMode === 'colorful' ? { backgroundColor: customColor } : {}} />
                                <input type="color" ref={colorInputRef} className="absolute opacity-0 pointer-events-none" value={customColor} onChange={(e) => setCustomColor(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className={cn(
                    "flex-1 flex flex-col items-center px-8 pb-1 overflow-y-auto transition-colors duration-200",
                    !selectedAgent ? "justify-start pt-20" : "justify-center pt-0"
                )}>
                    <AnimatePresence mode="wait">
                        {activeView === 'home' ? (
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
                        ) : (
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
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}