import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Database, Layers, Activity, PieChart } from 'lucide-react';
import { cn } from '../../shared';
import type { ThemeStyles } from '../../shared';

interface DataSummaryProps {
    type: 'tabular' | 'vision';
    files: any[];
    themeStyles: ThemeStyles;
}

export const DataSummary: React.FC<DataSummaryProps> = ({ type, files, themeStyles }) => {
    // 這裡我們預設一些模擬數據，未來可以從真實文件解析
    const stats = type === 'tabular' ? [
        { label: 'Total Rows', value: '12,480', icon: Database },
        { label: 'Total Columns', value: '24', icon: Layers },
        { label: 'Missing Values', value: '0.2%', icon: Activity },
    ] : [
        { label: 'Total Images', value: '1,200', icon: FileText },
        { label: 'Labels', value: '8 classes', icon: PieChart },
        { label: 'Avg Resolution', value: '1024x1024', icon: Layers },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "h-full p-5 rounded-3xl border flex flex-col gap-6",
                themeStyles.isDark ? "bg-white/[0.03] border-white/10" : "bg-black/[0.03] border-black/10"
            )}
        >
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-4">
                    Data Metadata
                </h4>
                <div className="space-y-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                    <stat.icon size={14} />
                                </div>
                                <span className="text-xs font-medium opacity-60">{stat.label}</span>
                            </div>
                            <span className="text-xs font-bold font-mono tracking-tight">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2 mb-3">
                    <Activity size={14} className="text-teal-500" />
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Data Health</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '98%' }}
                        className="h-full bg-teal-500"
                    />
                </div>
                <p className="text-[10px] mt-2 opacity-40 font-medium italic">Excellent quality for training</p>
            </div>
        </motion.div>
    );
};
