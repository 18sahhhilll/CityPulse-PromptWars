import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';

const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })));
const Explore = lazy(() => import('../pages/Explore').then(m => ({ default: m.Explore })));
const PlaceDetail = lazy(() => import('../pages/PlaceDetail').then(m => ({ default: m.PlaceDetail })));
const History = lazy(() => import('../pages/History').then(m => ({ default: m.History })));
const Safety = lazy(() => import('../pages/Safety').then(m => ({ default: m.Safety })));
const Compare = lazy(() => import('../pages/Compare').then(m => ({ default: m.Compare })));
const Insights = lazy(() => import('../pages/Insights').then(m => ({ default: m.Insights })));
const ReportPage = lazy(() => import('../pages/ReportPage').then(m => ({ default: m.ReportPage })));
const Saved = lazy(() => import('../pages/Saved').then(m => ({ default: m.Saved })));
const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const About = lazy(() => import('../pages/About').then(m => ({ default: m.About })));
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="p-8 max-w-7xl mx-auto space-y-4">
    <Skeleton className="h-12 w-1/3" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:id" element={<PlaceDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
