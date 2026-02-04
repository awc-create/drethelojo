// src/content/publications.ts

export type PublicationType =
  | 'Journal'
  | 'Preprint'
  | 'Abstract'
  | 'Poster'
  | 'Presentation'
  | 'Game'
  | 'Other';

export type PublicationRole = 'First author' | 'Co-author' | 'Contributor';

export type PublicationStatus = 'Published' | 'Submitted' | 'Under review' | 'In prep';

export type PublicationLinks = {
  pubmed?: string;
  doi?: string;
  pdf?: string;
  project?: string;

  // ✅ academic extras supported by UI
  preprint?: string; // e.g. medRxiv / bioRxiv / institutional repo
  arxiv?: string;
  journal?: string;
  github?: string;
  slides?: string;
  osf?: string;
};

export type PublicationMetrics = {
  citations?: number; // e.g. Google Scholar citations count
  impactFactor?: number; // journal impact factor (if relevant)
};

export type Publication = {
  id: string;
  title: string;
  year: number;
  type: PublicationType;
  role: PublicationRole;

  venue?: string;
  summary?: string;

  // optional: if you want a manual citation instead of auto-generated
  citation?: string;

  tags?: string[];
  links?: PublicationLinks;

  featured?: boolean;
  status?: PublicationStatus;

  metrics?: PublicationMetrics;
};

export const PUBLICATIONS: Publication[] = [
  {
    id: 'p1',
    title: 'Title of dermatology-related paper goes here',
    year: 2025,
    type: 'Journal',
    role: 'Co-author',
    venue: 'Journal Name (or submitted)',
    summary: 'Short one-liner about the focus and the contribution.',
    tags: ['Dermatology', 'Clinical'],
    status: 'Published',
    featured: true,
    metrics: { citations: 12, impactFactor: 5.2 },
    links: {
      pubmed: '',
      doi: '',
      pdf: '',
      journal: '',
    },
  },
  {
    id: 'p2',
    title: 'AI in dermatology — project/paper title placeholder',
    year: 2026,
    type: 'Abstract',
    role: 'First author',
    venue: 'Conference / Symposium',
    summary: 'Investigating AI-assisted tools for learning support and diagnostic reasoning.',
    tags: ['Dermatology', 'AI'],
    status: 'Submitted',
    featured: true,
    metrics: { citations: 0 },
    links: {
      project: '/projects/derm-ai',
      slides: '',
      preprint: '', // ✅ now valid
    },
  },
  {
    id: 'p3',
    title: 'QIP',
    year: 2026,
    type: 'Presentation',
    role: 'First author',
    venue: 'Teaching / Medical education venue',
    summary: '',
    tags: ['Education', 'Dermatology'],
    status: 'In prep',
    featured: false,
    metrics: { citations: 3 },
    links: {
      project: '/research',
      pdf: '',
      slides: '',
    },
  },
];
