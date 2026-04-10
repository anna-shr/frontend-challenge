'use client';

import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  error: string | null;
  onRetry?: () => void;
}

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <div className={styles.error}>
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryBtn}>
          Попробовать снова
        </button>
      )}
    </div>
  );
};