import EnergyChart from './EnergyChart';
import IrradiationChart from './IrradiationChart';
import { useMonitoringData } from '@/context/MonitoringDataContext';
import styles from './Charts.module.css'; 
import Card from '@/components/common/Card';

const ChartSection = () => {
  const { filteredReports } = useMonitoringData();

  if (!filteredReports || filteredReports.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No data available to display charts.</p>
        <p>Please select a date range and update datapoints.</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <Card>
            <EnergyChart height={300} />
          </Card>
        </div>
        <div className={styles.chartCard}>
          <Card>
            <IrradiationChart height={300} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
