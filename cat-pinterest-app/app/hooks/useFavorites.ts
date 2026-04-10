'use client';

import { useState, useEffect } from 'react';
import type { Cat } from '@/app/types';

const STORAGE_KEY = 'favoriteCats';

export const useFavorites = () => {
  const [favoriteCats, setFavoriteCats] = useState<Cat[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const favorites = saved ? (JSON.parse(saved) as Cat[]) : [];
        setFavoriteCats(favorites);
      } catch {
        setFavoriteCats([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (cat: Cat) => {
    setFavoriteCats((prev) => {
      const isAlreadyFavorite = prev.some((fc) => fc.id === cat.id);

      const newFavorites = isAlreadyFavorite
        ? prev.filter((fc) => fc.id !== cat.id)
        : [...prev, cat];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const clearAllFavorites = () => {
    const confirmed = window.confirm(
      `Вы уверены, что хотите удалить всех ${favoriteCats.length} котиков из избранного?`
    );

    if (!confirmed) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setFavoriteCats([]);
  };

  return {
    favoriteCats,
    favoritesCount: favoriteCats.length,
    toggleFavorite,
    clearAllFavorites,
  };
};