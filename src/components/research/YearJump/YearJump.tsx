'use client';

import styles from './YearJump.module.scss';
import type { Publication } from '@/content/publications';

type Props = {
  publications: Publication[];
};

export default function YearJump({ publications }: Props) {
  const years = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);

  if (years.length < 2) return null;

  const jump = (year: number) => {
    const el = document.getElementById(`year-${year}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.wrap} aria-label="Jump to year">
      <span className={styles.label}>Jump</span>
      {years.map((y) => (
        <button key={y} type="button" className={styles.pill} onClick={() => jump(y)}>
          {y}
        </button>
      ))}
    </div>
  );
}
