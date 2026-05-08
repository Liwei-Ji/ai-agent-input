/**
 * Header.tsx
 * 頂部標頭組件：顯示當前選擇的 Agent 狀態，並提供淺色/深色/自定義色彩模式的切換功能。
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from './shared';
import type { Agent, ViewType, ThemeMode, ThemeStyles } from './shared';

interface HeaderProps {
    selectedAgent: Agent | null;
    activeView: ViewType;
    themeStyles: ThemeStyles;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    customColor: string;
    setCustomColor: (color: string) => void;
    colorInputRef: React.RefObject<HTMLInputElement | null>;
    isMobile: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
    selectedAgent,
    activeView,
    themeStyles,
    themeMode,
    setThemeMode,
    customColor,
    setCustomColor,
    colorInputRef,
    isMobile,
    setIsSidebarOpen
}) => {
    return (
        <header className={cn(
            "h-20 px-8 flex items-center justify-between z-10 shrink-0 transition-colors duration-200",
            isMobile && "px-4"
        )}>
            <div className="flex items-center gap-3">
                {isMobile && (
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <AnimatePresence>
                    {selectedAgent && (activeView === 'home' || activeView === 'notebook') && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300", themeStyles.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10 text-gray-900")}>
                        <div className={cn("w-2 h-2 rounded-full", selectedAgent.color)} /><span className="opacity-70 uppercase tracking-widest">{selectedAgent.name}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </header>
    );
};
