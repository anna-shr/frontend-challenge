'use client';

import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  small?: boolean;
  text?: string;
}

export const LoadingSpinner = ({ small, text }: LoadingSpinnerProps) => {
  if (small) {
    return (
      <div className={styles.smallContainer}>
        <div className={styles.spinnerSmall}></div>
        {text && <p>{text}</p>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p>Загрузка...</p>
    </div>
  );
};