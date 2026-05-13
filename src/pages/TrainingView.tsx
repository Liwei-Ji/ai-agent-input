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
    Plus,
    GripVertical,
    Split,
    Check,
    RefreshCw,
    Clock,
    Cpu
} from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// --- Sub-components for dnd-kit ---

const CardContent = ({ col, themeStyles, isDragging, onRemove, showGrip, disabled }: {
    col: ColumnItem,
    themeStyles: ThemeStyles,
    isDragging?: boolean,
    onRemove?: () => void,
    showGrip?: boolean,
    disabled?: boolean
}) => (
    <div className={cn(
        "flex items-center justify-between p-3 rounded-xl border transition-all shadow-sm select-none w-full",
        themeStyles.isDark ? "bg-zinc-900 border-white/10" : "bg-white border-black/5",
        isDragging && "opacity-50 ring-2 ring-blue-500/50",
        (col.disabled || disabled) && "opacity-50"
    )}>
        <div className="flex items-center gap-3">
            {showGrip && <GripVertical size={14} className="opacity-30 cursor-grab active:cursor-grabbing" />}
            {col.type === 'timestamp' ? <Layers size={16} className="opacity-40" /> : <Table size={16} className="opacity-40" />}
            <span className="text-sm font-semibold opacity-80">{col.name}</span>
            {col.recommend && (
                <span className="px-2 py-0.5 rounded-md bg-linear-to-r from-teal-400 to-teal-500 text-[10px] font-bold text-white uppercase tracking-tighter shadow-sm">
                    Recommend
                </span>
            )}
        </div>
        {(col.disabled || disabled) ? (
            <Info size={14} className="opacity-30" />
        ) : onRemove ? (
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
                <X size={18} className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all" />
            </button>
        ) : null}
    </div>
);

const DraggableCard = ({ col, themeStyles, onTap, disabled }: { col: ColumnItem, themeStyles: ThemeStyles, onTap: () => void, disabled?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: col.id,
        disabled: col.disabled || disabled,
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <motion.div
            layout
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            whileHover={!col.disabled ? { scale: 1.01, borderColor: "rgba(59, 130, 246, 0.5)" } : {}}
            whileTap={{ scale: 0.98 }}
            onTap={onTap}
            className={cn(
                "touch-none",
                (col.disabled || disabled) ? "cursor-default" : "cursor-pointer"
            )}
        >
            <CardContent col={col} themeStyles={themeStyles} isDragging={isDragging} disabled={disabled} />
        </motion.div>
    );
};

const SortableCard = ({ col, themeStyles, onRemove, sortableId }: { col: ColumnItem, themeStyles: ThemeStyles, onRemove: () => void, sortableId?: string }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sortableId || `selected-${col.id}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <motion.div
            layout
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="touch-none"
        >
            <CardContent col={col} themeStyles={themeStyles} isDragging={isDragging} onRemove={onRemove} showGrip />
        </motion.div>
    );
};

export const TrainingView: React.FC<TrainingViewProps> = ({ themeStyles }) => {
    const [activePanel, setActivePanel] = useState<string | null>('experiment');
    const [topic, setTopic] = useState('');
    const [selectedType, setSelectedType] = useState('xgboost');
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

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

    const [outputAvailableCols, setOutputAvailableCols] = useState<ColumnItem[]>([
        { id: 'out-1', name: 'Frame', type: 'data' },
        { id: 'out-2', name: 'Time (s)', type: 'data' },
        { id: 'out-3', name: 'Timestamp', type: 'timestamp' },
        { id: 'out-4', name: 'Defect Size', type: 'data' },
        { id: 'out-5', name: 'Confidence', type: 'data' },
    ]);

    const [outputSelectedCols, setOutputSelectedCols] = useState<ColumnItem[]>([]);

    const [isSplitEnabled, setIsSplitEnabled] = useState(false);
    const [trainRatio, setTrainRatio] = useState(80);

    const [isCVEnabled, setIsCVEnabled] = useState(false);
    const [cvFolds, setCvFolds] = useState(2);

    const [computeParam, setComputeParam] = useState('medium');

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
        setAvailableCols(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const handleMoveOutputToRight = (item: ColumnItem) => {
        if (item.disabled) return;
        setOutputAvailableCols(prev => prev.filter(i => i.id !== item.id));
        setOutputSelectedCols(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const handleMoveOutputToLeft = (item: ColumnItem) => {
        setOutputSelectedCols(prev => prev.filter(i => i.id !== item.id));
        setOutputAvailableCols(prev => {
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        setIsDraggingOver(true);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setIsDraggingOver(false);

        if (!over) return;

        // If dragging from available to selected
        if (over.id === 'droppable-selected' || String(over.id).startsWith('selected-')) {
            const item = availableCols.find(c => c.id === active.id);
            if (item) {
                handleMoveToRight(item);
            }
        }

        // If reordering within selected
        if (String(active.id).startsWith('selected-') && String(over.id).startsWith('selected-')) {
            if (active.id !== over.id) {
                setSelectedCols((items) => {
                    const oldIndex = items.findIndex(i => `selected-${i.id}` === active.id);
                    const newIndex = items.findIndex(i => `selected-${i.id}` === over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        }
    };

    const handleOutputDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setIsDraggingOver(false);

        if (!over) return;

        // Note: Left side is not draggable as per request, 
        // so this only handles reordering on the right side.
        if (String(active.id).startsWith('out-selected-') && String(over.id).startsWith('out-selected-')) {
            if (active.id !== over.id) {
                setOutputSelectedCols((items) => {
                    const oldIndex = items.findIndex(i => `out-selected-${i.id}` === active.id);
                    const newIndex = items.findIndex(i => `out-selected-${i.id}` === over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        }
    };

    const experimentTypes = [
        { id: 'xgboost', name: 'xgboost', recommend: true, description: 'Gradient boosting for tabular data (numeric/categorical features). Best for handling complex relationships.' },
        { id: 'randomforest', name: 'randomforest', description: 'Ensemble of decision trees for tabular data (numeric/categorical features).' },
        { id: 'svm', name: 'svm', description: 'Supervised learning for structured data, effective with smaller datasets or linear separability.' },
        { id: 'dnn', name: 'dnn', description: 'Deep neural network for tabular data. Suitable for large datasets with complex relationships between features.' }
    ];

    const computeOptions = [
        { id: 'low', name: 'Low', description: 'Faster but accuracy might be not enough. You can try once in low mode to confirm your data quality.' },
        { id: 'medium', name: 'Medium', recommend: true, description: 'Average speed and accuracy performance.' },
        { id: 'high', name: 'High', description: 'Spend much time but be able to raise accuracy.' }
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
                                        : "bg-white border-black/10 focus:border-blue-500/50"
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
                                        <span className="px-2 py-0.5 rounded-md bg-linear-to-r from-teal-400 to-teal-500 text-[10px] font-bold text-white uppercase tracking-tighter shadow-sm">
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
            title: 'Select INPUT Column',
            icon: Table,
            content: (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Left Column: Options */}
                        <div className={cn(
                            "md:col-span-4 rounded-2xl p-3 space-y-2",
                            themeStyles.isDark ? "bg-transparent" : "bg-transparent"
                        )}>
                            <AnimatePresence mode='popLayout'>
                                {availableCols.map((col) => (
                                    <DraggableCard
                                        key={`available-${col.id}`}
                                        col={col}
                                        themeStyles={themeStyles}
                                        onTap={() => handleMoveToRight(col)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Selected */}
                        <div
                            id="droppable-selected"
                            className={cn(
                                "md:col-span-8 rounded-2xl p-3 space-y-2 border-2 transition-all min-h-[160px]",
                                isDraggingOver
                                    ? "border-blue-500/50 bg-blue-500/5 ring-4 ring-blue-500/10"
                                    : "border-transparent",
                                themeStyles.isDark ? "bg-white/5" : "bg-black/5"
                            )}
                        >
                            <SortableContext
                                items={selectedCols.map(c => `selected-${c.id}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <AnimatePresence mode='popLayout'>
                                    {selectedCols.map((col) => (
                                        <SortableCard
                                            key={`selected-${col.id}`}
                                            col={col}
                                            themeStyles={themeStyles}
                                            onRemove={() => handleMoveToLeft(col)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </SortableContext>

                            {/* Placeholder */}
                            {selectedCols.length === 0 && (
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
                            )}
                        </div>
                    </div>

                    <DragOverlay dropAnimation={null}>
                        {activeId ? (
                            <div className="opacity-80 scale-105 pointer-events-none">
                                {availableCols.find(c => c.id === activeId) ? (
                                    <CardContent col={availableCols.find(c => c.id === activeId)!} themeStyles={themeStyles} isDragging />
                                ) : (
                                    <CardContent col={selectedCols.find(c => `selected-${c.id}` === activeId)!} themeStyles={themeStyles} isDragging />
                                )}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )
        },
        {
            id: 'output-columns',
            title: 'Select OUTPUT Column',
            icon: Table,
            content: (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleOutputDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Left Column: Options */}
                        <div className={cn(
                            "md:col-span-4 rounded-2xl p-3 space-y-2",
                            themeStyles.isDark ? "bg-transparent" : "bg-transparent"
                        )}>
                            <AnimatePresence mode='popLayout'>
                                {outputAvailableCols.map((col) => (
                                    <DraggableCard
                                        key={`out-available-${col.id}`}
                                        col={col}
                                        themeStyles={themeStyles}
                                        onTap={() => handleMoveOutputToRight(col)}
                                        disabled={true} // Non-draggable as requested
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Selected */}
                        <div
                            id="droppable-output-selected"
                            className={cn(
                                "md:col-span-8 rounded-2xl p-3 space-y-2 border-2 transition-all min-h-[160px]",
                                isDraggingOver
                                    ? "border-blue-500/50 bg-blue-500/5 ring-4 ring-blue-500/10"
                                    : "border-transparent",
                                themeStyles.isDark ? "bg-white/5" : "bg-black/5"
                            )}
                        >
                            <SortableContext
                                items={outputSelectedCols.map(c => `out-selected-${c.id}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <AnimatePresence mode='popLayout'>
                                    {outputSelectedCols.map((col) => (
                                        <SortableCard
                                            key={`out-selected-${col.id}`}
                                            col={col}
                                            themeStyles={themeStyles}
                                            onRemove={() => handleMoveOutputToLeft(col)}
                                            sortableId={`out-selected-${col.id}`}
                                        />
                                    ))}
                                </AnimatePresence>
                            </SortableContext>

                            {/* Placeholder */}
                            {outputSelectedCols.length === 0 && (
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
                                        {isDraggingOver ? "Drop here!" : "Click columns from left"}
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <DragOverlay dropAnimation={null}>
                        {activeId ? (
                            <div className="opacity-80 scale-105 pointer-events-none">
                                {outputSelectedCols.find(c => `out-selected-${c.id}` === activeId) && (
                                    <CardContent col={outputSelectedCols.find(c => `out-selected-${c.id}` === activeId)!} themeStyles={themeStyles} isDragging />
                                )}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )
        },
        {
            id: 'split',
            title: 'Training / Testing Splitting',
            icon: Split,
            content: (
                <div className="space-y-6 py-2">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSplitEnabled(!isSplitEnabled)}
                            className={cn(
                                "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                                isSplitEnabled
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : (themeStyles.isDark ? "border-white/20 bg-transparent" : "border-black/20 bg-transparent")
                            )}
                        >
                            {isSplitEnabled && <Check size={14} strokeWidth={3} />}
                        </button>
                        <span className="text-sm font-semibold opacity-80">Enable Data Splitting</span>
                    </div>

                    <AnimatePresence>
                        {isSplitEnabled && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-2 gap-8 pt-2"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Training Ratio</label>
                                    <div className="relative group">
                                        <select
                                            value={trainRatio}
                                            onChange={(e) => setTrainRatio(Number(e.target.value))}
                                            className={cn(
                                                "w-full appearance-none px-4 py-3 rounded-xl border transition-all outline-none text-sm font-bold cursor-pointer",
                                                themeStyles.isDark
                                                    ? "bg-transparent border-white/10 focus:border-blue-500/50 hover:bg-white/5"
                                                    : "bg-white border-black/10 focus:border-blue-500/50 hover:bg-black/5"
                                            )}
                                        >
                                            {[80, 75, 70, 65, 60].map(val => (
                                                <option key={val} value={val}>{val}%</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Testing Ratio</label>
                                    <div className="relative group">
                                        <select
                                            value={100 - trainRatio}
                                            onChange={(e) => setTrainRatio(100 - Number(e.target.value))}
                                            className={cn(
                                                "w-full appearance-none px-4 py-3 rounded-xl border transition-all outline-none text-sm font-bold cursor-pointer",
                                                themeStyles.isDark
                                                    ? "bg-transparent border-white/10 focus:border-blue-500/50 hover:bg-white/5"
                                                    : "bg-white border-black/10 focus:border-blue-500/50 hover:bg-black/5"
                                            )}
                                        >
                                            {[40, 35, 30, 25, 20].map(val => (
                                                <option key={val} value={val}>{val}%</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )
        },
        {
            id: 'cv',
            title: 'Cross Validation',
            icon: RefreshCw,
            content: (
                <div className="space-y-6 py-2">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCVEnabled(!isCVEnabled)}
                            className={cn(
                                "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                                isCVEnabled
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : (themeStyles.isDark ? "border-white/20 bg-transparent" : "border-black/20 bg-transparent")
                            )}
                        >
                            {isCVEnabled && <Check size={14} strokeWidth={3} />}
                        </button>
                        <span className="text-sm font-semibold opacity-80">Enable Cross Validation</span>
                    </div>

                    <AnimatePresence>
                        {isCVEnabled && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6 pt-2"
                            >
                                <div className="space-y-3 max-w-xs">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-1">Number of Folds</label>
                                    <div className="relative group">
                                        <select
                                            value={cvFolds}
                                            onChange={(e) => setCvFolds(Number(e.target.value))}
                                            className={cn(
                                                "w-full appearance-none px-4 py-3 rounded-xl border transition-all outline-none text-sm font-bold cursor-pointer",
                                                themeStyles.isDark
                                                    ? "bg-transparent border-white/10 focus:border-blue-500/50 hover:bg-white/5"
                                                    : "bg-white border-black/10 focus:border-blue-500/50 hover:bg-black/5"
                                            )}
                                        >
                                            {[2, 3, 4, 5].map(val => (
                                                <option key={val} value={val}>{val} fold</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity" />
                                    </div>
                                    <p className="text-xs opacity-50 mt-2 ml-1 font-medium">
                                        Estimated Time: ~30 mins ({cvFolds})Fold
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )
        },
        {
            id: 'computing',
            title: 'Computing Parameters',
            icon: Cpu,
            content: (
                <div className="grid grid-cols-1 gap-4 p-2">
                    {computeOptions.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => setComputeParam(opt.id)}
                            className={cn(
                                "group cursor-pointer flex gap-4 p-2 rounded-xl transition-all duration-300",
                                computeParam === opt.id ? "opacity-100" : "opacity-60 hover:opacity-80"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-1",
                                computeParam === opt.id
                                    ? "border-blue-500 bg-blue-500 text-white"
                                    : (themeStyles.isDark ? "border-white/20" : "border-black/20")
                            )}>
                                {computeParam === opt.id && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-300" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-base tracking-tight">{opt.name}</span>
                                    {opt.recommend && (
                                        <span className="px-2 py-0.5 rounded-md bg-linear-to-r from-teal-400 to-teal-500 text-[10px] font-bold text-white uppercase tracking-tighter shadow-sm">
                                            Recommend
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs opacity-60 leading-relaxed font-medium">
                                    {opt.description}
                                </p>
                            </div>
                        </div>
                    ))}
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
                            themeStyles.isDark ? "bg-transparent border-white/10" : "bg-transparent border-black/10",
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
                                    <div className="p-5 pt-0">
                                        <div className="pt-1">
                                            {panel.content}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};