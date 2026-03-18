'use client';

// app/projects/escape-room/play/PlayClient.tsx
import { useEffect } from 'react';
import styles from './play.module.scss';

export default function PlayClient() {
  useEffect(() => {
    // Hide footer + kill scroll on this page only
    const footer = document.querySelector('footer') as HTMLElement | null;
    const body = document.body;

    if (footer) footer.style.display = 'none';
    body.style.overflow = 'hidden';

    return () => {
      // Restore when navigating away
      if (footer) footer.style.display = '';
      body.style.overflow = '';
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <iframe
        src="/game/index.html"
        title="Derm Escape Lab"
        className={styles.frame}
        allow="fullscreen"
      />
    </div>
  );
}
