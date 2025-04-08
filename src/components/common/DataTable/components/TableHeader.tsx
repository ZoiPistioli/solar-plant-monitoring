import { ChevronUp, ChevronDown } from 'lucide-react';
import { TableHeaderProps } from '@/types';
import styles from '../DataTable.module.css';

function TableHeader<T>({
    columns,
    sortKey,
    sortDirection,
    onSortChange,
    actions
}: TableHeaderProps<T>) {
    return (
        <thead className={styles.header}>
            <tr>
                {columns.map((column) => (
                <th
                    key={String(column.key)}
                    className={`${styles.headerCell} ${
                        column.sortable ? styles.sortableHeader : ''
                    }`}
                    style={{ width: column.width ?? 'auto' }}
                    onClick={() => {
                        if (!column.sortable) return;
                        onSortChange(String(column.key));
                    }}
                >
                    <div className={styles.headerContent}>
                        {column.header}
                        {sortKey === column.key && sortDirection && (
                            <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </span>
                        )}
                    </div>
                </th>
                ))}
                {actions && (
                    <th className={styles.actionsHeader}>Actions</th>
                )}
            </tr>
        </thead>
    );
}

export default TableHeader;