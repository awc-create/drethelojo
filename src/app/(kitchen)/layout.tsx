// src/app/(kitchen)/layout.tsx
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Solene Kitchen',
  description: 'The family recipe book — kept with care, for this generation and the next.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Solene Kitchen',
  },
};

export const viewport: Viewport = {
  themeColor: '#f4f1ea',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
