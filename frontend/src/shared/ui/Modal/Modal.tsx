import { type FC, type ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string; // className, чтобы конкретные модалки задавали свои max-width/padding
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    console.error("Элемент с id 'modal-root' не найден в DOM");
    return null;
  }

  // Поведение shared: блокируем скролл страницы, пока модалка открыта
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Поведение shared: закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose} data-testid="modal-overlay">
      <div
        className={`${styles.modal} ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    modalRoot,
  );
};
