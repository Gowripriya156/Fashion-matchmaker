
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-stone-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-800">
          <SparklesIcon className="h-8 w-8 text-pink-500" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Fashion Matchmaker
          </h1>
        </div>
      </div>
    </header>
  );
};
