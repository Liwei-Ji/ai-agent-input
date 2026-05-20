import React from 'react';
import { motion } from 'framer-motion';
import {
    Database,
    Layout,
    AlertCircle,
    Activity,
    ImageIcon,
    Tag,
    Maximize,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../shared';
import type { ThemeStyles } from '../../shared';

interface DataSummaryProps {
    type: 'tabular' | 'vision';
    files: any[];
    themeStyles: ThemeStyles;
}

export const DataSummary: React.FC<DataSummaryProps> = ({ type, files, themeStyles }) => {
    // 模擬數據，未來可以從真實文件解析
    const summaryData = type === 'tabular' ? {
        metrics: [
            { label: 'Total Rows', value: '12,480', icon: Database },
            { label: 'Feature Count', value: '24 columns', icon: Layout },
            { label: 'Missing Values', value: '0.2%', icon: AlertCircle },
            { label: 'Class Imbalance', value: 'None', icon: Activity },
        ],
        health: 94,
        healthLabel: 'Excellent quality for regression/classification'
    } : {
        metrics: [
            { label: 'Total Images', value: '1,200', icon: ImageIcon },
            { label: 'Label Categories', value: '8 classes', icon: Tag },
            { label: 'Avg Resolution', value: '1024x1024', icon: Maximize },
            { label: 'Annotated Data', value: '98.5%', icon: CheckCircle2 },
        ],
        health: 88,
        healthLabel: 'High diversity, ready for fine-tuning'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "h-full p-5 rounded-3xl flex flex-col gap-6",
                themeStyles.isDark ? "border-white/10" : "border-black/10"
            )}
        >
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-4">
                    Data Metadata
                </h4>
                {/* Stats Grid */}
                <div className="space-y-4 mb-8">
                    {summaryData.metrics.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                    themeStyles.isDark ? "bg-white/5 text-white/50 group-hover:bg-white/10" : "bg-black/5 text-black/50 group-hover:bg-black/10"
                                )}>
                                    <stat.icon size={16} />
                                </div>
                                <span className="text-sm opacity-60 font-medium">{stat.label}</span>
                            </div>
                            <span className="text-sm font-bold tracking-tight">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Data Health Indicator */}
                <div className="pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-teal-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Data Health</span>
                        </div>
                    </div>

                    <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mb-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${summaryData.health}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-linear-to-r from-teal-500 to-emerald-400"
                        />
                    </div>

                    <p className="text-[10px] italic opacity-50">{summaryData.healthLabel}</p>
                </div>
            </div>
        </motion.div>
    );
};
