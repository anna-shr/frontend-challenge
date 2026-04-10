import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.scss';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Кошачий пинтерест',
  description: 'Смотрите на котиков и добавляйте их в избранное',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}