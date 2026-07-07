// src/app/coming-soon/page.tsx
import { Suspense } from 'react';
import ComingSoonClient from './ComingSoonClient';

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<ComingSoonSkeleton />}>
      <ComingSoonClient />
    </Suspense>
  );
}

function ComingSoonSkeleton() {
  return (
    <main
      style={{
        minHeight: 'calc(100dvh - var(--navbar-height))',
        display: 'grid',
        placeItems: 'center',
        padding: '48px var(--gutter)',
      }}
    >
      <section
        style={{
          width: 'min(760px, 100%)',
          borderRadius: 28,
          background: 'rgba(247,246,243,0.85)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 22px 70px rgba(0,0,0,0.10)',
          padding: '32px',
        }}
      >
        <div
          style={{
            height: 14,
            width: 180,
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 10,
            marginBottom: 14,
          }}
        />
        <div
          style={{
            height: 42,
            width: 260,
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 12,
            marginBottom: 12,
          }}
        />
        <div
          style={{
            height: 18,
            width: '85%',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: 10,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 18,
            width: '70%',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
        <div
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}
        >
          <div
            style={{ height: 34, width: 320, background: 'rgba(0,0,0,0.05)', borderRadius: 999 }}
          />
          <div
            style={{ height: 34, width: 150, background: 'rgba(0,0,0,0.05)', borderRadius: 999 }}
          />
        </div>
      </section>
    </main>
  );
}
