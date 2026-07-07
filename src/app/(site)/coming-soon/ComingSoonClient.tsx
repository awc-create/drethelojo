'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.scss';

import { GATE_QUESTIONS } from '@/content/gateQuestions';

export default function ComingSoonClient() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/';

  const questions = useMemo(() => GATE_QUESTIONS, []);
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>(
    Array.from({ length: questions.length }, () => '')
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAnswerAt = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const unlock = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/gate/unlock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        setError('Not quite — try again.');
        setLoading(false);
        return;
      }

      window.location.href = from;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* ================= HERO CARD ================= */}
      <section className={styles.card}>
        <p className={styles.kicker}>Dr Ethel Ojo</p>

        <h1 className={styles.title}>Coming soon.</h1>

        <p className={styles.lead}>
          A portfolio documenting clinical progression, research, AI, and medical education work.
        </p>

        <div className={styles.row}>
          <span className={styles.pill}>Dermatology · Research · AI · Education</span>

          <button type="button" className={styles.private} onClick={() => setOpen(true)}>
            Private access
          </button>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalTop}>
              <h2 className={styles.modalTitle}>Private access</h2>

              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className={styles.modalLead}>Answer the questions to unlock the full site.</p>

            {/* ================= QUESTIONS ================= */}
            <div className={styles.form}>
              {questions.map((q, i) => (
                <label key={q.id} className={styles.field}>
                  <span className={styles.label}>{q.prompt}</span>

                  <input
                    className={styles.input}
                    value={answers[i] ?? ''}
                    placeholder={q.placeholder ?? 'answer…'}
                    onChange={(e) => setAnswerAt(i, e.target.value)}
                    autoComplete="off"
                  />
                </label>
              ))}
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <button
              type="button"
              className={styles.unlock}
              onClick={unlock}
              disabled={loading || questions.length === 0}
            >
              {loading ? 'Unlocking…' : 'Unlock'}
            </button>

            {questions.length === 0 ? (
              <p className={styles.hint}>
                Gate questions aren’t set yet. Add them in <code>src/content/gateQuestions.ts</code>
                .
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
