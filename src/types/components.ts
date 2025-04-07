import React from 'react';
import { SortDirection } from './ui';
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
    columns: {
        key: string;
        header: string;
        sortable?: boolean;
        render?: (item: T) => React.ReactNode;
        width?: string;
    }[];
    keyExtractor: (item: T) => string;
    searchFields?: string[];
    itemsPerPage?: number;
    isLoading?: boolean;
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
    onSearchChange?: (term: string) => void;
    
    currentPage?: number;
    onPageChange?: (page: number) => void;
    
    sortKey?: string | null;
    sortDirection?: SortDirection;
    onSortChange?: (key: string | null, direction: SortDirection) => void;
    
    totalItems?: number;  
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
    serverSidePagination?: boolean;
}

export interface PlantFormProps {
    solarPlant?: SolarPlant;
    onSubmit: (solarPlant: { name: string }) => void;
    onCancel: () => void;
}

export interface PlantListProps {
    onNavigate: (path: string) => void;
}
