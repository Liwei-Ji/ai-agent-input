import { useState, useEffect, useRef } from "react";
import {
    Play, Square, StopCircle, CheckCircle2,
    AlertCircle, ChevronRight, Terminal,
    Loader2, PanelRightClose, PanelRightOpen
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const AgentSupervision = () => {
    const { t } = useTranslation();

    // --- 核心狀態 ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAgentActive, setIsAgentActive] = useState(false);
    const [status, setStatus] = useState<"idle" | "running" | "success" | "stopped">("idle");
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    const logEndRef = useRef<HTMLDivElement>(null);

    // --- 模擬執行邏輯 ---
    useEffect(() => {
        let interval: any;
        if (isAgentActive && status === "running") {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        handleComplete();
                        return 100;
                    }
                    return prev + 2;
                });

                const newLogs = [
                    "Analyzing system architecture...",
                    "Checking dependencies...",
                    "Refactoring core modules...",
                    "Optimizing build pipeline...",
                    "Running integration tests...",
                    "Finalizing deployment script..."
                ];
                setLogs(prev => {
                    if (prev.length < 15) {
                        return [...prev, `> ${newLogs[Math.floor(Math.random() * newLogs.length)]}`];
                    }
                    return prev;
                });
            }, 300);
        }
        return () => clearInterval(interval);
    }, [isAgentActive, status]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleStart = () => {
        setIsAgentActive(true);
        setStatus("running");
        setIsSidebarOpen(true);
        setLogs(["> Initializing agentic workspace...", "> Sovereignty boundary active."]);
        setProgress(0);
    };

    const handleStop = () => {
        setStatus("stopped");
        setIsAgentActive(false);
        setLogs(prev => [...prev, "!! EMERGENCY STOP TRIGGERED BY USER", "!! Control returned to human."]);

        // 1秒後重置邊框顏色 (模擬紅色閃爍)
        setTimeout(() => {
            // keep status as stopped to show the red state
        }, 1000);
    };

    const handleComplete = () => {
        setStatus("success");
        setIsAgentActive(false);
        setLogs(prev => [...prev, "> Task completed successfully.", "> Deploying changes..."]);
    };

    const handleReset = () => {
        setStatus("idle");
        setIsAgentActive(false);
        setLogs([]);
        setProgress(0);
    };

    return (
        <div className="flex h-[600px] w-full min-h-[500px] overflow-hidden font-sans rounded-3xl relative">

            {/* 左側對話區域 */}
            <div className="flex-1 flex flex-col h-full min-w-0 transition-opacity relative">

                {/* 懸浮觸發開關 */}
                <div className="absolute top-4 right-4 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`
                            p-2 rounded-lg text-slate-400 hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all
                            ${isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"} 
                        `}
                    >
                        <PanelRightOpen size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-md mx-auto space-y-8 py-10">
                        {/* User Message */}
                        <div className="flex justify-end animate-in fade-in slide-in-from-right-3">
                            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tr-none text-sm text-slate-700 max-w-[85%]">
                                Can you refactor the deployment scripts for the current project?
                            </div>
                        </div>

                        {/* AI Message with Action Button */}
                        <div className="flex justify-start animate-in fade-in slide-in-from-left-3">
                            <div className="space-y-4 max-w-[85%]">
                                <div className="text-sm text-slate-700 leading-relaxed">
                                    {status === "stopped"
                                        ? "The process was aborted. I've rolled back any partial changes."
                                        : status === "success"
                                            ? "I've successfully refactored the scripts and verified them against the build pipeline."
                                            : "I can help with that. I'll need to analyze the scripts and apply changes. Should I proceed?"
                                    }
                                </div>

                                {status === "idle" && (
                                    <button
                                        onClick={handleStart}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                                    >
                                        <Play size={16} fill="white" />
                                        Execute Action
                                    </button>
                                )}

                                {(status === "stopped" || status === "success") && (
                                    <button
                                        onClick={handleReset}
                                        className="text-xs text-indigo-600 font-medium hover:underline px-1"
                                    >
                                        Try again
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右側代理控制畫布 (Sovereignty Boundary) - 懸浮樣式 */}
            <div
                className={`
                    shrink-0 bg-white flex flex-col relative
                    transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                    ${isSidebarOpen
                        ? "w-[380px] opacity-100 m-4 rounded-2xl shadow-2xl h-[calc(100%-2rem)] z-40 overflow-hidden"
                        : "w-0 opacity-0 translate-x-10 m-0 h-[calc(100%-2rem)] overflow-hidden"
                    }
                    ${status === "running" ? "gradient-border-indigo animate-pulse-subtle" : "border-4"}
                    ${status === "stopped" ? "border-red-400" : ""}
                    ${status === "success" ? "gradient-border-emerald" : ""}
                    ${status === "idle" ? "border-slate-100" : ""}
                `}
                onClick={() => isAgentActive && handleStop()}
            >
                {/* Sidebar Header */}
                <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className={isAgentActive ? "text-indigo-600" : "text-slate-400"} />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center flex-1">
                            Agent Execution Terminal
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 px-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <PanelRightClose size={18} />
                    </button>
                </div>

                {/* 執行畫面內容 */}
                <div className="flex-1 overflow-hidden flex flex-col bg-slate-950 font-mono p-4">
                    <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide text-[11px]">
                        {logs.map((log, index) => (
                            <div key={index} className={`
                                ${log.startsWith("!!") ? "text-red-400 font-bold" : "text-slate-300"}
                                ${log.startsWith("> Task completed") ? "text-emerald-400 font-bold" : ""}
                            `}>
                                {log}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>

                    {/* 下方狀態欄 */}
                    <div className="mt-4 pt-4 relative">
                        {/* 停止按鈕 HUD - 移至進度條上方 */}
                        {isAgentActive && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleStop(); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 text-white rounded-full text-xs font-bold shadow-2xl backdrop-blur-md hover:bg-black transition-all border border-white/20 animate-in slide-in-from-bottom-2 duration-300"
                                >
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    Stop Agent
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Execution Progress</span>
                            <span className="text-[10px] text-indigo-400 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${status === "success" ? "bg-emerald-500" :
                                    status === "stopped" ? "bg-red-500" : "bg-indigo-500"
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 狀態覆蓋層 (終止時) */}
                {!isAgentActive && status !== "idle" && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] flex items-center justify-center p-8 animate-in fade-in duration-500">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl space-y-4 text-center max-w-[240px]">
                            {status === "success" ? (
                                <>
                                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={24} className="text-emerald-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">Deployment Complete</div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                                        <AlertCircle size={24} className="text-red-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">Operation Terminated</div>
                                </>
                            )}
                            <button
                                onClick={handleReset}
                                className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                    .gradient-border-indigo {
                        border: 4px solid transparent;
                        background-image: linear-gradient(white, white), linear-gradient(to right, #6366f1, #a855f7);
                        background-origin: border-box;
                        background-clip: content-box, border-box;
                        box-shadow: inset 0 0 100px rgba(99, 102, 241, 0.3);
                    }
                    .gradient-border-emerald {
                        border: 4px solid transparent;
                        background-image: linear-gradient(white, white), linear-gradient(to right, #10b981, #34d399);
                        background-origin: border-box;
                        background-clip: content-box, border-box;
                        box-shadow: inset 0 0 100px rgba(16, 185, 129, 0.3);
                    }
                    @keyframes pulse-subtle {
                        0%, 100% { opacity: 0.85; filter: saturate(1.1); }
                        50% { opacity: 1; filter: saturate(1.3); }
                    }
                    .animate-pulse-subtle {
                        animation: pulse-subtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                `}
            </style>

        </div>
    );
};
