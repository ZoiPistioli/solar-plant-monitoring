import { SolarPlant } from '@/types';

function isPlantKey(key: string): key is keyof SolarPlant {
  return ['name', 'id'].includes(key);
}

export const listUtils = {
  /**
   * Paginate an array of items
   * @param items Array of items to paginate
   * @param currentPage Current page number
   * @param itemsPerPage Number of items per page
   * @returns Object with paginated items and total pages
   */
  paginate: <T>(
    items: T[], 
    currentPage: number, 
    itemsPerPage: number
  ) => {
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    return {
      currentItems,
      totalPages
    };
  },

  /**
   * Sort an array of items
   * @param items Array of items to sort
   * @param field Field to sort by
   * @param direction Sort direction
   * @returns Sorted array of items
   */
  sort: <T>(
    items: T[], 
    field: keyof T | null, 
    direction: 'asc' | 'desc' | null
  ): T[] => {
    if (!field || !direction) return items;

    return [...items].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * Determine next sort state
   * @param currentField Current sort field
   * @param currentDirection Current sort direction
   * @param newField New field to sort by
   * @returns New sort state
   */
  nextSortState: (
    currentField: keyof SolarPlant | null, 
    currentDirection: 'asc' | 'desc' | null, 
    newField: string
  ): { 
    field: keyof SolarPlant | null, 
    direction: 'asc' | 'desc' | null 
  } => {
    if (!isPlantKey(newField)) {
      throw new Error(`Invalid sort field: ${newField}`);
    }

    if (currentField === newField) {
      if (currentDirection === 'asc') {
        return { field: newField, direction: 'desc' };
      } else if (currentDirection === 'desc') {
        return { field: null, direction: null };
      }
    }
    return { field: newField, direction: 'asc' };
  }
};