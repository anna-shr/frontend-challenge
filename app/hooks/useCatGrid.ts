import { useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_VISIBLE_COUNT,
  LOAD_MORE_STEP,
  INTERSECTION_THRESHOLD,
  INTERSECTION_ROOT_MARGIN,
} from './useCatGrid.constants';

interface UseCatGridParams {
  isMounted: boolean;
  isAllTab: boolean;
  catsCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreCats: () => Promise<void>;
}

interface UseCatGridResult {
  visibleCount: number;
  isInitialLoading: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

export const useCatGrid = ({
  isMounted,
  isAllTab,
  catsCount,
  loading,
  error,
  hasMore,
  loadMoreCats,
}: UseCatGridParams): UseCatGridResult => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const isInitialLoading =
    isMounted &&
    isAllTab &&
    catsCount === 0 &&
    !error;

  useEffect(() => {
    if (!isMounted || !isAllTab) return;

    if (catsCount === 0 && !loading && !error) {
      loadMoreCats();
    }
  }, [isMounted, isAllTab, catsCount, loading, error, loadMoreCats]);

  const loadNextChunk = useCallback(() => {
    if (loadingRef.current) return;

    const hasHiddenCats = visibleCount < catsCount;

    if (hasHiddenCats) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, catsCount));
      return;
    }

    if (hasMore && !loading) {
      loadingRef.current = true;

      loadMoreCats().finally(() => {
        loadingRef.current = false;
      });
    }
  }, [visibleCount, catsCount, hasMore, loading, loadMoreCats]);

  useEffect(() => {
    if (!isMounted || !isAllTab || isInitialLoading) return;
    if (!hasMore && visibleCount >= catsCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !loading && !isInitialLoading) {
          loadNextChunk();
        }
      },
      {
        threshold: INTERSECTION_THRESHOLD,
        rootMargin: INTERSECTION_ROOT_MARGIN,
      }
    );

    const currentObserver = observerRef.current;

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
      observer.disconnect();
    };
  }, [
    isMounted,
    isAllTab,
    isInitialLoading,
    hasMore,
    visibleCount,
    catsCount,
    loading,
    loadNextChunk,
  ]);

  return {
    visibleCount,
    isInitialLoading,
    observerRef,
  };
};