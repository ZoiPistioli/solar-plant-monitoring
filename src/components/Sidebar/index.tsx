import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { Zap, Menu, X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery(768);
  
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  return (
    <>
      <div className={styles.mobileHeader}>
        <div className={styles.logoContainer}>
          <Zap className={styles.logoIcon} />
          <h1 className={styles.logoTitle}>Solar Manager</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={styles.toggleButton}
        >
          {isOpen ? (
            <X className={styles.toggleIcon} />
          ) : (
            <Menu className={styles.toggleIcon} />
          )}
        </button>
      </div>
      
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.desktopLogo}>
          <Zap className={styles.desktopLogoIcon} />
          <h1 className={styles.desktopLogoTitle}>SPP MANAGER</h1>
        </div>
        
        <nav className={styles.navigation}>
          {Object.entries(ROUTES).map(([key, route]) => {
            const isActive = route.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(route.path);
            return (
              <div 
                key={key}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Link
                  to={route.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <div className={`${styles.navIcon} ${isActive ? styles.navIconActive : ''}`}>
                    {React.cloneElement(route.icon, {})}
                  </div>
                  <span className={`${styles.navLabel} ${isActive ? styles.navLabelActive : ''}`}>
                    {route.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;