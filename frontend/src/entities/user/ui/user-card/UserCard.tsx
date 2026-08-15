import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import type { UserCardProps, SkillBadge } from './UserCard.types';
import styles from './UserCard.module.css';
import { Card } from '@shared/ui/Card';
import { Avatar } from '@shared/ui/Avatar';
import { LikesCounter } from '@features/favorites/ui/LikesCounter';
import { SkillPlate } from '@shared/ui/skill-plate/SkillPlate';
import { Button } from '@shared/ui/Button';
import { getSkillColorVar } from '@shared/ui/skill-plate/utils/getSkillColorVar';
import clockIcon from '@shared/assets/icons/common/icon_clock.svg';

const SKILLS_VISIBLE_LIMIT = 2;

export const UserCard: React.FC<UserCardProps> = ({
  avatarSrc,
  name,
  city,
  age,
  skillsOffered,
  skillsWanted,
  about,
  showLike = true,
  likesCount,
  onLikeClick,
  isLiked = false,
  onMore,
  moreLabel = 'Подробнее',
  className,
  height = 'regular',
  exchangeOffered = false, // новый пропс для статуса кнопки
}) => {
  // Функция для рендера навыков
  const renderSkills = useCallback((skills: SkillBadge[]) => {
    // если навыков нет - покажет заглушку
    if (!skills || skills.length === 0) {
      return <SkillPlate className={styles.emptySkill} variant="default" text="Нет навыков" />;
    }

    const visible = skills.slice(0, SKILLS_VISIBLE_LIMIT);
    const hiddenCount = skills.length - SKILLS_VISIBLE_LIMIT;

    return (
      <>
        {visible.map((skill) => (
          <SkillPlate
            key={skill.id}
            variant="default"
            text={skill.text}
            colorVar={getSkillColorVar(skill.categoryId)}
          />
        ))}

        {hiddenCount > 0 && <SkillPlate variant="count" text={`${hiddenCount}`} />}
      </>
    );
  }, []);

  // Мемоизируем отрендеренные навыки для оптимизации
  const renderedOfferedSkills = useMemo(
    () => renderSkills(skillsOffered),
    [skillsOffered, renderSkills],
  );
  const renderedWantedSkills = useMemo(
    () => renderSkills(skillsWanted),
    [skillsWanted, renderSkills],
  );

  return (
    <Card className={clsx(styles.userCard, className)} data-height={height}>
      <div className={styles.header}>
        <Avatar src={avatarSrc} size={100} alt={`Аватар пользователя ${name}`} />
        <div className={styles.userInfo}>
          <h2 className={styles.name}>{name}</h2>
          <div className={styles.cityAge}>{age === undefined ? city : `${city}, ${age}`}</div>
        </div>
        {showLike && (
          <LikesCounter
            showCount={likesCount !== undefined}
            isActive={isLiked}
            likesCount={likesCount}
            className={styles.favoriteToggle}
            onClick={onLikeClick}
            aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
          />
        )}
      </div>

      <div className={styles.skillsSection}>
        {about && !onMore && <div className={styles.about}>{about}</div>}

        <div className={styles.skill}>
          <h4 className={styles.skillsLabel}>Может научить:</h4>
          <div className={styles.skillsRow}>{renderedOfferedSkills}</div>
        </div>

        <div className={styles.skill}>
          <h4 className={styles.skillsLabel}>Хочет научиться:</h4>
          <div className={styles.skillsRow}>{renderedWantedSkills}</div>
        </div>
      </div>

      {onMore && exchangeOffered && (
        <Button
          variant="secondary"
          fullWidth
          onClick={onMore}
          className={`${exchangeOffered ? styles.sentButton : ''}`}
        >
          <img src={clockIcon} alt="" className={styles.buttonIcon} /> Обмен предложен
        </Button>
      )}

      {onMore && !exchangeOffered && (
        <Button fullWidth onClick={onMore}>
          {moreLabel}
        </Button>
      )}
    </Card>
  );
};
