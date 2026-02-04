'use client';

import Link from 'next/link';
import styles from './TrainingRequirements.module.scss';

export default function TrainingRequirements() {
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>At a glance</p>

      <div className={styles.block}>
        <span className={styles.label}>Core exams</span>
        <p className={styles.text}>MRCP → SCE (Dermatology)</p>
      </div>

      <div className={styles.block}>
        <span className={styles.label}>Typical durations</span>
        <p className={styles.text}>Med school 5–6y · Foundation 2y · IMT 2y · Dermatology 4y</p>
      </div>

      <div className={styles.block}>
        <span className={styles.label}>Competitiveness</span>
        <p className={styles.text}>
          Dermatology is highly competitive — portfolio strength and commitment evidence matter.
        </p>
      </div>

      <div className={styles.actions}>
        <Link href="/research" className={styles.primary}>
          Research outputs
        </Link>
        <Link href="/cv" className={styles.secondary}>
          View CV
        </Link>
      </div>
    </div>
  );
}
