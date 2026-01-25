import { useState } from "react";
import { 
  Play, Plus, X, ChevronDown, 
  Bot, Image as ImageIcon, UploadCloud, FileOutput, 
  MoreHorizontal, Loader2, Check, FileText, Trash2, Folder 
} from "lucide-react";

// 定義節點類型
interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "output";
  title: string;
  icon: React.ElementType;
  color: string;
}

// 所有節點顏色為 Slate (灰色)
const NODES: WorkflowNode[] = [
  {
    id: "node-1",
    type: "trigger",
    title: "Inputs",
    icon: UploadCloud,
    color: "bg-slate-100 text-slate-600" 
  },
  {
    id: "node-2",
    type: "action",
    title: "AI Agent",
    icon: Bot,
    color: "bg-slate-100 text-slate-600"
  },
  {
    id: "node-3",
    type: "action",
    title: "Design",
    icon: ImageIcon,
    color: "bg-slate-100 text-slate-600"
  },
  {
    id: "node-4",
    type: "output",
    title: "Output",
    icon: FileOutput,
    color: "bg-slate-100 text-slate-600"
  }
];

type NodeStatus = "idle" | "running" | "completed";

interface FileItem {
    id: string;
    name: string;
    size: string;
}

const MOCK_FILE_POOL: FileItem[] = [
    { id: "1", name: "product_specs.pdf", size: "2.4 MB" },
    { id: "2", name: "reference_photo.jpg", size: "3.1 MB" },
    { id: "3", name: "market_data.csv", size: "1.2 MB" }
];

export const Workflows = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});

  const [files, setFiles] = useState<FileItem[]>([MOCK_FILE_POOL[0]]);

  // --- 處理節點點擊 (Toggle 邏輯) ---
  const handleNodeClick = (id: string) => {
    if (selectedNodeId === id && isSidebarOpen) {
        setIsSidebarOpen(false);
        setSelectedNodeId(null);
    } else {
        setSelectedNodeId(id);
        setIsSidebarOpen(true);
    }
  };

  const handleCloseSidebar = () => {
      setIsSidebarOpen(false);
      setSelectedNodeId(null);
  };

  const handleSimulateUpload = () => {
      if (files.length >= 3) return;
      const nextFile = MOCK_FILE_POOL.find(
          mockFile => !files.some(currentFile => currentFile.id === mockFile.id)
      );
      if (nextFile) {
          setFiles(prev => [...prev, nextFile]);
      }
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleRun = () => {
    if (isWorkflowRunning) return;
    setIsWorkflowRunning(true);
    setNodeStatuses({});

    const sequence = [
        { id: "node-1", delay: 0, duration: 800 },
        { id: "node-2", delay: 800, duration: 1500 },
        { id: "node-3", delay: 2300, duration: 1500 },
        { id: "node-4", delay: 3800, duration: 800 },
    ];

    sequence.forEach(({ id, delay, duration }) => {
        setTimeout(() => setNodeStatuses(prev => ({ ...prev, [id]: "running" })), delay);
        setTimeout(() => {
            setNodeStatuses(prev => ({ ...prev, [id]: "completed" }));
            if (id === "node-4") setIsWorkflowRunning(false);
        }, delay + duration);
    });
  };

  const selectedNode = NODES.find(n => n.id === selectedNodeId);

  const renderSidebarContent = () => {
    switch (selectedNodeId) {
      case "node-1": // Inputs
        const isFull = files.length >= 3;
        return (
          <div className="space-y-6">
             <div 
                onClick={handleSimulateUpload}
                className={`
                    border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all group
                    ${isFull 
                        ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60" 
                        : "border-slate-200 cursor-pointer hover:bg-slate-50 hover:border-indigo-300"
                    }
                `}
             >
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform
                    ${isFull ? "bg-slate-200 text-slate-400" : "bg-indigo-50 text-indigo-500 group-hover:scale-110"}
                `}>
                   <UploadCloud size={20} />
                </div>
                <p className="text-xs font-medium text-slate-600">
                    {isFull ? "Upload limit reached (3/3)" : "Click to upload"}
                </p>
                {!isFull && <p className="text-[10px] text-slate-400 mt-1">SVG, PNG, JPG or PDF</p>}
             </div>

             {files.length > 0 && (
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Files ({files.length})</label>
                    <div className="space-y-2">
                        {files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded border border-slate-200 text-indigo-500">
                                    <FileText size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-slate-700">{file.name}</span>
                                    <span className="text-[10px] text-slate-400">{file.size}</span>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => handleDeleteFile(file.id, e)}
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                            </div>
                        ))}
                    </div>
                </div>
             )}
          </div>
        );

      case "node-2": // AI Agent
        return (
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Model</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                        <option>Gemini Flash</option>
                        <option>Gemini Pro</option>
                        <option>Gemini Ultra</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">System Prompt</label>
                <textarea 
                  rows={8}
                  className="w-full bg-white border border-slate-200 text-slate-600 text-xs leading-relaxed rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-sm"
                  defaultValue="You are a professional prompt designer who specializes in creating prompts to generate product images for use in online catalogs and ads."
                />
             </div>
          </div>
        );

      case "node-3": // Design
        return (
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Style</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                        <option>Photorealistic</option>
                        <option>Minimalist</option>
                        <option>Cyberpunk</option>
                        <option>Studio Lighting</option>
                        <option>Oil Painting</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
             </div>
          </div>
        );

      case "node-4": // Output
        return (
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">File Name</label>
                <input 
                  type="text" 
                  defaultValue="generated_product_image"
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Format</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                        <option>PNG</option>
                        <option>JPG</option>
                        <option>WEBP</option>
                        <option>JSON (Metadata)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
             </div>
             
             {/* Storage Location */}
             <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Storage Location</label>
                <div className="relative group">
                    <div className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Folder size={14} />
                    </div>
                    <input 
                      type="text" 
                      defaultValue="/project/assets/renders"
                      className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-mono text-xs"
                    />
                </div>
             </div>
          </div>
        );

      default:
        return <div className="text-slate-400 text-sm p-4">Select a node to configure.</div>;
    }
  };

  return (
    <div className="flex h-[600px] w-full min-h-[500px] bg-slate-50 overflow-hidden font-sans rounded-3xl relative">
      
      {/* 背景 */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
            backgroundSize: '24px 24px', 
            opacity: 0.5 
        }}
      ></div>

      {/* 中間畫布區域 */}
      <div className="flex-1 overflow-y-auto relative z-10 flex flex-col items-center py-12">
          
          <button 
            onClick={handleRun}
            disabled={isWorkflowRunning}
            className={`
                mb-10 flex items-center gap-2 px-8 py-2.5 rounded-xl shadow-lg font-medium transition-all active:scale-95
                ${isWorkflowRunning 
                    ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed" 
                    : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:scale-105"
                }
            `}
          >
             {isWorkflowRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
             {isWorkflowRunning ? "Running..." : "Run"}
          </button>

          <div className="flex flex-col items-center w-full max-w-[320px]">
              {NODES.map((node, index) => {
                  const status = nodeStatuses[node.id] || "idle";
                  const isRunning = status === "running";
                  const isCompleted = status === "completed";
                  const isSelected = selectedNodeId === node.id; 

                  return (
                  <div key={node.id} className="w-full flex flex-col items-center">
                      {index > 0 && (
                          <div className="flex flex-col items-center h-10 relative">
                              <div className={`w-[2px] h-full border-l-2 border-dotted transition-colors duration-500 ${isCompleted || isRunning ? "border-indigo-300" : "border-slate-300"}`}></div>
                              <div className="absolute top-1/2 -translate-y-1/2 z-10 bg-slate-50 p-1">
                                <button className="w-5 h-5 rounded bg-indigo-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                                    <Plus size={12} strokeWidth={3} />
                                </button>
                              </div>
                          </div>
                      )}

                      <div 
                        onClick={() => handleNodeClick(node.id)}
                        className={`
                            group relative w-full bg-white rounded-2xl p-3 flex items-center justify-between
                            cursor-pointer transition-all duration-300
                            
                            ${isRunning 
                                ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-100 scale-[1.02] border-transparent" 
                                : isCompleted
                                    ? "border border-emerald-500 shadow-sm"
                                    : isSelected 
                                        ? "ring-2 ring-indigo-500 shadow-md border-transparent" 
                                        : "border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200"
                            }
                        `}
                      >
                          {index > 0 && (
                              <div className={`
                                absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 bg-white z-20
                                ${isCompleted || isRunning ? "border-indigo-500" : "border-slate-300"}
                              `}></div>
                          )}
                          {index < NODES.length - 1 && (
                              <div className={`
                                absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 bg-white z-20
                                ${isCompleted ? "border-emerald-500" : isRunning ? "border-indigo-500" : "border-slate-300"}
                              `}></div>
                          )}

                          <div className="flex items-center gap-4">
                              <div className={`
                                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                                  ${isCompleted ? "bg-emerald-100 text-emerald-600" : node.color}
                              `}>
                                  {isCompleted ? <Check size={18} strokeWidth={3} /> : 
                                   isRunning ? <Loader2 size={18} className="animate-spin text-indigo-600" /> :
                                   <node.icon size={18} />}
                              </div>
                              <div className="flex flex-col justify-center h-full">
                                  <span className="text-sm font-bold text-slate-800 leading-none">
                                      {node.title}
                                  </span>
                              </div>
                          </div>
                          <div className="text-slate-300 group-hover:text-slate-500">
                              <MoreHorizontal size={20} />
                          </div>
                      </div>
                  </div>
                  );
              })}
          </div>
          <div className="h-20"></div>
      </div>

      {/* 右側懸浮視窗樣式 */}
      <div 
        className={`
            absolute top-4 right-4 bottom-4 w-[340px]
            bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50
            transition-all duration-300 cubic-bezier(0.25, 1, 0.5, 1)
            ${isSidebarOpen 
                ? "translate-x-0 opacity-100 pointer-events-auto" 
                : "translate-x-10 opacity-0 pointer-events-none"
            }
        `}
      >
          {/* Sidebar Header */}
          <div className="h-14 flex items-center justify-between px-5 shrink-0 rounded-t-2xl">
              <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${selectedNode?.color.replace('text-', 'bg-opacity-20 ')}`}>
                    {selectedNode && <selectedNode.icon size={16} className={selectedNode.color.split(" ")[1]} />}
                  </div>
                  <span className="font-semibold text-sm text-slate-700">
                      {selectedNode ? selectedNode.title : "Configuration"}
                  </span>
              </div>
              <button 
                onClick={handleCloseSidebar} 
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                  <X size={18} />
              </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-5">
             {renderSidebarContent()}
          </div>
      </div>

    </div>
  );
};