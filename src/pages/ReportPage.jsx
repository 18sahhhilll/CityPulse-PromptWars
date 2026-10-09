import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { ReportForm } from '../components/forms/ReportForm';
import { ShieldAlert } from 'lucide-react';

export const ReportPage = () => {
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-rose-500" /> Submit a Citizen Report
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Report hazards, accidents, harassment, dark alleys, garbage, flooding or traffic. Every submission is analyzed by our AI pipeline.
          </p>
        </div>

        <ReportForm />
      </div>
    </PageShell>
  );
};
