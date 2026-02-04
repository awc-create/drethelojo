'use client';

import Link from 'next/link';
import styles from './TrainingHero.module.scss';

export default function TrainingHero() {
  return (
    <header className={styles.hero}>
      <p className={styles.kicker}>Training</p>
      <h1 className={styles.title}>Dermatology training pathway (UK).</h1>
      <p className={styles.lead}>
        A clear breakdown of the prerequisites and training stages — from A-levels to consultant.
      </p>

      <div className={styles.actions}>
        <Link href="/journey" className={styles.primary}>
          View journey
        </Link>
        <Link href="/contact" className={styles.secondary}>
          Contact
        </Link>
      </div>
    </header>
  );
}
