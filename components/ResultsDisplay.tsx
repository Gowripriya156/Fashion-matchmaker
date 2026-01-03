
import React from 'react';
import { Suggestion } from '../types';
import { SuggestionCard } from './SuggestionCard';
import { DressIcon } from './icons/DressIcon';
import { CameraIcon } from './icons/CameraIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { SaveIcon } from './icons/SaveIcon';

interface ResultsDisplayProps {
  suggestions: Suggestion[];
  isLoading: boolean;
  error: string | null;
  hasSubmitted: boolean;
  onVisualize: () => void;
  isVisualizing: boolean;
  visualizedOutfitUrl: string | null;
  visualizeError: string | null;
  onRegenerate: () => void;
  onStartOver: () => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 animate-pulse">
        <div className="h-6 bg-stone-200 rounded-md w-1/3 mb-3"></div>
        <div className="space-y-2">
            <div className="h-4 bg-stone-200 rounded-md w-full"></div>
            <div className="h-4 bg-stone-200 rounded-md w-5/6"></div>
        </div>
        <div className="h-4 bg-stone-200 rounded-md w-1/2 mt-4"></div>
    </div>
);

const VisualizationDisplay: React.FC<{
    isVisualizing: boolean;
    visualizedOutfitUrl: string | null;
    visualizeError: string | null;
}> = ({ isVisualizing, visualizedOutfitUrl, visualizeError }) => {
    if (isVisualizing) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 animate-pulse">
                <div className="w-full aspect-square bg-stone-200 rounded-xl"></div>
                 <div className="h-5 bg-stone-200 rounded-md w-1/3 mt-4 mx-auto"></div>
            </div>
        );
    }

    if (visualizeError) {
        return (
             <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                <h4 className="font-semibold text-red-800">Visualization Failed</h4>
                <p className="text-sm text-red-700 mt-1">{visualizeError}</p>
             </div>
        );
    }

    if (visualizedOutfitUrl) {
        return (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200/80 space-y-4">
                 <h4 className="text-xl font-bold text-stone-800 text-center">Your Complete Look</h4>
                 <img src={visualizedOutfitUrl} alt="Visualized complete outfit" className="w-full h-auto object-cover rounded-xl" />
                 <a
                    href={visualizedOutfitUrl}
                    download="fashion-match-outfit.png"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-200"
                 >
                    <SaveIcon className="w-5 h-5" />
                    Save Look
                 </a>
            </div>
        );
    }

    return null;
}


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    suggestions, 
    isLoading, 
    error, 
    hasSubmitted,
    onVisualize,
    isVisualizing,
    visualizedOutfitUrl,
    visualizeError,
    onRegenerate,
    onStartOver
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="py-1">
            <svg className="h-6 w-6 text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Oops! Something went wrong.</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasSubmitted) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-white rounded-2xl shadow-sm border border-stone-200/80 h-full">
            <DressIcon className="w-24 h-24 text-stone-300 mb-6" />
            <h2 className="text-2xl font-semibold text-stone-700 mb-2">Let's find your perfect match!</h2>
            <p className="max-w-md text-stone-500">
                Upload a picture of your dress and tell us what you're looking for. Our AI stylist will create a personalized look just for you.
            </p>
        </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
             <h2 className="text-3xl font-bold text-stone-800">Your Style Suggestions</h2>
             <button
                onClick={onStartOver}
                className="text-sm font-semibold text-pink-600 hover:text-pink-800 transition-colors"
             >
                Try Another Dress
             </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button
                onClick={onVisualize}
                disabled={isVisualizing}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200 disabled:bg-stone-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isVisualizing ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Your Look...
                      </>
                ) : (
                    <>
                        <CameraIcon className="w-5 h-5" />
                        Visualize the Outfit
                    </>
                )}
            </button>
            <button
                onClick={onRegenerate}
                className="w-full flex items-center justify-center gap-2 bg-white text-stone-700 font-semibold py-3 px-4 rounded-lg shadow-sm border border-stone-300 hover:bg-stone-100 hover:border-stone-400 transition-all duration-200"
            >
                <RefreshIcon className="w-5 h-5" />
                Get New Ideas
            </button>
        </div>

        <VisualizationDisplay 
            isVisualizing={isVisualizing}
            visualizedOutfitUrl={visualizedOutfitUrl}
            visualizeError={visualizeError}
        />
        
        <div className="space-y-4 pt-4">
            {suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} />
            ))}
        </div>
      </div>
    );
  }

  return null;
};
