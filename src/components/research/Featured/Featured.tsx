'use client';

import Link from 'next/link';
import styles from './Featured.module.scss';
import type { Publication } from '@/content/publications';

type Props = {
  publications: Publication[];
};

const LINK_META: Record<string, { label: string; external: boolean; tooltip: string }> = {
  pubmed: { label: 'PubMed', external: true, tooltip: 'View on PubMed' },
  doi: { label: 'DOI', external: true, tooltip: 'Open DOI link' },
  pdf: { label: 'PDF', external: true, tooltip: 'Open PDF' },
  project: { label: 'Project', external: false, tooltip: 'View related project' },
  arxiv: { label: 'arXiv', external: true, tooltip: 'View on arXiv' },
  journal: { label: 'Journal', external: true, tooltip: 'Open journal page' },
  github: { label: 'Code', external: true, tooltip: 'View code repository' },
  slides: { label: 'Slides', external: true, tooltip: 'View slides' },
  osf: { label: 'OSF', external: true, tooltip: 'View on OSF' },
};

function buildLinks(p: Publication) {
  if (!p.links) return [];

  return Object.entries(p.links)
    .filter(([, href]) => typeof href === 'string' && href.trim().length > 0)
    .map(([key, href]) => {
      const meta = LINK_META[key] ?? {
        label: key.toUpperCase(),
        external: true,
        tooltip: `Open ${key}`,
      };
      return { key, href: href.trim(), ...meta };
    });
}

export default function Featured({ publications }: Props) {
  if (!publications.length) return null;

  return (
    <section className={styles.wrap} aria-label="Featured research">
      <div className={styles.head}>
        <h2 className={styles.title}>Featured</h2>
        <p className={styles.lead}>A few highlights worth starting with.</p>
      </div>

      <div className={styles.grid}>
        {publications.slice(0, 3).map((p) => {
          const links = buildLinks(p);
          const status = p.status ?? 'Published';

          return (
            <article key={p.id} className={styles.card}>
              <div className={styles.topRow}>
                <span className={styles.meta}>
                  {p.type} · {p.year}
                </span>
                <span className={styles.status} title="Publication status">
                  {status}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{p.title}</h3>
              {p.venue ? <p className={styles.venue}>{p.venue}</p> : null}
              {p.summary ? <p className={styles.summary}>{p.summary}</p> : null}

              {(p.tags?.length ?? 0) > 0 ? (
                <div className={styles.tags} aria-label="Tags">
                  {p.tags!.slice(0, 8).map((t) => (
                    <span key={`${p.id}-${t}`} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {links.length > 0 ? (
                <div className={styles.links} aria-label="Links">
                  {links.map((l) => (
                    <Link
                      key={`${p.id}-${l.key}`}
                      href={l.href}
                      className={styles.link}
                      title={l.tooltip}
                      aria-label={l.tooltip}
                      {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
