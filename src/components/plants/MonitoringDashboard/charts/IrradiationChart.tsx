import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { useMonitoringData } from '@/context/MonitoringDataContext';
import { DatapointReport } from '@/types';
import styles from './IrradiationChart.module.css';

interface IrradiationChartProps {
  height?: number;
}

const IrradiationChart: React.FC<IrradiationChartProps> = ({ height = 400 }) => {
  const { filteredReports: data } = useMonitoringData();

  if (!data || data.length === 0) {
    return <div className={styles.noData}>No irradiation data available to display</div>;
  }

  const avgExpected = data.reduce(
    (acc: number, item: DatapointReport) => acc + item.total_irradiation_expected,
    0
  ) / data.length;

  const avgObserved = data.reduce(
    (acc: number, item: DatapointReport) => acc + item.total_irradiation_observed,
    0
  ) / data.length;

  const ratio = avgExpected > 0 ? (avgObserved / avgExpected) * 100 : 0;

  return (
    <>
      <h3 className={styles.chartTitle}>Solar Irradiation</h3>

      <div className={styles.metrics}>
        <div className={`${styles.metricCard} ${styles.amber}`}>
          <p className={styles.metricLabel}>Avg Expected</p>
          <p className={styles.metricValue}>{avgExpected.toFixed(2)} W/m²</p>
        </div>
        <div className={`${styles.metricCard} ${styles.orange}`}>
          <p className={styles.metricLabel}>Avg Observed</p>
          <p className={styles.metricValue}>{avgObserved.toFixed(2)} W/m²</p>
        </div>
        <div className={`${styles.metricCard} ${styles.ratio}`}>
          <p className={styles.metricLabel}>Irradiation Ratio</p>
          <p className={styles.metricValue}>{ratio.toFixed(2)}%</p>
        </div>
      </div>

      <div style={{ height: `${height}px` }} className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
            <XAxis
              dataKey="day"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: 'Irradiation (W/m²)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="total_irradiation_expected"
              stroke="#ffc658"
              name="Irradiation Expected"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="total_irradiation_observed"
              stroke="#ff7300"
              strokeWidth={2}
              name="Irradiation Observed"
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#ff7300', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default IrradiationChart;
