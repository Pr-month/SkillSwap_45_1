import type { Db } from '@shared/api/mock/normalize';
import type { User } from '@shared/api/mock/types';
import type {
  UserCardProps,
  SkillBadge,
} from '@entities/user/ui/user-card/UserCard.types';
import type { CardHeight } from '@entities/user/ui/user-card/UserCard.types';

export interface MapUserToUserCardOpts {
  about?: string;
  showLike?: boolean;
  likesCount?: number;
  isLiked?: boolean;
  onLikeClick?: () => void;
  onMore?: () => void;
  moreLabel?: string;
  height?: CardHeight;
  className?: string;
  exchangeOffered?: boolean;
}

export const mapUserToUserCardProps = (
  db: Db,
  user: User,
  opts?: MapUserToUserCardOpts,
): UserCardProps & { id: string } => {
  /*
   * CITY
   *
   * Backend больше не предоставляет cities/cityId.
   * Поэтому сначала используем user.city,
   * а если его нет — оставляем пустую строку.
   *
   * Если cityId когда-нибудь снова появится,
   * поддержка тоже останется.
   */
  const city =
    user.city ??
    (user.cityId ? db.citiesById[user.cityId]?.name : undefined) ??
    '';

  /*
   * AGE
   *
   * birthDate теперь optional.
   */
  let age: number | undefined;

  if (user.birthDate) {
    const birth = new Date(user.birthDate);

    if (!isNaN(birth.getTime())) {
      const today = new Date();

      age =
        today.getFullYear() -
        birth.getFullYear();

      const monthDiff =
        today.getMonth() -
        birth.getMonth();

      if (
        monthDiff < 0 ||
        (
          monthDiff === 0 &&
          today.getDate() < birth.getDate()
        )
      ) {
        age--;
      }

      if (age < 0) {
        age = undefined;
      }
    }
  }

  /*
   * SKILLS OFFERED
   *
   * skillsOfferedIds теперь optional,
   * поэтому используем ?? [].
   */
  const skillsOffered: SkillBadge[] = (
    user.skillsOfferedIds ?? []
  )
    .map((skillId) => {
      const skill = db.skillsById[skillId];

      if (!skill) {
        return null;
      }

      return {
        id: skill.id,
        text: skill.title,
        categoryId: skill.categoryId,
      };
    })
    .filter(
      (skill): skill is SkillBadge =>
        skill !== null,
    );

  /*
   * SKILLS WANTED
   */
  const skillsWanted: SkillBadge[] = (
    user.skillsWantedIds ?? []
  )
    .map((skillId) => {
      const skill = db.skillsById[skillId];

      if (!skill) {
        return null;
      }

      return {
        id: skill.id,
        text: skill.title,
        categoryId: skill.categoryId,
      };
    })
    .filter(
      (skill): skill is SkillBadge =>
        skill !== null,
    );

  /*
   * Базовые данные карточки.
   */
  const baseProps: UserCardProps = {
    avatarSrc: user.avatar,
    name: user.name,
    city,
    age,
    skillsOffered,
    skillsWanted,

    ...(opts?.about !== undefined
      ? { about: opts.about }
      : user.about !== undefined
        ? { about: user.about }
        : {}),
  };

  /*
   * Опции компонента имеют приоритет
   * над базовыми данными.
   */
  const finalProps: UserCardProps = {
    ...baseProps,
    ...opts,
  };

  return {
    id: user.id,
    ...finalProps,
  };
};