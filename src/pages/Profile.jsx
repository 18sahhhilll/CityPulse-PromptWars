import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { useReportStore } from '../store/useReportStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { usePlaces } from '../hooks/usePlaces';
import { useCityStore } from '../store/useCityStore';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from '../components/auth/AuthModal';
import { Badge } from '../components/ui/Badge';
import { PlaceCard } from '../components/cards/PlaceCard';
import { REPORT_CATEGORIES } from '../config/categories';
import {
  User,
  ShieldCheck,
  Award,
  FileText,
  MapPin,
  ThumbsUp,
  Trash2,
  ExternalLink,
  Plus,
  Sparkles,
  Heart,
  CheckCircle2,
  Calendar,
  Zap,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const currentCity = useCityStore((state) => state.currentCity);
  const { reports, removeReport } = useReportStore();
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds) || [];
  const { allPlaces } = usePlaces();
  const savedPlaces = (allPlaces || []).filter((p) => favoriteIds.includes(p.id));

  const { user, initialize, signOut } = useAuthStore();

  const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'saved', 'achievements'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Only show reports the user actually filed — never show seeded sample data
  const userSubmittedReports = reports.filter((r) => r.id && r.id.startsWith('user-'));
  const displayedReports = userSubmittedReports;

  // Compute profile statistics
  const totalUpvotesReceived = userSubmittedReports.reduce((acc, r) => acc + (r.upvotes || 1), 0);

  const handleDeleteReport = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this report from your profile?')) {
      removeReport(id);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getCivicLevel = (count) => {
    if (count >= 10) return 'Level 5 Master Guardian';
    if (count >= 5) return 'Level 4 Civic Guardian';
    if (count >= 2) return 'Level 3 Community Sentinel';
    if (count >= 1) return 'Level 2 Active Reporter';
    return 'Level 1 Citizen Scout';
  };

  const openAuth = (mode = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Banner & Header Card */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Top Gradient Background */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 p-6 flex justify-between items-start">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              {user ? (user.isSupabase ? 'Supabase Authenticated Profile' : 'Citizen Active Profile') : 'Guest Session'}
            </span>

            {user && (
              <button
                onClick={signOut}
                className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Profile Details Container */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-12">
            
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-1 shadow-xl">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-indigo-600 dark:text-cyan-400 font-bold text-2xl font-display">
                    {user ? getInitials(user.fullName) : <User className="w-10 h-10 text-slate-400" />}
                  </div>
                </div>
                {user && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md" title="Active Verified Account">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                {user ? (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
                        {user.fullName}
                      </h1>
                      <Badge variant="verified">{getCivicLevel(userSubmittedReports.length)}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.email}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {currentCity.name}, MH
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-violet-500" /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
                        Guest Citizen
                      </h1>
                      <Badge variant="estimated">Unauthenticated</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span>Sign in with Supabase Auth to unlock citizen verification & profile stats.</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <Link
                  to="/report"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>File New Report</span>
                </Link>
              ) : (
                <button
                  onClick={() => openAuth('signin')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 divide-x divide-slate-100 dark:divide-slate-800 text-center py-4">
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                {userSubmittedReports.length}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Reports Filed
              </div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-violet-600 dark:text-violet-400 font-display">
                {totalUpvotesReceived}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Community Upvotes
              </div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
                {user ? '96%' : '--'}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                AI Trust Score
              </div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-extrabold text-pink-600 dark:text-pink-400 font-display">
                {user ? 'Top 5%' : '--'}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Civic Impact
              </div>
            </div>
          </div>
        </div>

        {/* Unauthenticated Guest Advisory Banner */}
        {!user && (
          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400" /> Supabase Citizen Authentication
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Create an account or sign in with your email to attach user metadata to reports and sync profile progress.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openAuth('signin')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'reports'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Filed Reports ({userSubmittedReports.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Places ({favoriteIds.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'achievements'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Civic Badges (4)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MY FILED REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {displayedReports.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
                  No Reports Filed Yet
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  When you submit incident reports for unsafe streetlights, traffic jams, or hazardous areas, they will appear here on your profile with live AI analysis status.
                </p>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>File Your First Report</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedReports.map((report) => {
                  const categoryMeta = REPORT_CATEGORIES.find((c) => c.id === report.category) || REPORT_CATEGORIES[0];
                  const isUserFiled = report.id && report.id.startsWith('user-');

                  return (
                    <div
                      key={report.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                    >
                      {/* Top Header & Category */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                              {categoryMeta.emoji}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                                {categoryMeta.label}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Logged {new Date(report.createdAt || Date.now()).toLocaleDateString()} • {report.time || 'Day'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isUserFiled ? (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 text-[10px] font-bold">
                                Yours
                              </span>
                            ) : (
                              <Badge variant="sample">Sample</Badge>
                            )}
                            <Badge variant={report.verified ? 'verified' : 'estimated'}>
                              {report.verified ? 'AI Verified' : 'Under Review'}
                            </Badge>
                          </div>
                        </div>

                        {/* Report Headline & Description */}
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
                          {report.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                          {report.description}
                        </p>

                        {/* Optional Attached Photo */}
                        {report.photo && (
                          <div className="mt-2 rounded-xl overflow-hidden max-h-40 border border-slate-200 dark:border-slate-700">
                            <img src={report.photo} alt="Attached incident" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Footer & Meta Info */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            {report.cityName || currentCity.name} ({report.lat?.toFixed(3)}, {report.lng?.toFixed(3)})
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400">
                            <Zap className="w-3.5 h-3.5" />
                            Severity {report.severity || 3}/5
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                            <ThumbsUp className="w-3.5 h-3.5 text-indigo-600" />
                            {report.upvotes || 1} Community Upvotes
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate('/safety')}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Safety Map</span>
                            </button>
                            {isUserFiled && (
                              <button
                                onClick={(e) => handleDeleteReport(report.id, e)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                title="Delete report"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED PLACES */}
        {activeTab === 'saved' && (
          <div>
            {savedPlaces.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
                  No Bookmarked Places Yet
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Explore attractions, restaurants, and heritage spots across the city and tap the heart icon to save them to your profile.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Explore City Spots</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CIVIC BADGES & ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl shrink-0">
                🏆
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">First Report Logged</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Submitted your first safety report to CityPulse.</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">Unlocked</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-2xl shrink-0">
                🌙
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Night Watcher</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reported lighting or nighttime safety hazards.</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">Unlocked</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/20 text-violet-600 flex items-center justify-center text-2xl shrink-0">
                🛡️
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Civic Guardian</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Achieved 90%+ AI trust verification score.</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">Unlocked</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md flex items-center gap-4 opacity-75">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-2xl shrink-0">
                🌟
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Community Hero</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive 10+ upvotes from local citizens.</p>
                <span className="text-[10px] font-bold text-slate-400 mt-1 block">In Progress</span>
              </div>
            </div>
          </div>
        )}

        {/* Auth Modal Popup */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authModalMode}
        />

      </div>
    </PageShell>
  );
};

export default Profile;
