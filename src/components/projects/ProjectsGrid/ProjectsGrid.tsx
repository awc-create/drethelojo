'use client';

import styles from './ProjectsGrid.module.scss';
import type { Project } from '@/content/projects';
import ProjectCard from '@/components/projects/ProjectCard/ProjectCard';

type Props = {
  projects: Project[];
  variant: 'featured' | 'default';
};

export default function ProjectsGrid({ projects, variant }: Props) {
  if (!projects.length) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No results.</p>
        <p className={styles.emptyText}>
          Try clearing filters or searching for a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div className={variant === 'featured' ? styles.gridFeatured : styles.grid}>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
