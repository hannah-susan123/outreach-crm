import type { Stage } from '../types';

/** Visual style per stage. Full class names are listed so Tailwind can find them. */
export const STAGE_STYLES: Record<Stage, { dot: string; color: string }> = {
  Lead: { dot: 'bg-slate-400', color: '#94a3b8' },
  Contacted: { dot: 'bg-sky-500', color: '#0ea5e9' },
  Proposal: { dot: 'bg-amber-500', color: '#f59e0b' },
  Won: { dot: 'bg-emerald-500', color: '#10b981' },
  Lost: { dot: 'bg-rose-500', color: '#f43f5e' },
};

export const OPEN_STAGES: Stage[] = ['Lead', 'Contacted', 'Proposal'];
