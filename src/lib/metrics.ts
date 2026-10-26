import { STAGES, type Contact, type Deal, type Stage } from '../types';
import { OPEN_STAGES } from './stages';

export interface Kpis {
  totalContacts: number;
  openDeals: number;
  pipelineValue: number; // AED, open stages only
  /** Won / (Won + Lost), 0-1. Null when no deal has closed yet. */
  winRate: number | null;
}

export function computeKpis(contacts: Contact[], deals: Deal[]): Kpis {
  const open = deals.filter((d) => OPEN_STAGES.includes(d.stage));
  const won = deals.filter((d) => d.stage === 'Won').length;
  const lost = deals.filter((d) => d.stage === 'Lost').length;
  return {
    totalContacts: contacts.length,
    openDeals: open.length,
    pipelineValue: open.reduce((sum, d) => sum + d.value, 0),
    winRate: won + lost > 0 ? won / (won + lost) : null,
  };
}

export interface StageSummary {
  stage: Stage;
  count: number;
  value: number;
}

export function summariseByStage(deals: Deal[]): StageSummary[] {
  return STAGES.map((stage) => {
    const inStage = deals.filter((d) => d.stage === stage);
    return { stage, count: inStage.length, value: inStage.reduce((sum, d) => sum + d.value, 0) };
  });
}

export interface WeekPoint {
  weekStart: string; // ISO date of the Monday
  label: string; // e.g. "20 Oct"
  count: number;
}

/** Monday 00:00 (local time) of the week containing `date`. */
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

/** New contacts per week for the last `weeks` weeks, including the current one. */
export function contactsPerWeek(contacts: Contact[], weeks = 12, today = new Date()): WeekPoint[] {
  const current = startOfWeek(today);
  const points: WeekPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(current);
    start.setDate(current.getDate() - i * 7);
    points.push({
      weekStart: start.toISOString(),
      label: start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      count: 0,
    });
  }

  const firstStart = new Date(points[0].weekStart).getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  for (const c of contacts) {
    const created = startOfWeek(new Date(c.createdAt)).getTime();
    // Round to absorb daylight-saving shifts between weeks.
    const index = Math.round((created - firstStart) / weekMs);
    if (index >= 0 && index < points.length) points[index].count += 1;
  }
  return points;
}
