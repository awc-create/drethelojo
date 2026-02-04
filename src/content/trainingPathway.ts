export type TrainingStatus = 'Completed' | 'Current' | 'Next' | 'Planned';

export type TrainingStep = {
  id: string;
  title: string;
  duration?: string; // e.g. "2 years"
  summary: string;
  requirements?: string[]; // bullets
  outputs?: string[]; // bullets (what you gain)
  status?: TrainingStatus; // optional, can be computed later from dates
  note?: string; // optional micro detail
};

export const TRAINING_PATHWAY: TrainingStep[] = [
  {
    id: 'alevels',
    title: 'A-levels',
    duration: '2 years',
    summary:
      'Typically three or four A-levels at grade A/A*. Usually includes Chemistry and often Biology, Physics, or Maths.',
    requirements: ['Chemistry (required)', 'Plus Biology/Physics/Maths (often required)'],
    outputs: ['Eligibility to apply for medical school'],
  },
  {
    id: 'med-school',
    title: 'Medical school (MBBS/MBChB)',
    duration: '5–6 years',
    summary:
      'Undergraduate medical degree. May include an intercalated degree depending on programme and choice.',
    outputs: ['Primary medical qualification (e.g., MBBS/MBChB)'],
    note: 'Intercalated degree optional (varies by school).',
  },
  {
    id: 'foundation',
    title: 'Foundation training',
    duration: '2 years',
    summary:
      'Rotations across medical and surgical specialties to build broad clinical competence and confidence.',
    outputs: ['Broad clinical exposure', 'Portfolio evidence', 'Career direction clarity'],
  },
  {
    id: 'imt',
    title: 'Internal Medicine Training (IMT)',
    duration: '2 years',
    summary:
      'Further medical specialty experience and progression toward MRCP. Alternative routes can include paediatric rotations with RCPCH membership for some pathways.',
    requirements: ['IMT portfolio requirements', 'Prepare for MRCP exams'],
    outputs: ['Eligibility to apply for Dermatology training after MRCP'],
    note: 'Some candidates enter via paediatric route + RCPCH membership.',
  },
  {
    id: 'mrcp',
    title: 'MRCP',
    duration: 'Alongside IMT',
    summary: 'Pass examinations to become a Member of the Royal College of Physicians (MRCP).',
    outputs: ['MRCP achieved', 'Competitive eligibility for Dermatology training applications'],
  },
  {
    id: 'apply-derm',
    title: 'Apply for Dermatology specialty training',
    duration: 'Application cycle',
    summary:
      'Dermatology is highly competitive. Strong evidence, portfolio, and commitment to specialty are key.',
    outputs: ['Interview and ranking outcomes', 'Potential offer for a training post'],
  },
  {
    id: 'st3-derm',
    title: 'Dermatology Specialty Registrar training (StR)',
    duration: '4 years',
    summary:
      'Specialty training across core dermatology competencies, clinics, procedures, and subspecialty exposure.',
    outputs: ['Specialty competency sign-off', 'Progress toward CCT'],
  },
  {
    id: 'sce',
    title: 'Specialty Certificate Examination (SCE) in Dermatology',
    duration: 'Before end of training',
    summary: 'Pass the SCE before completing training.',
    outputs: ['SCE completed', 'Requirements met for completion of specialty training'],
  },
  {
    id: 'cct-consultant',
    title: 'CCT → Consultant Dermatologist',
    duration: 'Post-training',
    summary:
      'On successful completion, you become accredited and can apply for consultant dermatologist posts.',
    outputs: ['CCT achieved', 'Eligible for consultant dermatologist roles'],
  },
];
