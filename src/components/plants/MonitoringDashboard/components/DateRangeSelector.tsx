import { useEffect, useState } from 'react';
import ModalButton from "@/components/common/Modal/ModalButton";
import { CirclePlus } from 'lucide-react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import styles from '../MonitoringDashboardContent/MonitoringDashboardContent.module.css';
import { DateRangeSelectorProps } from '@/types';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const DateRangeSelector = ({ 
    dateRange, 
    handleSelect, 
    handleUpdateDatapoints 
}: DateRangeSelectorProps) => {
    const isMobile = useMediaQuery(768);
    const [sizeMobile, setSizeMobile] = useState(isMobile);

    useEffect(() => {
        setSizeMobile(isMobile);
    }, [isMobile]);

    return (
        <ModalButton
            buttonLabel="Choose Date Range"
            modalTitle="Select Date Range"
            icon={<CirclePlus size={20} className={styles.buttonIcon} />}
            buttonClassName={styles.menuButton}
            size={sizeMobile ? "medium" : "xlarge"}
        >
            {({ onClose }) => (
                <div
                    className={sizeMobile ? styles.mobileContainer : ''}
                    style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}
                >
                    <DateRangePicker
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        months={sizeMobile ? 1 : 2}
                        ranges={dateRange}
                        direction={sizeMobile ? "vertical" : "horizontal"}
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