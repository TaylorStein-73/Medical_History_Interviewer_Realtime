import { medicalHistoryAgent } from './medicalHistory';

// Cast to `any` to satisfy TypeScript until the core types make RealtimeAgent
// assignable to `Agent<unknown>` (current library versions are invariant on
// the context type).


export const medicalHistoryInterviewerScenario = [
  medicalHistoryAgent,
];

// Name of the company represented by this agent set. Used by guardrails
export const medicalHistoryInterviewerCompanyName = 'Shady Grove Fertility';
