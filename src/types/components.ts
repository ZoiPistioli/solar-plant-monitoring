import React from 'react';
import { Column, SortDirection } from './ui';
import { SolarPlant } from './domain';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'primary' | 'secondary';
    fullScreen?: boolean;
    message?: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    searchFields?: Array<keyof T>;
    itemsPerPage?: number;
    isLoading?: boolean;
    emptyStateMessage?: string;
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
    onSearchChange?: (searchTerm: string) => void;

    sortKey?: string | null;
    sortDirection?: SortDirection;
    onSortChange?: (key: string | null, direction: SortDirection) => void;

    currentPage?: number;
    onPageChange?: (page: number) => void;
}

export interface PlantFormProps {
    solarPlant?: SolarPlant;
    onSubmit: (solarPlant: { name: string }) => void;
    onCancel: () => void;
}

export interface PlantListProps {
    onNavigate: (path: string) => void;
}
