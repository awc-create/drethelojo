'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './Research.module.scss';

import { PUBLICATIONS, type Publication } from '@/content/publications';

type FilterKey = 'All' | 'First author' | 'Co-author' | 'Journal' | 'Abstract' | 'Poster' | 'AI';

const FILTERS: FilterKey[] = [
  'All',
  'First author',
  'Co-author',
  'Journal',
  'Abstract',
  'Poster',
  'AI',
];

function matchesFilter(p: Publication, f: FilterKey) {
  if (f === 'All') return true;
  if (f === 'First author') return p.role === 'First author';
  if (f === 'Co-author') return p.role === 'Co-author';
  if (f === 'Journal') return p.type === 'Journal';
  if (f === 'Abstract') return p.type === 'Abstract';
  if (f === 'Poster') return p.type === 'Poster';
  if (f === 'AI') return (p.tags ?? []).some((t) => t.toLowerCase() === 'ai');
  return true;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export default function Research() {
  const [filter, setFilter] = useState<FilterKey>('All');

  const items = useMemo(() => {
    const filtered = PUBLICATIONS.filter((p) => matchesFilter(p, filter));
    return filtered.sort((a, b) => b.year - a.year);
  }, [filter]);

  return (
    <section className={styles.section} aria-label="Research highlights">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker}>Research</p>
          <h2 className={styles.title}>Selected work & collaborations.</h2>
          <p className={styles.lead}>
            A snapshot of publications, abstracts, and projects — shaped by curiosity, rigour, and
            practical impact in dermatology.
          </p>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.filters} role="list" aria-label="Filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`${styles.filter} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <Link href="/research" className={styles.viewAll}>
            View all research
          </Link>
        </div>

        <div className={styles.grid} role="list">
          {items.map((p) => {
            const pubmed = p.links?.pubmed;
            const doi = p.links?.doi;
            const pdf = p.links?.pdf;
            const project = p.links?.project;

            return (
              <article key={p.id} className={styles.card} role="listitem">
                <div className={styles.cardTop}>
                  <div className={styles.metaRow}>
                    <span className={styles.badge}>{p.type}</span>
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={styles.meta}>{p.year}</span>
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={styles.meta}>{p.role}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{p.title}</h3>

                  {p.venue ? <p className={styles.venue}>{p.venue}</p> : null}
                  {p.summary ? <p className={styles.summary}>{p.summary}</p> : null}
                </div>

                <div className={styles.cardBottom}>
                  <div className={styles.tags} aria-label="Tags">
                    {(p.tags ?? []).slice(0, 4).map((t) => (
                      <span key={`${p.id}-${t}`} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className={styles.links}>
                    {isNonEmptyString(pubmed) ? (
                      <a href={pubmed} target="_blank" rel="noreferrer" className={styles.link}>
                        PubMed
                      </a>
                    ) : null}

                    {isNonEmptyString(doi) ? (
                      <a href={doi} target="_blank" rel="noreferrer" className={styles.link}>
                        DOI
                      </a>
                    ) : null}

                    {isNonEmptyString(pdf) ? (
                      <a href={pdf} target="_blank" rel="noreferrer" className={styles.link}>
                        PDF
                      </a>
                    ) : null}

                    {/* ✅ TS-safe: only render Link when project is a string */}
                    {isNonEmptyString(project) ? (
                      <Link href={project} className={styles.linkSoft}>
                        Project
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>No items match this filter yet.</p>
        ) : null}
      </div>
    </section>
  );
}
