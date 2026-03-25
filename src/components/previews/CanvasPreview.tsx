import { useState } from "react";
import { ChatInput } from "../ChatInput";
import { Download, FileText, Play, FilePlus } from "lucide-react";

export const CanvasPreview = () => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleSend = (text: string) => {
        console.log("Send to Canvas:", text);
    };

    return (
        <div className="relative w-full max-w-lg h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-700">
            {/* 訊息區 */}
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar relative">
                <div className="pt-4 space-y-6">
                    {/* AI 訊息 1 */}
                    <div className="flex flex-col items-start">
                        <div className="max-w-[90%] text-sm leading-relaxed text-slate-700 py-2 px-1">
                            Hi, I'm AI Agnet
                        </div>
                    </div>

                    {/* User 訊息 */}
                    <div className="flex flex-col items-end">
                        <div className="max-w-[90%] text-sm leading-relaxed bg-blue-600 text-slate-50 shadow-lg rounded-2xl rounded-br-sm p-4">
                            I have a document that needs auditing, the content is as follows...
                        </div>
                    </div>

                    {/* AI 訊息 2 */}
                    <div className="flex flex-col items-start gap-1">
                        <div className="max-w-[90%] text-sm leading-relaxed text-slate-700 py-2 px-1">
                            I've generated a draft of the document for you.
                        </div>

                        {/* 操作按鈕 (下載/切換預覽) */}
                        <div className="flex items-center gap-4 px-1">
                            <button
                                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                                className={`p-1.5 transition-colors rounded-md ${isPreviewOpen ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                title="Preview"
                            >
                                <Play size={20} />
                            </button>
                            <button className="text-slate-500 hover:text-slate-700 transition-colors">
                                <FilePlus size={20} />
                            </button>
                            <button className="text-slate-500 hover:text-slate-700 transition-colors">
                                <Download size={20} />
                            </button>
                        </div>

                        {/* 文件卡片 or 預覽框 */}
                        {!isPreviewOpen ? (
                            /* 預設檔案卡片 */
                            <div className="w-[300px] p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate">Placeholder.pdf</p>
                                </div>
                            </div>
                        ) : (
                            /* 展開預覽內容 */
                            <div className="w-full aspect-[4/3] bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                                <div className="relative w-32 h-32 mb-4 opacity-20">
                                    <div className="absolute inset-0 border-2 border-slate-400 rounded-xl flex items-center justify-center">
                                        <div className="w-16 h-16 border-2 border-slate-400 rounded-lg transform -rotate-6 translate-x-1" />
                                        <div className="absolute w-16 h-16 border-2 border-slate-400 rounded-lg bg-white flex items-center justify-center">
                                            <div className="w-8 h-8 flex flex-col items-center justify-center">
                                                <div className="w-full h-1 bg-slate-400 rounded-full mb-1" />
                                                <div className="w-2/3 h-1 bg-slate-400 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">Image</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 底部輸入框 */}
            <div className="p-6 pt-2">
                <ChatInput
                    placeholder="Ask any question..."
                    onSend={handleSend}
                />
            </div>
        </div>
    );
};
