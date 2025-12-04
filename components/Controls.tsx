import React from 'react';
import { AppState } from '../types';

interface ControlsProps extends AppState {
  onChange: (key: keyof AppState, value: any) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step, onChange }) => (
  <div className="mb-5">
    <div className="flex justify-between mb-2">
      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</label>
      <span className="text-[10px] font-mono text-cyan-500">{value.toFixed(2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-cyan-400 transition-all"
    />
  </div>
);

const Controls: React.FC<ControlsProps> = ({
  speed,
  distortion,
  frequency,
  onChange,
  onUpload,
}) => {
  return (
    <div className="absolute top-6 right-6 z-10 w-72 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-none shadow-2xl text-white">
      <h2 className="text-sm font-bold mb-1 text-white uppercase tracking-widest">Warp Settings</h2>
      <p className="text-[10px] text-neutral-500 mb-6 border-b border-white/10 pb-4">
        Simplex Noise Displacement
      </p>

      {/* Texture Upload */}
      <div className="mb-8">
        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
          Reference Texture
        </label>
        <div className="relative group">
           <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="block w-full text-xs text-neutral-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-none file:border-0
              file:text-[10px] file:font-bold file:uppercase file:tracking-wider
              file:bg-white/10 file:text-white
              hover:file:bg-white/20 cursor-pointer transition-colors"
          />
        </div>
      </div>

      <Slider
        label="Flow Speed"
        value={speed}
        min={0}
        max={1.0}
        step={0.01}
        onChange={(v) => onChange('speed', v)}
      />

      <Slider
        label="Distortion Strength"
        value={distortion}
        min={0}
        max={0.5}
        step={0.001}
        onChange={(v) => onChange('distortion', v)}
      />

      <Slider
        label="Noise Frequency (Scale)"
        value={frequency}
        min={0.5}
        max={10.0}
        step={0.1}
        onChange={(v) => onChange('frequency', v)}
      />
      
      <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded text-[10px] text-neutral-400 leading-relaxed">
        <strong>Tip:</strong> High Frequency + Low Speed = Heat Haze. <br/>
        Low Frequency + High Speed = Drifting Clouds.
      </div>
    </div>
  );
};

export default Controls;