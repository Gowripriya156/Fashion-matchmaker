
import React from 'react';
import { WandIcon } from './icons/WandIcon';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  occasion: string;
  setOccasion: (occasion: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isFileSelected: boolean;
}

const occasions = ['Any', 'Casual', 'Formal', 'Party'];

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, setPrompt, occasion, setOccasion, onSubmit, isLoading, isFileSelected }) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="occasion" className="block text-sm font-medium text-stone-600 mb-2">
          Occasion
        </label>
        <div className="grid grid-cols-2 gap-2">
            {occasions.map((o) => (
                <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 border ${
                        occasion === o
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100 hover:border-stone-400'
                    }`}
                >
                    {o}
                </button>
            ))}
        </div>
      </div>
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-stone-600 mb-1">
          I'm looking for...
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., shoes and a handbag"
          rows={3}
          className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !isFileSelected}
        className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-pink-600 transition-all duration-200 disabled:bg-stone-300 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Styling...
          </>
        ) : (
          <>
            <WandIcon className="w-5 h-5" />
            Find Matches
          </>
        )}
      </button>
    </div>
  );
};
