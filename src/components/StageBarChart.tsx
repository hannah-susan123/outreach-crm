import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { StageSummary } from '../lib/metrics';

interface StageBarChartProps {
  data: StageSummary[];
  dataKey: 'count' | 'value';
  /** Name shown in the tooltip, e.g. "Deals". */
  label: string;
  formatValue: (v: number) => string;
  formatTick?: (v: number) => string;
  allowDecimals?: boolean;
}

const BAR_COLOR = '#4f46e5'; // indigo-600, the app's accent

/** Single-series bar chart with one bar per pipeline stage. */
export function StageBarChart({
  data,
  dataKey,
  label,
  formatValue,
  formatTick = formatValue,
  allowDecimals = true,
}: StageBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#e2e8f0" />
        {/* interval={0}: always label all five stages, even on narrow screens */}
        <XAxis
          dataKey="stage"
          interval={0}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: '#64748b' }}
        />
        <YAxis
          tickFormatter={formatTick}
          allowDecimals={allowDecimals}
          tickLine={false}
          axisLine={false}
          width={40}
          tick={{ fontSize: 11, fill: '#64748b' }}
        />
        <Tooltip
          cursor={{ fill: '#f1f5f9' }}
          formatter={(v) => [formatValue(Number(v)), label]}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }}
        />
        <Bar dataKey={dataKey} fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
