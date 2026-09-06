import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Phone, ShieldAlert } from 'lucide-react';

interface WorkerReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: { category: string; description: string }) => void;
}

export const WorkerReportProblemModal: React.FC<WorkerReportProblemModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Customer not available');
  const [description, setDescription] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = [
    'Customer not available / Not answering phone',
    'Wrong service location / Cannot find address',
    'Extra heavy work requested beyond original job',
    'Customer refused to pay or disputing agreed amount',
    'Unsafe or hazardous environment at site',
    'Required spare parts / customer materials missing',
    'Other issue'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ category: selectedCategory, description });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-amber-50 px-5 sm:px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold">
              ⚠️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                Report a Problem
              </h2>
              <p className="text-xs text-amber-800">
                Cooperative supervisor will assist you immediately
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-black text-gray-900">
              Problem Report Logged
            </h3>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Your cooperative area supervisor has been notified. You are protected by the Sahakari worker safety charter.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                What is the issue you are facing?
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-amber-100 text-amber-950 border-amber-400'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                Extra Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain in a few words what happened..."
                className="w-full p-3 rounded-2xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden min-h-[80px]"
              />
            </div>

            <div className="bg-red-50 p-3 rounded-2xl border border-red-200 flex items-center justify-between text-xs">
              <div className="text-red-900 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Need urgent assistance right now?</span>
              </div>
              <a
                href="tel:1800123456"
                className="px-3 py-1.5 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition"
              >
                Call Helpline
              </a>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs transition shadow-sm cursor-pointer"
              >
                Submit Issue
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
