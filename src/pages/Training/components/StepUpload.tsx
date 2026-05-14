import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Image as ImageIcon, Upload, Check, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../../shared';
import type { ThemeStyles } from '../../shared';

interface StepUploadProps {
    themeStyles: ThemeStyles;
    onComplete: (type: 'tabular' | 'vision', files: any[]) => void;
}

export const StepUpload: React.FC<StepUploadProps> = ({ themeStyles, onComplete }) => {
    const [selection, setSelection] = useState<'tabular' | 'vision' | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectType = (type: 'tabular' | 'vision') => {
        setSelection(type);
        // 測試模式：點擊即調用完成，不進行內部狀態切換與延遲
        onComplete(type, ['sample_file']);
    };

    const reset = () => {
        setSelection(null);
        setStatus('idle');
    };

    return (
        <div className="space-y-6 py-2">
            <AnimatePresence mode="wait">
                {/* 測試模式：直接點擊即完成 */}
                {status === 'idle' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <UploadTypeCard 
                            icon={Database}
                            title="Pure Dataset"
                            description="Click to instantly use a sample tabular dataset for testing."
                            onClick={() => handleSelectType('tabular')}
                            themeStyles={themeStyles}
                        />
                        <UploadTypeCard 
                            icon={ImageIcon}
                            title="Dataset + Images"
                            description="Click to instantly use a sample vision dataset for testing."
                            onClick={() => handleSelectType('vision')}
                            themeStyles={themeStyles}
                        />
                    </motion.div>
                )}

                {/* 完成狀態 */}
                {status === 'completed' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-4 rounded-2xl border flex items-center justify-between",
                            themeStyles.isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <div>
                                <div className="font-bold flex items-center gap-2">
                                    {uploadedFile}
                                    <Check size={16} className="text-teal-500" />
                                </div>
                                <p className="text-xs opacity-50 capitalize">{selection} data analysis ready</p>
                            </div>
                        </div>
                        <button 
                            onClick={reset}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <RefreshCw size={18} className="opacity-40" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const UploadTypeCard = ({ icon: Icon, title, description, onClick, themeStyles }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "p-6 rounded-3xl border-2 transition-all text-left group hover:scale-[1.02] active:scale-[0.98]",
            themeStyles.isDark 
                ? "bg-white/5 border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5" 
                : "bg-white border-black/5 hover:border-blue-500/50 hover:bg-blue-50"
        )}
    >
        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Icon size={24} />
        </div>
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-sm opacity-50 leading-relaxed">{description}</p>
    </button>
);
