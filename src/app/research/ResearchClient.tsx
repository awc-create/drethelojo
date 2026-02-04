// src/app/research/ResearchClient.tsx
'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.scss';

import type { Publication, PublicationRole, PublicationType } from '@/content/publications';
import Filters from '@/components/research/Filters/Filters';
import PublicationsList from '@/components/research/PublicationsList/PublicationsList';

// ✅ new components
import Featured from '@/components/research/Featured/Featured';
import InProgress from '@/components/research/InProgress/InProgress';
import YearJump from '@/components/research/YearJump/YearJump';

type Props = {
  initialPublications: Publication[];
};

type FilterState = {
  q: string;
  type: PublicationType | 'All';
  role: PublicationRole | 'All';
  tag: string | 'All';
  year: number | 'All';
};

export default function ResearchClient({ initialPublications }: Props) {
  const allTags = useMemo(() => {
    const set = new Set<string>();
    initialPublications.forEach((p) => (p.tags ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialPublications]);

  const allYears = useMemo(() => {
    const set = new Set<number>();
    initialPublications.forEach((p) => set.add(p.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [initialPublications]);

  const featured = useMemo(() => {
    return initialPublications.filter((p) => p.featured).slice(0, 3);
  }, [initialPublications]);

  const inProgress = useMemo(() => {
    return initialPublications
      .filter((p) => (p.status ?? 'Published') !== 'Published')
      .sort((a, b) => b.year - a.year);
  }, [initialPublications]);

  const [filters, setFilters] = useState<FilterState>({
    q: '',
    type: 'All',
    role: 'All',
    tag: 'All',
    year: 'All',
  });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    return initialPublications
      .filter((p) => {
        if (filters.type !== 'All' && p.type !== filters.type) return false;
        if (filters.role !== 'All' && p.role !== filters.role) return false;
        if (filters.year !== 'All' && p.year !== filters.year) return false;
        if (filters.tag !== 'All') {
          const tags = p.tags ?? [];
          if (!tags.includes(filters.tag)) return false;
        }
        if (q) {
          const hay =
            `${p.title} ${p.venue ?? ''} ${(p.tags ?? []).join(' ')} ${p.role} ${p.type}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.year - a.year);
  }, [filters, initialPublications]);

  const counts = useMemo(() => {
    const total = initialPublications.length;
    const shown = filtered.length;
    return { total, shown };
  }, [filtered.length, initialPublications.length]);

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Research</p>
        <h1 className={styles.title}>Publications & academic work.</h1>
        <p className={styles.lead}>
          A curated view of research outputs — collaborations, original work, and ongoing projects.
        </p>

        <div className={styles.metaRow}>
          <span className={styles.metaPill}>
            Showing <strong>{counts.shown}</strong> of <strong>{counts.total}</strong>
          </span>
          <span className={styles.metaHint}>
            Use filters to refine by type, role, tag, or year.
          </span>
        </div>
      </header>

      {/* ✅ Featured (max 3) */}
      <section className={styles.featured}>
        <Featured publications={featured} />
      </section>

      {/* ✅ In Progress band */}
      <section className={styles.inProgress}>
        <InProgress publications={inProgress} />
      </section>

      {/* ✅ Filters */}
      <section className={styles.controls}>
        <Filters value={filters} onChange={setFilters} tags={allTags} years={allYears} />
      </section>

      {/* ✅ Year jump pills (based on filtered years) */}
      <section className={styles.yearJump}>
        <YearJump publications={filtered} />
      </section>

      {/* ✅ Results */}
      <section className={styles.results}>
        <PublicationsList publications={filtered} />
      </section>
    </main>
  );
}
