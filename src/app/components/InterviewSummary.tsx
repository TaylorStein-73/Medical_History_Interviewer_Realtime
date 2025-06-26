import React, { useEffect } from 'react';

interface InterviewSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  tasks: string[];
}

export default function InterviewSummary({ isOpen, onClose, summary, tasks }: InterviewSummaryProps) {
  useEffect(() => {
    console.log('InterviewSummary mounted/updated');
    console.log('InterviewSummary props:', { isOpen, summary, tasks });
  }, [isOpen, summary, tasks]);

  console.log('InterviewSummary render:', { isOpen, summary, tasks });

  if (!isOpen) {
    console.log('InterviewSummary not showing because isOpen is false');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Interview Summary</h1>
          <button
            onClick={() => {
              console.log('InterviewSummary close button clicked');
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {tasks.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Tasks to Complete</h2>
              <ul className="list-disc pl-5 space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="text-gray-700">{task}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">SOAP Notes</h2>
            <div className="whitespace-pre-wrap font-mono text-sm text-gray-700">
              {summary}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              console.log('InterviewSummary close button clicked');
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 