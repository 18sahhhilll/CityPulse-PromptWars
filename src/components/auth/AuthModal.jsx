import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAuthStore } from '../../store/useAuthStore';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, defaultMode = 'signin', onSuccess }) => {
  const [mode, setMode] = useState(defaultMode); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [localError, setLocalError] = useState('');

  const { signIn, signUp, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && !fullName) {
      setLocalError('Please enter your full name.');
      return;
    }

    let result;
    if (mode === 'signin') {
      result = await signIn(email, password);
    } else {
      result = await signUp(email, password, fullName);
    }

    if (result.success) {
      setEmail('');
      setPassword('');
      setFullName('');
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  const displayError = localError || error;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'signin' ? 'Citizen Sign In' : 'Register Citizen Account'}>
      <div className="space-y-5">
        
        {/* Header Icon & Intro */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
            {mode === 'signin' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
            {mode === 'signin' ? 'Welcome Back to CityPulse' : 'Create Your Civic Guardian Profile'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signin'
              ? 'Sign in to file verified citizen reports and track community impact.'
              : 'Register to file safety reports, upvote local issues, and earn civic badges.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setLocalError('');
              clearError();
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setLocalError('');
              clearError();
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sahil Deshmukh"
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{mode === 'signin' ? 'Sign In to Account' : 'Complete Registration'}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </Modal>
  );
};
