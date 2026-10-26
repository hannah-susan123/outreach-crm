import type { ReactNode } from 'react';
import { ICONS, type IconName } from './icons';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: IconName;
  actions?: ReactNode;
  /** Smaller padding, for use inside cards and charts. */
  compact?: boolean;
}

export function EmptyState({ title, message, icon = 'chart', actions, compact = false }: EmptyStateProps) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center ${
        compact ? 'px-6 py-8' : 'px-6 py-16'
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ${
          compact ? 'h-10 w-10' : 'h-12 w-12'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={compact ? 'h-5 w-5' : 'h-6 w-6'}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={ICONS[icon]} />
        </svg>
      </span>
      <h3 className={`mt-3 font-semibold text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}>{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}
