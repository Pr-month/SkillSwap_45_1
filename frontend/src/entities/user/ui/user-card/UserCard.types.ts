export type SkillBadge = {
  id: number;
  text: string;
  categoryId: number;
};

export type CardHeight = 'regular' | 'compact' | 'auto' | 'full';
// regular - В каталоге (обычная высота)
// compact - На странице навыка (компактная)
// auto - Если нужно без ограничений
// full - Если на всю высоту родителя

export interface UserCardProps {
  avatarSrc?: string;
  name: string;
  city: string;
  age?: number | string;
  skillsOffered: SkillBadge[];
  skillsWanted: SkillBadge[];
  about?: string;
  showLike?: boolean;
  likesCount?: number;
  onLikeClick?: () => void;
  isLiked?: boolean;
  onMore?: () => void;
  moreLabel?: string;
  className?: string;
  height?: CardHeight; // новый проп
  exchangeOffered?: boolean; // новый проп для статуса кнопки
}
