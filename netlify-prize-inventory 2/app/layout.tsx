import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '魚章獎品櫃｜庫存管理',
  description: 'Google 試算表連動的獎品櫃庫存、上架與熱銷管理工具',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
