import { useState, useEffect } from 'react';
import { DataTableProps, SortDirection } from '@/types';
import styles from './DataTable.module.css';

import useTableData from '@/hooks/useTableData';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import TableBody from './components/TableBody';
import TableHeader from './components/TableHeader';

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchFields = [],
  itemsPerPage = 10,
  isLoading = false,
  onRowClick,
  actions,
  onSearchChange,
  currentPage: controlledPage,
  onPageChange,
  sortKey: controlledSortKey,
  sortDirection: controlledSortDirection,
  onSortChange,
  totalItems,
  totalPages: passedTotalPages,
  hasNextPage,
  hasPrevPage,
  serverSidePagination = false,
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalPage, setInternalPage] = useState(1);
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] =
    useState<SortDirection>(null);

  useEffect(() => {
    if (!controlledPage && !onPageChange) setInternalPage(1);
    
    const handler = setTimeout(() => {
      onSearchChange?.(searchTerm);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearchChange]);

  const currentPage = controlledPage ?? internalPage;
  const sortKey = controlledSortKey ?? internalSortKey;
  const sortDirection = controlledSortDirection ?? internalSortDirection;

  const {
    processedData,
    totalPages,
    displayTotalItems
  } = useTableData({
    data,
    searchTerm,
    searchFields,
    sortKey,
    sortDirection,
    currentPage,
    itemsPerPage,
    serverSidePagination,
    passedTotalPages,
    totalItems
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!serverSidePagination || !onPageChange) {
      setInternalPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    const safeNewPage = Math.max(1, Math.min(newPage, totalPages));
    
    if (onPageChange) {
      onPageChange(safeNewPage);
    } else {
      setInternalPage(safeNewPage);
    }
  };

  const handleSortChange = (colKey: string) => {
    if (onSortChange) {
      if (sortKey === colKey) {
        if (sortDirection === 'asc') {
          onSortChange(colKey, 'desc');
        } else {
          onSortChange(null, null);
        }
      } else {
        onSortChange(colKey, 'asc');
      }
    } else {
      if (sortKey === colKey) {
        if (sortDirection === 'asc') {
          setInternalSortDirection('desc');
        } else {
          setInternalSortKey(null);
          setInternalSortDirection(null);
        }
      } else {
        setInternalSortKey(colKey);
        setInternalSortDirection('asc');
      }
    }

    handlePageChange(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <SearchBar 
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        <div className={styles.resultsInfo}>
          {!isLoading && displayTotalItems > 0 && (
            <span className={styles.resultsCount}>
              {displayTotalItems} {displayTotalItems === 1 ? 'entry' : 'entries'}
            </span>
          )}

          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasPrevPage={serverSidePagination ? (hasPrevPage ?? false) : currentPage > 1}
              hasNextPage={serverSidePagination ? (hasNextPage ?? false) : currentPage < totalPages}
            />
          )}
        </div>
      </div>

      <div className={`${styles.tableContainer} ${columns.length > 3 ? styles.horizontalOverflow : ''}`}>
        <table className={styles.table}>
          <TableHeader
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            actions={!!actions}
          />
          <TableBody
            data={processedData}
            columns={columns}
            keyExtractor={keyExtractor}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onRowClick={onRowClick}
            actions={actions}
            handleSearch={handleSearch}
            itemsPerPage={itemsPerPage}
          />
        </table>
      </div>
    </div>
  );
};

export default DataTable;