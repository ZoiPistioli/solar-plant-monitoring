import { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { ModalProps } from '@/types';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium'
}: ModalProps) => {
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return styles.modalSmall;
            case 'large':
                return styles.modalLarge;
            case 'xlarge':
                return styles.modalXLarge;
            default:
                return styles.modalMedium;
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={`${styles.modalContent} ${getSizeClass()}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;