// src/app/journey/JourneyClient.tsx
'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.scss';

import { CLINICAL_ROTATIONS } from '@/content/clinicalTimeline';
import { formatRange, getTimelineState } from '@/lib/timeline';

// ✅ Milestones strip
import MilestonesStrip from '@/components/journey/MilestonesStrip/MilestonesStrip';
import { JOURNEY_MILESTONES } from '@/content/journeyMilestones';

type TabKey = 'clinical' | 'professional';

type Milestone = {
  year?: string;
  title: string;
  detail: string;
  tag?: string;
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

export default function JourneyClient() {
  const [tab, setTab] = useState<TabKey>('clinical');

  const { items, currentIndex, current, next, progress } = useMemo(
    () => getTimelineState(CLINICAL_ROTATIONS),
    []
  );

  const progressPct = Math.round(progress * 100);

  // ✅ a11y ids
  const tabClinicalId = 'journey-tab-clinical';
  const tabProfessionalId = 'journey-tab-professional';
  const panelClinicalId = 'journey-panel-clinical';
  const panelProfessionalId = 'journey-panel-professional';

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Journey</p>
        <h1 className={styles.title}>Clinical progression & professional growth.</h1>
        <p className={styles.lead}>
          A live view of rotations alongside the wider work across research, AI, and education.
        </p>

        {/* ✅ Tabs (proper roles so aria-selected is valid) */}
        <div className={styles.tabs} role="tablist" aria-label="Journey tabs">
          <button
            id={tabClinicalId}
            type="button"
            role="tab"
            aria-selected={tab === 'clinical'}
            aria-controls={panelClinicalId}
            className={`${styles.tab} ${tab === 'clinical' ? styles.tabActive : ''}`}
            onClick={() => setTab('clinical')}
          >
            Clinical timeline
          </button>

          <button
            id={tabProfessionalId}
            type="button"
            role="tab"
            aria-selected={tab === 'professional'}
            aria-controls={panelProfessionalId}
            className={`${styles.tab} ${tab === 'professional' ? styles.tabActive : ''}`}
            onClick={() => setTab('professional')}
          >
            Professional timeline
          </button>
        </div>

        {/* ✅ Milestones strip under hero */}
        <MilestonesStrip items={JOURNEY_MILESTONES} />
      </header>

      <section className={styles.content}>
        {tab === 'clinical' ? (
          <div id={panelClinicalId} role="tabpanel" aria-labelledby={tabClinicalId} tabIndex={0}>
            <div className={styles.nowCard}>
              <div className={styles.nowTop}>
                <div>
                  <p className={styles.nowLabel}>Current Rotation</p>
                  <h2 className={styles.nowTitle}>{current?.title ?? '—'}</h2>
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

            <div className={styles.timeline} role="list">
              {items.map((r, idx) => {
                const isCurrent = idx === currentIndex;
                const isPast = currentIndex >= 0 && idx < currentIndex;

                const skills = Array.isArray(r.skills) ? r.skills : [];
                const competencies = Array.isArray(r.competencies) ? r.competencies : [];
                const goals = Array.isArray(r.goals) ? r.goals : [];

                return (
                  <div
                    key={`${r.start}-${r.title}`}
                    className={`${styles.item} ${isCurrent ? styles.itemCurrent : ''} ${
                      isPast ? styles.itemPast : ''
                    }`}
                    role="listitem"
                  >
                    <div className={styles.dot} aria-hidden="true" />

                    <div className={styles.card}>
                      <div className={styles.topRow}>
                        <span className={styles.range}>{formatRange(r.start, r.end)}</span>
                        {isCurrent ? <span className={styles.badge}>Current</span> : null}
                      </div>

                      <h3 className={styles.itemTitle}>{r.title}</h3>
                      {r.summary ? <p className={styles.itemDetail}>{r.summary}</p> : null}

                      {/* ✅ Expanded detail blocks */}
                      {skills.length > 0 ? (
                        <div className={styles.block}>
                          <p className={styles.blockTitle}>Key focus</p>
                          <ul className={styles.list}>
                            {skills.slice(0, 6).map((s) => (
                              <li key={`${r.title}-skill-${s}`}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {competencies.length > 0 ? (
                        <div className={styles.chips} aria-label="Competencies">
                          {competencies.slice(0, 8).map((c) => (
                            <span key={`${r.title}-comp-${c}`} className={styles.chip}>
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {goals.length > 0 ? (
                        <div className={styles.block}>
                          <p className={styles.blockTitle}>Goals</p>
                          <ul className={styles.list}>
                            {goals.slice(0, 4).map((g) => (
                              <li key={`${r.title}-goal-${g}`}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            id={panelProfessionalId}
            role="tabpanel"
            aria-labelledby={tabProfessionalId}
            tabIndex={0}
          >
            <div className={styles.timeline} role="list">
              {PROFESSIONAL_MILESTONES.map((m) => (
                <div key={`${m.year}-${m.title}`} className={styles.item} role="listitem">
                  <div className={styles.dot} aria-hidden="true" />
                  <div className={styles.card}>
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
          </div>
        )}
      </section>
    </main>
  );
}
