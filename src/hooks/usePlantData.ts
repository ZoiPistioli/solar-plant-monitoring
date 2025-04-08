import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SolarPlant } from '@/types';
import { apiService } from '@/services/apiService';
import { listUtils } from '@/utils/listUtils';

/**
 * Custom hook to manage solar plant data and related operations
 * Handles data fetching, pagination, sorting, and CRUD operations
 * @returns Object with plant data and handler functions
 */
function usePlantData() {
    const [plants, setPlants] = useState<SolarPlant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [sortKey, setSortKey] = useState<keyof SolarPlant | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    
    const itemsPerPage = 10;

    /**
     * Fetches solar plants with pagination, search and sorting
     */
    const fetchPlants = async () => {
        if (isFetching) return;

        setIsFetching(true);
        setLoading(true);

        try {
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await apiService.getPlants(itemsPerPage, offset, searchTerm);

        if (response.error) {
            setError(response.error);
        } else if (response.data) {
            if ('count' in response.data && 'results' in response.data) {
            const { count, next, previous, results } = response.data;

            setTotalItems(count);
            setNextPageUrl(next);
            setPrevPageUrl(previous);

            const sorted = sortKey && sortDirection
                ? listUtils.sort(results, sortKey, sortDirection)
                : results;

            setPlants(sorted);
            } else {
            const results = Array.isArray(response.data) ? response.data : [];
            setTotalItems(results.length);
            setNextPageUrl(null);
            setPrevPageUrl(null);

            const sorted = sortKey && sortDirection
                ? listUtils.sort(results, sortKey, sortDirection)
                : results;

            setPlants(sorted);
            }

            setError(null);
        }
        } catch (err) {
        console.error('Error fetching plants:', err);
        setError('Failed to fetch plants. Check console for details.');
        } finally {
        setLoading(false);
        setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, [currentPage, searchTerm]);

    /**
     * Handles plant deletion
     * @param plantUid - Unique ID of the plant to delete
     */
    const handleDelete = async (plantUid: string) => {
        if (window.confirm('Are you sure you want to delete this plant?')) {
        const result = await apiService.deletePlant(plantUid);

        if (result.error) {
            setError("Failed to delete plant: " + result.error);
            toast.error('Failed to delete plant');
        } else {
            toast.success('Plant deleted successfully');
            fetchPlants();
        }
        }
    };

    /**
     * Handles creating a new plant
     * @param plantData - Plant data with name
     */
    const handleCreatePlant = async (plantData: { name: string }) => {
        setLoading(true);
        try {
        const response = await apiService.createPlant(plantData);

        if (response.error) {
            setError(response.error);
            toast.error('Failed to create plant');
            return;
        }

        toast.success('Plant created successfully');
        setCurrentPage(1);
        fetchPlants();
        } catch (err) {
        setError('Failed to create plant. Please try again.');
        toast.error('Error occurred during plant creation');
        } finally {
        setLoading(false);
        }
    };

  /**
   * Handles updating an existing plant
   * @param plant - The plant to update
   * @param updatedData - New plant data
   */
  const handleUpdatePlant = async (plant: SolarPlant, updatedData: { name: string }) => {
    setLoading(true);
    try {
      const response = await apiService.updatePlant(plant.uid, updatedData);

      if (response.error) {
        setError(response.error);
        toast.error('Failed to update plant');
        return;
      }

      toast.success('Plant updated successfully');
      fetchPlants();
    } catch (err) {
      setError('Failed to update plant. Please try again.');
      toast.error('Error occurred during plant update');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles sort change for the table
   * @param key - Column key to sort by
   * @param direction - Sort direction (asc/desc/null)
   */
  const handleSortChange = (key: string | null, direction: 'asc' | 'desc' | null) => {
    setSortKey(key as keyof SolarPlant | null);
    setSortDirection(direction);
    setCurrentPage(1);

    if (plants.length > 0) {
      const sorted = listUtils.sort(plants, key as keyof SolarPlant | null, direction);
      setPlants(sorted);
    }
  };

  /**
   * Handles page change for pagination
   * @param newPage - Page number to navigate to
   */
  const handlePageChange = (newPage: number) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) return;
    if (loading || isFetching) return;

    setCurrentPage(newPage);
  };

  /**
   * Handles search term changes
   * @param term - Search term
   */
  const handleSearchChange = (term: string) => {
    if (term !== searchTerm) {
      setSearchTerm(term);
      setCurrentPage(1);
    }
  };

  return {
    plants,
    loading,
    error,
    currentPage,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    sortKey,
    sortDirection,
    nextPageUrl,
    prevPageUrl,
    handleDelete,
    handleCreatePlant,
    handleUpdatePlant,
    handleSortChange,
    handlePageChange,
    handleSearchChange
  };
}

export default usePlantData;