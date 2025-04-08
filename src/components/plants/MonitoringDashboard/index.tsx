import React from 'react';
import { MonitoringDataProvider } from '@/context/MonitoringDataContext';
import { MonitoringDashboardProps } from '@/types';
import MonitoringDashboardContent from './MonitoringDashboardContent';

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ plantId, plantName }) => {
  return (
    <MonitoringDataProvider>
      <MonitoringDashboardContent
        plantId={plantId}
        plantName={plantName}
      />
    </MonitoringDataProvider>
  );
};

export default MonitoringDashboard;