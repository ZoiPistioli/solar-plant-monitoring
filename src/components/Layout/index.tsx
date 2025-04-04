import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;