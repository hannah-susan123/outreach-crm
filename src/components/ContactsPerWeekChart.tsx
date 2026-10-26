import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WeekPoint } from '../lib/metrics';

interface ContactsPerWeekChartProps {
  data: WeekPoint[];
}

export function ContactsPerWeekChart({ data }: ContactsPerWeekChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#e2e8f0" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={16}
          tick={{ fontSize: 12, fill: '#64748b' }}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} tick={{ fontSize: 12, fill: '#64748b' }} />
        <Tooltip
          cursor={{ stroke: '#cbd5e1' }}
          labelFormatter={(l) => `Week of ${l}`}
          formatter={(v) => [Number(v), 'New contacts']}
          contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
