'use client';

import styles from './RotationAccordion.module.scss';

type Props = {
  skills?: string[];
  competencies?: string[];
  goals?: string[];
};

function hasItems(arr?: string[]) {
  return Array.isArray(arr) && arr.length > 0;
}

export default function RotationAccordion({ skills, competencies, goals }: Props) {
  const show = hasItems(skills) || hasItems(competencies) || hasItems(goals);
  if (!show) return null;

  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <span className={styles.summaryText}>Rotation outcomes</span>
        <span className={styles.chev} aria-hidden="true">
          ▾
        </span>
      </summary>

      <div className={styles.body}>
        {hasItems(skills) ? (
          <div className={styles.block}>
            <p className={styles.blockTitle}>Key focus</p>
            <ul className={styles.list}>
              {skills!.slice(0, 8).map((s) => (
                <li key={`skill-${s}`}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasItems(competencies) ? (
          <div className={styles.block}>
            <p className={styles.blockTitle}>Competencies</p>
            <div className={styles.chips} aria-label="Competencies">
              {competencies!.slice(0, 10).map((c) => (
                <span key={`comp-${c}`} className={styles.chip}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {hasItems(goals) ? (
          <div className={styles.block}>
            <p className={styles.blockTitle}>Goals</p>
            <ul className={styles.list}>
              {goals!.slice(0, 6).map((g) => (
                <li key={`goal-${g}`}>{g}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}
