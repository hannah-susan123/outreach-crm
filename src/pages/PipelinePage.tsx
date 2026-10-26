import { useMemo, useState } from 'react';
import { STAGES, type Contact, type Deal, type DealInput } from '../types';
import { useCrm } from '../lib/CrmContext';
import { formatAED, formatCompact } from '../lib/format';
import { summariseByStage } from '../lib/metrics';
import { OPEN_STAGES, STAGE_STYLES } from '../lib/stages';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DealCard } from '../components/DealCard';
import { DealForm } from '../components/DealForm';
import { EmptyState } from '../components/EmptyState';
import { KpiCard } from '../components/KpiCard';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import type { PageProps } from '../components/Sidebar';
import { StageBarChart } from '../components/StageBarChart';

const sumValue = (deals: Deal[]) => deals.reduce((sum, d) => sum + d.value, 0);

export function PipelinePage({ onNavigate }: PageProps) {
  const { contacts, deals, addDeal, moveDeal, deleteDeal, loadSampleData } = useCrm();
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Deal | null>(null);

  const contactsById = useMemo(() => new Map<string, Contact>(contacts.map((c) => [c.id, c])), [contacts]);
  const byStage = useMemo(() => summariseByStage(deals), [deals]);

  const openValue = sumValue(deals.filter((d) => OPEN_STAGES.includes(d.stage)));
  const wonValue = sumValue(deals.filter((d) => d.stage === 'Won'));

  async function handleAdd(input: DealInput) {
    await addDeal(input);
    setFormOpen(false);
  }

  async function confirmDelete() {
    if (!deleting) return;
    await deleteDeal(deleting.id);
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline"
        description={`${deals.length} deal${deals.length === 1 ? '' : 's'}`}
        actions={deals.length > 0 && <Button onClick={() => setFormOpen(true)}>+ Add deal</Button>}
      />

      {deals.length === 0 ? (
        contacts.length === 0 ? (
          <EmptyState
            icon="pipeline"
            title="Add a contact first"
            message="Every deal belongs to a contact. Add someone on the Contacts page, then come back to create a deal."
            actions={
              <>
                <Button onClick={() => onNavigate('contacts')}>Go to Contacts</Button>
                {/* Safe without a prompt: this branch only renders when the app is empty. */}
                <Button variant="secondary" onClick={() => void loadSampleData()}>
                  Load sample data
                </Button>
              </>
            }
          />
        ) : (
          <EmptyState
            icon="pipeline"
            title="No deals yet"
            message="Create a deal for one of your contacts and track it from Lead to Won."
            actions={<Button onClick={() => setFormOpen(true)}>+ Add deal</Button>}
          />
        )
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <KpiCard label="Open pipeline" value={formatAED(openValue)} hint="Lead, Contacted, Proposal" />
              <KpiCard label="Won" value={formatAED(wonValue)} hint="Closed deals" />
            </div>
            {/* min-w-0 lets the grid cell shrink, so the chart measures its real width */}
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-800">Value by stage</h2>
                <p className="text-xs text-slate-500">AED</p>
              </div>
              <div className="mt-4 h-56">
                <StageBarChart
                  data={byStage}
                  dataKey="value"
                  label="Total value"
                  formatValue={formatAED}
                  formatTick={formatCompact}
                />
              </div>
            </div>
          </section>

          {/* Stacked on mobile; five scrollable columns from tablet up */}
          <section className="md:-mx-1 md:overflow-x-auto md:px-1 md:pb-2">
            <div className="grid gap-4 md:min-w-[1000px] md:grid-cols-5">
              {STAGES.map((stage) => {
                const inStage = deals.filter((d) => d.stage === stage);
                return (
                  <div key={stage} className="flex flex-col rounded-xl bg-slate-100 p-3">
                    <div className="mb-3 flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${STAGE_STYLES[stage].dot}`} />
                        <h3 className="text-sm font-semibold text-slate-800">{stage}</h3>
                        <span className="rounded-full bg-white px-2 text-xs text-slate-500">{inStage.length}</span>
                      </div>
                      <span className="text-xs tabular-nums text-slate-500">{formatAED(sumValue(inStage))}</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      {inStage.map((deal) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          contact={contactsById.get(deal.contactId)}
                          onStageChange={(next) => moveDeal(deal.id, next)}
                          onDelete={() => setDeleting(deal)}
                        />
                      ))}
                      {inStage.length === 0 && (
                        <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-400 md:py-6">
                          No deals in {stage}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      <Modal open={formOpen} title="Add deal" onClose={() => setFormOpen(false)}>
        <DealForm contacts={contacts} onSubmit={handleAdd} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this deal?"
        message={`“${deleting?.title ?? ''}” will be removed from the pipeline. This can't be undone.`}
        confirmLabel="Delete deal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
