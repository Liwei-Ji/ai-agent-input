import { useState, useRef, useEffect } from "react";
import { Send, Table as TableIcon, Zap, GripVertical } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  tableData?: string[][]; 
}

export const AutoFill = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Need to organize a schedule? I can help you create and fill tables instantly."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // 表格編輯狀態
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [grid, setGrid] = useState<string[][]>(
    Array(6).fill("").map(() => ["", ""]) // 6列 x 2行 的空表格
  );
  const [showAutoFillHint, setShowAutoFillHint] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // 監聽表格內容變化，判斷是否觸發 Auto Fill 提示
  useEffect(() => {
    const firstCell = grid[0][0].trim().toLowerCase();
    if (firstCell === "monday" || firstCell === "mon" || firstCell === "週一") {
      if (grid[1][0] === "") {
        setShowAutoFillHint(true);
      }
    } else {
      setShowAutoFillHint(false);
    }
  }, [grid]);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newGrid = [...grid];
    newGrid[rowIndex] = [...newGrid[rowIndex]];
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);
  };

  const performAutoFill = () => {
    const firstCell = grid[0][0].trim();
    const newGrid = [...grid];
    
    const isChinese = firstCell === "週一";
    const daysEn = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysCn = ["週一", "週二", "週三", "週四", "週五", "週六"];
    const targetDays = isChinese ? daysCn : daysEn;

    for (let i = 0; i < 6; i++) {
      newGrid[i] = [...newGrid[i]];
      newGrid[i][0] = targetDays[i];
    }
    
    setGrid(newGrid);
    setShowAutoFillHint(false);
  };

  const handleSend = () => {
    if (showTableEditor) {
      const newMsg: Message = { 
        id: Date.now().toString(), 
        role: "user", 
        text: "Here is the schedule:",
        tableData: grid 
      };
      setMessages(prev => [...prev, newMsg]);
      setShowTableEditor(false);
      setGrid(Array(6).fill("").map(() => ["", ""])); 

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "Perfect. I've logged the schedule from Monday to Saturday."
        }]);
      }, 800);
    } else {
      if (!inputValue.trim()) return;
      const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
      setMessages(prev => [...prev, newMsg]);
      setInputValue("");
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "I can verify that. Would you like to put it in a table?"
        }]);
      }, 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTableClick = () => {
    setShowTableEditor(!showTableEditor);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-3xl flex flex-col animate-in fade-in zoom-in duration-500 ">
      
      {/* 聊天區域 */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pt-12"
        >
          <div className="space-y-6 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                <div className={`
                  max-w-[95%] text-sm leading-7 whitespace-pre-wrap
                  ${msg.role === "ai" 
                    ? "text-slate-700 animate-in fade-in slide-in-from-bottom-2" 
                    : "bg-blue-600 text-white p-4 rounded-2xl rounded-br-sm shadow-sm"
                  }
                `}>
                  {msg.text}
                </div>

                {/* 已發送的表格展示 */}
                {msg.tableData && (
                  <div className="mt-2 w-full max-w-[280px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in zoom-in duration-300">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-3 py-2 border-b border-r border-slate-200 w-1/2">Day</th>
                          <th className="px-3 py-2 border-b border-slate-200 w-1/2">Task</th>
                        </tr>
                      </thead>
                      <tbody>
                        {msg.tableData.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-100 last:border-0">
                            <td className="px-3 py-2 border-r border-slate-100 font-medium text-slate-700">{row[0]}</td>
                            <td className="px-3 py-2 text-slate-500">{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 表格編輯器 (絕對定位，浮在輸入框上方)
        使用 absolute bottom-full 確保它固定在輸入框上方，不影響佈局
        */}
        {showTableEditor && (
          <div className="absolute bottom-[72px] right-4 w-[300px] z-30 animate-in slide-in-from-bottom-2 fade-in duration-300">
             <div className="bg-white border border-indigo-200 rounded-2xl shadow-xl overflow-hidden ring-2 ring-indigo-50">
                {/* Header */}
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <TableIcon size={12} className="text-indigo-500" />
                    Schedule Grid (2x6)
                  </span>
                  <button onClick={() => setShowTableEditor(false)} className="text-slate-400 hover:text-red-500">
                    <span className="sr-only">Close</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>

                {/* Grid */}
                <div className="p-0 relative max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                  {showAutoFillHint && (
                    <div className="absolute top-10 left-24 z-20 animate-in zoom-in duration-300">
                       <button 
                          onClick={performAutoFill}
                          className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
                       >
                          <Zap size={10} className="fill-yellow-300 text-yellow-300" />
                          <span>Auto Fill Days?</span>
                       </button>
                       <div className="absolute top-1/2 -left-1 w-2 h-2 bg-indigo-600 transform rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  )}

                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                         <th className="border-b border-r border-slate-200 p-2 bg-slate-50/50 w-1/2 text-slate-400 font-medium">Day</th>
                         <th className="border-b border-slate-200 p-2 bg-slate-50/50 w-1/2 text-slate-400 font-medium">Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grid.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={`${rIdx}-${cIdx}`} className="border-b border-r border-slate-100 p-0 last:border-r-0 relative group">
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                placeholder={rIdx === 0 && cIdx === 0 ? "Try 'Monday'..." : ""}
                                className={`
                                  w-full h-8 px-3 outline-none bg-transparent transition-colors
                                  ${cIdx === 0 ? 'font-medium text-indigo-900' : 'text-slate-600'}
                                  focus:bg-indigo-50/30
                                  placeholder:text-slate-300 placeholder:italic
                                `}
                              />
                              {/* 裝飾：右下角拖曳點 */}
                              {cIdx === 0 && rIdx === 0 && cell && !showAutoFillHint && grid[1][0] === "" && (
                                 <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-indigo-500 cursor-nwse-resize z-10" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Footer */}
                <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex justify-end">
                    <span className="text-[10px] text-slate-400 mr-auto flex items-center gap-1">
                      {showAutoFillHint ? <Zap size={10} className="animate-pulse text-indigo-500" /> : <GripVertical size={10} />}
                      {showAutoFillHint ? "AI Pattern Detected" : "Drag handle to fill"}
                    </span>
                </div>
             </div>
          </div>
        )}

        {/* 底部輸入區 */}
        <div className="shrink-0 pt-2 pb-4 px-4 relative z-20">
            <div className="relative flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
                
                {/* 表格按鈕 */}
                <button 
                  onClick={handleTableClick}
                  className={`
                    p-2 rounded-xl transition-all duration-300 flex-shrink-0
                    ${showTableEditor 
                      ? "bg-indigo-100 text-indigo-600" 
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    }
                  `}
                  title="Insert 2x6 Table"
                >
                  <TableIcon size={20} />
                </button>

                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  // 當打開表格時，禁用下方輸入框
                  disabled={showTableEditor}
                  placeholder={showTableEditor ? "Editing table above..." : "Ask any question..."}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 h-8 disabled:cursor-default pl-2"
                />

                <button
                  onClick={handleSend}
                  disabled={!showTableEditor && !inputValue.trim()}
                  className={`
                    p-2 rounded-full transition-all
                    ${(showTableEditor || inputValue.trim()) 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    }
                  `}
                >
                  <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};