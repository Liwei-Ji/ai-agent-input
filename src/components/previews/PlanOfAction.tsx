import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  ListTodo, Play, CheckCircle2, Circle, Loader2 
} from "lucide-react";

// 定義步驟的狀態
type StepStatus = 'pending' | 'running' | 'completed';

interface PlanStep {
  id: string;
  label: string;
  status: StepStatus;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content?: string;
  planData?: {
    title: string;
    steps: PlanStep[];
    isFinished: boolean;
  };
}

export const PlanOfAction = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 用來控制停止執行的 Ref
  const abortControllerRef = useRef(false);

  const [inputValue, setInputValue] = useState("");
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Can you analyze my website performance and fix the main issues?"
    },
    {
      id: "2",
      role: "ai",
      content: "I can certainly help with that. Before I make any changes, here is the proposed plan of action for your approval:",
      planData: {
        title: "Performance Optimization Plan",
        isFinished: false,
        steps: [
          { id: "s1", label: "Run Lighthouse Audit", status: "pending" },
          { id: "s2", label: "Analyze Image Compression Ratios", status: "pending" },
          { id: "s3", label: "Identify Unused JavaScript Chunks", status: "pending" },
          { id: "s4", label: "Generate Optimization Report", status: "pending" },
        ]
      }
    }
  ]);

  // 處理執行計畫的邏輯
  const handleRunPlan = async (messageId: string) => {
    setIsExecutingPlan(true);
    abortControllerRef.current = false; // 重置停止信號

    const currentMsgIndex = messages.findIndex(m => m.id === messageId);
    if (currentMsgIndex === -1) return;
    
    const steps = messages[currentMsgIndex].planData!.steps;

    for (let i = 0; i < steps.length; i++) {
      // 檢查是否被停止
      if (abortControllerRef.current) {
        setIsExecutingPlan(false);
        return; 
      }

      // 設定當前步驟為 running
      setMessages(prev => {
        const newMsgs = [...prev];
        const plan = newMsgs[currentMsgIndex].planData!;
        // 確保前面的步驟是 completed (防止重複執行時狀態錯誤)
        if (i > 0) plan.steps[i-1].status = "completed";
        plan.steps[i].status = "running";
        return newMsgs;
      });

      // 模擬執行時間 (1秒)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 再次檢查是否被停止 (防止等待期間被按停止)
      if (abortControllerRef.current) {
        setIsExecutingPlan(false);
        return; 
      }

      // 設定當前步驟為 completed
      setMessages(prev => {
        const newMsgs = [...prev];
        const plan = newMsgs[currentMsgIndex].planData!;
        plan.steps[i].status = "completed";
        return newMsgs;
      });
    }

    // 全部完成
    setMessages(prev => {
      const newMsgs = [...prev];
      newMsgs[currentMsgIndex].planData!.isFinished = true;
      return newMsgs;
    });

    setIsExecutingPlan(false);

    // 自動追加最終結果訊息
    if (!abortControllerRef.current) {
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "ai",
                content: "Optimization complete! I've compressed 12 images and removed 45kb of unused JS. Your estimated score improved by 15 points."
            }]);
        }, 500);
    }
  };

  // 停止邏輯
  const handleStop = () => {
    abortControllerRef.current = true; // 發出停止信號
    setIsExecutingPlan(false); // 更新 UI 狀態
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "I received your request."
        }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isExecutingPlan) handleSend();
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isExecutingPlan]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500">
      
      {/* 聊天內容容器 */}
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        
        {/* 訊息顯示區 */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8"
        >
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                
                {/* 文字訊息 */}
                {msg.content && (
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`
                        max-w-[90%] p-4 text-sm leading-7 rounded-2xl whitespace-pre-wrap
                        ${msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-sm shadow-sm" 
                        : "bg-transparent text-slate-700 rounded-bl-sm px-0 py-0"} 
                    `}>
                        {msg.content}
                    </div>
                    </div>
                )}

                {/* Plan of Action Card */}
                {msg.role === "ai" && msg.planData && (
                    <div className="max-w-[90%] ml-0 mt-2">
                        {/* 卡片樣式 */}
                        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-300">
                            
                            {/* Header */}
                            <div className="p-5 pb-2 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <ListTodo size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-800">
                                    {msg.planData.title}
                                </span>
                            </div>

                            {/* Steps List */}
                            <div className="px-5 py-2 space-y-4">
                                {msg.planData.steps.map((step, index) => (
                                    <div key={step.id} className="flex items-start gap-3 transition-colors duration-300">
                                        {/* Status Icon */}
                                        <div className="mt-0.5 shrink-0">
                                            {step.status === 'completed' && (
                                                <CheckCircle2 size={18} className="text-green-500 animate-in zoom-in duration-300" />
                                            )}
                                            {step.status === 'running' && (
                                                <Loader2 size={18} className="text-indigo-600 animate-spin" />
                                            )}
                                            {step.status === 'pending' && (
                                                <Circle size={18} className="text-slate-200" />
                                            )}
                                        </div>
                                        
                                        {/* Label */}
                                        <span className={`
                                            text-sm transition-colors duration-300
                                            ${step.status === 'completed' ? "text-slate-400 line-through decoration-slate-200" : ""}
                                            ${step.status === 'running' ? "text-indigo-700 font-medium" : ""}
                                            ${step.status === 'pending' ? "text-slate-600" : ""}
                                        `}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Footer */}
                            <div className="p-4 pt-2 flex justify-end">
                                {!msg.planData.isFinished ? (
                                    <button
                                        onClick={() => handleRunPlan(msg.id)}
                                        disabled={isExecutingPlan}
                                        className={`
                                            flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all
                                            ${isExecutingPlan 
                                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
                                            }
                                        `}
                                    >
                                        {isExecutingPlan ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Play size={14} fill="currentColor" />
                                                Approve & Run
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg border border-green-100">
                                        <CheckCircle2 size={14} />
                                        Plan Executed
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* 底部輸入控制區 */}
        <div className="shrink-0 pt-2 pb-4 px-4  z-10">
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all duration-300
                ${isExecutingPlan 
                    ? "border-slate-200 bg-white" 
                    : "border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
                }
            `}>
              
              <button
                type="button"
                className="transition-colors shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                disabled={isExecutingPlan}
              >
                <Paperclip size={20} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
              />

              <div className="flex-1 relative h-10 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isExecutingPlan}
                  placeholder={isExecutingPlan ? "Plan is executing..." : "Ask any question..."}
                  className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10"
                />
              </div>

              {/* 根據狀態顯示 發送 或 停止 按鈕 */}
              {isExecutingPlan ? (
                  // 停止按鈕
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 active:scale-90 shadow-sm"
                    title="Stop Execution"
                  >
                    <span className="w-3 h-3 bg-current"></span>
                  </button>
              ) : (
                  // 發送按鈕
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={`
                      flex items-center justify-center
                      w-10 h-10 rounded-full transition-all shrink-0
                      ${
                        inputValue.trim()
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      }
                    `}
                  >
                    <Send size={18} />
                  </button>
              )}

            </div>
        </div>
      </div>

    </div>
  );
};