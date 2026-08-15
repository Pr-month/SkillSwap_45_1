import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '@shared/ui/Modal/Modal';
import { Button } from '@shared/ui/Button/Button';
import PersonalIcon from '@shared/assets/icons/common/icon_person_circle_nosize.svg';
import styles from './OfferLoginModal.module.css';

export interface OfferLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfferLoginModal: React.FC<OfferLoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    onClose();
  };

  const handleLogin = () => {
    onClose();
    navigate('/auth/login', { state: { from: location.pathname } });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <img src={PersonalIcon} alt="" aria-hidden="true" className={styles.icon} />
        </div>

        <h2 className={styles.title}>Пожалуйста, войдите в аккаунт</h2>

        <p className={styles.description}>
          Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками c другими людьми
        </p>

        <div className={styles.containerButton}>
          <div className={styles.buttonWrapper}>
            <Button fullWidth onClick={handleClose} variant="secondary">
              Отмена
            </Button>
          </div>
          <div className={styles.buttonWrapper}>
            <Button fullWidth onClick={handleLogin} variant="primary">
              Войти
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
