
import React from 'react';
import { Suggestion } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface SuggestionCardProps {
  suggestion: Suggestion;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-bold text-pink-600 mb-2">{suggestion.name}</h3>
      <p className="text-stone-600 mb-4">{suggestion.description}</p>
      <div className="bg-emerald-50 p-4 rounded-lg flex items-start gap-3">
        <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-emerald-800">Why it works</h4>
          <p className="text-sm text-emerald-700">{suggestion.reasoning}</p>
        </div>
      </div>
    </div>
  );
};
