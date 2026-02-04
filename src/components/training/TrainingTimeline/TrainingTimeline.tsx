'use client';

import styles from './TrainingTimeline.module.scss';
import type { TrainingStep, TrainingStatus } from '@/content/trainingPathway';

type Props = {
  steps: TrainingStep[];
};

// You can replace this later with live status derived from dates (like Journey).
function defaultStatusForIndex(i: number): TrainingStatus | undefined {
  if (i <= 1) return 'Completed';
  if (i === 3) return 'Current'; // example: IMT
  if (i === 4) return 'Next'; // example: MRCP focus
  return 'Planned';
}

function statusTone(status?: TrainingStatus) {
  if (!status) return '';
  if (status === 'Completed') return styles.statusCompleted;
  if (status === 'Current') return styles.statusCurrent;
  if (status === 'Next') return styles.statusNext;
  return styles.statusPlanned;
}

export default function TrainingTimeline({ steps }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.timeline} role="list">
        {steps.map((s, idx) => {
          const status = s.status ?? defaultStatusForIndex(idx);

          return (
            <article key={s.id} className={styles.item} role="listitem">
              <div className={styles.rail} aria-hidden="true">
                <span className={styles.dot} />
              </div>

              <div className={styles.card}>
                <div className={styles.topRow}>
                  <div className={styles.leftMeta}>
                    <span className={styles.stepIndex}>{String(idx + 1).padStart(2, '0')}</span>
                    {s.duration ? <span className={styles.duration}>{s.duration}</span> : null}
                  </div>

                  <span className={`${styles.status} ${statusTone(status)}`}>{status}</span>
                </div>

                <h2 className={styles.title}>{s.title}</h2>
                <p className={styles.summary}>{s.summary}</p>

                {s.note ? <p className={styles.note}>{s.note}</p> : null}

                {(s.requirements?.length ?? 0) > 0 ? (
                  <div className={styles.block}>
                    <p className={styles.blockTitle}>Key requirements</p>
                    <ul className={styles.list}>
                      {s.requirements!.slice(0, 6).map((r) => (
                        <li key={`${s.id}-req-${r}`}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {(s.outputs?.length ?? 0) > 0 ? (
                  <div className={styles.block}>
                    <p className={styles.blockTitle}>What you gain</p>
                    <ul className={styles.list}>
                      {s.outputs!.slice(0, 6).map((o) => (
                        <li key={`${s.id}-out-${o}`}>{o}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
