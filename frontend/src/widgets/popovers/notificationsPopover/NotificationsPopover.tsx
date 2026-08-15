import { type FC, type RefObject } from 'react';
import { Popover } from '@shared/ui/Popover';
import { Button } from '@shared/ui/Button';
import iconLightbulb from '@shared/assets/icons/common/icon_lightbulb_nosize.svg';
import styles from './NotificationsPopover.module.css';

export interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  hasNew?: boolean;
  offsetX?: number;
  offsetY?: number;
}

export const NotificationsPopover: FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  anchorRef,
  hasNew = true,
}) => {
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      anchorRef={anchorRef}
      className={styles.root}
      offsetX={-250}
      offsetY={20}
    >
      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.title}>Новые уведомления</h4>
          <button type="button" className={styles.headerAction}>
            Прочитать все
          </button>
        </div>

        {hasNew ? (
          <ul className={styles.list}>
            <li className={styles.item}>
              <img className={styles.itemIcon} src={iconLightbulb} alt="" aria-hidden="true" />
              <div className={styles.itemBody}>
                <div className={styles.itemTop}>
                  <p className={styles.itemText}>Николай принял ваш обмен</p>
                  <span className={styles.itemDate}>сегодня</span>
                </div>
                <p className={styles.itemSubtext}>Перейдите в профиль, чтобы обсудить детали</p>
              </div>
              <div className={styles.itemActions}>
                <Button variant="primary" className={styles.itemButton}>
                  Перейти
                </Button>
              </div>
            </li>

            <li className={styles.item}>
              <img className={styles.itemIcon} src={iconLightbulb} alt="" aria-hidden="true" />
              <div className={styles.itemBody}>
                <div className={styles.itemTop}>
                  <p className={styles.itemText}>Татьяна предлагает вам обмен</p>
                  <span className={styles.itemDate}>сегодня</span>
                </div>
                <p className={styles.itemSubtext}>Примите обмен, чтобы обсудить детали</p>
              </div>
            </li>
          </ul>
        ) : (
          <p className={styles.empty}>Новых уведомлений нет</p>
        )}

        <div className={styles.sectionHeader}>
          <h4 className={styles.title}>Просмотренные</h4>
          <button type="button" className={styles.headerAction}>
            Очистить
          </button>
        </div>

        <ul className={styles.list}>
          <li className={styles.item}>
            <img className={styles.itemIcon} src={iconLightbulb} alt="" aria-hidden="true" />
            <div className={styles.itemBody}>
              <div className={styles.itemTop}>
                <p className={styles.itemText}>Олег предлагает вам обмен</p>
                <span className={styles.itemDate}>вчера</span>
              </div>
              <p className={styles.itemSubtext}>Примите обмен, чтобы обсудить детали</p>
            </div>
          </li>

          <li className={styles.item}>
            <img className={styles.itemIcon} src={iconLightbulb} alt="" aria-hidden="true" />
            <div className={styles.itemBody}>
              <div className={styles.itemTop}>
                <p className={styles.itemText}>Игорь принял ваш обмен</p>
                <span className={styles.itemDate}>23 мая</span>
              </div>
              <p className={styles.itemSubtext}>Перейдите в профиль, чтобы обсудить детали</p>
            </div>
          </li>
        </ul>
      </div>
    </Popover>
  );
};
