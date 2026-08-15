import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@shared/ui/icon-button';
import cls from './HeaderActionsUser.module.css';
import iconThemeDark from '@shared/assets/icons/ui/icon_theme_dark.svg';
import iconHeart from '@shared/assets/icons/ui/icon_heart.svg';
import iconBell from '@shared/assets/icons/common/icon_bell_nosize.svg';
import { NotificationsPopover } from '@widgets/popovers/notificationsPopover';
import { ProfileMenu } from '@widgets/popovers/profile-menu/ProfileMenu';
import { useAppSelector, useAppDispatch } from '@shared/lib/storeHooks';
import { logoutThunk } from '@features/auth/model/authThunks';

export const HeaderActionsUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const profileName = useAppSelector((s) => s.profile.profile.name);
  const avatarUrl = useAppSelector((s) => s.profile.profile.avatarSrc);

  const name = isAuthenticated ? profileName || 'Пользователь' : 'Гость';

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement | null>(null);

  const handleLogout = useCallback(() => {
    dispatch(logoutThunk());
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <div className={cls.wrapper}>
      <div className={cls.buttonGroup}>
        <IconButton icon={<img src={iconThemeDark} alt="" />} aria-label="Темная тема" />

        <IconButton
          ref={bellRef}
          icon={<img src={iconBell} alt="" width={24} height={24} />}
          aria-label="Уведомления"
          onClick={() => setIsNotificationsOpen((prev) => !prev)}
          isActive={isNotificationsOpen}
        />

        <IconButton icon={<img src={iconHeart} alt="" />} aria-label="Избранное" />
      </div>

      <div className={cls.profile}>
        <ProfileMenu
          userName={name}
          avatarUrl={avatarUrl}
          profilePath="/profile"
          onLogoutClick={handleLogout}
          className={cls.profileMenu}
        />
      </div>

      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        anchorRef={bellRef}
      />
    </div>
  );
};
