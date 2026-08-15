import { Link, useLocation } from 'react-router-dom';
import cls from './HeaderActionsPublic.module.css';
import { Button } from '@shared/ui/Button';
import { IconButton } from '@shared/ui/icon-button';
import iconThemeDark from '@shared/assets/icons/ui/icon_theme_dark.svg';

export const HeaderActionsPublic = () => {
  const location = useLocation();

  return (
    <div className={cls.wrapper}>
      <div className={cls.settingsButtons}>
        <IconButton icon={<img src={iconThemeDark} alt="" />} aria-label="Темная тема" />
      </div>

      <div className={cls.registrationButtons}>
        <Link to="/auth/login" state={{ from: location.pathname }}>
          <Button variant="secondary">Войти</Button>
        </Link>

        <Link to="/auth/register/step-1">
          <Button variant="primary">Зарегистрироваться</Button>
        </Link>
      </div>
    </div>
  );
};
