import type { Metadata } from 'next';
import EscapeRoomClient from './EscapeRoomClient';

export const metadata: Metadata = {
  title: 'Teaching Escape Room App — Dr Ethel Ojo',
  description:
    'An interactive, case-based dermatology escape room. Diagnose patients, solve clinical puzzles, and escape before time runs out.',
  openGraph: {
    title: 'Derm Escape Lab — Dr Ethel Ojo',
    description: 'Interactive dermatology escape room training game.',
  },
};

export default function EscapeRoomPage() {
  return <EscapeRoomClient />;
}
