import DataTable from '@/components/common/DataTable';
import { DatapointReport, DataReportTableProps } from '@/types';
import { useMonitoringData } from '@/context/MonitoringDataContext';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import styles from './DataReportTable.module.css';

function DataReportTable({ onSearchChange }: DataReportTableProps) {
  const { filteredReports, isLoading } = useMonitoringData();

  const getDiffBadge = (diff: number) => {
    const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus;
    const badgeClass =
      diff > 0
        ? `${styles.badge} ${styles.badgeUp}`
        : diff < 0
        ? `${styles.badge} ${styles.badgeDown}`
        : `${styles.badge} ${styles.badgeEqual}`;

    return (
      <span className={badgeClass}>
        <Icon size={12} />
        {Math.abs(diff).toFixed(2)}
      </span>
    );
  };

  const columns = [
    {
      key: 'day',
      header: 'Date',
      sortable: true
    },
    {
      key: 'total_energy_expected',
      header: 'Energy Expected',
      sortable: true,
      render: (item: DatapointReport) => (
        <span style={{ fontWeight: 600 }}>
          {item.total_energy_expected.toFixed(2)}
        </span>
      )
    },
    {
      key: 'total_energy_observed',
      header: 'Energy Observed',
      sortable: true,
      render: (item: DatapointReport) => {
        const diff = item.total_energy_observed - item.total_energy_expected;
        return (
          <div className={styles.valueWithBadge}>
            <span>{item.total_energy_observed.toFixed(2)}</span>
            {getDiffBadge(diff)}
          </div>
        );
      }
    },
    {
      key: 'total_irradiation_expected',
      header: 'Irradiation Expected',
      sortable: true,
      render: (item: DatapointReport) => (
        <span style={{ fontWeight: 600 }}>
          {item.total_irradiation_expected.toFixed(2)}
        </span>
      )
    },
    {
      key: 'total_irradiation_observed',
      header: 'Irradiation Observed',
      sortable: true,
      render: (item: DatapointReport) => {
        const diff =
          item.total_irradiation_observed - item.total_irradiation_expected;
        return (
          <div className={styles.valueWithBadge}>
            <span>{item.total_irradiation_observed.toFixed(2)}</span>
            {getDiffBadge(diff)}
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <DataTable
        data={filteredReports}
        columns={columns}
        keyExtractor={(item) => item.day}
        searchFields={['day']}
        onSearchChange={onSearchChange}
        isLoading={isLoading}
        itemsPerPage={10}
        serverSidePagination={false}
      />
    </div>
  );
}

export default DataReportTable;