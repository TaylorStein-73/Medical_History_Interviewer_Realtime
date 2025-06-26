"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface InterviewContextType {
  isComplete: boolean;
  summary: string;
  tasks: string[];
  setSummary: (summary: string) => void;
  setTasks: (tasks: string[]) => void;
  completeInterview: (summary: string, tasks: string[]) => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  console.log('InterviewProvider render');
  
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  const completeInterview = useCallback((newSummary: string, newTasks: string[]) => {
    console.log('InterviewContext.completeInterview called with:', { newSummary, newTasks });
    setSummary(newSummary);
    setTasks(newTasks);
    setIsComplete(true);
    console.log('InterviewContext state updated:', { isComplete: true, summary: newSummary, tasks: newTasks });
  }, []);

  const resetInterview = useCallback(() => {
    console.log('InterviewContext.resetInterview called');
    setSummary('');
    setTasks([]);
    setIsComplete(false);
    console.log('InterviewContext state reset');
  }, []);

  const value = {
    isComplete,
    summary,
    tasks,
    setSummary,
    setTasks,
    completeInterview,
    resetInterview,
  };

  console.log('InterviewContext current state:', value);

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
} 