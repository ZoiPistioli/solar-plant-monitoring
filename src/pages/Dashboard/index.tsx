import Card from '@/components/common/Card';
import styles from './Dashboard.module.css';
import { ArrowRight, BarChart2, Bolt, Settings, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/solar-panel-plants');
  };

  return (
    <Card>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            <Zap className={styles.logoIcon} /> Solar Monitoring Made Simple
          </h1>
          <p className={styles.subtitle}>
            Track energy performance, system health, and solar output in real-time.
          </p>
          <button className={styles.button} onClick={handleGetStarted}>
            Get Started
            <ArrowRight className={styles.buttonArrow} />
          </button>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <BarChart2 className={styles.icon} />
            <h3>Real-Time Charts</h3>
            <p>Visualize energy production and irradiation effortlessly.</p>
          </div>
          <div className={styles.feature}>
            <Bolt className={styles.icon} />
            <h3>Performance Metrics</h3>
            <p>Monitor expected vs. observed output and performance ratios.</p>
          </div>
          <div className={styles.feature}>
            <Settings className={styles.icon} />
            <h3>System Status</h3>
            <p>Stay updated with system health, alerts, and activity logs.</p>
          </div>
        </section>
      </div>
    </Card>
  );
};

export default Dashboard;
