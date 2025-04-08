import React, { useMemo } from 'react';
import { SearchX } from 'lucide-react';
import Loader from '@/components/common/Loader';
import { formatDate } from '@/utils/dateUtils';
import { DataStateRendererProps } from '@/types';
import styles from './DataStateRender.module.css';

export const DataStateRenderer = React.memo(({
    dataState,
    dateRange,
    children,
}: DataStateRendererProps) => {
    const formattedDateRange = useMemo(() => {
        const start = dateRange[0]?.startDate;
        const end = dateRange[0]?.endDate;
        
        if (!start || !end) return '';

        const sameDay = formatDate(start) === formatDate(end);
        return sameDay
            ? formatDate(start)
            : `${formatDate(start)} to ${formatDate(end)}`;
    }, [dateRange]);

    const renderLoadingSpinner = () => (
        <div 
            role="alert" 
            aria-busy="true" 
            className={styles.container}
        >
            <Loader
                size="md"
                variant="primary"
                message="Loading data..."
            />
        </div>
    );

    const renderEmptyState = () => (
        <div 
            role="region" 
            aria-label="No data available" 
            className={styles.container}
        >
            <div className={styles.emptyStateWrapper}>
                <div className={styles.iconWrapper}>
                    <SearchX 
                        size={48} 
                        color="#9ca3af" 
                        aria-hidden="true" 
                    />
                </div>
                <p className={styles.emptyStateTitle}>
                    No datapoints found for <strong>{formattedDateRange}</strong>
                </p>
                <p className={styles.emptyStateSubtitle}>
                    Select a date range and click "Update Datapoints" to load data.
                </p>
            </div>
        </div>
    );

    const renderContent = (): React.ReactNode => {
        switch (dataState) {
            case 'initial':
            case 'empty':
                return renderEmptyState();
            case 'loading':
                return renderLoadingSpinner();
            case 'loaded':
                return children;
            default:
                console.warn(`Unexpected data state: ${dataState}`);
                return null;
        }
    };

    return (
        <div data-testid="data-state-renderer">
            {renderContent()}
        </div>
    );
});

DataStateRenderer.displayName = 'DataStateRenderer';

export default DataStateRenderer;