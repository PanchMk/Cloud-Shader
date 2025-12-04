import React, { useState, Suspense } from 'react';
import MistScene from './components/MistScene';
import Controls from './components/Controls';
import { AppState } from './types';

const App: React.FC = () => {
  // Initial State optimized for a "Liquid/Cloudy" distortion look
  const [state, setState] = useState<AppState>({
    speed: 0.1,        // Slow, gentle movement
    distortion: 0.05,  // Subtle warping, not too chaotic
    frequency: 2.0,    // Medium scale noise
    textureUrl: null,  // Starts with default in MistScene
  });

  const handleStateChange = (key: keyof AppState, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a new object URL for the uploaded file
      const url = URL.createObjectURL(file);
      setState((prev) => ({ ...prev, textureUrl: url }));
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      {/* 3D Scene Background */}
      {/* 
        We use a key based on textureUrl to force a complete remount of the scene 
        whenever the texture changes. This prevents Suspense/Loader issues that 
        can cause the app to freeze when swapping textures.
      */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-xs uppercase tracking-widest z-0">
          Loading Shader...
        </div>
      }>
        <MistScene key={state.textureUrl || 'default'} {...state} />
      </Suspense>

      {/* Foreground UI */}
      <Controls 
        {...state} 
        onChange={handleStateChange} 
        onUpload={handleFileUpload} 
      />

      {/* Minimal Title */}
      <div className="absolute bottom-6 left-6 pointer-events-none mix-blend-difference z-20">
        <h1 className="text-2xl font-bold text-white tracking-tighter">
          WARP<span className="text-neutral-500">.</span>FX
        </h1>
      </div>
    </div>
  );
};

export default App;