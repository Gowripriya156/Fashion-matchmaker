
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Suggestion } from './types';
import { getFashionMatches, visualizeOutfit } from './services/geminiService';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { PromptControls } from './components/PromptControls';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('shoes, a handbag, and jewelry');
  const [occasion, setOccasion] = useState<string>('Any');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for visualization
  const [visualizedOutfitUrl, setVisualizedOutfitUrl] = useState<string | null>(null);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [visualizeError, setVisualizeError] = useState<string | null>(null);


  const handleFileChange = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSuggestions([]);
      setError(null);
      setVisualizedOutfitUrl(null); // Reset visualization on new image
      setVisualizeError(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) {
      setError('Please upload an image of a dress first.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please tell us what you are looking for.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setVisualizedOutfitUrl(null); // Reset visualization on new submission
    setVisualizeError(null);

    try {
      const results = await getFashionMatches(selectedFile, prompt, occasion);
      setSuggestions(results);
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(`An error occurred: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, prompt, occasion]);

  const handleVisualizeOutfit = useCallback(async () => {
    if (!selectedFile || suggestions.length === 0) {
      setVisualizeError("Cannot visualize without a dress and suggestions.");
      return;
    }

    setIsVisualizing(true);
    setVisualizeError(null);
    setVisualizedOutfitUrl(null);

    try {
      const imageUrl = await visualizeOutfit(selectedFile, suggestions);
      setVisualizedOutfitUrl(imageUrl);
    } catch (e) {
        const err = e as Error;
        console.error(err);
        setVisualizeError(`Failed to create visualization: ${err.message}. Please try again.`);
    } finally {
        setIsVisualizing(false);
    }
  }, [selectedFile, suggestions]);

  const handleStartOver = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSuggestions([]);
    setError(null);
    setVisualizedOutfitUrl(null);
    setVisualizeError(null);
    setIsLoading(false);
    setIsVisualizing(false);
    setPrompt('shoes, a handbag, and jewelry');
    setOccasion('Any');
  };


  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80">
              <h2 className="text-xl font-semibold text-stone-700 mb-4">1. Your Dress</h2>
              <ImageUploader onFileChange={handleFileChange} previewUrl={previewUrl} />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 sticky top-8">
              <h2 className="text-xl font-semibold text-stone-700 mb-4">2. Find Matches</h2>
              <PromptControls
                prompt={prompt}
                setPrompt={setPrompt}
                occasion={occasion}
                setOccasion={setOccasion}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isFileSelected={!!selectedFile}
              />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 xl:col-span-9">
            <ResultsDisplay
              suggestions={suggestions}
              isLoading={isLoading}
              error={error}
              hasSubmitted={suggestions.length > 0 || isLoading || !!error}
              onVisualize={handleVisualizeOutfit}
              isVisualizing={isVisualizing}
              visualizedOutfitUrl={visualizedOutfitUrl}
              visualizeError={visualizeError}
              onRegenerate={handleSubmit}
              onStartOver={handleStartOver}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
