import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/components/common/Modal';
import { ModalButtonProps } from '@/types/components';

const ModalButton = ({
    buttonLabel,
    modalTitle,
    icon = <Plus size={20} />,
    buttonClassName = '',
    children,
    size = 'medium' 
}: ModalButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const renderChildren = () => {
        if (typeof children === 'function') {
            return children({ onClose: handleCloseModal });
        }
        return children;
    };

    return (
        <>
            <button
                className={`modalButton ${buttonClassName}`}
                onClick={handleOpenModal}
            >
                {icon}
                <span>{buttonLabel}</span>
            </button>

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={modalTitle}
                    size={size} 
                >
                    {renderChildren()}
                </Modal>
            )}
        </>
    );
};

export default ModalButton;