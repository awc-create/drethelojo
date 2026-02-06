'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.scss';

import { GATE_QUESTIONS } from '@/content/gateQuestions';

export default function ComingSoonClient() {
  const sp = useSearchParams();
  const from = sp.get('from') ?? '/';

  const questions = useMemo(() => GATE_QUESTIONS, []);
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>(
    Array.from({ length: questions.length }, () => '')
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAt = (i: number, v: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[i] = v;
      return copy;
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
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
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

      {open ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalTop}>
              <h2 className={styles.modalTitle}>Private access</h2>
              <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <p className={styles.modalLead}>Answer the questions to unlock the full site.</p>

            <div className={styles.form}>
              {questions.map((q, i) => (
                <label key={q.id} className={styles.field}>
                  <span className={styles.label}>{q.prompt}</span>
                  <input
                    className={styles.input}
                    value={answers[i] ?? ''}
                    placeholder={q.placeholder ?? 'answer…'}
                    onChange={(e) => setAt(i, e.target.value)}
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
