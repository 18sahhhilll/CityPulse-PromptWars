import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Compass, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <PageShell>
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold font-display text-slate-100">404 — Page Not Found</h1>
        <p className="text-xs text-slate-400">
          The requested route does not exist or has moved to another city district.
        </p>
        <Link to="/" className="inline-block pt-2">
          <Button variant="primary" icon={Compass}>
            Return to City Dashboard
          </Button>
        </Link>
      </div>
    </PageShell>
  );
};
