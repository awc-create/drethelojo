'use client';

import Link from 'next/link';
import styles from './Projects.module.scss';
import { PROJECTS } from '@/content/projects';
import type { Project, ProjectStatus } from '@/content/projects';

function statusTone(status: ProjectStatus) {
  if (status === 'Active') return styles.statusActive;
  if (status === 'In progress') return styles.statusProgress;
  if (status === 'Published') return styles.statusPublished;
  return styles.statusPaused;
}

function primaryCta(p: Project): { href: string; label: string; external?: boolean } {
  const links = p.links ?? {};

  // Prefer internal “Details” pages if you have them
  if (typeof links.docs === 'string' && links.docs.trim()) {
    return { href: links.docs.trim(), label: 'View details' };
  }

  // Or a demo page if internal
  if (typeof links.demo === 'string' && links.demo.trim()) {
    const href = links.demo.trim();
    const external = /^https?:\/\//i.test(href);
    return { href, label: external ? 'Open demo' : 'View project', external };
  }

  // Fall back to a conventional details route
  return { href: `/projects/${p.id}`, label: 'View project' };
}

export default function Projects() {
  // Home should “tease”, so show a small curated set
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 2);
  const shown = featured.length ? featured : PROJECTS.slice(0, 2);

  return (
    <section className={styles.section} aria-label="Projects">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker}>Projects</p>
          <h2 className={styles.title}>Where research becomes impact.</h2>
          <p className={styles.lead}>
            Active builds alongside training — focused on dermatology AI, and education through
            interactive learning.
          </p>
        </header>

        <div className={styles.grid}>
          {shown.map((p) => {
            const cta = primaryCta(p);
            const bgSrc = p.cover?.src;

            return (
              <article key={p.id} className={styles.card}>
                {/* optional soft background image layer */}
                {bgSrc ? (
                  <div
                    className={styles.bg}
                    style={{ backgroundImage: `url(${bgSrc})` }}
                    aria-hidden="true"
                  />
                ) : null}

                <div className={styles.overlay} aria-hidden="true" />

                <div className={styles.cardInner}>
                  <div className={styles.topRow}>
                    <span className={`${styles.status} ${statusTone(p.status)}`}>{p.status}</span>
                    {typeof p.year === 'number' ? (
                      <span className={styles.year}>{p.year}</span>
                    ) : null}
                  </div>

                  <h3 className={styles.cardTitle}>{p.title}</h3>

                  {/* subtitle -> use "type + status" microline */}
                  <p className={styles.subtitle}>
                    {p.type} · {p.status}
                  </p>

                  {/* description -> summary + optional detail */}
                  <p className={styles.desc}>{p.summary}</p>
                  {p.detail ? <p className={styles.descMuted}>{p.detail}</p> : null}

                  {(p.tags?.length ?? 0) > 0 ? (
                    <div className={styles.tags} aria-label="Tags">
                      {(p.tags ?? []).slice(0, 4).map((t) => (
                        <span key={`${p.id}-${t}`} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className={styles.actions}>
                    {cta.external ? (
                      <a
                        href={cta.href}
                        className={styles.primary}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cta.label}
                      </a>
                    ) : (
                      <Link href={cta.href} className={styles.primary}>
                        {cta.label}
                      </Link>
                    )}

                    <Link href="/projects" className={styles.secondary}>
                      View all projects
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
