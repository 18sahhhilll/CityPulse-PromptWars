import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TrendChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { time: '06:00', reports: 2 },
    { time: '09:00', reports: 8 },
    { time: '12:00', reports: 5 },
    { time: '15:00', reports: 12 },
    { time: '18:00', reports: 19 },
    { time: '21:00', reports: 14 },
    { time: '00:00', reports: 6 },
  ];

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
          <YAxis stroke="#64748B" tick={{ fontSize: 11, fill: '#94A3B8' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
          />
          <Area type="monotone" dataKey="reports" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#trendGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
