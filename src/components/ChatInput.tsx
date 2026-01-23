import React, { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  placeholder?: string;
  onSend?: (text: string) => void;
  onUpload?: (file: File) => void;
  disabled?: boolean;
  uploadButtonClass?: string;
  customPlaceholder?: React.ReactNode;
  
  // 擴充，讓外部可以換 icon 和點擊行為
  leftIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
}

export const ChatInput = ({ 
  placeholder, 
  onSend, 
  onUpload, 
  disabled = false,
  uploadButtonClass = "",
  customPlaceholder,
  leftIcon,
  onLeftIconClick,
}: ChatInputProps) => {
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (value.trim() && !disabled) {
      onSend?.(value);
      setValue("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
      e.target.value = ""; 
    }
  };

  const handleLeftClick = () => {
    if (onLeftIconClick) {
      onLeftIconClick(); 
    } else {
      fileInputRef.current?.click();
    }
  };

  const defaultButtonStyle = "text-slate-400 hover:bg-slate-100 hover:text-indigo-600";
  const buttonStyle = uploadButtonClass || defaultButtonStyle;

  return (
    <div className="relative flex w-full items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
      
      {/* 左側按鈕 */}
      <button
        type="button"
        onClick={handleLeftClick}
        disabled={disabled}
        className={`
          transition-colors shrink-0
          disabled:opacity-40 disabled:cursor-not-allowed
          p-2 rounded-xl
          ${buttonStyle}
        `}
      >
        {leftIcon || <Paperclip size={20} />}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {/* 輸入框區域 */}
      <div className="flex-1 relative h-10 flex items-center">
        {!value && customPlaceholder && (
          <div className="absolute inset-0 flex items-center px-2 pointer-events-none overflow-hidden">
            {customPlaceholder}
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={disabled}
          placeholder={customPlaceholder ? "" : (placeholder || "Ask any question...")}
          className="w-full h-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed z-10"
        />
      </div>

      {/* 發送按鈕 */}
      <button
        onClick={sendMessage}
        disabled={!value.trim() || disabled}
        className={`
          flex items-center justify-center
          w-10 h-10 rounded-full transition-all shrink-0
          ${
            value.trim() && !disabled
              ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
          }
        `}
      >
        <Send size={18} />
      </button>
    </div>
  );
};