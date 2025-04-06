import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'primary' | 'secondary';
    fullScreen?: boolean;
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    variant = 'primary',
    fullScreen = false,
    message
}) => {
    const loaderClasses = [
        styles.loader,
        styles[size],
        styles[variant],
        fullScreen ? styles.fullScreen : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={loaderClasses}>
            <div className={styles.loaderContainer}>
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner}></div>
                </div>
                {message && (
                    <p className={styles.message}>{message}</p>
                )}
            </div>
        </div>
    );
};

export default Loader;