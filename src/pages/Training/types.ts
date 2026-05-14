import { Table } from 'lucide-react';
import type { ThemeStyles } from '../shared';

export interface ColumnItem {
    id: string;
    name: string;
    disabled?: boolean;
    recommend?: boolean;
    type?: 'data' | 'timestamp';
}

export interface TrainingViewProps {
    themeStyles: ThemeStyles;
}
