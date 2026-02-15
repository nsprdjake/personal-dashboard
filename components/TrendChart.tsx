'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

interface TrendChartProps {
  title: string;
  data: any[];
  dataKey: string;
  valueKey: string;
  secondaryKey?: string;
  color: string;
}

export default function TrendChart({ title, data, dataKey, valueKey, secondaryKey, color }: TrendChartProps) {
  // Aggregate data by date
  const aggregated = data.reduce((acc: any, item: any) => {
    const date = format(new Date(item[dataKey]), 'MMM dd');
    if (!acc[date]) {
      acc[date] = {
        date,
        [valueKey]: 0,
        count: 0,
      };
      if (secondaryKey) {
        acc[date][secondaryKey] = 0;
      }
    }
    acc[date][valueKey] += item[valueKey] || 1;
    if (secondaryKey && item[secondaryKey]) {
      acc[date][secondaryKey] += item[secondaryKey];
    }
    acc[date].count += 1;
    return acc;
  }, {});

  // Calculate averages for secondary key
  const chartData = Object.values(aggregated).map((d: any) => {
    if (secondaryKey && d.count > 0) {
      d[secondaryKey] = Math.round(d[secondaryKey] / d.count);
      d[valueKey] = Math.round(d[valueKey] / d.count);
    }
    return d;
  });

  if (chartData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="text-purple-200 text-center py-8">No data to display yet</div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
          <YAxis stroke="rgba(255,255,255,0.7)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
          {secondaryKey && <Legend />}
          <Line type="monotone" dataKey={valueKey} stroke={color} strokeWidth={3} dot={{ r: 4 }} />
          {secondaryKey && (
            <Line type="monotone" dataKey={secondaryKey} stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
