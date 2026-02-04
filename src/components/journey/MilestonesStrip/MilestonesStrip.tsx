'use client';

import styles from './MilestonesStrip.module.scss';
import type { JourneyMilestone } from '@/content/journeyMilestones';

type Props = {
  items: JourneyMilestone[];
};

export default function MilestonesStrip({ items }: Props) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className={styles.strip} aria-label="Journey milestones">
      {items.map((m) => (
        <div
          key={`${m.label}-${m.value}`}
          className={`${styles.card} ${m.tone === 'olive' ? styles.cardOlive : ''}`}
        >
          <span className={styles.label}>{m.label}</span>
          <span className={styles.value}>{m.value}</span>
          {m.detail ? <span className={styles.detail}>{m.detail}</span> : null}
        </div>
      ))}
    </section>
  );
}
