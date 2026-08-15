import React from 'react';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import { selectDb } from '@app/store/db/selectors';
import { mapUserToUserCardProps } from '@entities/user/model/mappers';
import { UserCardSection } from '@widgets/user-card-section';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFavoriteUserIds, toggleFavorite } from '@features/favorites/model';
import { selectIsAuthenticated } from '@features/auth/model/selectors';
import type { RootState } from '@app/store/store'; // Импортируem тип RootState из вашего store

export const CatalogSections: React.FC = () => {
  const db = useAppSelector(selectDb);
  const isLikedData = useSelector(selectFavoriteUserIds);
  const isAuthenticated = useSelector(selectIsAuthenticated); // Получаем статус авторизации
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Получаем все статусы предложений обмена
  const exchangeOfferedMap = useSelector((state: RootState) => state.exchange.offeredExchanges);

  if (!db) {
    return null;
  }

  const handlerLike = (id: number) => {
    dispatch(toggleFavorite(id));
  };

  const users = db.users;

  // Функция для создания пропсов карточки пользователя
  const createUserCardProps = (user: (typeof users)[0]) =>
    mapUserToUserCardProps(db, user, {
      onMore: () => navigate(`/skill/${user.id}`),
      onLikeClick: () => handlerLike(user.id),
      isLiked: isLikedData.includes(user.id),
      likesCount: isLikedData.includes(user.id) ? 1 : undefined,
      moreLabel: 'Подробнее',
      showLike: true,
      exchangeOffered: isAuthenticated ? exchangeOfferedMap[user.id] || false : false, // добавляем статус предложения обмена
    });

  // Популярные (или точное совпадение для авторизованных)
  const firstSectionItems = users.map(createUserCardProps);

  // Новые
  const sortedByNew = [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const newItems = sortedByNew.map(createUserCardProps);

  // Рекомендуемые
  const recommendedItems = users.map(createUserCardProps);

  // Определяем заголовок первой секции в зависимости от статуса авторизации
  const firstSectionTitle = isAuthenticated ? 'Точное совпадение' : 'Популярное';

  // Определяем заголовок второй секции в зависимости от статуса авторизации
  const secondSectionTitle = isAuthenticated ? 'Новые идеи' : 'Новое';

  return (
    <>
      <UserCardSection
        title={firstSectionTitle}
        items={firstSectionItems}
        variant="row"
        onActionClick={() => {}}
        actionLabel="Смотреть все"
      />
      <UserCardSection
        title={secondSectionTitle}
        items={newItems}
        variant="row"
        onActionClick={() => {}}
        actionLabel="Смотреть все"
      />
      <UserCardSection title="Рекомендуем" items={recommendedItems} variant="grid" />
    </>
  );
};
