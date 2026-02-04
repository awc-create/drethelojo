export type ProjectType = 'AI' | 'Education' | 'Clinical' | 'Research' | 'Other';
export type ProjectStatus = 'Active' | 'In progress' | 'Published' | 'Paused';

export type ProjectLinkKey = 'demo' | 'github' | 'paper' | 'slides' | 'video' | 'docs';

export type Project = {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;

  year?: number;
  summary: string;
  detail?: string;

  tags?: string[];
  stack?: string[]; // e.g. ["Next.js", "TypeScript", "Prisma"]

  featured?: boolean;

  metrics?: {
    stars?: number;
    users?: number;
    citations?: number;
  };

  links?: Partial<Record<ProjectLinkKey, string>>;

  // for future: cover images
  cover?: {
    src: string;
    alt: string;
  };
};

export const PROJECTS: Project[] = [
  {
    id: 'derm-ai',
    title: 'Dermatology AI (Clinical Learning Companion)',
    type: 'AI',
    status: 'In progress',
    year: 2026,
    summary:
      'Exploring AI-assisted approaches that support clinical decision-making, learning, and responsible innovation.',
    tags: ['Dermatology', 'AI', 'Clinical'],
    stack: ['TypeScript', 'Next.js'],
    featured: true,
    metrics: { citations: 0 },
    links: {
      docs: '/projects/derm-ai',
    },
  },
  {
    id: 'escape-room',
    title: 'Teaching Escape Room App (Dermatology)',
    type: 'Education',
    status: 'Active',
    year: 2026,
    summary:
      'An interactive, case-based learning experience for dermatology aspirants — fun, high-retention, and structured.',
    tags: ['Education', 'Dermatology', 'Game'],
    stack: ['Next.js', 'TypeScript'],
    featured: true,
    links: {
      demo: '/projects/escape-room',
      github: '', // add later
    },
  },
  {
    id: 'qip',
    title: 'QIP & Training Presentations',
    type: 'Clinical',
    status: 'In progress',
    year: 2025,
    summary:
      'Quality improvement and teaching outputs developed alongside training, with a focus on measurable clinical outcomes.',
    tags: ['Clinical', 'Education'],
    stack: ['—'],
    featured: false,
    links: {
      slides: '', // add later
      docs: '/projects/qip',
    },
  },
];
