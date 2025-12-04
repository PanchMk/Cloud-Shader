import * as THREE from 'three';

export interface Uniforms {
  uTime: { value: number };
  uTexture: { value: THREE.Texture | null };
  uSpeed: { value: number };
  uDistortion: { value: number }; // Amplitude
  uFrequency: { value: number };  // Scale
}

export interface AppState {
  speed: number;
  distortion: number;
  frequency: number;
  textureUrl: string | null;
}