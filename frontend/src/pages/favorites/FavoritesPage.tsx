import { useMemo, useState, useCallback } from 'react';
import { UserCardSection } from '@widgets/user-card-section';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import { selectFavoriteUserIds, toggleFavorite } from '@features/favorites/model/favoritesSlice';
import { mapUserToUserCardProps } from '@entities/user/model';
import styles from './FavoritesPage.module.css';
import { selectDb } from '@app/store/db/selectors';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const db = useAppSelector(selectDb);
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds);

  const favoriteIdsSet = useMemo(() => new Set(favoriteUserIds.map(Number)), [favoriteUserIds]);

  const [removingIds, setRemovingIds] = useState<number[]>([]);

  const handleUnlike = useCallback(
    (userId: number) => {
      if (removingIds.includes(userId)) return;

      setRemovingIds((prev) => [...prev, userId]);

      window.setTimeout(() => {
        dispatch(toggleFavorite(userId));
        setRemovingIds((prev) => prev.filter((id) => id !== userId));
      }, 200);
    },
    [dispatch, removingIds],
  );

  if (!db) {
    return <div className={styles.empty}>Загрузка...</div>;
  }

  const users = db.users;

  const items = users
    .filter((user) => favoriteIdsSet.has(user.id))
    .map((user) => {
      const isRemoving = removingIds.includes(user.id);

      return mapUserToUserCardProps(db, user, {
        showLike: true,
        isLiked: !isRemoving,
        onLikeClick: () => handleUnlike(user.id),
        className: isRemoving ? styles.removingCard : undefined,
      });
    });

  if (items.length === 0) {
    return <div className={styles.empty}>Вы не добавили ни одного пользователя</div>;
  }

  return (
    <UserCardSection
      title=""
      items={items}
      variant="grid"
      className={styles.container}
      renderHeader={false}
    />
  );
}
