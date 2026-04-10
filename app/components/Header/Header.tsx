'use client';

import styles from './Header.module.scss';

interface HeaderProps {
  activeTab: 'all' | 'favorites';
  onTabChange: (tab: 'all' | 'favorites') => void;
  favoritesCount: number;
  onClearFavorites?: () => void;
}

export const Header = ({ 
  activeTab, 
  onTabChange, 
  favoritesCount,
  onClearFavorites 
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <nav className={styles.tabs} aria-label="Навигация по категориям">
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => onTabChange('all')}
            aria-current={activeTab === 'all' ? 'page' : undefined}
          >
            Все котики
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => onTabChange('favorites')}
            aria-current={activeTab === 'favorites' ? 'page' : undefined}
          >
            Любимые котики
            <span className={styles.count}>{favoritesCount}</span>
          </button>
        </nav>
        
        {activeTab === 'favorites' && favoritesCount > 0 && onClearFavorites && (
          <button 
            onClick={onClearFavorites} 
            className={styles.clearFavoritesBtn}
            aria-label="Удалить всех котиков из избранного"
          >
            🗑️ Удалить всех ({favoritesCount})
          </button>
        )}
      </div>
    </header>
  );
};