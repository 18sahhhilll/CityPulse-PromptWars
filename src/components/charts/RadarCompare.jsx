import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export const RadarCompare = ({ places = [] }) => {
  if (!places || places.length === 0) return null;

  const colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EC4899'];

  const metrics = [
    { key: 'safety', label: 'Safety' },
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'affordability', label: 'Affordability' },
    { key: 'rating', label: 'Rating' },
    { key: 'accessibility', label: 'Accessibility' },
  ];

  const data = metrics.map((m) => {
    const entry = { metric: m.label };
    places.forEach((p) => {
      entry[p.name] = p.scores?.[m.key] || 75;
    });
    return entry;
  });

  return (
    <div className="w-full h-[320px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="metric" stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
          {places.map((place, idx) => (
            <Radar
              key={place.id || idx}
              name={place.name}
              dataKey={place.name}
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
              fillOpacity={0.3}
            />
          ))}
          <Legend wrapperStyle={{ color: '#F8FAFC', fontSize: '12px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
