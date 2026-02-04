'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import styles from './PublicationsList.module.scss';
import type { Publication } from '@/content/publications';
import {
  copyToClipboard,
  downloadTextFile,
  makeBibTeX,
  makeCitation,
  makeRIS,
} from '@/lib/researchExports';

type Props = {
  publications: Publication[];
};

type LinkItem = {
  key: string;
  label: string;
  href: string;
  external: boolean;
  tooltip: string;
  icon: string;
};

type LinkMeta = {
  label: string;
  external: boolean;
  tooltip: string;
  icon: string;
};

const LINK_META: Record<string, LinkMeta> = {
  pubmed: {
    label: 'PubMed',
    external: true,
    tooltip: 'View on PubMed',
    icon: 'mdi:book-open-variant',
  },
  doi: { label: 'DOI', external: true, tooltip: 'Open DOI link', icon: 'mdi:link-variant' },
  journal: {
    label: 'Journal',
    external: true,
    tooltip: 'Open journal page',
    icon: 'mdi:newspaper-variant-outline',
  },
  preprint: {
    label: 'Preprint',
    external: true,
    tooltip: 'View preprint',
    icon: 'mdi:file-clock-outline',
  },
  arxiv: {
    label: 'arXiv',
    external: true,
    tooltip: 'View on arXiv',
    icon: 'mdi:alpha-a-circle-outline',
  },
  pdf: { label: 'PDF', external: true, tooltip: 'Open PDF', icon: 'mdi:file-pdf-box' },

  project: {
    label: 'Project',
    external: false,
    tooltip: 'View related project',
    icon: 'mdi:folder-outline',
  },
  github: { label: 'Code', external: true, tooltip: 'View code repository', icon: 'mdi:github' },
  slides: { label: 'Slides', external: true, tooltip: 'View slides', icon: 'mdi:presentation' },
  osf: { label: 'OSF', external: true, tooltip: 'View on OSF', icon: 'mdi:database-outline' },
};

function buildLinks(p: Publication): LinkItem[] {
  if (!p.links) return [];

  return Object.entries(p.links)
    .filter(([, href]) => typeof href === 'string' && href.trim().length > 0)
    .map(([key, href]) => {
      const meta: LinkMeta = LINK_META[key] ?? {
        label: key.toUpperCase(),
        external: true,
        tooltip: `Open ${key}`,
        icon: 'mdi:open-in-new',
      };

      return {
        key,
        label: meta.label,
        href: href.trim(),
        external: meta.external,
        tooltip: meta.tooltip,
        icon: meta.icon,
      };
    })
    .sort((a, b) => {
      const order = [
        'pubmed',
        'doi',
        'journal',
        'preprint',
        'arxiv',
        'pdf',
        'project',
        'github',
        'slides',
        'osf',
      ];
      const ai = order.indexOf(a.key);
      const bi = order.indexOf(b.key);
      if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

export default function PublicationsList({ publications }: Props) {
  const [toast, setToast] = useState<string>('');

  const mostCitedCount = useMemo(() => {
    let max = 0;
    for (const p of publications) {
      const c = p.metrics?.citations ?? 0;
      if (c > max) max = c;
    }
    return max;
  }, [publications]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 1600);
  };

  if (!publications.length) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No results.</p>
        <p className={styles.emptyText}>Try clearing filters or searching by a different term.</p>
      </div>
    );
  }

  const byYear = publications.reduce<Record<number, Publication[]>>((acc, p) => {
    acc[p.year] = acc[p.year] ?? [];
    acc[p.year].push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear)
    .map((y) => Number(y))
    .sort((a, b) => b - a);

  return (
    <div className={styles.wrap}>
      {toast ? (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}

      {years.map((year) => (
        <section
          key={year}
          id={`year-${year}`}
          className={styles.yearBlock}
          aria-label={`Publications ${year}`}
        >
          <div className={styles.yearHeader}>
            <h2 className={styles.yearTitle}>{year}</h2>
            <span className={styles.yearCount}>{byYear[year].length} items</span>
          </div>

          <div className={styles.grid}>
            {byYear[year].map((p) => {
              const linkItems = buildLinks(p);
              const status = p.status ?? 'Published';
              const citations = p.metrics?.citations;
              const impact = p.metrics?.impactFactor;

              const isMostCited = mostCitedCount > 0 && (citations ?? 0) === mostCitedCount;

              const hasTags = (p.tags?.length ?? 0) > 0;
              const hasLinks = linkItems.length > 0;
              const hasMetrics = typeof citations === 'number' || typeof impact === 'number';

              return (
                <article key={p.id} className={styles.card}>
                  <div className={styles.paperIcon} aria-hidden="true">
                    <Icon icon="mdi:file-document-outline" />
                  </div>

                  <div className={styles.topRow}>
                    <span className={styles.meta}>{p.type}</span>
                    <span className={styles.role}>{p.role}</span>
                  </div>

                  <h3 className={styles.title} title={p.title}>
                    {p.title}
                  </h3>

                  {p.venue ? <p className={styles.venue}>{p.venue}</p> : null}
                  {p.summary ? <p className={styles.summary}>{p.summary}</p> : null}

                  <div className={styles.badgeRow}>
                    <span className={styles.status} title="Publication status">
                      {status}
                    </span>
                    {isMostCited ? (
                      <span
                        className={styles.mostCited}
                        title="Highest citation count in this list"
                      >
                        Most cited
                      </span>
                    ) : null}
                  </div>

                  {hasMetrics ? (
                    <div className={styles.metrics} aria-label="Metrics">
                      {typeof citations === 'number' ? (
                        <span className={styles.metric} title="Citations (e.g. Google Scholar)">
                          Citations: <strong>{citations}</strong>
                        </span>
                      ) : null}
                      {typeof impact === 'number' ? (
                        <span
                          className={styles.metric}
                          title="Impact factor (journal-level metric)"
                        >
                          Impact factor: <strong>{impact}</strong>
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {hasTags || hasLinks ? (
                    <div className={styles.footerStack}>
                      {hasTags ? (
                        <div className={styles.tags} aria-label="Tags">
                          {(p.tags ?? []).slice(0, 12).map((t) => (
                            <span key={`${p.id}-${t}`} className={styles.tag}>
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {hasLinks ? (
                        <div className={styles.links} aria-label="Links">
                          {linkItems.map((l) => (
                            <Link
                              key={`${p.id}-${l.key}`}
                              href={l.href}
                              className={styles.link}
                              title={l.tooltip}
                              aria-label={l.tooltip}
                              {...(l.external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                            >
                              <Icon icon={l.icon} className={styles.linkIcon} aria-hidden="true" />
                              <span>{l.label}</span>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className={styles.divider} aria-hidden="true" />

                  <div className={styles.actions} aria-label="Citations and exports">
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.actionPrimary}`}
                      title="Copy citation"
                      onClick={async () => {
                        const text = makeCitation(p);
                        const ok = await copyToClipboard(text);
                        showToast(ok ? 'Citation copied' : 'Copy failed');
                      }}
                    >
                      Copy citation
                    </button>

                    <button
                      type="button"
                      className={styles.actionBtn}
                      title="Download BibTeX"
                      onClick={() => {
                        const bib = makeBibTeX(p);
                        downloadTextFile(`${p.id}.bib`, bib);
                        showToast('BibTeX downloaded');
                      }}
                    >
                      BibTeX
                    </button>

                    <button
                      type="button"
                      className={styles.actionBtn}
                      title="Download RIS"
                      onClick={() => {
                        const ris = makeRIS(p);
                        downloadTextFile(`${p.id}.ris`, ris);
                        showToast('RIS downloaded');
                      }}
                    >
                      RIS
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
