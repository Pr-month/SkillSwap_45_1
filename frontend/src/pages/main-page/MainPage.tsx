import { useMemo, useState, useCallback } from 'react';
import styles from './MainPage.module.css';
import { FiltersSidebar } from '@widgets/filters-sidebar';
import { CatalogSections } from '@widgets/catalog-sections';
import { UserCardSection } from '@widgets/user-card-section';
import { mapUserToUserCardProps } from '@entities/user/model/mappers';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import { selectDb } from '@app/store/db/selectors';
import { selectFilters } from '@features/filters/model/selectors';
import { countAppliedFilters, createDefaultFilterValues } from '@features/filters/model/utils';
import { useNavigate } from 'react-router-dom';
import { AppliedFiltersChips } from '@features/filters/ui';
import { buildAppliedBadges, removeBadge, type TBadge } from '@features/filters/model/badges';
import { setFilters } from '@features/filters/model/filtersSlice';
import { selectFavoriteUserIds, toggleFavorite } from '@features/favorites/model/favoritesSlice';
import { selectIsAuthenticated } from '@features/auth/model/selectors';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/store/store'; // Импортируem тип RootState из вашего store

type SortOrder = 'newest' | 'oldest';

import { selectSearchQuery } from '@features/search/model';
import { selectUsersByFiltersAndSearch } from '@features/search/model/searchSelectors';

export default function MainPage() {
  const db = useAppSelector(selectDb);
  const isLikedData = useSelector(selectFavoriteUserIds);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const filters = useAppSelector(selectFilters);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // Получаем все статусы предложений обмена
  const exchangeOfferedMap = useSelector((state: RootState) => state.exchange.offeredExchanges);

  const filteredUsers = useAppSelector(selectUsersByFiltersAndSearch);

  const searchQuery = useAppSelector(selectSearchQuery);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const defaults = useMemo(() => {
    if (!db) return null;
    return createDefaultFilterValues(db.categories);
  }, [db]);

  const appliedFiltersCount = useMemo(() => {
    if (!db || !defaults) return 0;
    return countAppliedFilters(filters, defaults);
  }, [db, defaults, filters]);

  const badges = useMemo(() => buildAppliedBadges(filters, db), [filters, db]);

  const handlerLike = useCallback(
    (id: number) => {
      dispatch(toggleFavorite(id));
    },
    [dispatch],
  );

  const handleRemoveBadge = useCallback(
    (badge: TBadge) => {
      if (!defaults) return;
      const next = removeBadge(filters, defaults, badge);
      dispatch(setFilters(next));
    },
    [defaults, filters, dispatch],
  );

  const hasAppliedFilters = appliedFiltersCount > 0;

  const hasSearch = searchQuery.trim().length > 0;

  const shouldShowResults = hasAppliedFilters || hasSearch;

  const filteredItems = useMemo(() => {
    if (!db || !filteredUsers) return [];

    // Сортируем пользователей по дате регистрации (предполагаем, что есть поле createdAt)
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sortedUsers.map((user) =>
      mapUserToUserCardProps(db, user, {
        onMore: () => navigate(`/skill/${user.id}`),
        onLikeClick: () => handlerLike(user.id),
        isLiked: isLikedData.includes(user.id),
        likesCount: isLikedData.includes(user.id) ? 1 : undefined,
        moreLabel: 'Подробнее',
        showLike: true,
        exchangeOffered: isAuthenticated ? exchangeOfferedMap[user.id] || false : false, // добавляем статус предложения обмена
      }),
    );
  }, [
    db,
    filteredUsers,
    navigate,
    sortOrder,
    isLikedData,
    handlerLike,
    isAuthenticated,
    exchangeOfferedMap,
  ]);

  const handleSortToggle = () => {
    setSortOrder((prev: string) => (prev === 'newest' ? 'oldest' : 'newest'));
  };

  const sortActionLabel = sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые';

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <FiltersSidebar />
      </aside>

      <main className={styles.content}>
        {!db && <div className={styles.state}>Загрузка каталога...</div>}

        {db && !shouldShowResults && (
          <div className={styles.catalogWrap}>
            <CatalogSections />
          </div>
        )}

        {db && shouldShowResults && (
          <section className={styles.resultsSection}>
            <AppliedFiltersChips
              badges={badges}
              onRemove={handleRemoveBadge}
              className={styles.resultsBadges}
            />
            {filteredItems.length > 0 ? (
              <UserCardSection
                title={`Подходящие предложения: ${filteredItems.length}`}
                items={filteredItems}
                variant="grid"
                renderHeader={true}
                className={styles.resultsGrid}
                onActionClick={handleSortToggle}
                actionLabel={sortActionLabel}
                allGrid={true}
              />
            ) : (
              <div className={styles.emptyState}>Ничего не найдено</div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
