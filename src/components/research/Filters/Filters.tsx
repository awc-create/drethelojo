'use client';

import styles from './Filters.module.scss';
import type { PublicationRole, PublicationType } from '@/content/publications';

type FilterState = {
  q: string;
  type: PublicationType | 'All';
  role: PublicationRole | 'All';
  tag: string | 'All';
  year: number | 'All';
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  tags: string[];
  years: number[];
};

export default function Filters({ value, onChange, tags, years }: Props) {
  return (
    <div className={styles.wrap} aria-label="Research filters">
      <div className={styles.row}>
        <label className={styles.label}>
          <span>Search</span>
          <input
            className={styles.input}
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
            placeholder="Title, venue, tag…"
          />
        </label>

        <label className={styles.label}>
          <span>Type</span>
          <select
            className={styles.select}
            value={value.type}
            onChange={(e) => onChange({ ...value, type: e.target.value as FilterState['type'] })}
          >
            <option value="All">All</option>
            <option value="Paper">Paper</option>
            <option value="Abstract">Abstract</option>
            <option value="Poster">Poster</option>
            <option value="Preprint">Preprint</option>
          </select>
        </label>

        <label className={styles.label}>
          <span>Role</span>
          <select
            className={styles.select}
            value={value.role}
            onChange={(e) => onChange({ ...value, role: e.target.value as FilterState['role'] })}
          >
            <option value="All">All</option>
            <option value="First author">First author</option>
            <option value="Co-author">Co-author</option>
            <option value="Contributor">Contributor</option>
          </select>
        </label>

        <label className={styles.label}>
          <span>Tag</span>
          <select
            className={styles.select}
            value={value.tag}
            onChange={(e) => onChange({ ...value, tag: e.target.value as FilterState['tag'] })}
          >
            <option value="All">All</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          <span>Year</span>
          <select
            className={styles.select}
            value={value.year}
            onChange={(e) =>
              onChange({
                ...value,
                year: e.target.value === 'All' ? 'All' : Number(e.target.value),
              })
            }
          >
            <option value="All">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange({ q: '', type: 'All', role: 'All', tag: 'All', year: 'All' })}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
