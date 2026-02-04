// src/content/journeyMilestones.ts

export type JourneyMilestone = {
  label: string; // small uppercase label
  value: string; // main line
  detail?: string; // optional muted line
  tone?: 'neutral' | 'olive'; // subtle highlight
};

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    label: 'Current path',
    value: 'IMT 1',
    detail: 'Internal Medicine Training',
    tone: 'olive',
  },
  {
    label: 'Clinical now',
    value: 'ICU',
    detail: 'Rotation in progress',
  },
  {
    label: 'Next rotation',
    value: 'Oncology',
    detail: 'Starts March',
    tone: 'olive',
  },
  {
    label: 'Parallel work',
    value: 'Research · AI · Education',
    detail: 'Running alongside training',
  },
  {
    label: 'Focus',
    value: 'Dermatology-aligned growth',
    detail: 'Evidence-led, patient-first',
  },
];
