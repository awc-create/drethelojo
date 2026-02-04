'use client';

import styles from './ProjectFilters.module.scss';
import type { ProjectStatus, ProjectType } from '@/content/projects';

type FilterState = {
  q: string;
  type: ProjectType | 'All';
  status: ProjectStatus | 'All';
  tag: string | 'All';
};

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  tags: string[];
};

const TYPES: Array<ProjectType | 'All'> = [
  'All',
  'AI',
  'Education',
  'Clinical',
  'Research',
  'Other',
];
const STATUSES: Array<ProjectStatus | 'All'> = [
  'All',
  'Active',
  'In progress',
  'Published',
  'Paused',
];

export default function ProjectFilters({ value, onChange, tags }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.search}>
        <label className={styles.label} htmlFor="project-search">
          Search
        </label>
        <input
          id="project-search"
          className={styles.input}
          placeholder="Search projects (e.g. AI, escape room, QIP)…"
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-type">
            Type
          </label>
          <select
            id="project-type"
            className={styles.select}
            value={value.type}
            onChange={(e) => onChange({ ...value, type: e.target.value as FilterState['type'] })}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-status">
            Status
          </label>
          <select
            id="project-status"
            className={styles.select}
            value={value.status}
            onChange={(e) =>
              onChange({ ...value, status: e.target.value as FilterState['status'] })
            }
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="project-tag">
            Tag
          </label>
          <select
            id="project-tag"
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
        </div>

        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange({ q: '', type: 'All', status: 'All', tag: 'All' })}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
