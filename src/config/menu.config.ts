// src/config/menu.config.ts
export type NavLink = { slug: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { slug: '', label: 'Home' },
  { slug: 'journey', label: 'Journey' },
  { slug: 'research', label: 'Research' },
  { slug: 'projects', label: 'Projects' },
  { slug: 'training', label: 'Training' },
  { slug: 'cv', label: 'CV' },
  { slug: 'contact', label: 'Contact' },
];
