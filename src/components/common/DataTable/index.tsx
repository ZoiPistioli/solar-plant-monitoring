import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SearchX,
} from 'lucide-react';
import { DataTableProps, SortDirection } from '@/types';
import Loader from '@/components/common/Loader';
import styles from './DataTable.module.css';

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

  const filteredData = useMemo(() => {
    if (serverSidePagination) return data;
    
    if (!searchTerm.trim()) return data;
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return (
          value != null &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [data, searchTerm, searchFields, serverSidePagination]);

  const sortedData = useMemo(() => {
    if (serverSidePagination) return data;
    
    if (!sortKey || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey],
        bValue = b[sortKey];
      if (aValue === bValue) return 0;
      const comp =
        aValue === null
          ? -1
          : bValue === null
          ? 1
          : typeof aValue === 'string'
          ? aValue.localeCompare(String(bValue))
          : aValue < bValue
          ? -1
          : 1;
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [filteredData, sortKey, sortDirection, serverSidePagination]);

  const calculatedTotalPages = serverSidePagination 
    ? (passedTotalPages || Math.ceil((totalItems || 0) / itemsPerPage))
    : Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  
  const totalPages = calculatedTotalPages;
  
  const paginatedData = useMemo(() => {
    if (serverSidePagination) return data;
    
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, serverSidePagination, data]);

  const displayData = serverSidePagination ? data : paginatedData;
  
  const displayTotalItems = serverSidePagination ? (totalItems || 0) : sortedData.length;
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!serverSidePagination || !onPageChange) {
      setInternalPage(1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button
              className={styles.clearSearch}
              onClick={() => handleSearch('')}
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.resultsInfo}>
          {!isLoading && displayTotalItems > 0 && (
            <span className={styles.resultsCount}>
              {displayTotalItems} {displayTotalItems === 1 ? 'entry' : 'entries'}
            </span>
          )}

          {!isLoading && totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() =>
                  onPageChange
                    ? onPageChange(Math.max(currentPage - 1, 1))
                    : setInternalPage((p) => Math.max(p - 1, 1))
                }
                disabled={serverSidePagination ? !hasPrevPage : currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.pageIndicator}>
                {currentPage} / {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() =>
                  onPageChange
                    ? onPageChange(Math.min(currentPage + 1, totalPages))
                    : setInternalPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={serverSidePagination ? !hasNextPage : currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
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

                    const colKey = String(column.key);
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

                    if (onPageChange) {
                      onPageChange(1);
                    } else {
                      setInternalPage(1);
                    }
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
          <tbody className={styles.tableBody}>
            {isLoading ? (
              <tr className={`${styles.loaderRow} loaderRow`}>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className={`${styles.loaderCell} loaderCell`}
                >
                  <Loader
                    size="md"
                    variant="primary"
                    message="Loading data..."
                  />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className={styles.emptyCell}
                >
                  <div className={styles.iconWrapper}>
                    <SearchX size={48} className={styles.emptyIcon} />
                  </div>
                  <p className={styles.emptyTitle}>No entries found</p>
                  <p className={styles.emptySubtitle}>
                    Add your first entry to get started.
                  </p>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className={styles.emptyCell}
                >
                  <div className={styles.iconWrapper}>
                    <SearchX size={48} className={styles.emptyIcon} />
                  </div>
                  <p className={styles.emptyTitle}>No matching results</p>
                  <p className={styles.emptySubtitle}>
                    Try a different search term or clear your search to see all
                    data.
                  </p>
                  <button
                    className={styles.clearButton}
                    onClick={() => handleSearch('')}
                  >
                    Clear Search
                  </button>
                </td>
              </tr>
            ) : (
              <>
                {Array.from({ length: itemsPerPage }, (_, index) => 
                  index < data.length ? (
                    <tr
                      key={keyExtractor(data[index])}
                      className={`${styles.row} ${
                        onRowClick ? styles.clickableRow : ''
                      }`}
                      onClick={
                        onRowClick ? () => onRowClick(data[index]) : undefined
                      }
                    >
                      {columns.map((column) => (
                        <td
                          key={`${keyExtractor(data[index])}-${String(column.key)}`}
                          className={styles.cell}
                          style={{ width: column.width ?? 'auto' }}
                        >
                          {column.render
                            ? column.render(data[index])
                            : data[index][column.key as keyof T]}
                        </td>
                      ))}
                      {actions && (
                        <td className={styles.actionsCell}>
                          <div
                            className={styles.actionsCellContent}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {actions(data[index])}
                          </div>
                        </td>
                      )}
                    </tr>
                  ) : (
                    <tr key={`filler-${index}`} className={styles.row}>
                      <td
                        colSpan={columns.length + (actions ? 1 : 0)}
                        style={{ height: '53px' }}
                      >
                        &nbsp;
                      </td>
                    </tr>
                  )
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;