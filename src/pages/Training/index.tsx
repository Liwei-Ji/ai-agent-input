import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    FlaskConical,
    Search,
    Play,
    Table,
    X,
    Plus,
    Split,
    Check,
    RefreshCw,
    Cpu,
    Rocket,
    Trash2,
    ArrowRight,
    Upload
} from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '../shared';
import type { ColumnItem, TrainingViewProps } from './types';
import { CardContent, DraggableCard, SortableCard, DroppableArea } from './components/TrainingCards';
import { StepUpload } from './components/StepUpload';
import { DataSummary } from './components/DataSummary';

export const TrainingView: React.FC<TrainingViewProps> = ({ themeStyles }) => {
    const [phase, setPhase] = useState<'upload' | 'config'>('upload');
    const [activePanel, setActivePanel] = useState<string | null>('experiment');
    const [topic, setTopic] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [uploadType, setUploadType] = useState<'tabular' | 'vision' | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

    const [computeParam, setComputeParam] = useState<string | null>(null);


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

    const handleDiscard = () => {
        // Reset all states
        setTopic('');
        setSelectedType('xgboost');
        setAvailableCols([
            { id: 'col-1', name: 'Frame', type: 'data' },
            { id: 'col-2', name: 'Timestamp', type: 'timestamp', disabled: true },
            { id: 'col-3', name: 'Confidence', type: 'data' },
        ]);
        setSelectedCols([
            { id: 'col-4', name: 'Time (s)', type: 'data', recommend: true },
            { id: 'col-5', name: 'Defect Size', type: 'data', recommend: true },
        ]);
        setOutputAvailableCols([
            { id: 'out-1', name: 'Frame', type: 'data' },
            { id: 'out-2', name: 'Time (s)', type: 'data' },
            { id: 'out-3', name: 'Timestamp', type: 'timestamp' },
            { id: 'out-4', name: 'Defect Size', type: 'data' },
            { id: 'out-5', name: 'Confidence', type: 'data' },
        ]);
        setOutputSelectedCols([]);
        setIsSplitEnabled(false);
        setTrainRatio(80);
        setIsCVEnabled(false);
        setCvFolds(2);
        setComputeParam(null);
        setCompletedSteps([]);
        setUploadType(null);
        setUploadedFiles([]);
        setPhase('upload');
        setActivePanel('experiment');

    };

    const markStepComplete = (id: string) => {
        setCompletedSteps(prev => prev.includes(id) ? prev : [...prev, id]);
    };

    const computeOptions = [
        { id: 'low', name: 'Low', description: 'Faster but accuracy might be not enough. You can try once in low mode to confirm your data quality.' },
        { id: 'medium', name: 'Medium', recommend: true, description: 'Average speed and accuracy performance.' },
        { id: 'high', name: 'High', description: 'Spend much time but be able to raise accuracy.' }
    ];

    const isReadyToCompute = ['upload', 'experiment', 'type', 'columns', 'output-columns', 'computing'].every(id => completedSteps.includes(id));


    const Stepper = () => {
        const steps = [
            { id: 'upload', label: 'Data Source', isDone: phase === 'config' || completedSteps.includes('upload') },
            { id: 'config', label: 'Configuration', isDone: isReadyToCompute },
            { id: 'training', label: 'Training', isDone: false },
        ];

        return (
            <div className="flex items-center gap-4">
                {steps.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 text-[10px] font-bold border-2",
                                (step.id === 'upload' && phase === 'upload') || (step.id === 'config' && phase === 'config')
                                    ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                    : step.isDone 
                                        ? "bg-teal-500 border-teal-500 text-white"
                                        : themeStyles.isDark 
                                            ? "bg-white/5 border-white/10 text-white/20" 
                                            : "bg-black/5 border-black/5 text-black/20"
                            )}>
                                {step.isDone ? <Check size={12} strokeWidth={4} /> : i + 1}
                            </div>
                            <span className={cn(
                                "text-[9px] uppercase tracking-wider font-black transition-colors duration-300 hidden md:block",
                                (step.id === 'upload' && phase === 'upload') || (step.id === 'config' && phase === 'config')
                                    ? "text-blue-500"
                                    : step.isDone ? "text-teal-500" : "opacity-30"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="w-4 h-[1px] bg-black/10 dark:bg-white/10" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const NextStepButton = ({ nextId, currentId, label = "Go to Next" }: { nextId: string, currentId: string, label?: string }) => (
        <div className="flex justify-end mt-6 pt-4 border-t border-white/5">
            <button
                onClick={() => {
                    markStepComplete(currentId);
                    setActivePanel(nextId);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
                {label}
                <ArrowRight size={16} />
            </button>
        </div>
    );

    const panels = [
        {
            id: 'experiment',
            title: 'Experiment Topic',
            summary: topic ? (topic.length > 20 ? topic.substring(0, 20) + '...' : topic) : null,
            isComplete: completedSteps.includes('experiment'),
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
                            onClick={() => {
                                markStepComplete('experiment');
                                setActivePanel('type');
                            }}
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
            summary: experimentTypes.find(t => t.id === selectedType)?.name || selectedType,
            isComplete: completedSteps.includes('type'),
            icon: Play,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                    {experimentTypes.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => {
                                setSelectedType(type.id);
                                markStepComplete('type');
                                setTimeout(() => setActivePanel('columns'), 300);
                            }}
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
            summary: selectedCols.length > 0
                ? (selectedCols.length <= 2
                    ? selectedCols.map(c => c.name).join(', ')
                    : `${selectedCols.length} Columns (${selectedCols.slice(0, 2).map(c => c.name).join(', ')}...)`)
                : null,
            isComplete: completedSteps.includes('columns'),
            icon: Table,
            content: (
                <div className="space-y-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Left Column: Options */}
                            <div className={cn(
                                "md:col-span-4 rounded-2xl p-3 space-y-2 border-2 border-dashed",
                                themeStyles.isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
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
                            <DroppableArea
                                id="droppable-selected"
                                className={cn(
                                    "md:col-span-8 rounded-2xl p-3 space-y-2 border-2 transition-all min-h-[160px]",
                                    "border-dashed border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5"
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
                            </DroppableArea>
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
                    <NextStepButton currentId="columns" nextId="output-columns" />
                </div>
            )
        },
        {
            id: 'output-columns',
            title: 'Select OUTPUT Column',
            summary: outputSelectedCols.length > 0
                ? (outputSelectedCols.length <= 2
                    ? outputSelectedCols.map(c => c.name).join(', ')
                    : `${outputSelectedCols.length} Columns (${outputSelectedCols.slice(0, 2).map(c => c.name).join(', ')}...)`)
                : null,
            isComplete: completedSteps.includes('output-columns'),
            icon: Table,
            content: (
                <div className="space-y-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleOutputDragEnd}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Left Column: Options */}
                            <div className={cn(
                                "md:col-span-4 rounded-2xl p-3 space-y-2 border-2 border-dashed",
                                themeStyles.isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
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
                            <DroppableArea
                                id="droppable-output-selected"
                                className={cn(
                                    "md:col-span-8 rounded-2xl p-3 space-y-2 border-2 transition-all min-h-[160px]",
                                    "border-dashed border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5"
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
                            </DroppableArea>
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
                    <NextStepButton currentId="output-columns" nextId="split" />
                </div>
            )
        },
        {
            id: 'split',
            title: 'Training / Testing Splitting',
            summary: isSplitEnabled ? `${trainRatio}/${100 - trainRatio}` : "Off",
            isComplete: completedSteps.includes('split'),
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
                    <NextStepButton currentId="split" nextId="cv" />
                </div>
            )
        },
        {
            id: 'cv',
            title: 'Cross Validation',
            summary: isCVEnabled ? `${cvFolds} Fold` : "Off",
            isComplete: completedSteps.includes('cv'),
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
                    <NextStepButton currentId="cv" nextId="computing" />
                </div>
            )
        },
        {
            id: 'computing',
            title: 'Computing Parameters',
            summary: computeOptions.find(o => o.id === computeParam)?.name,
            isComplete: completedSteps.includes('computing'),
            icon: Cpu,
            content: (
                <div className="grid grid-cols-1 gap-4 p-2">
                    {computeOptions.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => {
                                setComputeParam(opt.id);
                                markStepComplete('computing');
                            }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl mx-auto px-4"
        >
            <div className={cn(
                "sticky top-0 z-30 pt-4 pb-6 mb-8 transition-all duration-300 backdrop-blur-xl",
                themeStyles.isDark 
                    ? "bg-zinc-950/80" 
                    : "bg-white/80"
            )}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black mb-2 tracking-tight">Model Training</h1>
                        <p className="opacity-50 max-w-lg text-xs font-medium">Configure and refine your AI model parameters through experimental topics.</p>
                    </div>
                    <div className="shrink-0 mb-1">
                        <Stepper />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {phase === 'upload' ? (
                    <motion.div
                        key="upload-phase"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="py-10"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold mb-2">Select Data Source</h2>
                            <p className="opacity-50 text-sm">Choose the type of data you want to use for this training experiment.</p>
                        </div>
                        <StepUpload
                            themeStyles={themeStyles}
                            onComplete={(type, files) => {
                                setUploadType(type);
                                setUploadedFiles(files);
                                markStepComplete('upload');
                                setPhase('config');
                                setActivePanel('experiment');
                            }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="config-phase"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pb-20"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left: Configuration Steps */}
                            <div className="lg:col-span-8 space-y-3">
                                {panels.map((panel, idx) => (
                                    <div
                                        key={panel.id}
                                        ref={el => { panelRefs.current[panel.id] = el; }}
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
                                            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                                    activePanel === panel.id ? "bg-blue-500 text-white" : (panel.isComplete ? "bg-teal-500/10 text-teal-500" : (themeStyles.isDark ? "bg-white/10 text-white/70" : "bg-black/10 text-black/70"))
                                                )}>
                                                    {panel.isComplete && activePanel !== panel.id ? <Check size={20} strokeWidth={3} /> : <panel.icon size={20} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-4 h-full">
                                                        <div className="flex flex-col justify-center">
                                                            <h3 className="font-bold text-lg leading-none mb-1">{panel.title}</h3>
                                                            <p className="text-[10px] opacity-40 uppercase tracking-wider font-bold">Step {idx + 1}</p>
                                                        </div>
                                                        {activePanel !== panel.id && panel.summary && (
                                                            <div className="flex items-center h-full">
                                                                <span className="text-sm font-medium opacity-60 truncate bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5">
                                                                    {panel.summary}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                            <motion.div
                                                animate={{ rotate: activePanel === panel.id ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="opacity-50 ml-4"
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

                                {/* Bottom Actions moved inside left column to align with steps */}
                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-start gap-6">
                                    <button
                                        onClick={handleDiscard}
                                        className={cn(
                                            "flex items-center justify-center gap-2 px-12 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 w-full sm:w-60 border shadow-sm",
                                            themeStyles.isDark
                                                ? "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                                                : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                                        )}
                                    >
                                        <Trash2 size={18} className="opacity-70" />
                                        Discard
                                    </button>

                                    <button
                                        disabled={!isReadyToCompute}
                                        className={cn(
                                            "group relative flex items-center justify-center gap-3 px-12 py-4 rounded-2xl font-bold text-base transition-all overflow-hidden w-full sm:w-60 border",
                                            isReadyToCompute 
                                                ? "bg-linear-to-r from-blue-500 via-indigo-500 to-blue-500 text-white border-transparent shadow-xl shadow-blue-400/30 cursor-pointer" 
                                                : ""
                                        )}
                                        style={!isReadyToCompute ? {
                                            backgroundColor: themeStyles.isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb', // zinc-200
                                            borderColor: themeStyles.isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db', // zinc-300
                                            color: themeStyles.isDark ? 'rgba(255,255,255,0.2)' : '#6b7280', // zinc-500
                                            cursor: 'not-allowed'
                                        } : {}}
                                    >
                                        {isReadyToCompute && (
                                            <motion.div
                                                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}
                                        <Rocket size={20} className={cn(
                                            "transition-transform duration-300",
                                            isReadyToCompute ? "group-hover:rotate-12" : "opacity-30"
                                        )} />
                                        <span>Start Training</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right: Persistent Data Summary */}
                            <div className="lg:col-span-4 sticky top-8">
                                <DataSummary type={uploadType!} files={uploadedFiles} themeStyles={themeStyles} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
