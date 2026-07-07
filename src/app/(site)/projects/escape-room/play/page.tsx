// app/projects/escape-room/play/page.tsx
import type { Metadata } from 'next';
import PlayClient from './PlayClient';

export const metadata: Metadata = {
  title: 'Play — Derm Escape Lab',
  description: 'Play the Derm Escape Lab — an interactive dermatology escape room.',
};

export default function PlayPage() {
  return <PlayClient />;
}
