import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Logo.module.css';
import logoImg from '../../assets/images/common/header_logo.svg';

export interface LogoProps {
  to?: string;
  className?: string;
}

export const Logo = ({ to = '/', className }: LogoProps) => {
  return (
    <Link to={to} className={clsx(styles.logo, className)}>
      <img src={logoImg} alt="SkillSwap" className={styles.icon} />
      <span className={styles.text}>SkillSwap</span>
    </Link>
  );
};
