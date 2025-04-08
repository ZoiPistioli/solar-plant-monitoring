import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiService } from '@/services/apiService';
import { 
  formatDate, 
  getMonthsInRange,
  filterDataByDateRange 
} from '@/utils/dateUtils';
import { DataReportRequest, UseDataFetchingProps } from '@/types';

/**
 * Custom hook for fetching and managing solar plant data reports
 * @param props - Configuration for the data fetching hook
 * @returns Object containing data state and methods to manage data
 */
export const useDataFetching = ({
  plantId, 
  dateRange, 
  setDatapointReports, 
  setIsLoading
}: UseDataFetchingProps) => {
  const [dataState, setDataState] = useState<'initial' | 'loading' | 'empty' | 'loaded'>('initial');
  const [hasAutoUpdated, setHasAutoUpdated] = useState(false);

  /**
   * Fetches datapoint reports for the selected plant and date range
   * Automatically triggers data updates if no data is available
   */
  const fetchDatapointReport = useCallback(async () => {
    if (!plantId) {
      toast.error('No plant ID available');
      setDataState('empty');
      setIsLoading(false);
      return;
    }

    setDataState('loading');
    setIsLoading(true);
    
    try {
      const startDate = dateRange[0].startDate;
      const endDate = dateRange[0].endDate;

      if (!startDate || !endDate) {
        toast.error('Invalid date range');
        setDataState('empty');
        setIsLoading(false);
        return;
      }

      const months = getMonthsInRange(startDate, endDate);
      let allData: any[] = [];

      for (const month of months) {
        const reportParams: DataReportRequest = {
          plant_id: plantId,
          date: formatDate(month)
        };

        const response = await apiService.getDataReport(reportParams);

        if (response.error) {
          console.error('Error from report API:', response.error);
          continue;
        }

        if (Array.isArray(response.data)) {
          allData = [...allData, ...response.data];
        }
      }

      const filtered = filterDataByDateRange(allData, startDate, endDate);

      if (filtered.length > 0) {
        setDatapointReports(filtered);
        setHasAutoUpdated(false);
        setDataState('loaded');
      } else if (!hasAutoUpdated && allData.length === 0) {
        setHasAutoUpdated(true);

        for (const month of months) {
          const requestBody = {
            from_date: formatDate(month),
            to_date: formatDate(month),
            plant_id: plantId
          };

          try {
            await apiService.updateData(requestBody);
          } catch (err) {
            console.error('Auto update failed for:', month, err);
          }
        }

        setTimeout(() => {
          fetchDatapointReport();
        }, 1000);
        return;
      } else {
        setDatapointReports([]);
        setDataState('empty');
      }
    } catch (error) {
      console.error('Unexpected error retrieving datapoint report:', error);
      toast.error('Unexpected error retrieving datapoint report');
      setDatapointReports([]);
      setDataState('empty');
    } finally {
      setIsLoading(false);
    }
  }, [plantId, dateRange, setDatapointReports, setIsLoading, hasAutoUpdated]);

  /**
   * Manually triggers a data update for the selected date range
   * @param onClose - Callback function to close any modal/popup after update
   */
  const handleUpdateDatapoints = useCallback(async (onClose: () => void) => {
    if (!plantId) {
      toast.error('No plant ID available');
      return;
    }

    try {
      const startDate = dateRange[0].startDate;
      const endDate = dateRange[0].endDate;

      if (!startDate || !endDate) {
        toast.error('Invalid date range');
        return;
      }

      setDataState('loading');
      setIsLoading(true);

      const months = getMonthsInRange(startDate, endDate);
      const loadingToast = toast.loading('Updating datapoints...');

      for (const month of months) {
        const requestBody = {
          from_date: formatDate(month),
          to_date: formatDate(month),
          plant_id: plantId
        };

        try {
          await apiService.updateData(requestBody);
        } catch (err) {
          console.error('Update error for month:', month, err);
        }
      }

      toast.dismiss(loadingToast);
      toast.success('Datapoints updated for selected range');
      onClose();

      setTimeout(() => {
        fetchDatapointReport();
      }, 1000);
    } catch (err) {
      toast.error('Unexpected error updating datapoints');
      setDataState('empty');
      setIsLoading(false);
    }
  }, [plantId, dateRange, fetchDatapointReport, setIsLoading]);

  /**
   * Automatically fetches data when plantId changes
   * Includes debounce to prevent excessive API calls
   */
  useEffect(() => {
    if (plantId) {
      setDataState('loading');
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        fetchDatapointReport();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [plantId, fetchDatapointReport, setIsLoading]);

  return {
    dataState,
    fetchDatapointReport,
    handleUpdateDatapoints
  };
};