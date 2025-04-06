import React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    width?: string;
}