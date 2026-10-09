import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const VoiceRecorder = ({ onTranscriptChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  const startRecording = () => {
    setError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Web Speech API is not supported on this browser. Try typing instead.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        if (onTranscriptChange) onTranscriptChange(currentText);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied or error occurred.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            variant="outline"
            size="sm"
            icon={Mic}
          >
            Record Voice Note
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="danger"
            size="sm"
            icon={Square}
            className="animate-pulse"
          >
            Stop Recording...
          </Button>
        )}
        {isRecording && (
          <span className="text-xs font-medium text-rose-400 flex items-center gap-1.5 animate-pulse">
            <Volume2 className="w-4 h-4" /> Listening to voice...
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-amber-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {transcript && (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
          <span className="font-semibold text-cyan-400 block mb-0.5">Transcribed Note:</span>
          "{transcript}"
        </div>
      )}
    </div>
  );
};
