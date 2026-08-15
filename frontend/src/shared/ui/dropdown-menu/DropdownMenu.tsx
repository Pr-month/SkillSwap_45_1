import { type FC, type ReactNode, useEffect, useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styles from './DropdownMenu.module.css';

export interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  children?: ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  matchWidth?: boolean;
  className?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  anchorRef,
  children,
  placement = 'bottom-start',
  matchWidth = true,
  className = '',
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const portalRoot = useMemo(() => {
    let root = document.getElementById('popover-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'popover-root';
      document.body.appendChild(root);
    }
    return root;
  }, []);

  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const anchorRect = anchorRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const width = matchWidth ? anchorRect.width : 0;

    switch (placement) {
      case 'bottom-start':
        top = anchorRect.bottom + window.scrollY;
        left = anchorRect.left + window.scrollX;
        break;
      case 'bottom-end':
        top = anchorRect.bottom + window.scrollY;
        left = anchorRect.right + window.scrollX - (matchWidth ? anchorRect.width : 0);
        break;
      case 'top-start':
        top = anchorRect.top + window.scrollY;
        left = anchorRect.left + window.scrollX;
        break;
      case 'top-end':
        top = anchorRect.top + window.scrollY;
        left = anchorRect.right + window.scrollX - (matchWidth ? anchorRect.width : 0);
        break;
      default:
        top = anchorRect.bottom + window.scrollY;
        left = anchorRect.left + window.scrollX;
    }

    setPosition({ top, left, width });
  }, [isOpen, anchorRef, placement, matchWidth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const dropdownStyles: React.CSSProperties = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
  };

  if (matchWidth && position.width > 0) {
    dropdownStyles.width = `${position.width}px`;
  }

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className={`${styles.dropdownMenu} ${className}`}
      style={dropdownStyles}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>,
    portalRoot,
  );
};
