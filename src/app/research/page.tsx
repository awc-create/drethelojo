// src/app/research/page.tsx
import ResearchClient from './ResearchClient';
import { PUBLICATIONS } from '@/content/publications';

export default function ResearchPage() {
  return <ResearchClient initialPublications={PUBLICATIONS} />;
}
