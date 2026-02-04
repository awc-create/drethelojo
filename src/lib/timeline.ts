// src/lib/timeline.ts
import type { Rotation } from '@/content/clinicalTimeline';

function toDate(d: string) {
  // Interpret as local date (avoid timezone shifting)
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1, 12, 0, 0);
}

export function getTimelineState(rotations: Rotation[], now = new Date()) {
  const items = [...rotations].sort(
    (a, b) => toDate(a.start).getTime() - toDate(b.start).getTime()
  );

  const t = now.getTime();

  const currentIndex = items.findIndex((r) => {
    const s = toDate(r.start).getTime();
    const e = toDate(r.end).getTime();
    return t >= s && t < e;
  });

  const current = currentIndex >= 0 ? items[currentIndex] : null;
  const next = currentIndex >= 0 ? (items[currentIndex + 1] ?? null) : (items[0] ?? null);

  let progress = 0;
  if (current) {
    const s = toDate(current.start).getTime();
    const e = toDate(current.end).getTime();
    progress = Math.min(1, Math.max(0, (t - s) / (e - s)));
  }

  return { items, currentIndex, current, next, progress };
}

export function formatMonthYear(d: string) {
  const dt = toDate(d);
  return dt.toLocaleString(undefined, { month: 'short', year: 'numeric' });
}

export function formatRange(start: string, end: string) {
  return `${formatMonthYear(start)} — ${formatMonthYear(end)}`;
}
