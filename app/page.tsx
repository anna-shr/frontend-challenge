'use client';

import { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { CatGrid } from './components/CatGrid/CatGrid';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { useFavorites } from './hooks/useFavorites';
import { useCats } from './hooks/useGetCats';
import { useMounted } from './hooks/useMounted';
import { useCatGrid } from './hooks/useCatGrid';
import type { CatWithFavorite } from './types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const isMounted = useMounted();
  const isAllTab = activeTab === 'all';
  const isFavoritesTab = activeTab === 'favorites';

  const {
    favoriteCats,
    favoritesCount,
    toggleFavorite,
    clearAllFavorites,
  } = useFavorites();

  const favoriteIds = useMemo(() => {
    return new Set(favoriteCats.map((cat) => cat.id));
  }, [favoriteCats]);

  const {
    allCats,
    loading,
    error,
    hasMore,
    loadMoreCats,
  } = useCats();

  const {
    visibleCount,
    isInitialLoading,
    observerRef,
  } = useCatGrid({
    isMounted,
    isAllTab,
    catsCount: allCats.length,
    loading,
    error,
    hasMore,
    loadMoreCats,
  });

  const handleToggleFavorite = useCallback((cat: CatWithFavorite) => {
    toggleFavorite(cat);
  }, [toggleFavorite]);

  const displayedCats: CatWithFavorite[] = useMemo(() => {
    if (isAllTab) {
      return allCats
        .map((cat) => ({
          ...cat,
          isFavorite: favoriteIds.has(cat.id),
        }))
        .slice(0, visibleCount);
    }

    return favoriteCats.map((cat) => ({
      ...cat,
      isFavorite: true,
    }));
  }, [isAllTab, allCats, favoriteIds, visibleCount, favoriteCats]);

  const showErrorMessage = isAllTab && !!error;

  const showSentinel =
    isAllTab &&
    (hasMore || visibleCount < allCats.length) &&
    !error &&
    !isInitialLoading;

  const showEndMessage =
    isAllTab &&
    !hasMore &&
    visibleCount >= allCats.length &&
    allCats.length > 0;

  const showEmptyFavorites =
    isFavoritesTab &&
    displayedCats.length === 0;

  if (!isMounted) {
    return (
      <>
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          favoritesCount={favoritesCount}
          onClearFavorites={clearAllFavorites}
        />
        <main className="container">
          <LoadingSpinner />
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favoritesCount}
        onClearFavorites={clearAllFavorites}
      />

      <main>
        {isAllTab && isInitialLoading ? (
          <div className="container">
            <LoadingSpinner />
          </div>
        ) : showErrorMessage ? (
          <ErrorMessage error={error} onRetry={loadMoreCats} />
        ) : (
          <>
            <CatGrid
              cats={displayedCats}
              onToggleFavorite={handleToggleFavorite}
              isFavoritesTab={isFavoritesTab}
            />

            {isAllTab && loading && !isInitialLoading && (
              <LoadingSpinner small text="Загружаем ещё котиков..." />
            )}

            {showSentinel && <div ref={observerRef} className="sentinel" />}

            {showEndMessage && (
              <div className="end-message">
                <p>✨ Вы посмотрели всех котиков! ✨</p>
              </div>
            )}

            {showEmptyFavorites && (
              <div className="empty">
                <p>😿 Нет любимых котиков</p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="retry-btn"
                >
                  Посмотреть всех котиков
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}