/**
 * Header.tsx
 * 頂部標頭組件：顯示當前選擇的 Agent 狀態，並提供淺色/深色/自定義色彩模式的切換功能。
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
}

export const Header: React.FC<HeaderProps> = ({
    selectedAgent,
    activeView,
    themeStyles,
    themeMode,
    setThemeMode,
    customColor,
    setCustomColor,
    colorInputRef
}) => {
    return (
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
    );
};
