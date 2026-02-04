'use client';

import styles from './InProgress.module.scss';
import type { Publication } from '@/content/publications';

type Props = {
  publications: Publication[];
};

export default function InProgress({ publications }: Props) {
  if (!publications.length) return null;

  return (
    <section className={styles.wrap} aria-label="In progress research">
      <div className={styles.left}>
        <p className={styles.kicker}>In progress</p>
        <h2 className={styles.title}>Ongoing work & submissions.</h2>
        <p className={styles.lead}>A quick view of what’s currently in motion.</p>
      </div>

      <div className={styles.list} role="list">
        {publications.slice(0, 4).map((p) => (
          <div key={p.id} className={styles.item} role="listitem">
            <div className={styles.top}>
              <span className={styles.status}>{p.status ?? 'Published'}</span>
              <span className={styles.meta}>
                {p.type} · {p.year}
              </span>
            </div>
            <p className={styles.name}>{p.title}</p>
            {p.venue ? <p className={styles.venue}>{p.venue}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
