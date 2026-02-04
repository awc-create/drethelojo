// src/components/home/journey/Journey.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './Journey.module.scss';

import { CLINICAL_ROTATIONS } from '@/content/clinicalTimeline';
import { formatRange, getTimelineState } from '@/lib/timeline';

type Milestone = {
  year?: string; // e.g. "Now"
  title: string;
  detail: string;
  tag?: string; // e.g. "Training"
};

const PROFESSIONAL_MILESTONES: Milestone[] = [
  {
    year: 'Now',
    tag: 'Training',
    title: 'Clinical Training',
    detail:
      'Building dermatology-aligned competencies, documenting progress, and strengthening patient-facing confidence.',
  },
  {
    year: 'Ongoing',
    tag: 'Research',
    title: 'Research & Publications',
    detail:
      'Contributing to collaborative papers and leading original work — focused on dermatology outcomes and evidence-based care.',
  },
  {
    year: 'Project',
    tag: 'AI',
    title: 'Dermatology AI',
    detail:
      'Exploring AI-assisted approaches that support clinical decision-making, learning, and responsible innovation.',
  },
  {
    year: 'Build',
    tag: 'Education',
    title: 'Teaching Escape Room App',
    detail:
      'Designing an interactive learning experience for dermatology aspirants — case-based, fun, and high-retention.',
  },
];

type TabKey = 'clinical' | 'professional';

export default function Journey() {
  const [tab, setTab] = useState<TabKey>('clinical');

  const { items, currentIndex, current, next, progress } = useMemo(
    () => getTimelineState(CLINICAL_ROTATIONS),
    []
  );

  const progressPct = Math.round(progress * 100);

  // placeholders (wire later)
  const stats = {
    publications: '—',
    collaborations: '—',
    activeBuilds: '2',
    currentPath: 'IMT 1',
  };

  return (
    <section className={styles.section} aria-label="Journey">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker}>Journey</p>
          <h2 className={styles.title}>Progress, in two lenses.</h2>
          <p className={styles.lead}>
            Follow the live clinical rotations — and the broader professional journey across
            research, AI, and education.
          </p>
        </header>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Journey tabs">
          <button
            type="button"
            className={`${styles.tab} ${tab === 'clinical' ? styles.tabActive : ''}`}
            onClick={() => setTab('clinical')}
            role="tab"
            aria-selected={tab === 'clinical'}
          >
            Clinical timeline
          </button>

          <button
            type="button"
            className={`${styles.tab} ${tab === 'professional' ? styles.tabActive : ''}`}
            onClick={() => setTab('professional')}
            role="tab"
            aria-selected={tab === 'professional'}
          >
            Professional timeline
          </button>
        </div>

        <div className={styles.grid}>
          {/* LEFT */}
          <div className={styles.panel}>
            {tab === 'clinical' ? (
              <>
                {/* Live current rotation card */}
                <div className={styles.nowCard}>
                  <div className={styles.nowTop}>
                    <div>
                      <p className={styles.nowLabel}>Current Rotation</p>
                      <h3 className={styles.nowTitle}>{current?.title ?? '—'}</h3>
                      <p className={styles.nowRange}>
                        {current ? formatRange(current.start, current.end) : 'Not in range'}
                      </p>
                    </div>

                    <div className={styles.progressPill} aria-label={`Progress ${progressPct}%`}>
                      <span className={styles.progressText}>{progressPct}%</span>
                    </div>
                  </div>

                  <div className={styles.progressBar} aria-hidden="true">
                    <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                  </div>

                  <div className={styles.nextRow}>
                    <span className={styles.nextLabel}>Next:</span>
                    <span className={styles.nextValue}>
                      {next ? `${next.title} · ${formatRange(next.start, next.end)}` : '—'}
                    </span>
                  </div>
                </div>

                {/* Clinical list */}
                <div className={styles.timeline} role="list">
                  {items.map((r, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isPast = currentIndex >= 0 && idx < currentIndex;

                    return (
                      <div
                        key={`${r.start}-${r.title}`}
                        className={`${styles.item} ${isCurrent ? styles.itemCurrent : ''} ${
                          isPast ? styles.itemPast : ''
                        }`}
                        role="listitem"
                      >
                        <div className={styles.dot} aria-hidden="true" />
                        <div className={styles.content}>
                          <div className={styles.topRow}>
                            <span className={styles.range}>{formatRange(r.start, r.end)}</span>
                            {isCurrent ? <span className={styles.badge}>Current</span> : null}
                          </div>
                          <h3 className={styles.itemTitle}>{r.title}</h3>
                          {r.summary ? <p className={styles.itemDetail}>{r.summary}</p> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Professional list */}
                <div className={styles.timeline} role="list">
                  {PROFESSIONAL_MILESTONES.map((m) => (
                    <div key={`${m.year}-${m.title}`} className={styles.item} role="listitem">
                      <div className={styles.dot} aria-hidden="true" />
                      <div className={styles.content}>
                        <div className={styles.topRow}>
                          {m.year ? <span className={styles.range}>{m.year}</span> : null}
                          {m.tag ? <span className={styles.tag}>{m.tag}</span> : null}
                        </div>
                        <h3 className={styles.itemTitle}>{m.title}</h3>
                        <p className={styles.itemDetail}>{m.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          <aside className={styles.sideCard} aria-label="Summary">
            <p className={styles.sideKicker}>At a glance</p>

            <div className={styles.sideBlock}>
              <span className={styles.sideLabel}>Current path</span>
              <p className={styles.sideText}>{stats.currentPath}</p>
            </div>

            <div className={styles.sideBlock}>
              <span className={styles.sideLabel}>Clinical (Now)</span>
              <p className={styles.sideText}>{current?.title ?? '—'}</p>
            </div>

            <div className={styles.sideBlock}>
              <span className={styles.sideLabel}>Clinical (Next)</span>
              <p className={styles.sideText}>{next?.title ?? '—'}</p>
            </div>

            <div className={styles.sideBlock}>
              <span className={styles.sideLabel}>Professional</span>
              <p className={styles.sideText}>
                Research, AI, and education projects running alongside training.
              </p>
            </div>

            <div className={styles.sideActions}>
              <Link href="/journey" className={styles.sideBtn}>
                View full journey
              </Link>
              <Link href="/projects" className={styles.sideLink}>
                Explore projects
              </Link>
            </div>
          </aside>
        </div>

        {/* ✅ Stats row (restored + extra card) */}
        <div className={styles.stats} aria-label="Highlights">
          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.publications}</span>
            <span className={styles.statLabel}>Publications</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.collaborations}</span>
            <span className={styles.statLabel}>Research collaborations</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.activeBuilds}</span>
            <span className={styles.statLabel}>Active builds</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.currentPath}</span>
            <span className={styles.statLabel}>Current path</span>
          </div>
        </div>
      </div>
    </section>
  );
}
