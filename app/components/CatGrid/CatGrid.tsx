'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { CatWithFavorite } from '@/app/types';
import styles from './CatGrid.module.scss';

interface CatGridProps {
  cats: CatWithFavorite[];
  onToggleFavorite: (cat: CatWithFavorite) => void;
  isFavoritesTab?: boolean;
}

export const CatGrid = ({
  cats,
  onToggleFavorite,
  isFavoritesTab = false,
}: CatGridProps) => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getJustifyContent = useMemo(() => {
    if (isFavoritesTab) return styles.flexStart;
    if (cats.length === 0) return styles.flexStart;

    let cardsPerRow = 5;
    if (screenWidth > 0) {
      if (screenWidth < 480) cardsPerRow = 2;
      else if (screenWidth < 768) cardsPerRow = 2;
      else if (screenWidth < 992) cardsPerRow = 3;
      else if (screenWidth < 1200) cardsPerRow = 4;
      else cardsPerRow = 5;
    }

    if (cats.length <= cardsPerRow) {
      return styles.flexStart;
    }

    const lastRowCount = cats.length % cardsPerRow;
    const isLastRowFull = lastRowCount === 0;

    if (isLastRowFull) {
      return styles.spaceBetween;
    }

    return styles.flexStart;
  }, [cats.length, isFavoritesTab, screenWidth]);

  if (cats.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Галерея котиков">
      <div className={`${styles.grid} ${getJustifyContent}`}>
        {cats.map((cat) => (
          <article key={cat.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={cat.url}
                alt={`Фотография котика ${cat.id}`}
                width={400}
                height={400}
                className={styles.catImage}
                unoptimized
              />
              <button
                className={`${styles.favoriteBtn} ${cat.isFavorite ? styles.alwaysVisible : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(cat);
                }}
                aria-label={cat.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              >
                <Image
                  src={cat.isFavorite
                    ? '/favorite.png'
                    : '/favorite_border.png'
                  }
                  alt=""
                  width={40}
                  height={40}
                  className={styles.heartIcon}
                  aria-hidden="true"
                />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};