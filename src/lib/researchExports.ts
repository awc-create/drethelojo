// src/lib/researchExports.ts
import type { Publication } from '@/content/publications';

export function makeCitation(p: Publication): string {
  if (p.citation && p.citation.trim()) return p.citation.trim();

  // Clean, consistent fallback
  const venue = p.venue ? ` ${p.venue}.` : '';
  const role = p.role ? ` (${p.role})` : '';
  const type = p.type ? ` [${p.type}]` : '';
  const year = p.year ? ` ${p.year}.` : '';

  return `${p.title}.${venue}${year}${type}${role}`.replace(/\s+/g, ' ').trim();
}

export function makeBibTeX(p: Publication): string {
  const key = `Ojo${p.year}${slugKey(p.title)}`;
  const title = sanitizeBib(p.title);
  const journalOrVenue = sanitizeBib(p.venue ?? '');
  const year = String(p.year);

  // If DOI exists, include it
  const doi = (p.links?.doi ?? '').trim();
  const url =
    (p.links?.pubmed ?? '').trim() ||
    (p.links?.journal ?? '').trim() ||
    (p.links?.arxiv ?? '').trim() ||
    (p.links?.project ?? '').trim() ||
    '';

  const lines: string[] = [];
  lines.push(`@misc{${key},`);
  lines.push(`  title={${title}},`);
  if (journalOrVenue) lines.push(`  howpublished={${journalOrVenue}},`);
  lines.push(`  year={${year}},`);
  if (doi) lines.push(`  doi={${sanitizeBib(doi)}},`);
  if (url) lines.push(`  url={${sanitizeBib(url)}},`);
  lines.push(`  note={${sanitizeBib(p.type)}; ${sanitizeBib(p.role)}},`);
  lines.push(`}`);

  return lines.join('\n');
}

export function makeRIS(p: Publication): string {
  const type = risType(p.type);
  const title = p.title ?? '';
  const year = p.year ? String(p.year) : '';
  const venue = p.venue ?? '';

  // Prefer DOI / PubMed / Journal URL
  const doi = (p.links?.doi ?? '').trim();
  const url =
    (p.links?.pubmed ?? '').trim() ||
    (p.links?.journal ?? '').trim() ||
    (p.links?.arxiv ?? '').trim() ||
    (p.links?.project ?? '').trim() ||
    '';

  const out: string[] = [];
  out.push(`TY  - ${type}`);
  if (title) out.push(`TI  - ${title}`);
  if (venue) out.push(`JO  - ${venue}`);
  if (year) out.push(`PY  - ${year}`);
  if (doi) out.push(`DO  - ${doi}`);
  if (url) out.push(`UR  - ${url}`);
  out.push(`N1  - ${p.type}; ${p.role}`);
  out.push(`ER  - `);

  return out.join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function slugKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 18);
}

function sanitizeBib(s: string): string {
  return s.replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}

function risType(t: string): string {
  switch (t) {
    case 'Journal':
      return 'JOUR';
    case 'Preprint':
      return 'PREP';
    case 'Abstract':
      return 'ABST';
    case 'Poster':
      return 'CONF';
    case 'Presentation':
      return 'SLIDE';
    case 'Game':
      return 'COMP';
    default:
      return 'GEN';
  }
}
