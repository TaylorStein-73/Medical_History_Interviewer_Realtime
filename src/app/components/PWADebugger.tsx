"use client";

import { useEffect, useState } from 'react';

interface PWAStatus {
  serviceWorkerSupported: boolean;
  serviceWorkerRegistered: boolean;
  manifestSupported: boolean;
  isStandalone: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  userAgent: string;
}

export default function PWADebugger() {
  const [status, setStatus] = useState<PWAStatus | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);
  const [debuggerEnabled, setDebuggerEnabled] = useState(false);

  useEffect(() => {
    // Enable debugger with Ctrl+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDebuggerEnabled(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!debuggerEnabled) return;

    const checkPWAStatus = async () => {
      const newStatus: PWAStatus = {
        serviceWorkerSupported: 'serviceWorker' in navigator,
        serviceWorkerRegistered: false,
        manifestSupported: 'manifest' in window.document.createElement('link'),
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isInstalled: false,
        canInstall: false,
        userAgent: navigator.userAgent
      };

      // Check if service worker is registered
      if (newStatus.serviceWorkerSupported) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          newStatus.serviceWorkerRegistered = !!registration;
        } catch (e) {
          console.log('[PWA Debug] Error checking SW registration:', e);
        }
      }

      // Check if app is installed (various methods)
      newStatus.isInstalled = newStatus.isStandalone || 
        (window as any).navigator?.standalone === true;

      setStatus(newStatus);
    };

    checkPWAStatus();

    // Listen for beforeinstallprompt to detect installability
    const handleBeforeInstall = () => {
      setStatus(prev => prev ? { ...prev, canInstall: true } : null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, [debuggerEnabled]);

  if (!debuggerEnabled || !status) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono"
        title="PWA Debug Info (Ctrl+Shift+D to enable)"
      >
        PWA Debug
      </button>
      
      {showDebugger && (
        <div className="absolute bottom-12 left-0 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-80 text-xs font-mono">
          <div className="mb-2 font-bold flex justify-between items-center">
            PWA Status
            <button 
              onClick={() => setDebuggerEnabled(false)}
              className="text-red-400 hover:text-red-300"
              title="Close debugger"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1">
            <div>SW Supported: <span className={status.serviceWorkerSupported ? 'text-green-400' : 'text-red-400'}>
              {status.serviceWorkerSupported ? 'Yes' : 'No'}
            </span></div>
            <div>SW Registered: <span className={status.serviceWorkerRegistered ? 'text-green-400' : 'text-red-400'}>
              {status.serviceWorkerRegistered ? 'Yes' : 'No'}
            </span></div>
            <div>Manifest Supported: <span className={status.manifestSupported ? 'text-green-400' : 'text-red-400'}>
              {status.manifestSupported ? 'Yes' : 'No'}
            </span></div>
            <div>Is Standalone: <span className={status.isStandalone ? 'text-green-400' : 'text-yellow-400'}>
              {status.isStandalone ? 'Yes' : 'No'}
            </span></div>
            <div>Is Installed: <span className={status.isInstalled ? 'text-green-400' : 'text-yellow-400'}>
              {status.isInstalled ? 'Yes' : 'No'}
            </span></div>
            <div>Can Install: <span className={status.canInstall ? 'text-green-400' : 'text-yellow-400'}>
              {status.canInstall ? 'Yes' : 'No'}
            </span></div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div>Browser: {status.userAgent.includes('Chrome') ? 'Chrome' : 
                           status.userAgent.includes('Firefox') ? 'Firefox' :
                           status.userAgent.includes('Safari') ? 'Safari' : 'Other'}</div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700 text-yellow-400">
              <div>Note: Install button only shows when browser determines app is installable</div>
              <div className="mt-1 text-gray-400">Press Ctrl+Shift+D to toggle this debugger</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 