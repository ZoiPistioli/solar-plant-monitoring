import React from 'react';
import { SolarPlant } from './domain';
import { Range } from 'react-date-range';

export type SortDirection = 'asc' | 'desc' | null;

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
    size?: 'small' | 'medium' | 'large' | 'xlarge';
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

export interface ColumnDefinition<T> {
    key: string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

export interface UseTableDataProps<T> {
    data: T[];
    searchTerm: string;
    searchFields: string[];
    sortKey: string | null;
    sortDirection: SortDirection;
    currentPage: number;
    itemsPerPage: number;
    serverSidePagination: boolean;
    passedTotalPages?: number;
    totalItems?: number;
}

export interface TableHeaderProps<T> {
    columns: ColumnDefinition<T>[];
    sortKey: string | null;
    sortDirection: SortDirection;
    onSortChange: (key: string) => void;
    actions: boolean;
}

export interface TableBodyProps<T> {
    data: T[];
    columns: ColumnDefinition<T>[];
    keyExtractor: (item: T) => string;
    isLoading: boolean;
    searchTerm: string;
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
    handleSearch: (value: string) => void;
    itemsPerPage: number;
}

export interface EmptyStateProps {
    searchTerm: string;
    onClearSearch: () => void;
}

export interface SearchBarProps {
    searchTerm: string;
    onSearch: (value: string) => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasPrevPage: boolean;
    hasNextPage: boolean;
}

export interface PlantFormProps {
    solarPlant?: SolarPlant;
    onSubmit: (solarPlant: { name: string }) => void;
    onCancel: () => void;
}

export interface PlantListProps {
    onNavigate: (path: string) => void;
}

export interface ModalButtonProps {
    buttonLabel: string;
    modalTitle: string;
    children: React.ReactNode | ((props: { onClose: () => void }) => React.ReactNode);
    icon?: React.ReactNode;
    buttonClassName?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface DateRangeState extends Range {
    key: string;
}

export interface DatapointReport {
    day: string;
    total_energy_expected: number;
    total_energy_observed: number;
    total_irradiation_expected: number;
    total_irradiation_observed: number;
}

export interface MonitoringDashboardProps {
    plantId: string | null;
    plantName: string | null;
    onNavigate?: (path: string) => void;
}

export interface DateRangeSelectorProps {
    dateRange: DateRangeState[];
    handleSelect: (ranges: { [key: string]: Range }) => void;
    handleUpdateDatapoints: (onClose: () => void) => Promise<void>;
}

export interface DataReportTableProps {
    onSearchChange: (term: string) => void;
}

export interface ChartProps {
    data: DatapointReport[];
    height?: number;
}

export interface DataStateRendererProps {
    dataState: 'initial' | 'loading' | 'empty' | 'loaded';
    dateRange: DateRangeState[];
    children: React.ReactNode;
    onRetry?: () => void;
}

export interface UseDataFetchingProps {
    plantId: string | null;
    dateRange: DateRangeState[];
    setDatapointReports: (data: any[]) => void;
    setIsLoading: (loading: boolean) => void;
}