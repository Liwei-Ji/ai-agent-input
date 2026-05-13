import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FlaskConical, Search, Play } from 'lucide-react';
import { cn } from './shared';
import type { ThemeStyles } from './shared';

interface TrainingViewProps {
    themeStyles: ThemeStyles;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ themeStyles }) => {
    const [activePanel, setActivePanel] = useState<string | null>('experiment');
    const [topic, setTopic] = useState('');

    const panels = [
        {
            id: 'experiment',
            title: 'Experiment Topic',
            icon: FlaskConical,
            content: (
                <div className="space-y-4">
                    <p className="text-sm opacity-70">Define the main objective or topic of your training experiment.</p>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Optimizing GMP workflow analysis..."
                                className={cn(
                                    "w-full px-4 py-2.5 rounded-xl border transition-all outline-none text-sm",
                                    themeStyles.isDark 
                                        ? "bg-white/5 border-white/10 focus:border-blue-500/50" 
                                        : "bg-black/5 border-black/10 focus:border-blue-500/50"
                                )}
                            />
                        </div>
                        <button 
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95",
                                "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
                            )}
                        >
                            <Search size={16} />
                            Analyze
                        </button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto py-8 px-4"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Model Training</h1>
                <p className="opacity-60">Configure and refine your AI model parameters through experimental topics.</p>
            </div>

            <div className="space-y-3">
                {panels.map((panel) => (
                    <div 
                        key={panel.id}
                        className={cn(
                            "rounded-2xl border transition-all duration-300 overflow-hidden",
                            themeStyles.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10",
                            activePanel === panel.id && (themeStyles.isDark ? "ring-1 ring-blue-500/30" : "ring-1 ring-blue-500/20")
                        )}
                    >
                        <button
                            onClick={() => setActivePanel(activePanel === panel.id ? null : panel.id)}
                            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                    activePanel === panel.id ? "bg-blue-500 text-white" : (themeStyles.isDark ? "bg-white/10 text-white/70" : "bg-black/10 text-black/70")
                                )}>
                                    <panel.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{panel.title}</h3>
                                    <p className="text-xs opacity-50 uppercase tracking-wider font-semibold">Step {panel.id === 'experiment' ? '1' : '?'}</p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: activePanel === panel.id ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="opacity-50"
                            >
                                <ChevronDown size={20} />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {activePanel === panel.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <div className="p-5 pt-0 border-t border-white/5 mt-2">
                                        <div className="pt-4">
                                            {panel.content}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {/* Placeholder for future panels */}
                <div className={cn(
                    "p-5 rounded-2xl border border-dashed flex items-center justify-center opacity-30",
                    themeStyles.isDark ? "border-white/20" : "border-black/20"
                )}>
                    <p className="text-sm font-medium italic">More training modules coming soon...</p>
                </div>
            </div>
        </motion.div>
    );
};
