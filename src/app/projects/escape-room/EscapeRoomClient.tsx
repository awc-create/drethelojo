'use client';

import Link from 'next/link';
import styles from './page.module.scss';

export default function EscapeRoomClient() {
  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/projects">Projects</Link>
        <span aria-hidden>/</span>
        <span>Escape Room</span>
      </nav>

      <header className={styles.pageHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Teaching Escape Room App</h1>
          <p className={styles.lead}>
            An interactive, case-based learning experience for dermatology aspirants — fun,
            high-retention, and structured.
          </p>
        </div>
        <div className={styles.metaBlock}>
          <span className={styles.badgeActive}>Active</span>
          <div className={styles.metaTags}>
            <span className={styles.metaTag}>Education</span>
            <span className={styles.metaTag}>Dermatology</span>
            <span className={styles.metaTag}>Game</span>
          </div>
        </div>
      </header>

      <section className={styles.gameSection}>
        <div className={styles.gameFrameOuter}>
          <iframe
            src="/game/index.html"
            title="Derm Escape Lab"
            className={styles.gameFrame}
            allow="fullscreen"
          />
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.controlsMeta}>
            <span className={styles.controlsMetaItem}>
              <svg
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              10 min
            </span>
            <span className={styles.controlsMetaItem}>
              <svg
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Desktop &amp; mobile
            </span>
          </div>
          <a href="/projects/escape-room/play" className={styles.openBtn}>
            ↗ Open full screen
          </a>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.infoGrid}>
        <div>
          <p className={styles.infoLabel}>How to play</p>
          <ol className={styles.howList}>
            <li>
              <span className={styles.howNum}>1</span>
              <span>
                Tap glowing hotspots to inspect objects and examine the patient&apos;s chart
              </span>
            </li>
            <li>
              <span className={styles.howNum}>2</span>
              <span>Answer dermatology questions to earn digits for the door code</span>
            </li>
            <li>
              <span className={styles.howNum}>3</span>
              <span>Pick up items — select them from your inventory to use on objects</span>
            </li>
            <li>
              <span className={styles.howNum}>4</span>
              <span>Enter the 4-digit code at the door keypad before the timer runs out</span>
            </li>
          </ol>
        </div>

        <div>
          <p className={styles.infoLabel}>Stack</p>
          <div className={styles.stackTags}>
            {['Phaser 3', 'TypeScript', 'Vite'].map((t) => (
              <span key={t} className={styles.stackTag}>
                {t}
              </span>
            ))}
          </div>

          <p className={styles.infoLabel} style={{ marginTop: '1.5rem' }}>
            Status
          </p>
          <div className={styles.statusRow}>
            <div className={styles.statusDot} />
            <span className={styles.statusText}>
              Room 1 playable — Room 2 and study mode in progress
            </span>
          </div>

          <p className={styles.infoLabel} style={{ marginTop: '1.5rem' }}>
            Year
          </p>
          <span className={styles.statusText}>2026</span>
        </div>
      </section>
    </main>
  );
}
