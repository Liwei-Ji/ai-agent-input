import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    FlaskConical,
    Search,
    Play,
    Table,
    Layers,
    X,
    Info,
    Plus
} from 'lucide-react';
import { cn } from './shared';
import type { ThemeStyles } from './shared';

interface ColumnItem {
    id: string;
    name: string;
    disabled?: boolean;
    recommend?: boolean;
    type?: 'data' | 'timestamp';
}

interface TrainingViewProps {
    themeStyles: ThemeStyles;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ themeStyles }) => {
    const [activePanel, setActivePanel] = useState<string | null>('experiment');
    const [topic, setTopic] = useState('');
    const [selectedType, setSelectedType] = useState('xgboost');
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const rightColumnRef = useRef<HTMLDivElement>(null);

    // --- Step 3: Column Selection State ---
    const [availableCols, setAvailableCols] = useState<ColumnItem[]>([
        { id: 'col-1', name: 'Frame', type: 'data' },
        { id: 'col-2', name: 'Timestamp', type: 'timestamp', disabled: true },
        { id: 'col-3', name: 'Confidence', type: 'data' },
    ]);

    const [selectedCols, setSelectedCols] = useState<ColumnItem[]>([
        { id: 'col-4', name: 'Time (s)', type: 'data', recommend: true },
        { id: 'col-5', name: 'Defect Size', type: 'data', recommend: true },
    ]);

    const handleMoveToRight = (item: ColumnItem) => {
        if (item.disabled) return;
        setAvailableCols(prev => prev.filter(i => i.id !== item.id));
        setSelectedCols(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const handleMoveToLeft = (item: ColumnItem) => {
        setSelectedCols(prev => prev.filter(i => i.id !== item.id));
        setAvailableCols(prev => [...prev, item]);
    };

    const experimentTypes = [
        { id: 'xgboost', name: 'xgboost', recommend: true, description: 'Gradient boosting for tabular data (numeric/categorical features). Best for handling complex relationships.' },
        { id: 'randomforest', name: 'randomforest', description: 'Ensemble of decision trees for tabular data (numeric/categorical features).' },
        { id: 'svm', name: 'svm', description: 'Supervised learning for structured data, effective with smaller datasets or linear separability.' },
        { id: 'dnn', name: 'dnn', description: 'Deep neural network for tabular data. Suitable for large datasets with complex relationships between features.' }
    ];

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
        },
        {
            id: 'type',
            title: 'Experiment Type',
            icon: Play,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                    {experimentTypes.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={cn(
                                "group cursor-pointer flex gap-4 p-1 rounded-xl transition-all duration-300",
                                selectedType === type.id ? "opacity-100" : "opacity-60 hover:opacity-80"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-1",
                                selectedType === type.id
                                    ? "border-blue-500 bg-blue-500 text-white"
                                    : (themeStyles.isDark ? "border-white/20" : "border-black/20")
                            )}>
                                {selectedType === type.id && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-base tracking-tight">{type.name}</span>
                                    {type.recommend && (
                                        <span className="px-2 py-0.5 rounded-md bg-linear-to-r from-orange-400 to-orange-500 text-[10px] font-bold text-white uppercase tracking-tighter shadow-sm">
                                            Recommend
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs opacity-60 leading-relaxed font-medium">
                                    {type.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 'columns',
            title: 'Select INPUT column',
            icon: Table,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left Column: Options */}
                    <div className={cn(
                        "md:col-span-4 rounded-2xl p-3 space-y-2",
                        themeStyles.isDark ? "bg-white/5" : "bg-black/5"
                    )}>
                        <AnimatePresence mode='popLayout'>
                            {availableCols.map((col) => (
                                <motion.div
                                    layout
                                    key={col.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    drag={!col.disabled}
                                    dragSnapToOrigin
                                    dragElastic={0.1}
                                    dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                                    onDragStart={() => setIsDraggingOver(true)}
                                    onDragEnd={(event, info) => {
                                        setIsDraggingOver(false);
                                        if (!rightColumnRef.current) return;
                                        const rect = rightColumnRef.current.getBoundingClientRect();
                                        const { x, y } = info.point;
                                        
                                        // Add a small buffer (20px) to make the drop target more forgiving
                                        if (
                                            x >= rect.left - 20 &&
                                            x <= rect.right + 20 &&
                                            y >= rect.top - 20 &&
                                            y <= rect.bottom + 20
                                        ) {
                                            handleMoveToRight(col);
                                        }
                                    }}
                                    whileHover={!col.disabled ? { scale: 1.01, borderColor: "rgba(59, 130, 246, 0.5)" } : {}}
                                    whileDrag={{ 
                                        scale: 1.03, 
                                        zIndex: 50,
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -10px rgba(0, 0, 0, 0.2)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onTap={() => handleMoveToRight(col)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border transition-all shadow-sm select-none",
                                        themeStyles.isDark ? "bg-zinc-900 border-white/10" : "bg-white border-black/5",
                                        col.disabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer hover:border-blue-500/50 active:scale-[0.98] touch-none"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {col.type === 'timestamp' ? <Layers size={16} className="opacity-40" /> : <Table size={16} className="opacity-40" />}
                                        <span className="text-sm font-semibold opacity-80">{col.name}</span>
                                    </div>
                                    {col.disabled && <Info size={14} className="opacity-30" />}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Selected */}
                    <div 
                        ref={rightColumnRef}
                        className={cn(
                            "md:col-span-8 rounded-2xl p-3 space-y-2 border-2 transition-all min-h-[160px]",
                            isDraggingOver 
                                ? "border-blue-500/50 bg-blue-500/5 ring-4 ring-blue-500/10" 
                                : "border-transparent",
                            themeStyles.isDark ? "bg-white/5" : "bg-black/5"
                        )}
                    >
                        <AnimatePresence mode='popLayout'>
                            {selectedCols.map((col) => (
                                <motion.div
                                    layout
                                    key={col.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border shadow-sm group",
                                        themeStyles.isDark ? "bg-zinc-900 border-white/10" : "bg-white border-black/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Table size={16} className="opacity-40" />
                                        <span className="text-sm font-semibold opacity-80">{col.name}</span>
                                        {col.recommend && (
                                            <span className="px-2 py-0.5 rounded-md bg-linear-to-r from-teal-400 to-teal-500 text-[10px] font-bold text-white uppercase tracking-tighter shadow-sm">
                                                Recommend
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleMoveToLeft(col)}
                                        className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <X size={18} className="opacity-40 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Placeholder */}
                        <motion.div
                            layout
                            className={cn(
                                "border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 transition-all",
                                isDraggingOver 
                                    ? "opacity-100 border-blue-500/50 text-blue-500 bg-blue-500/5" 
                                    : "opacity-30",
                                themeStyles.isDark ? "border-white/20" : "border-black/20"
                            )}
                        >
                            <Plus size={18} className={cn(isDraggingOver && "animate-bounce")} />
                            <span className="text-sm font-medium">
                                {isDraggingOver ? "Drop here!" : "Drag here or click from left"}
                            </span>
                        </motion.div>
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
                {panels.map((panel, idx) => (
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
                                    <p className="text-xs opacity-50 uppercase tracking-wider font-semibold">Step {idx + 1}</p>
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