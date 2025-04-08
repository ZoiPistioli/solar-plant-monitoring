import { useMemo } from 'react';
import { UseTableDataProps } from '@/types';
import { listUtils } from '@/utils/listUtils'; 

/**
 * Custom hook that processes table data with filtering, sorting, and pagination
 * @template T - Generic type extending Record<string, any>
 * @param props - Table data processing configuration
 * @returns Object containing processed data, total pages, and total items count
 */
function useTableData<T extends Record<string, any>>(props: UseTableDataProps<T>) {
  const {
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
  } = props;

  /**
   * Filters data based on search term across specified fields
   * Only applies in client-side mode
   */
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

  /**
   * Sorts filtered data using the listUtils.sort utility
   * Only applies in client-side mode
   */
  const sortedData = useMemo(() => {
    if (serverSidePagination) return data;
    
    if (!sortKey || !sortDirection) return filteredData;
    return listUtils.sort(filteredData, sortKey as keyof T, sortDirection);
  }, [filteredData, sortKey, sortDirection, serverSidePagination, data]);

  /**
   * Uses listUtils.paginate to handle pagination and get total pages
   */
  const { currentItems, totalPages: calculatedTotalPages } = useMemo(() => {
    if (serverSidePagination) {
      return {
        currentItems: data,
        totalPages: passedTotalPages || Math.ceil((totalItems || 0) / itemsPerPage)
      };
    }
    
    // Use the listUtils.paginate utility function
    return listUtils.paginate(sortedData, currentPage, itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, serverSidePagination, data, passedTotalPages, totalItems]);

  /**
   * Calculates total pages based on data length or server-provided value
   */
  const totalPages = serverSidePagination 
    ? (passedTotalPages || Math.ceil((totalItems || 0) / itemsPerPage))
    : calculatedTotalPages;

  /**
   * Determines total items count from server data or local data length
   */
  const displayTotalItems = serverSidePagination 
    ? (totalItems || 0) 
    : sortedData.length;

  return {
    processedData: currentItems, 
    totalPages,
    displayTotalItems
  };
}

export default useTableData;