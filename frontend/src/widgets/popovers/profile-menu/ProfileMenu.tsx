import { type FC, useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Popover } from '@shared/ui/Popover';
import { Avatar } from '@shared/ui/Avatar';
import styles from './ProfileMenu.module.css';
import clsx from 'clsx';
import IconExit from '@shared/assets/icons/ui/icon_exit.svg';

interface ProfileMenuProps {
  avatarUrl?: string;
  userName?: string;
  profilePath: string;
  onLogoutClick?: () => void;
  className?: string;
  exitIconSrc?: string;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({
  avatarUrl,
  userName,
  profilePath,
  onLogoutClick,
  className,
  exitIconSrc,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | HTMLDivElement)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const handleLogout = useCallback(() => {
    handleClose();
    onLogoutClick?.();
  }, [handleClose, onLogoutClick]);

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      const menuItems = menuItemsRef.current.filter(Boolean);
      if (menuItems.length === 0) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev < menuItems.length - 1 ? prev + 1 : 0;
            menuItems[nextIndex]?.focus();
            return nextIndex;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev > 0 ? prev - 1 : menuItems.length - 1;
            menuItems[nextIndex]?.focus();
            return nextIndex;
          });
          break;

        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          menuItems[0]?.focus();
          break;

        case 'End':
          e.preventDefault();
          setFocusedIndex(menuItems.length - 1);
          menuItems[menuItems.length - 1]?.focus();
          break;

        case 'Tab':
          if (
            (!e.shiftKey && focusedIndex === menuItems.length - 1) ||
            (e.shiftKey && focusedIndex === 0)
          ) {
            e.preventDefault();
            handleClose();
          }
          break;
      }
    },
    [isOpen, focusedIndex, handleClose],
  );

  useEffect(() => {
    if (isOpen) {
      menuItemsRef.current = [];

      const timer = setTimeout(() => {
        const menuElement = menuRef.current;
        if (menuElement) {
          const menuItems = Array.from(menuElement.querySelectorAll('[role="menuitem"]')) as (
            | HTMLAnchorElement
            | HTMLDivElement
          )[];

          if (menuItems.length > 0) {
            menuItemsRef.current = menuItems;
            menuItems[0].focus();
            setFocusedIndex(0);
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleClose]);

  return (
    <div className={clsx(styles.profileMenu, className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="profile-menu"
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          } else if (e.key === 'ArrowDown' && !isOpen) {
            e.preventDefault();
            handleToggle();
          } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            handleClose();
          }
        }}
        className={styles.triggerButton}
      >
        {userName && <span className={styles.userName}>{userName}</span>}
        <Avatar src={avatarUrl} alt="Профиль" />
      </button>

      <Popover
        isOpen={isOpen}
        onClose={handleClose}
        anchorRef={triggerRef}
        placement="bottom-end"
        role="menu"
        className={styles.menu}
      >
        <div
          ref={menuRef}
          className={styles.menuContent}
          role="menu"
          id="profile-menu"
          onKeyDown={handleMenuKeyDown}
        >
          {/* Личный кабинет */}
          <Link to={profilePath} role="menuitem" className={styles.menuItem} onClick={handleClose}>
            Личный кабинет
          </Link>

          {/* Выйти */}
          <div
            role="menuitem"
            className={styles.menuItem}
            onClick={handleLogout}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogout();
              }
            }}
          >
            <div className={styles.menuItemContent}>
              <span className={styles.menuItemText}>Выйти из аккаунта</span>
              <img
                src={exitIconSrc ?? IconExit}
                alt="иконка выйти"
                className={styles.menuItemIcon}
              />
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
};
