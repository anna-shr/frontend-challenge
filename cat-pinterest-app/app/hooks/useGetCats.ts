import { useState, useCallback } from 'react';
import type { Cat } from '@/app/types';

const FETCH_BATCH_SIZE = 24;

export const useCats = () => {
  const [allCats, setAllCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreCats = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_CAT_API_KEY || 'DEMO-API-KEY';
      const randomPage = Math.floor(Math.random() * 100);
      const url = `https://api.thecatapi.com/v1/images/search?limit=${FETCH_BATCH_SIZE}&page=${randomPage}&size=med&mime_types=jpg,png`;

      const res = await fetch(url, {
        headers: { 'x-api-key': apiKey },
      });

      if (!res.ok) {
        throw new Error('Ошибка загрузки');
      }

      const newCats: Cat[] = await res.json();

      if (newCats.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      setAllCats((prev) => {
        const existingIds = new Set(prev.map((cat) => cat.id));
        const uniqueNewCats = newCats.filter((cat) => !existingIds.has(cat.id));
        return [...prev, ...uniqueNewCats];
      });

      setHasMore(true);
    } catch (err) {
      setError('Не удалось загрузить котиков');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  const resetCats = useCallback(() => {
    setAllCats([]);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    allCats,
    loading,
    error,
    hasMore,
    loadMoreCats,
    resetCats,
  };
};