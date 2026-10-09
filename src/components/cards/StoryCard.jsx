import React, { useState, useEffect } from 'react';
import { Landmark, Calendar, User, ExternalLink, Sparkles } from 'lucide-react';
import { fetchWikipediaSummary } from '../../services/wikipedia';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const StoryCard = ({ site }) => {
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (site?.wikiTitle) {
      setLoading(true);
      fetchWikipediaSummary(site.wikiTitle).then((data) => {
        setWikiData(data);
        setLoading(false);
      });
    }
  }, [site?.wikiTitle]);

  if (!site) return null;

  return (
    <div className="space-y-4">
      <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
        <img
          src={wikiData?.thumbnail || site.image}
          alt={site.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <Badge variant="violet" className="mb-1">HERITAGE MONUMENT</Badge>
            <h2 className="text-2xl font-bold font-display text-white">{site.name}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px]">Era / Built</span>
            <span className="font-bold text-slate-200">{site.era}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px]">Architect / Patron</span>
            <span className="font-bold text-slate-200">{site.builder}</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Why It Matters
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">{site.whyItMatters}</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Historical Overview</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {wikiData?.extract || site.summary}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex flex-wrap gap-1">
          {site.tags?.map((t, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
              #{t}
            </span>
          ))}
        </div>

        {wikiData?.pageUrl && (
          <a
            href={wikiData.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
          >
            Read on Wikipedia <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
