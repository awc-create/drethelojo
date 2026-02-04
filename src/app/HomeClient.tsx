// src/app/HomeClient.tsx
'use client';

import styles from './page.module.scss';

import Hero from '@/components/home/hero/Hero';
import Journey from '@/components/home/journey/Journey';
import Research from '@/components/home/research/Research';
import Projects from '@/components/home/projects/Projects';
import Contact from '@/components/home/contact/Contact';

export default function HomeClient() {
  return (
    <main className={styles.home}>
      <section id="top" className={styles.sectionHero}>
        <Hero />
      </section>

      <section id="journey" className={styles.sectionDivider}>
        <Journey />
      </section>

      <section id="research" className={styles.sectionDivider}>
        <Research />
      </section>

      <section id="projects" className={styles.sectionDivider}>
        <Projects />
      </section>

      <section id="contact" className={styles.sectionDivider}>
        <Contact />
      </section>
    </main>
  );
}
