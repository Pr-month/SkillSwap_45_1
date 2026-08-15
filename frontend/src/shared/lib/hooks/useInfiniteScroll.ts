import { useRef, useEffect, type RefObject } from 'react';

export interface UseInfiniteScrollOptions {
  /** Включён ли подгрузка по скроллу */
  enabled: boolean;
  /** Есть ли ещё данные для подгрузки */
  hasMore: boolean;
  /** Колбэк подгрузки следующей порции (вызывается при попадании sentinel в зону видимости) */
  onLoadMore: () => void;
}

/**
 * Хук для бесконечного скролла списка.
 * Возвращает ref для элемента-«часового» (sentinel): разместите его в конце списка.
 * Когда этот элемент попадает в зону видимости, вызывается onLoadMore.
 */
export function useInfiniteScroll({
  enabled,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollOptions): RefObject<HTMLDivElement | null> {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, hasMore, onLoadMore]);

  return sentinelRef;
}
