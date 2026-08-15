import { type FC, type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './Popover.module.css';

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  placement?: 'bottom-start' | 'bottom-end';
  className?: string;
  role?: React.AriaRole;
  offsetX?: number;
  offsetY?: number;
}

export const Popover: FC<PopoverProps> = ({
  isOpen,
  onClose,
  anchorRef,
  children,
  placement = 'bottom-start',
  className,
  role = 'dialog',
  offsetX = 0,
  offsetY = 8,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !anchorRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!anchorRef.current) return;

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const top = anchorRect.bottom + offsetY;
      let left = 0;

      if (placement === 'bottom-start') {
        left = anchorRect.left + offsetX;
      } else if (placement === 'bottom-end') {
        left = anchorRect.right + offsetX;
      }

      setPosition({ top, left });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, anchorRef, placement, offsetX, offsetY]);

  // Обработка клика вне панели
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose, anchorRef]);

  // Обработка Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  const popoverRoot = document.getElementById('popover-root');
  if (!popoverRoot) {
    console.error("Элемент с id 'popover-root' не найден в DOM");
    return null;
  }

  return createPortal(
    <div
      ref={popoverRef}
      className={clsx(
        styles.popover,
        placement === 'bottom-end' && styles.placementBottomEnd,
        className,
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role={role}
      aria-modal="false"
    >
      {children}
    </div>,
    popoverRoot,
  );
};
