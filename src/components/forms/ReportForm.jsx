import React, { useState } from 'react';
import { REPORT_CATEGORIES } from '../../config/categories';
import { useReportStore } from '../../store/useReportStore';
import { useCityStore } from '../../store/useCityStore';
import { analyzeReportNLP } from '../../services/ai';
import { VoiceRecorder } from './VoiceRecorder';
import { PhotoUpload } from './PhotoUpload';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MapPin, Send, Sparkles, CheckCircle } from 'lucide-react';

export const ReportForm = ({ onSuccess }) => {
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
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold font-display text-slate-100">Report Successfully Logged!</h3>
        <p className="text-xs text-slate-300">Your report has been analyzed by our client AI pipeline and placed on the city map.</p>

        {/* AI Insight Breakdown Box */}
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-violet-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI NLP Analysis
            </span>
            <Badge variant={analysisResult.verified ? 'verified' : 'estimated'}>
              Confidence {analysisResult.verificationScore}%
            </Badge>
          </div>
          <p className="text-slate-300"><strong>Category Match:</strong> {analysisResult.category.toUpperCase()}</p>
          <p className="text-slate-300"><strong>Assigned Severity:</strong> {analysisResult.severity} / 5</p>
          <p className="text-slate-300"><strong>Detected Sentiment:</strong> {analysisResult.sentiment}</p>
        </div>

        <Button onClick={() => setSubmitted(false)} variant="secondary" size="sm">
          Submit Another Report
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 glass-panel p-6 rounded-2xl border border-slate-800">
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Select Issue Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REPORT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                category === cat.id
                  ? 'bg-violet-600/20 border-violet-500/60 text-white ring-2 ring-violet-500/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span className="text-[11px] truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Incident Headline</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Broken streetlight on FC Road lane 2"
          className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-violet/50"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Detailed Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Provide details about safety concerns, exact landmark, or time of day..."
          className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-sm rounded-xl border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-violet/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Voice Input</label>
          <VoiceRecorder onTranscriptChange={(text) => {
            setVoiceText(text);
            if (!description) setDescription(text);
          }} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Attach Photo</label>
          <PhotoUpload onPhotoSelect={setPhotoData} />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          Location: {lat.toFixed(4)}, {lng.toFixed(4)} ({currentCity.name})
        </span>
        <Button
          type="submit"
          disabled={isSubmitting || !title || !description}
          variant="primary"
          icon={Send}
        >
          {isSubmitting ? 'Analyzing AI...' : 'Submit Report'}
        </Button>
      </div>
    </form>
  );
};
