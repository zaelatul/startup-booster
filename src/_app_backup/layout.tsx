import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프로젝트2',
  description: '창업앱',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
