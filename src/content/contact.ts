// src/content/contact.ts

export type ContactLink = {
  label: string;
  href: string;
};

export type ContactConfig = {
  title: string;
  lead: string;

  email: string;
  location?: string;

  links: ContactLink[];

  note?: string; // small luxury line
};

export const CONTACT: ContactConfig = {
  title: 'Let’s connect.',
  lead: 'For research collaboration, speaking, or project enquiries — feel free to reach out. Messages are typically replied to within a few days.',

  email: 'ethel@example.com',
  location: 'United Kingdom',

  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/' },
    { label: 'ORCID', href: 'https://orcid.org/' },
  ],

  note: 'Dermatology · Research · AI · Education',
};
