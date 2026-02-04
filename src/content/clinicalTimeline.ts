// src/content/clinicalTimeline.ts

export type Rotation = {
  title: string;
  location?: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD (exclusive end is cleanest)
  summary?: string;

  // ✅ for /journey page detail
  skills?: string[];
  competencies?: string[];
  goals?: string[];
};

export const CLINICAL_ROTATIONS: Rotation[] = [
  {
    title: 'IMT — ICU',
    location: 'ICU',
    start: '2025-11-01',
    end: '2026-03-01',
    summary: 'Acute care exposure, escalation, procedures, and critical decision-making.',
    skills: [
      'Acute assessment, escalation & prioritisation',
      'ABG interpretation and ventilatory basics',
      'Sepsis recognition and early management',
      'Procedural confidence (sampling / lines)',
    ],
    competencies: ['Acute care', 'Escalation', 'Safety', 'Communication'],
    goals: ['Sharpen structured handovers', 'Build dermatology-aligned acute medicine confidence'],
  },
  {
    title: 'IMT — Oncology',
    location: 'Oncology',
    start: '2026-03-01',
    end: '2026-07-01',
    summary: 'Systemic therapies, complications, inpatient/outpatient oncology workflows.',
    skills: [
      'Recognising treatment-related complications',
      'MDT coordination and decision support',
      'Patient communication and shared decisions',
    ],
    competencies: ['MDT working', 'Complications', 'Communication'],
    goals: ['Strengthen holistic care planning', 'Sharpen documentation habits'],
  },
  // Add more rotations here…
];
