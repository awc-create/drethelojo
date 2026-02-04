'use client';

import styles from './Contact.module.scss';
import { CONTACT } from '@/content/contact';

export default function Contact() {
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Enquiry — Dr Ethel Ojo')}`;

  return (
    <section className={styles.section} aria-label="Contact">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.left}>
            <p className={styles.kicker}>Contact</p>
            <h2 className={styles.title}>{CONTACT.title}</h2>
            <p className={styles.lead}>{CONTACT.lead}</p>

            <div className={styles.meta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Email</span>
                <a className={styles.metaValue} href={mailto}>
                  {CONTACT.email}
                </a>
              </div>

              {CONTACT.location ? (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Location</span>
                  <span className={styles.metaValueMuted}>{CONTACT.location}</span>
                </div>
              ) : null}
            </div>

            <div className={styles.actions}>
              <a className={styles.primary} href={mailto}>
                Send an email
              </a>
              <a className={styles.secondary} href="#top">
                Back to top
              </a>
            </div>

            {CONTACT.note ? <p className={styles.note}>{CONTACT.note}</p> : null}
          </div>

          <div className={styles.right} aria-label="Links">
            <p className={styles.linksTitle}>Links</p>

            <div className={styles.links}>
              {CONTACT.links.map((l) => (
                <a
                  key={l.label}
                  className={styles.link}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.linkLabel}>{l.label}</span>
                  <span className={styles.linkArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>

            <div className={styles.smallCard}>
              <p className={styles.smallKicker}>Availability</p>
              <p className={styles.smallText}>
                Open to dermatology research collaboration and education-focused builds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
