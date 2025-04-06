import { useState, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/components/common/Modal';

interface ModalButtonProps {
  buttonLabel?: string;
  modalTitle: string;
  icon?: ReactNode;
  buttonClassName?: string;
  children: (props: { onClose: () => void }) => ReactNode;
}

const ModalButton = ({
  buttonLabel,
  modalTitle,
  icon = <Plus size={20} />,
  buttonClassName = '',
  children
}: ModalButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
        >
          {children({ onClose: handleCloseModal })}
        </Modal>
      )}
    </>
  );
};

export default ModalButton;