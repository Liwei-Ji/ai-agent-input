import { useState, useRef, useEffect } from "react";
import { 
  Send, Paperclip, 
  Brain, Terminal, ChevronDown, Check, Loader2, LineChart
} from "lucide-react";

// 定義思維步驟的類型
type ThoughtType = 'plan' | 'code' | 'execution' | 'observation';

interface ThoughtStep {
  id: string;
  type: ThoughtType;
  title: string;
  content?: string;
  status: 'pending' | 'running' | 'completed';
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  thoughtProcess?: {
    isExpanded: boolean;
    steps: ThoughtStep[];
    isFinished: boolean;
  };
}

export const StreamOfThought = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Calculate the first 10 numbers of the Fibonacci sequence and visualize the growth trend."
    }
  ]);

  // 模擬思維流的執行過程
  const simulateThinkingProcess = async (msgId: string) => {
    const stepsSequence: ThoughtStep[] = [
      { id: "s1", type: "plan", title: "Analyze Request", content: "User wants Fibonacci sequence (n=10) and a visualization. \n1. Generate sequence using Python.\n2. Use matplotlib for plotting.\n3. Return text summary.", status: "pending" },
      { id: "s2", type: "code", title: "Write Python Code", content: "def fibonacci(n):\n    fib = [0, 1]\n    while len(fib) < n:\n        fib.append(fib[-1] + fib[-2])\n    return fib\n\nprint(fibonacci(10))", status: "pending" },
      { id: "s3", type: "execution", title: "Execute in Sandbox", content: ">> Executing script...\n>> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n>> Plot generated successfully.", status: "pending" },
      { id: "s4", type: "observation", title: "Finalize Answer", content: "The sequence is generated. Constructing final response with the chart.", status: "pending" }
    ];

    setMessages(prev => [...prev, {
      id: msgId,
      role: "ai",
      content: "",
      thoughtProcess: {
        isExpanded: true,
        steps: stepsSequence,
        isFinished: false
      }
    }]);

    for (let i = 0; i < stepsSequence.length; i++) {
      setMessages(prev => prev.map(m => {
        if (m.id === msgId && m.thoughtProcess) {
          const newSteps = [...m.thoughtProcess.steps];
          newSteps[i] = { ...newSteps[i], status: 'running' };
          return { ...m, thoughtProcess: { ...m.thoughtProcess, steps: newSteps } };
        }
        return m;
      }));

      const delay = stepsSequence[i].type === 'code' ? 1500 : 1000;
      await new Promise(r => setTimeout(r, delay));

      setMessages(prev => prev.map(m => {
        if (m.id === msgId && m.thoughtProcess) {
          const newSteps = [...m.thoughtProcess.steps];
          newSteps[i] = { ...newSteps[i], status: 'completed' };
          return { ...m, thoughtProcess: { ...m.thoughtProcess, steps: newSteps } };
        }
        return m;
      }));
    }

    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.thoughtProcess) {
        return {
          ...m,
          content: "Here are the first 10 Fibonacci numbers:\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34.\n\nAs you can see from the calculation, the values grow exponentially. I've plotted the linear growth for you below.",
          thoughtProcess: { ...m.thoughtProcess, isFinished: true, isExpanded: false }
        };
      }
      return m;
    }));
    
    setIsGenerating(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsGenerating(true);
    
    setTimeout(() => {
        simulateThinkingProcess((Date.now() + 1).toString());
    }, 500);
  };

  const handleStop = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) handleSend();
    }
  };

  const toggleThought = (msgId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.thoughtProcess) {
        return { ...m, thoughtProcess: { ...m.thoughtProcess, isExpanded: !m.thoughtProcess.isExpanded } };
      }
      return m;
    }));
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl shadow-sm flex flex-col">
      
      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-8 pb-24"
      >
        <div className="w-full max-w-md mx-auto px-4 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-2">
              <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {/* User Message */}
                {msg.role === "user" && (
                    <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-sm max-w-[85%]">
                        {msg.content}
                    </div>
                )}

                {/* AI Thought Process Log */}
                {msg.role === "ai" && msg.thoughtProcess && (
                    <div className="w-full max-w-full mb-2">
                        <div className="overflow-hidden transition-all duration-300">
                            
                            {/* Log Header (Toggle Trigger) */}
                            <button 
                                onClick={() => toggleThought(msg.id)}
                                className="flex items-center gap-3 px-1 py-2 text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {/* 狀態圖示 */}
                                    {msg.thoughtProcess.isFinished ? (
                                        <div className="text-slate-400">
                                            <Brain size={16} />
                                        </div>
                                    ) : (
                                        <div className="text-amber-500 animate-pulse">
                                            <Loader2 size={16} className="animate-spin" />
                                        </div>
                                    )}
                                    <span className="text-xs font-semibold">
                                        {msg.thoughtProcess.isFinished ? "Thought Process" : "Thinking..."}
                                    </span>
                                </div>
                                
                                <ChevronDown 
                                    size={14} 
                                    className={`text-slate-300 transition-transform duration-300 ${msg.thoughtProcess.isExpanded ? "rotate-180" : ""}`} 
                                />
                            </button>

                            {/* Log Body (Collapsible) */}
                            {msg.thoughtProcess.isExpanded && (
                                <div className="pl-2 pr-4 py-2 space-y-4">
                                    {msg.thoughtProcess.steps.map((step, idx) => (
                                        <div key={step.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
                                            {/* Step Status Line */}
                                            <div className="flex flex-col items-center pt-1">
                                                <div className={`
                                                    w-4 h-4 rounded-full flex items-center justify-center shrink-0 border
                                                    ${step.status === 'completed' ? "bg-green-500 border-green-500 text-white" : ""}
                                                    ${step.status === 'running' ? "bg-white border-indigo-500 text-indigo-600" : ""}
                                                    ${step.status === 'pending' ? "bg-white border-slate-200 text-slate-300" : ""}
                                                `}>
                                                    {step.status === 'completed' && <Check size={10} strokeWidth={3} />}
                                                    {step.status === 'running' && <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />}
                                                </div>
                                                {/* Connecting Line */}
                                                {idx !== msg.thoughtProcess!.steps.length - 1 && (
                                                    <div className={`w-[1px] flex-1 my-1 min-h-[16px] ${step.status === 'completed' ? "bg-green-200" : "bg-slate-100"}`} />
                                                )}
                                            </div>

                                            {/* Step Content */}
                                            <div className="flex-1 pb-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-medium ${step.status === 'pending' ? "text-slate-300" : "text-slate-600"}`}>
                                                        {step.title}
                                                    </span>
                                                </div>
                                                
                                                {/* Detail View */}
                                                {step.content && step.status !== 'pending' && (
                                                    <div className={`
                                                        mt-1 text-xs rounded-lg p-3 overflow-x-auto
                                                        ${step.type === 'code' || step.type === 'execution' 
                                                            ? "bg-slate-900 text-slate-50 font-mono shadow-sm" 
                                                            : "text-slate-500 bg-slate-50"}
                                                    `}>
                                                        <pre className="whitespace-pre-wrap break-words">
                                                            {step.content}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Final AI Answer */}
                {msg.role === "ai" && msg.content && (
                     <div className="w-full text-slate-700 text-sm leading-relaxed animate-in fade-in zoom-in duration-300 pl-1">
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        {/* 模擬的 Chart 區塊 */}
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center h-48 text-slate-400">
                            <div className="flex flex-col items-center gap-2">
                                <LineChart size={32} className="text-indigo-400" />
                                <span className="text-xs">Matplotlib Visualization Generated</span>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))}

          {/* 模擬生成中的骨架 */}
          {isGenerating && messages[messages.length-1]?.role === "user" && (
             <div className="flex items-center gap-2 text-slate-400 text-xs ml-1 animate-pulse">
                <Brain size={14} />
                <span>Initializing reasoning process...</span>
             </div>
          )}
        </div>
      </div>

      {/* Input (Fixed Bottom) */}
      <div className="absolute bottom-0 left-0 right-2  z-20">
          <div className="w-full max-w-md mx-auto pt-4 pb-4 px-4">
            <div className={`
                relative flex w-full items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all duration-300
                ${isGenerating 
                    ? "border-slate-200 bg-white" 
                    : "border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
                }
            `}>
                <button disabled={isGenerating} className="transition-colors shrink-0 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
                <Paperclip size={20} />
                </button>
                <input ref={fileInputRef} type="file" className="hidden" />

                <div className="flex-1 relative h-10 flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isGenerating}
                    placeholder="Ask any question..."
                    className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed z-10 font-sans" 
                />
                </div>

                {isGenerating ? (
                    <button onClick={handleStop} className="flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 active:scale-90 shadow-sm">
                    <span className="w-3 h-3 bg-current"></span>
                    </button>
                ) : (
                    <button onClick={handleSend} disabled={!inputValue.trim()} className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shrink-0 ${inputValue.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}>
                    <Send size={18} />
                    </button>
                )}
            </div>
          </div>
      </div>

    </div>
  );
};