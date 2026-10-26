import { useState, type ComponentType } from 'react';
import { Sidebar, type PageId, type PageProps } from './components/Sidebar';
import { ContactsPage } from './pages/ContactsPage';
import { DashboardPage } from './pages/DashboardPage';
import { PipelinePage } from './pages/PipelinePage';
import { useCrm } from './lib/CrmContext';

const PAGES: Record<PageId, ComponentType<PageProps>> = {
  dashboard: DashboardPage,
  contacts: ContactsPage,
  pipeline: PipelinePage,
};

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const { loading, error } = useCrm();
  const CurrentPage = PAGES[page];

  function navigate(next: PageId) {
    setPage(next);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar current={page} onNavigate={navigate} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {error && (
            <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          {loading ? <p className="text-sm text-slate-500">Loading…</p> : <CurrentPage onNavigate={navigate} />}
        </div>
      </main>
    </div>
  );
}
