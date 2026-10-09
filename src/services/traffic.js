export const getTrafficMood = (incidents = []) => {
  const currentHour = new Date().getHours();
  const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 20);

  const trafficIncidents = incidents.filter((i) => i.category === 'traffic' || i.category === 'accident');

  if (trafficIncidents.length >= 3 || (isPeakHour && trafficIncidents.length >= 1)) {
    return {
      mood: 'Heavy Congestion',
      level: 'heavy',
      color: '#EF4444',
      bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      description: 'Rush hour bottleneck reported near major circles & flyovers.',
    };
  }

  if (isPeakHour || trafficIncidents.length > 0) {
    return {
      mood: 'Moderate Traffic',
      level: 'moderate',
      color: '#F59E0B',
      bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: 'Typical peak moving traffic with minor slowdowns.',
    };
  }

  return {
    mood: 'Smooth Flow',
    level: 'smooth',
    color: '#10B981',
    bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Roads clear with normal traffic speed.',
  };
};
