import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REPORT_CATEGORIES } from '../../config/categories';
import { useReportStore } from '../../store/useReportStore';
import { useCityStore } from '../../store/useCityStore';
import { analyzeReportNLP } from '../../services/ai';
import { VoiceRecorder } from './VoiceRecorder';
import { PhotoUpload } from './PhotoUpload';
import { Badge } from '../ui/Badge';
import { MapPin, Send, Sparkles, CheckCircle, User, ArrowRight } from 'lucide-react';

export const ReportForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const currentCity = useCityStore((state) => state.currentCity);
  const { reports, addReport } = useReportStore();

  const [category, setCategory] = useState(REPORT_CATEGORIES[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [lat, setLat] = useState(currentCity.lat);
  const [lng, setLng] = useState(currentCity.lng);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    const fullText = `${title}. ${description}. ${voiceText}`;

    // Run AI NLP Pipeline
    const nlpData = await analyzeReportNLP(fullText, category, reports);
    setAnalysisResult(nlpData);

    const newReport = {
      id: `user-${Date.now()}`,
      category: nlpData.category || category,
      title,
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      severity: nlpData.severity || 3,
      sentiment: nlpData.sentiment || 'neutral',
      time: new Date().getHours() >= 19 || new Date().getHours() <= 5 ? 'Night' : 'Day',
      createdAt: new Date().toISOString(),
      verified: nlpData.verified || false,
      verificationScore: nlpData.verificationScore || 50,
      upvotes: 1,
      photo: photoData,
      cityName: currentCity.name,
    };

    addReport(newReport);
    setIsSubmitting(false);
    setSubmitted(true);

    if (onSuccess) onSuccess(newReport);
  };

  if (submitted && analysisResult) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-400 dark:border-emerald-500/40 shadow-lg shadow-emerald-500/10">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
            Report Successfully Filed! 🎉
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Your safety report has been processed by our AI NLP analyzer and saved to your citizen profile.
            <strong className="block text-indigo-600 dark:text-indigo-400 mt-1">
              You can check, track, and manage your filed reports anytime on your Profile page.
            </strong>
          </p>
        </div>

        {/* AI Insight Breakdown Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-violet-500/10 border border-indigo-100 dark:border-violet-500/20 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-700 dark:text-violet-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Safety Classification
            </span>
            <Badge variant={analysisResult.verified ? 'verified' : 'estimated'}>
              Confidence {analysisResult.verificationScore}%
            </Badge>
          </div>
          <p className="text-slate-700 dark:text-slate-300"><strong>Category Match:</strong> {analysisResult.category.toUpperCase()}</p>
          <p className="text-slate-700 dark:text-slate-300"><strong>Assigned Severity:</strong> {analysisResult.severity} / 5</p>
          <p className="text-slate-700 dark:text-slate-300"><strong>Detected Sentiment:</strong> {analysisResult.sentiment}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Check My Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setTitle('');
              setDescription('');
              setVoiceText('');
              setPhotoData(null);
              setSubmitted(false);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
      <div>
        <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Select Issue Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REPORT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                category === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span className="text-[11px] truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Incident Headline</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Broken streetlight on FC Road lane 2"
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Detailed Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Provide details about safety concerns, exact landmark, or time of day..."
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Voice Input</label>
          <VoiceRecorder onTranscriptChange={(text) => {
            setVoiceText(text);
            if (!description) setDescription(text);
          }} />
        </div>
        <div>
          <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Attach Photo</label>
          <PhotoUpload onPhotoSelect={setPhotoData} />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
          Location: {lat.toFixed(4)}, {lng.toFixed(4)} ({currentCity.name})
        </span>
        <button
          type="submit"
          disabled={isSubmitting || !title || !description}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Analyzing AI...' : 'Submit Report'}</span>
        </button>
      </div>
    </form>
  );
};
