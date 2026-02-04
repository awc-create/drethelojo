'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.scss';

import type { Project, ProjectStatus, ProjectType } from '@/content/projects';
import ProjectFilters from '@/components/projects/ProjectFilters/ProjectFilters';
import ProjectsGrid from '@/components/projects/ProjectsGrid/ProjectsGrid';

type Props = {
  initialProjects: Project[];
};

type FilterState = {
  q: string;
  type: ProjectType | 'All';
  status: ProjectStatus | 'All';
  tag: string | 'All';
};

export default function ProjectsClient({ initialProjects }: Props) {
  const featured = useMemo(() => initialProjects.filter((p) => p.featured), [initialProjects]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => (p.tags ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialProjects]);

  const [filters, setFilters] = useState<FilterState>({
    q: '',
    type: 'All',
    status: 'All',
    tag: 'All',
  });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    return initialProjects
      .filter((p) => {
        if (filters.type !== 'All' && p.type !== filters.type) return false;
        if (filters.status !== 'All' && p.status !== filters.status) return false;
        if (filters.tag !== 'All') {
          const tags = p.tags ?? [];
          if (!tags.includes(filters.tag)) return false;
        }
        if (q) {
          const hay = `${p.title} ${p.summary} ${(p.tags ?? []).join(' ')} ${(p.stack ?? []).join(
            ' '
          )}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }, [filters, initialProjects]);

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Projects</p>
        <h1 className={styles.title}>Builds that support clinical growth.</h1>
        <p className={styles.lead}>
          A curated view of active work across AI, education, and clinical training — with links,
          notes, and progress.
        </p>
      </header>

      {featured.length ? (
        <section className={styles.featured} aria-label="Featured projects">
          <div className={styles.featuredHead}>
            <h2 className={styles.h2}>Featured</h2>
            <p className={styles.h2Lead}>The core builds running right now.</p>
          </div>
          <ProjectsGrid projects={featured} variant="featured" />
        </section>
      ) : null}

      <section className={styles.controls} aria-label="Project filters">
        <ProjectFilters value={filters} onChange={setFilters} tags={allTags} />
      </section>

      <section className={styles.results} aria-label="All projects">
        <ProjectsGrid projects={filtered} variant="default" />
      </section>
    </main>
  );
}
