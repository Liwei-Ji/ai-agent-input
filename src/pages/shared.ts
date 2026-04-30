/**
 * shared.ts
 * 共享定義層：包含全域使用的類型定義 (Types)、常量 (AGENTS) 以及工具函數 (cn, getContrastColor)。
 */
import { ShieldCheck, Cpu, FileText, Image } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 工具函數
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getContrastColor = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1f1f1f' : '#ffffff';
};

// 類型定義
export type ThemeMode = 'light' | 'dark' | 'colorful';
export type ViewType = 'home' | 'agents' | 'search';

export interface Agent {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
}

export interface Chat {
    id: string;
    title: string;
    timestamp: number;
    agentId: string;
}

export interface ThemeStyles {
    backgroundColor: string;
    color: string;
    borderColor: string;
    isDark: boolean;
}

// 常量
export const AGENTS: Agent[] = [
    { id: 'gmp', name: 'GMP AI Agent', description: '致力於 GMP 相關規範與品質管理流程諮詢。', icon: ShieldCheck, color: 'bg-blue-600' },
    { id: 'dise', name: 'DISE AI Agent', description: '專業提供 DISE 相關技術支援與系統開發指引。', icon: Cpu, color: 'bg-blue-600' },
    { id: 'doc', name: 'DOC AI', description: '智慧文檔管理專家，精通各類文件處理與自動化流程。', icon: FileText, color: 'bg-blue-600' },
    { id: 'apple', name: 'Nano Apple', description: '創意生成式 AI，能將您的想法轉化為精美豐富的圖像。', icon: Image, color: 'bg-blue-600' },
];
