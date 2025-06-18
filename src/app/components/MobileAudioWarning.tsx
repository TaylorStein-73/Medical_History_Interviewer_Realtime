"use client";

import { useEffect, useState } from 'react';

export default function MobileAudioWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasSeenWarning = localStorage.getItem('mobileAudioWarningDismissed') === 'true';
    
    if (isMobile && !hasSeenWarning && !dismissed) {
      setShowWarning(true);
    }
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowWarning(false);
    localStorage.setItem('mobileAudioWarningDismissed', 'true');
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Mobile Audio Tip
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            For the best experience on mobile, we recommend using headphones to prevent audio feedback. 
            Push-to-talk mode is enabled by default on mobile devices.
          </p>
          <button
            onClick={handleDismiss}
            className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md transition-colors"
          >
            Got it
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-yellow-400 hover:text-yellow-600"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 