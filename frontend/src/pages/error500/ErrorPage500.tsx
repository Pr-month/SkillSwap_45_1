import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button/Button';
import styles from './ErrorPage500.module.css';
import errorImage from '@shared/assets/images/error/error_500.svg';

export const ErrorPage500 = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.imageWrapper}>
        <img src={errorImage} alt="На сервере произошла ошибка" className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>На сервере произошла ошибка</h2>
          <p className={styles.description}>Попробуйте позже или вернитесь на главную страницу</p>
        </div>
        <div className={styles.buttons}>
          <Button className={styles.button} variant="secondary">
            Сообщить об ошибке
          </Button>
          <Button className={styles.button} variant="primary" onClick={handleGoHome}>
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
};
