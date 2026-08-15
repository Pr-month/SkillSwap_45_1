import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import styles from './ProfileSidebar.module.css';
import clsx from 'clsx';
import SvgIconEnvelope from '@shared/assets/icons/common/icon_request.svg';
import SvgIconChat from '@shared/assets/icons/common/icon_speech.svg';
import SvgIconHeart from '@shared/assets/icons/ui/icon_heart.svg';
import SvgIconBulb from '@shared/assets/icons/common/icon_lightbulb_nosize.svg';
import SvgIconUser from '@shared/assets/icons/common/icon_person.svg';
import { Button } from '@shared/ui/Button';
import stylesButton from '@shared/ui/Button/Button.module.css';

export const ProfileSidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    location.pathname === '/profile/favorites' ? 'Избранное' : 'Личные данные',
  );

  const handleButtonClick = (item: string) => () => {
    setActiveItem(item);
  };

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Button
            variant="ghost"
            className={clsx(styles.menuButton, activeItem === 'Заявки' && styles.active)}
            onClick={handleButtonClick('Заявки')}
          >
            <img src={SvgIconEnvelope} className={styles.icon} alt="Заявки" />
            <span>Заявки</span>
          </Button>
        </li>

        <li className={styles.menuItem}>
          <Button
            variant="ghost"
            className={clsx(styles.menuButton, activeItem === 'Мои обмены' && styles.active)}
            onClick={handleButtonClick('Мои обмены')}
          >
            <img src={SvgIconChat} className={styles.icon} alt="Мои обмены" />
            <span>Мои обмены</span>
          </Button>
        </li>

        <li className={styles.menuItem} onClick={handleButtonClick('Избранное')}>
          <NavLink
            to="/profile/favorites"
            className={() =>
              clsx(
                styles.menuButton,
                stylesButton.button,
                stylesButton.ghost,
                activeItem === 'Избранное' && styles.active,
              )
            }
          >
            <img src={SvgIconHeart} className={styles.icon} alt="Избранное" />
            <span>Избранное</span>
          </NavLink>
        </li>

        <li className={styles.menuItem}>
          <Button
            variant="ghost"
            className={clsx(styles.menuButton, activeItem === 'Мои навыки' && styles.active)}
            onClick={handleButtonClick('Мои навыки')}
          >
            <img src={SvgIconBulb} className={styles.icon} alt="Мои навыки" />
            <span>Мои навыки</span>
          </Button>
        </li>

        <li className={styles.menuItem} onClick={handleButtonClick('Личные данные')}>
          <NavLink
            to="/profile"
            className={() =>
              clsx(
                styles.menuButton,
                stylesButton.button,
                stylesButton.ghost,
                activeItem === 'Личные данные' && styles.active,
              )
            }
          >
            <img src={SvgIconUser} className={styles.icon} alt="Личные данные" />
            <span>Личные данные</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
