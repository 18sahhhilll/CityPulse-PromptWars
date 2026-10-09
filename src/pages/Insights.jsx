import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { CategoryBar } from '../components/charts/CategoryBar';
import { TrendChart } from '../components/charts/TrendChart';
import { AlertCard } from '../components/cards/AlertCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useReportStore } from '../store/useReportStore';
import { useCityStore } from '../store/useCityStore';
import socialFeedData from '../data/social.json';
import { Radio, Sparkles, ThumbsUp, ShieldCheck, MessageSquare, AlertCircle, Share2 } from 'lucide-react';

export const Insights = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const { reports, upvoteReport } = useReportStore();

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 flex items-center gap-2">
              <Radio className="w-7 h-7 text-cyan-400 animate-pulse" /> Smart City Insights & Pulse
            </h1>
            <p className="text-xs text-slate-400">AI-generated urban summaries, citizen report analytics, alert banners & social sentiment</p>
          </div>
          <Badge variant="verified" className="py-1 px-3 text-xs">
            LIVE SYNCHRONIZED
          </Badge>
        </div>

        {/* AI-Generated Plain Language Summary Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-slate-950 to-slate-950 space-y-3">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-cyan-400" /> AI Executive Summary: "What's Happening in {currentCity.name} Today"
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Urban activity in {currentCity.name} remains steady with pleasant 28°C clear skies. Peak citizen report activity centers around evening traffic bottlenecks at University Circle and lighting improvements along FC Road. Community verification rate is currently at <strong>78%</strong> with zero high-risk disasters reported in the past 24 hours.
          </p>
        </div>

        {/* Live Alerts Stream */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-display text-slate-100 uppercase tracking-wider">Active Broadcast Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AlertCard
              title="Moderate Weather Alert"
              message="Low probability monsoon showers expected between 5 PM and 8 PM. Clear outdoor visibility."
              type="info"
              timestamp="Issued 30 mins ago"
            />
            <AlertCard
              title="Traffic Congestion Advisory"
              message="Construction work near Metro Station 4 causing 10-minute delays on main road."
              type="warning"
              timestamp="Issued 1 hour ago"
            />
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold font-display text-slate-100">Citizen Reports by Category</h3>
            <CategoryBar reports={reports} />
          </div>

          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold font-display text-slate-100">Report Submissions (Time-of-Day Trend)</h3>
            <TrendChart />
          </div>
        </div>

        {/* Citizen Reports Verification Feed & Social Pulse */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Citizen Reports Verification Feed */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-slate-100">Recent Citizen Reports</h2>
              <span className="text-xs text-slate-400">{reports.length} Total Reports</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {reports.map((report) => (
                <div key={report.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-100 text-sm">{report.title}</h4>
                    <Badge variant={report.verified ? 'verified' : 'estimated'}>
                      {report.verified ? 'VERIFIED' : 'UNVERIFIED'} ({report.upvotes || 1} upvotes)
                    </Badge>
                  </div>
                  <p className="text-slate-300">{report.description}</p>
                  
                  {report.photo && (
                    <img src={report.photo} alt="Report attachment" className="w-full h-32 object-cover rounded-lg my-2" />
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span>Severity: {report.severity}/5 • {report.time}</span>
                    <button
                      onClick={() => upvoteReport(report.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/40 border border-violet-500/30 transition-colors font-semibold"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Confirm / Upvote ({report.upvotes || 1})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Social Pulse Simulated Feed */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-pink-400" /> Social Pulse Feed
              </h2>
              <Badge variant="sample">SIMULATED FEED</Badge>
            </div>

            <div className="space-y-3">
              {socialFeedData.map((post) => (
                <div key={post.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img src={post.avatar} alt={post.username} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-200 block">{post.username}</span>
                      <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-slate-300">{post.content}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <Badge variant={post.sentiment === 'positive' ? 'verified' : 'danger'}>
                      {post.sentiment.toUpperCase()} SENTIMENT
                    </Badge>
                    <span>❤️ {post.likes} likes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </PageShell>
  );
};
