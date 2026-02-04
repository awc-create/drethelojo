'use client';

import Link from 'next/link';
import styles from './ProjectCard.module.scss';
import type { Project } from '@/content/projects';

type Props = {
  project: Project;
};

function buildCtas(p: Project) {
  const links = p.links ?? {};
  const items: Array<{ key: string; label: string; href: string; external: boolean }> = [];

  if (links.demo) items.push({ key: 'demo', label: 'View', href: links.demo, external: false });
  if (links.docs) items.push({ key: 'docs', label: 'Details', href: links.docs, external: false });
  if (links.github)
    items.push({ key: 'github', label: 'GitHub', href: links.github, external: true });
  if (links.paper) items.push({ key: 'paper', label: 'Paper', href: links.paper, external: true });
  if (links.slides)
    items.push({ key: 'slides', label: 'Slides', href: links.slides, external: true });
  if (links.video) items.push({ key: 'video', label: 'Video', href: links.video, external: true });

  return items.slice(0, 3);
}

export default function ProjectCard({ project }: Props) {
  const ctas = buildCtas(project);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.metaRow}>
          <span className={styles.type}>{project.type}</span>
          <span className={styles.status}>{project.status}</span>
        </div>

        <h3 className={styles.title} title={project.title}>
          {project.title}
        </h3>

        <p className={styles.summary}>{project.summary}</p>
      </div>

      {(project.tags?.length ?? 0) > 0 ? (
        <div className={styles.tags} aria-label="Tags">
          {project.tags!.slice(0, 10).map((t) => (
            <span key={`${project.id}-${t}`} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {(project.stack?.length ?? 0) > 0 ? (
        <div className={styles.stack} aria-label="Stack">
          {project.stack!.slice(0, 6).map((s) => (
            <span key={`${project.id}-stack-${s}`} className={styles.stackItem}>
              {s}
            </span>
          ))}
        </div>
      ) : null}

      {project.metrics?.stars || project.metrics?.users || project.metrics?.citations ? (
        <div className={styles.metrics} aria-label="Metrics">
          {typeof project.metrics?.stars === 'number' ? (
            <span className={styles.metric}>
              Stars: <strong>{project.metrics.stars}</strong>
            </span>
          ) : null}
          {typeof project.metrics?.users === 'number' ? (
            <span className={styles.metric}>
              Users: <strong>{project.metrics.users}</strong>
            </span>
          ) : null}
          {typeof project.metrics?.citations === 'number' ? (
            <span className={styles.metric}>
              Citations: <strong>{project.metrics.citations}</strong>
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.actions}>
        {ctas.length ? (
          <>
            {ctas.map((c, idx) => (
              <Link
                key={`${project.id}-cta-${c.key}`}
                href={c.href}
                className={idx === 0 ? styles.primary : styles.secondary}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {c.label}
              </Link>
            ))}
          </>
        ) : (
          <Link href={`/projects/${project.id}`} className={styles.primary}>
            View
          </Link>
        )}
      </div>
    </article>
  );
}
