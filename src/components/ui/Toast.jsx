import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    info: <Info className="w-4 h-4 text-cyan-400" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-20 right-4 z-50 glass-panel px-4 py-3 rounded-xl border border-slate-700/80 shadow-2xl flex items-center gap-3 text-xs text-slate-100 bg-slate-950/90 backdrop-blur-xl max-w-sm"
      >
        {icons[type] || icons.info}
        <span className="flex-1 font-medium">{message}</span>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
