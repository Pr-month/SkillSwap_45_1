import type { FC, CSSProperties } from 'react';
import styles from './SkillPlate.module.css';
import clsx from 'clsx';

export type TSkillPlateVariant = 'default' | 'count';
type SkillPlateStyleVars = CSSProperties & {
  ['--skill-plate-bg']?: string;
};

export type TSkillPlateProps = {
  text: string;
  variant?: TSkillPlateVariant;
  className?: string;
  colorVar?: string;
};

export const SkillPlate: FC<TSkillPlateProps> = ({
  text,
  variant = 'default',
  className,
  colorVar,
}) => {
  // Формируем строку классов
  const combinedClassName = clsx(
    styles.skillPlate,
    styles[variant], // Добавляем класс для варианта
    className,
  );

  const style: SkillPlateStyleVars | undefined =
    variant === 'default' && colorVar ? { '--skill-plate-bg': `var(${colorVar})` } : undefined;

  return (
    <span className={combinedClassName} style={style}>
      {variant === 'count' ? `+${text}` : text}
    </span>
  );
};
