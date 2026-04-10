import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    PenTool,
    Languages,
    Search,
    Code,
    Palette,
    FileText,
    BarChart3,
    Eye,
    Globe,
    Hash
} from "lucide-react";
import { ChatInput } from "../ChatInput";

interface Skill {
    id: string;
    label: string;
    icon: any;
    promptHint: string;
}

// 將子組件定義在外部，防止在主組件重新渲染時導致 DOM 重新掛載（解決點擊亂跳的問題）
const SkillPill = ({ skill, active, onClick }: { skill: Skill, active: boolean, onClick: (s: Skill) => void }) => {
    const Icon = skill.icon;
    return (
        <button
            onClick={() => onClick(skill)}
            className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full 
                bg-white/40 backdrop-blur-md border border-slate-200/50 
                shadow-sm hover:shadow-md active:scale-95
                transition-all duration-300 whitespace-nowrap group
                ${active ? "ring-2 ring-indigo-500 bg-indigo-50" : ""}
            `}
        >
            <Icon size={16} className="text-indigo-500 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold text-slate-700">{skill.label}</span>
        </button>
    );
};

const MarqueeRow = ({ skills, direction, duration, activeTag, onTagClick }: {
    skills: Skill[],
    direction: "left" | "right",
    duration: string,
    activeTag: string | null,
    onTagClick: (s: Skill) => void
}) => {
    return (
        <div className="relative flex overflow-hidden py-1">
            <div
                className={`flex gap-4 marquee-${direction}`}
                style={{ animationDuration: duration }}
            >
                {[...skills, ...skills, ...skills, ...skills].map((skill, idx) => (
                    <SkillPill
                        key={`${skill.id}-${idx}`}
                        skill={skill}
                        active={activeTag === skill.id}
                        onClick={onTagClick}
                    />
                ))}
            </div>
        </div>
    );
};

export const AgentCapabilitiesMarquee = () => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const creativeSkills: Skill[] = [
        { id: "write", label: "Writing", icon: PenTool, promptHint: "Help me write..." },
        { id: "translate", label: "Translation", icon: Languages, promptHint: "Translate this..." },
        { id: "search", label: "Search", icon: Search, promptHint: "Search for..." },
        { id: "code", label: "Coding", icon: Code, promptHint: "Help me code..." },
        { id: "draw", label: "Drawing", icon: Palette, promptHint: "Help me draw..." },
    ];

    const utilitySkills: Skill[] = [
        { id: "pdf", label: "PDF", icon: FileText, promptHint: "Interpret this PDF..." },
        { id: "data", label: "Data", icon: BarChart3, promptHint: "Analyze this data..." },
        { id: "vision", label: "Vision", icon: Eye, promptHint: "What's in this image?" },
        { id: "web", label: "Web", icon: Globe, promptHint: "Summarize this page..." },
        { id: "summary", label: "Summary", icon: Hash, promptHint: "Summarize this..." },
    ];

    const handleTagClick = (skill: Skill) => {
        setInputValue(skill.promptHint);
        setActiveTag(skill.id);
        setTimeout(() => setActiveTag(null), 500);
    };

    return (
        <div className="flex flex-col items-center justify-center h-[600px] w-full bg-slate-50 relative overflow-hidden p-8 font-sans">

            {/* 背景裝飾光暈 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] opacity-40" />

            {/* 1. 模擬輸入框 */}
            <div className="w-full max-w-md relative z-20 mb-8">
                <ChatInput
                    value={inputValue}
                    onValueChange={setInputValue}
                    placeholder="Ask any question..."
                    onSend={(t) => console.log("Marquee Sent:", t)}
                />
            </div>

            {/* 2. 標籤跑馬燈 */}
            <div className="w-full max-w-md relative z-10 space-y-2">
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

                <MarqueeRow
                    skills={creativeSkills}
                    direction="left"
                    duration="30s"
                    activeTag={activeTag}
                    onTagClick={handleTagClick}
                />
                <MarqueeRow
                    skills={utilitySkills}
                    direction="right"
                    duration="25s"
                    activeTag={activeTag}
                    onTagClick={handleTagClick}
                />
            </div>

            <style>
                {`
                    @keyframes marquee-left {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes marquee-right {
                        0% { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .marquee-left {
                        animation: marquee-left linear infinite;
                    }
                    .marquee-right {
                        animation: marquee-right linear infinite;
                    }
                    .marquee-left:hover, .marquee-right:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>
        </div>
    );
};
