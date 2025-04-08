import ModalButton from "@/components/common/Modal/ModalButton";
import { CirclePlus } from 'lucide-react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import styles from '../MonitoringDashboardContent/MonitoringDashboardContent.module.css';
import { DateRangeSelectorProps } from '@/types';

const DateRangeSelector = ({ 
    dateRange, 
    handleSelect, 
    handleUpdateDatapoints 
}: DateRangeSelectorProps) => {
    return (
        <ModalButton
            buttonLabel="Choose Date Range"
            modalTitle="Select Date Range"
            icon={<CirclePlus size={20} className={styles.buttonIcon} />}
            buttonClassName={styles.menuButton}
            size="xlarge"
        >
            {({ onClose }) => (
                <div>
                    <DateRangePicker
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={dateRange}
                        direction="horizontal"
                        rangeColors={['#3d91ff', '#3ecf8e', '#fed14c']}
                    />
                    <button
                        onClick={() => handleUpdateDatapoints(onClose)}
                        className={styles.button}
                    >
                        Update Datapoints
                    </button>
                </div>
            )}
        </ModalButton>
    );
};

export default DateRangeSelector;