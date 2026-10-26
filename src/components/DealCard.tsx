import { STAGES, type Contact, type Deal, type Stage } from '../types';
import { formatAED } from '../lib/format';

interface DealCardProps {
  deal: Deal;
  contact?: Contact;
  onStageChange: (stage: Stage) => void;
  onDelete: () => void;
}

export function DealCard({ deal, contact, onStageChange, onDelete }: DealCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug text-slate-900">{deal.title}</h4>
        <button
          type="button"
          onClick={onDelete}
          className="-mr-1 -mt-1 rounded p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Delete deal ${deal.title}`}
          title="Delete deal"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-700">{contact?.name ?? 'Unknown contact'}</p>
      <p className="text-xs text-slate-500">{contact?.company ?? '—'}</p>
      <p className="mt-2 text-sm font-semibold tabular-nums text-slate-900">{formatAED(deal.value)}</p>
      <label className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        Stage
        <select
          value={deal.stage}
          onChange={(e) => onStageChange(e.target.value as Stage)}
          aria-label={`Stage for ${deal.title}`}
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}
