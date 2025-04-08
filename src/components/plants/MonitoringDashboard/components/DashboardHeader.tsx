import { CalendarDays } from 'lucide-react';
import { DateRangeState } from '@/types';
import DateRangeSelector from './DateRangeSelector';
import { getDateRangeDisplay } from '@/utils/dateUtils';
import styles from '../MonitoringDashboardContent/MonitoringDashboardContent.module.css';

interface DashboardHeaderProps {
  plantId: string | null;
  plantName: string | null;
  dateRange: DateRangeState[];
  handleSelect: (ranges: { [key: string]: any }) => void;
  handleUpdateDatapoints: (onClose: () => void) => Promise<void>;
}

const DashboardHeader = ({
  plantId,
  plantName,
  dateRange,
  handleSelect,
  handleUpdateDatapoints
}: DashboardHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>
          Monitoring - {plantName || ''}
        </h1>
        <DateRangeSelector
          dateRange={dateRange}
          handleSelect={handleSelect}
          handleUpdateDatapoints={handleUpdateDatapoints}
        />
      </div>
      <div className={styles.titleRow}>
        {plantId && <span className={styles.plantIdStyle}>{plantId}</span>}
        {dateRange[0]?.startDate && dateRange[0]?.endDate && (
          <div className={styles.reportRangeRow}>
            <CalendarDays size={18} className={styles.calendarIcon} />
            <span className={styles.reportRange}>
              {getDateRangeDisplay(dateRange[0].startDate, dateRange[0].endDate)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;