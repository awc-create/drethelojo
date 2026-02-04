'use client';

import styles from './page.module.scss';
import TrainingHero from '@/components/training/TrainingHero/TrainingHero';
import TrainingTimeline from '@/components/training/TrainingTimeline/TrainingTimeline';
import TrainingRequirements from '@/components/training/TrainingRequirements/TrainingRequirements';

import { TRAINING_PATHWAY } from '@/content/trainingPathway';

export default function TrainingClient() {
  return (
    <main className={styles.page}>
      <TrainingHero />

      <section className={styles.grid} aria-label="Training pathway">
        <div className={styles.main}>
          <TrainingTimeline steps={TRAINING_PATHWAY} />
        </div>

        <aside className={styles.side} aria-label="Key requirements">
          <TrainingRequirements />
        </aside>
      </section>
    </main>
  );
}
