import { Outlet, useNavigate } from 'react-router-dom';
import styles from './AuthLayout.module.css';
import CloseIcon from '@shared/assets/icons/ui/icon_close.svg';
import { Logo } from '@shared/ui/Logo';
import { Button } from '@shared/ui/Button';

export const AuthLayout = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Logo />
          <Button
            type="button"
            variant="ghost"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Закрыть"
          >
            Закрыть
            <img src={CloseIcon} alt="" aria-hidden="true" className={styles.icon} />
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
