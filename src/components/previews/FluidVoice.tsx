import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Mic, Keyboard, X, ArrowLeft, Send, Sparkles } from "lucide-react";
import { ChatInput } from "../ChatInput";

export const FluidVoice = () => {
    const { t, i18n } = useTranslation();
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [voiceState, setVoiceState] = useState<"greeting" | "listening" | "processing">("greeting");
    const [text, setText] = useState("");

    // 模擬 AI 主動打招呼
    useEffect(() => {
        if (isVoiceActive) {
            setVoiceState("greeting");

            // 實作語音語音播報 (Speech Synthesis) - 多語系支援
            const greetingText = t("fluid_voice_greeting");
            const utterance = new SpeechSynthesisUtterance(greetingText);

            // 根據當前系統語言設定播報參數
            const langMap: Record<string, string> = {
                "en": "en-US",
                "zh-TW": "zh-TW",
                "ja": "ja-JP"
            };
            utterance.lang = langMap[i18n.language] || "en-US";
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);

            const timer = setTimeout(() => {
                setVoiceState("listening");
            }, 4000);
            return () => {
                clearTimeout(timer);
                window.speechSynthesis.cancel(); // 退出時停止說話
            };
        }
    }, [isVoiceActive]);

    const toggleVoice = () => {
        setIsVoiceActive(!isVoiceActive);
    };

    return (
        <div className="flex h-[600px] w-full items-center justify-center font-sans relative overflow-hidden ">

            {/* 1. 標準輸入框狀態 (Text Mode - Minimalist Style) */}
            <div className={`
                w-full max-w-md px-4 transition-all duration-700
                ${isVoiceActive ? "opacity-0 scale-95 pointer-events-none translate-y-10" : "opacity-100 scale-100 translate-y-0"}
            `}>
                <ChatInput
                    value={text}
                    onValueChange={setText}
                    placeholder="Ask any question..."
                    rightIcon={<Mic size={20} />}
                    onRightIconClick={toggleVoice}
                    onSend={(t: string) => console.log("Voice Mode Text Send:", t)}
                />
            </div>

            {/* 2. 語音模式疊加層 (Voice Mode Overlay) */}
            <div className={`
                absolute inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 overflow-hidden rounded-3xl
                ${isVoiceActive ? "bg-white/90 backdrop-blur-xl opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}
            `}>

                {/* 核心內容區塊 (向上移動以獲取更好的視覺層次) */}
                <div className="flex flex-col items-center justify-center -translate-y-10">
                    {/* 語音信標 (Voice Orb) */}
                    <div className="relative flex items-center justify-center">
                        {/* 背景光暈層 (Halo Layers with Floating Effect) */}
                        <div className={`
                            absolute w-[450px] h-[450px] rounded-full bg-cyan-400/10 blur-[100px] transition-all duration-1000 animate-orb-float
                            ${voiceState !== "processing" ? "opacity-100 scale-110" : "opacity-0 scale-50"}
                        `} />
                        <div className={`
                            absolute w-[350px] h-[350px] rounded-full bg-pink-400/10 blur-[80px] transition-all duration-1000 animate-orb-float-delayed
                            ${voiceState !== "processing" ? "opacity-100 scale-105" : "opacity-0 scale-50"}
                        `} />

                        {/* 核心圓圈 (The Orb) */}
                        <div className={`
                            relative w-32 h-32 rounded-full shadow-2xl transition-all duration-700 flex items-center justify-center
                            ${voiceState === "processing" ? "orb-gradient-listening scale-100" : "orb-gradient-active scale-110"}
                        `}>
                            {/* 內部動態波紋 (僅在特定狀態下脈動) */}
                            <div className={`
                                absolute inset-0 rounded-full border border-white/30 transition-transform duration-300
                                ${voiceState !== "processing" ? "animate-ping opacity-20" : "opacity-0"}
                            `} />
                        </div>
                    </div>

                    {/* 文字引導 (Captions) */}
                    <div className="mt-16 text-center space-y-3 px-8 max-w-md">
                        <h2 className={`
                            text-2xl font-semibold text-slate-800 transition-opacity duration-1000 
                            ${voiceState === "greeting" ? "opacity-100" : "opacity-0 scale-95 blur-[2px]"}
                        `}>
                            "{t("fluid_voice_greeting")}"
                        </h2>
                    </div>
                </div>

                {/* 返回按鈕 (Back to Chat) */}
                <div className="absolute bottom-16">
                    <button
                        onClick={toggleVoice}
                        className="group flex flex-col items-center gap-3 transition-all active:scale-95"
                    >
                        <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:bg-black transition-colors border-2 border-white/20 backdrop-blur-md">
                            <ArrowLeft size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Return to Chat</span>
                    </button>
                </div>

            </div>

            <style>
                {`
                    @keyframes orb-float {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(60px, -50px) scale(1.05); }
                        66% { transform: translate(-20px, 15px) scale(0.95); }
                    }
                    .animate-orb-float {
                        animation: orb-float 6s ease-in-out infinite;
                    }
                    .animate-orb-float-delayed {
                        animation: orb-float 15s ease-in-out infinite reverse;
                    }
                    .orb-gradient-active {
                        background: radial-gradient(at 0% 0%, #f472b6 10%, transparent 70%),
                                    radial-gradient(at 100% 0%, #22d3ee 10%, transparent 70%),
                                    radial-gradient(at 100% 100%, #ffffff 10%, transparent 70%),
                                    radial-gradient(at 0% 100%, #a78bfa 0%, transparent 70%),
                                    #818cf8;
                        box-shadow: 
                            0 10px 50px rgba(129, 140, 248, 0.4),
                            inset 0 0 30px rgba(255, 255, 255, 0.4);
                    }
                    .orb-gradient-listening {
                        background: radial-gradient(circle at 30% 30%, #e2e8f0, #94a3b8);
                        box-shadow: 
                            0 0 20px rgba(148, 163, 184, 0.2),
                            inset 0 0 10px rgba(255, 255, 255, 0.2);
                        filter: grayscale(0.5);
                    }
                `}
            </style>

        </div>
    );
};
