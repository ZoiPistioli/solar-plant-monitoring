import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatapointReport } from '@/types';

interface MonitoringDataContextType {
  datapointReports: DatapointReport[];
  filteredReports: DatapointReport[];
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  setDatapointReports: (data: DatapointReport[]) => void;
  handleSearchFilter: (searchTerm: string) => void;
}

const MonitoringDataContext = createContext<MonitoringDataContextType | undefined>(undefined);

interface MonitoringDataProviderProps {
  children: ReactNode;
}

export const MonitoringDataProvider: React.FC<MonitoringDataProviderProps> = ({ children }) => {
  const [datapointReports, setDatapointReports] = useState<DatapointReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DatapointReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFilteredReports(datapointReports);
  }, [datapointReports]);

  const handleSearchFilter = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredReports(datapointReports);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = datapointReports.filter(report => {
      if (report.day.toLowerCase().includes(lowercasedSearch)) {
        return true;
      }
      
      const energyExpected = report.total_energy_expected.toString();
      const energyObserved = report.total_energy_observed.toString();
      const irradiationExpected = report.total_irradiation_expected.toString();
      const irradiationObserved = report.total_irradiation_observed.toString();
      
      return energyExpected.includes(lowercasedSearch) ||
             energyObserved.includes(lowercasedSearch) ||
             irradiationExpected.includes(lowercasedSearch) ||
             irradiationObserved.includes(lowercasedSearch);
    });
    
    setFilteredReports(filtered);
  };

  const contextValue: MonitoringDataContextType = {
    datapointReports,
    filteredReports,
    isLoading,
    setIsLoading,
    setDatapointReports,
    handleSearchFilter
  };

  return (
    <MonitoringDataContext.Provider value={contextValue}>
      {children}
    </MonitoringDataContext.Provider>
  );
};

export const useMonitoringData = (): MonitoringDataContextType => {
  const context = useContext(MonitoringDataContext);
  if (context === undefined) {
    throw new Error('useMonitoringData must be used within a MonitoringDataProvider');
  }
  return context;
};