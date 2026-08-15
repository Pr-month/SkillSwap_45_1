import cls from './HeaderBase.module.css';
import { Logo } from '@shared/ui/Logo';
import { useRef, useState } from 'react';
import { SkillsCatalogPopover } from '@widgets/popovers/skills-catalog-popover';
import arrowDownIcon from '@shared/assets/icons/ui/icon_arrow_down.svg';

export const HeaderBase = () => {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const skillsButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={cls.base}>
      <Logo />

      <nav className={cls.nav}>
        <span className={cls.about}>О проекте</span>

        <button
          type="button"
          className={cls.skillsButton}
          ref={skillsButtonRef}
          onClick={() => setIsSkillsOpen(!isSkillsOpen)}
          aria-expanded={isSkillsOpen}
          aria-haspopup="true"
        >
          <span>Все навыки</span>
          <img src={arrowDownIcon} alt="" width="24" height="24" />
        </button>

        <SkillsCatalogPopover
          isOpen={isSkillsOpen}
          onClose={() => setIsSkillsOpen(false)}
          anchorRef={skillsButtonRef}
        />
      </nav>
    </div>
  );
};
