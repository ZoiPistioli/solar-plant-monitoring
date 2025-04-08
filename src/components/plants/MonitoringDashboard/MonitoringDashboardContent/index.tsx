import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Range } from 'react-date-range';

import { useMonitoringData } from '@/context/MonitoringDataContext';
import { 
  createCurrentMonthToTodayRange, 
  adjustDateRange,
  applyCurrentMonthLogic,
  isCurrentMonth
} from '@/utils/dateUtils';

import { DateRangeState, SolarPlant } from '@/types';
import ChartSection from '@/components/plants/MonitoringDashboard/charts';
import { useDataFetching } from '@/hooks/useDataFetching';
import DashboardHeader from '../components/DashboardHeader';
import { DataStateRenderer } from '../components/DataStateRenderer';
import DataReportTable from '../components/DataReportTable';

const MonitoringDashboardContent = ({
  plantId,
  plantName
}: {
  plantId: SolarPlant['uid'] | null;
  plantName: SolarPlant['name'] | null;
}) => {
  const {
    setDatapointReports,
    handleSearchFilter,
    setIsLoading,
  } = useMonitoringData();

  const [dateRange, setDateRange] = useState<DateRangeState[]>(() => [createCurrentMonthToTodayRange()]);

  const { 
    dataState, 
    fetchDatapointReport, 
    handleUpdateDatapoints 
  } = useDataFetching({
    plantId, 
    dateRange, 
    setDatapointReports, 
    setIsLoading
  });

  const handleSelect = (ranges: { [key: string]: Range }) => {
    const selectedRange = ranges['selection'] as DateRangeState;
    if (!selectedRange.startDate || !selectedRange.endDate) return;

    const startDate = new Date(selectedRange.startDate);
    const endDate = new Date(selectedRange.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const { startDate: adjustedStartDate, endDate: adjustedEndDate } = adjustDateRange(startDate, endDate);
    
    const finalRange = isCurrentMonth(adjustedStartDate, adjustedEndDate)
      ? applyCurrentMonthLogic(adjustedStartDate, adjustedEndDate)
      : { startDate: adjustedStartDate, endDate: adjustedEndDate };

    setDateRange([{
      ...selectedRange,
      startDate: finalRange.startDate,
      endDate: finalRange.endDate
    }]);
  };

  const handleSearchChange = (term: string) => {
    handleSearchFilter(term);
  };
  
  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <DashboardHeader
        plantId={plantId}
        plantName={plantName}
        dateRange={dateRange}
        handleSelect={handleSelect}
        handleUpdateDatapoints={handleUpdateDatapoints}
      />

      <DataStateRenderer 
        dataState={dataState} 
        dateRange={dateRange}
        onRetry={fetchDatapointReport}
      >
        <div className="p-4">
          <ChartSection />
          <DataReportTable onSearchChange={handleSearchChange} />
        </div>
      </DataStateRenderer>
    </div>
  );
};

export default MonitoringDashboardContent;