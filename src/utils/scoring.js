import { DEFAULT_SCORING_WEIGHTS } from '../config/scoring.config';

export const calculateCompositeScore = (scores, weights = DEFAULT_SCORING_WEIGHTS) => {
  if (!scores) return 0;
  
  const wSafety = weights.safety ?? 0.30;
  const wClean = weights.cleanliness ?? 0.20;
  const wAfford = weights.affordability ?? 0.20;
  const wRating = weights.rating ?? 0.15;
  const wAccess = weights.accessibility ?? 0.15;

  const totalWeight = wSafety + wClean + wAfford + wRating + wAccess;
  if (totalWeight === 0) return 0;

  const rawScore =
    (scores.safety || 75) * wSafety +
    (scores.cleanliness || 75) * wClean +
    (scores.affordability || 75) * wAfford +
    (scores.rating || 75) * wRating +
    (scores.accessibility || 75) * wAccess;

  return Math.round(rawScore / totalWeight);
};

export const getScoreBadge = (score) => {
  if (score >= 85) return { label: 'Excellent', color: 'emerald', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  if (score >= 70) return { label: 'Good', color: 'cyan', bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
  if (score >= 50) return { label: 'Moderate', color: 'amber', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
  return { label: 'Needs Attention', color: 'rose', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
};
