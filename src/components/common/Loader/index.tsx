import { LoaderProps } from '@/types';
import styles from './Loader.module.css';

const Loader = ({
    size = 'md',
    variant = 'primary',
    fullScreen = false,
    message
}: LoaderProps) => {
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