import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import { useMonitoringData } from '@/context/MonitoringDataContext';
import { DatapointReport } from '@/types';
import styles from './EnergyChart.module.css';

const EnergyChart = ({ height = 400 }) => {
  const { filteredReports: data } = useMonitoringData();
  
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No energy data available to display</div>;
  }

  const avgExpectedEnergy = data.reduce(
    (acc: number, item: DatapointReport) => acc + item.total_energy_expected, 
    0
  ) / data.length;

  const totalExpected = data.reduce(
    (acc: number, item: DatapointReport) => acc + item.total_energy_expected, 
    0
  );

  const totalObserved = data.reduce(
    (acc: number, item: DatapointReport) => acc + item.total_energy_observed, 
    0
  );

  const performanceRatio = totalExpected > 0 
    ? (totalObserved / totalExpected) * 100 
    : 0;

  const ratioColor = performanceRatio >= 95
    ? styles.green
    : performanceRatio >= 85
    ? styles.yellow
    : styles.red;

  return (
    <>
      <h3 className={styles.chartTitle}>Energy Production</h3>

      <div className={styles.metrics}>
        <div className={`${styles.metricCard} ${styles.blue}`}>
          <p className={styles.metricLabel}>Expected Total</p>
          <p className={styles.metricValue}>{totalExpected.toFixed(2)} kWh</p>
        </div>
        <div className={`${styles.metricCard} ${styles.green}`}>
          <p className={styles.metricLabel}>Observed Total</p>
          <p className={styles.metricValue}>{totalObserved.toFixed(2)} kWh</p>
        </div>
        <div className={`${styles.metricCard} ${ratioColor}`}>
          <p className={styles.metricLabel}>Performance Ratio</p>
          <p className={styles.metricValue}>{performanceRatio.toFixed(2)}%</p>
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
              label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="total_energy_expected"
              stroke="#8884d8"
              name="Energy Expected"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="total_energy_observed"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Energy Observed"
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2 }}
            />
            <ReferenceLine
              y={avgExpectedEnergy}
              stroke="#8884d8"
              strokeDasharray="3 3"
              label={{ value: 'Avg Expected', position: 'insideTopRight' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default EnergyChart;
