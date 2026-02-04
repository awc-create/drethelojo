// src/components/home/hero/Hero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.copy}>
              <p className={styles.kicker}>
                Future Dermatologist · Research-Driven · AI + Education
              </p>

              <h1 className={styles.name}>Dr Ethel Ojo</h1>

              <p className={styles.headline}>
                Future Dermatologist focused on research, clinical excellence, and AI-driven
                innovation.
              </p>

              <p className={styles.sub}>
                Advancing the field of dermatology through dedicated research, clinical training,
                and innovative technology.
              </p>

              <div className={styles.ctas}>
                <Link href="/research" className={styles.primary}>
                  View Research
                </Link>
                <Link href="/journey" className={styles.secondary}>
                  Explore Journey
                </Link>
              </div>

              <div className={styles.chips} aria-label="Highlights">
                <span className={styles.chip}>Publications</span>
                <span className={styles.chip}>Dermatology AI Project</span>
                <span className={styles.chip}>Teaching App Development</span>
                <span className={styles.chip}>Training Milestones</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.visual} aria-hidden="true">
              <div className={styles.portraitFrame}>
                <Image
                  src="/assets/home/ethel-hero.jpeg"
                  alt="Dr Ethel Ojo"
                  fill
                  priority
                  sizes="(max-width: 900px) 92vw, 46vw"
                  className={styles.portrait}
                />
              </div>

              {/* optional subtle top lines like the mock */}
              <div className={styles.topLines} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
