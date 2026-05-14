import React from 'react';
import { motion } from 'framer-motion';
import { Table, Layers, GripVertical, X, Info } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../shared';
import type { ColumnItem } from '../types';
import type { ThemeStyles } from '../../shared';

export const CardContent = ({ col, themeStyles, isDragging, onRemove, showGrip, disabled }: {
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

export const DraggableCard = ({ col, themeStyles, onTap, disabled }: { col: ColumnItem, themeStyles: ThemeStyles, onTap: () => void, disabled?: boolean }) => {
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

export const SortableCard = ({ col, themeStyles, onRemove, sortableId }: { col: ColumnItem, themeStyles: ThemeStyles, onRemove: () => void, sortableId?: string }) => {
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

export const DroppableArea = ({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div 
            ref={setNodeRef} 
            className={cn(
                className,
                isOver && "border-blue-500/50 bg-blue-500/5 ring-4 ring-blue-500/10"
            )}
        >
            {children}
        </div>
    );
};
