import React from 'react';
import { Modal } from '@shared/ui/Modal/Modal';
import { Button } from '@shared/ui/Button/Button';
import NosizeIcon from '@shared/assets/icons/common/icon_bell_nosize_new.svg';
import styles from './OfferPreviewModal.module.css';

export interface OfferPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfferPreviewModal: React.FC<OfferPreviewModalProps> = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <img src={NosizeIcon} alt="" aria-hidden="true" className={styles.icon} />
        </div>

        <h2 className={styles.title}>Вы предложили обмен</h2>

        <p className={styles.description}>Теперь дождитесь подтверждения. Вам придёт уведомление</p>

        <div className={styles.buttonWrapper}>
          <Button fullWidth onClick={handleClose}>
            Готово
          </Button>
        </div>
      </div>
    </Modal>
  );
};
