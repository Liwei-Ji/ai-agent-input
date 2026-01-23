import { ChatInput } from "../ChatInput";

export const InitialCTA = () => (
  <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
    
    <div className="relative overflow-hidden rounded-[18px] p-[2px]">
      
      {/* onic-gradient
         1. transparent 0% -> transparent 90% : 前面 90% 都是透明的 (看不到)
         2. #6366f1 100% : 最後 10% 瞬間拉到亮紫色，形成短尾巴效果
      */}
      <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_90%,#6366f1_100%)]" />
      
      <div className="relative bg-white rounded-2xl">
        <ChatInput 
          placeholder="Ask any question..." 
          onSend={(t) => console.log("Initial CTA Text:", t)}
          onUpload={(f) => console.log("Initial CTA File:", f.name)}
        />
      </div>
    </div>

  </div>
);