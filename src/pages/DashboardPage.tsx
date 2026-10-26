import { useMemo, useState } from 'react';
import { useCrm } from '../lib/CrmContext';
import { formatAED, formatCompact } from '../lib/format';
import { computeKpis, contactsPerWeek, summariseByStage } from '../lib/metrics';
import { Button } from '../components/Button';
import { ChartCard } from '../components/ChartCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ContactsPerWeekChart } from '../components/ContactsPerWeekChart';
import { EmptyState } from '../components/EmptyState';
import { KpiCard } from '../components/KpiCard';
import { PageHeader } from '../components/PageHeader';
import type { PageProps } from '../components/Sidebar';
import { StageBarChart } from '../components/StageBarChart';

const WEEKS = 12;

type PendingAction = 'load' | 'reset' | null;

export function DashboardPage({ onNavigate }: PageProps) {
  const { contacts, deals, loadSampleData, resetData } = useCrm();
  const [pending, setPending] = useState<PendingAction>(null);

  const kpis = useMemo(() => computeKpis(contacts, deals), [contacts, deals]);
  const byStage = useMemo(() => summariseByStage(deals), [deals]);
  const weekly = useMemo(() => contactsPerWeek(contacts, WEEKS), [contacts]);

  const hasData = contacts.length > 0 || deals.length > 0;
  const hasDeals = deals.length > 0;
  const hasDealValue = byStage.some((s) => s.value > 0);
  const hasRecentContacts = weekly.some((w) => w.count > 0);

  /** Loads straight away into an empty app; asks first if it would replace data. */
  function requestLoad() {
    if (hasData) setPending('load');
    else void loadSampleData();
  }

  async function confirmPending() {
    if (pending === 'load') await loadSampleData();
    if (pending === 'reset') await resetData();
    setPending(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="An overview of your contacts and pipeline."
        actions={
          <>
            <Button variant="secondary" onClick={requestLoad}>
              Load sample data
            </Button>
            <Button
              variant="ghost"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => setPending('reset')}
              disabled={!hasData}
              title={hasData ? undefined : 'There is no data to reset'}
            >
              Reset data
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total contacts" value={kpis.totalContacts.toLocaleString('en-AE')} />
        <KpiCard label="Open deals" value={kpis.openDeals.toLocaleString('en-AE')} hint="Lead, Contacted, Proposal" />
        <KpiCard label="Pipeline value" value={formatAED(kpis.pipelineValue)} hint="Open deals only" />
        <KpiCard
          label="Win rate"
          value={kpis.winRate === null ? '—' : `${Math.round(kpis.winRate * 100)}%`}
          hint={kpis.winRate === null ? 'No deals won or lost yet' : 'Won ÷ (Won + Lost)'}
        />
      </section>

      {!hasData ? (
        <EmptyState
          icon="sparkle"
          title="Welcome to Outreach CRM"
          message="There's nothing here yet. Load sample data to explore the app, or start by adding your first contact."
          actions={
            <>
              <Button onClick={requestLoad}>Load sample data</Button>
              <Button variant="secondary" onClick={() => onNavigate('contacts')}>
                Add a contact
              </Button>
            </>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Deals per stage"
              empty={!hasDeals}
              emptyTitle="No deals yet"
              emptyMessage="Add a deal on the Pipeline page to see how deals spread across stages."
            >
              <StageBarChart
                data={byStage}
                dataKey="count"
                label="Deals"
                formatValue={(v) => v.toLocaleString('en-AE')}
                allowDecimals={false}
              />
            </ChartCard>

            <ChartCard
              title="Deal value per stage"
              subtitle="AED"
              empty={!hasDealValue}
              emptyTitle={hasDeals ? 'No deal values yet' : 'No deals yet'}
              emptyMessage={
                hasDeals
                  ? 'Your deals are all worth AED 0. Values will appear here once they are set.'
                  : 'Deal values per stage will show up here once you add deals.'
              }
            >
              <StageBarChart
                data={byStage}
                dataKey="value"
                label="Total value"
                formatValue={formatAED}
                formatTick={formatCompact}
              />
            </ChartCard>
          </div>

          <ChartCard
            title="New contacts per week"
            subtitle={`Last ${WEEKS} weeks`}
            empty={!hasRecentContacts}
            emptyTitle="No recent contacts"
            emptyMessage={
              contacts.length === 0
                ? 'Add contacts to track your outreach over time.'
                : `No contacts were added in the last ${WEEKS} weeks.`
            }
          >
            <ContactsPerWeekChart data={weekly} />
          </ChartCard>
        </>
      )}

      <ConfirmDialog
        open={pending === 'load'}
        title="Replace your data with sample data?"
        message={`This deletes your ${contacts.length} contacts and ${deals.length} deals and replaces them with 20 sample contacts and 25 sample deals. This can't be undone.`}
        confirmLabel="Replace with sample data"
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
      <ConfirmDialog
        open={pending === 'reset'}
        title="Reset all data?"
        message={`This permanently deletes all ${contacts.length} contacts and ${deals.length} deals. This can't be undone.`}
        confirmLabel="Delete everything"
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
