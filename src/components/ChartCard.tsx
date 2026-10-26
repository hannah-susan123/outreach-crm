import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** When true, the friendly empty message is shown instead of the chart. */
  empty: boolean;
  emptyTitle?: string;
  emptyMessage: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  empty,
  emptyTitle = 'Nothing to show yet',
  emptyMessage,
  children,
}: ChartCardProps) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="mt-4 h-56 sm:h-60">
        {empty ? <EmptyState compact title={emptyTitle} message={emptyMessage} /> : children}
      </div>
    </section>
  );
}
