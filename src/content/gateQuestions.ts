export type GateQuestion = {
  id: string;
  prompt: string;
  placeholder?: string;
};

export const GATE_QUESTIONS: GateQuestion[] = [
  {
    id: 'q1',
    prompt: 'Will you come to my cottage this summer?',
    placeholder: 'answer…',
  },
  // Add more later:
  // { id: "q2", prompt: "…", placeholder: "…" },
  // { id: "q3", prompt: "…", placeholder: "…" },
];
