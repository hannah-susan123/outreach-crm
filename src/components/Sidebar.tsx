import { ICONS } from './icons';

export type PageId = 'dashboard' | 'contacts' | 'pipeline';

/** Props every page receives, so empty states can link to other pages. */
export interface PageProps {
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'pipeline', label: 'Pipeline' },
];

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="sticky top-0 z-30 border-b border-slate-200 bg-white md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-4 pt-3 md:px-5 md:py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          O
        </span>
        <span className="text-lg font-semibold tracking-tight">Outreach CRM</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:py-0">
        {NAV_ITEMS.map((item) => {
          const active = item.id === current;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors md:gap-3 ${
                active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={ICONS[item.id]} />
              </svg>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
