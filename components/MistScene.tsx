import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, LinearFilter, MirroredRepeatWrapping } from 'three';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../utils/shader';
import { AppState } from '../types';

// Fix for JSX.IntrinsicElements errors - supporting both legacy and React 18+ JSX types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      shaderMaterial: any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        mesh: any;
        planeGeometry: any;
        shaderMaterial: any;
      }
    }
  }
}

const DEFAULT_TEXTURE_URL = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1024&auto=format&fit=crop";

interface MistMaterialProps extends AppState {}

const MistPlane: React.FC<MistMaterialProps> = ({ 
  speed, 
  distortion, 
  frequency,
  textureUrl 
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const activeUrl = textureUrl || DEFAULT_TEXTURE_URL;
  
  // Load texture using Suspense-ready loader
  // Cross-origin helps with Unsplash images
  const texture = useLoader(TextureLoader, activeUrl, (loader) => {
    loader.setCrossOrigin('anonymous');
  });

  // Effect: Configure texture settings when it loads
  // We use useEffect instead of useMemo for side effects (modifying texture props)
  useEffect(() => {
    if (texture) {
      texture.wrapS = MirroredRepeatWrapping;
      texture.wrapT = MirroredRepeatWrapping;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Create uniforms object once. We will update its values via refs/effects.
  // This avoids re-creating the object which can cause shader recompilation.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uSpeed: { value: speed },
      uDistortion: { value: distortion },
      uFrequency: { value: frequency },
    }),
    [texture] // Re-create if texture changes (mostly happens on mount since we key the component)
  );

  // Frame Loop: Update uniforms for animation
  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Update interactive parameters every frame (or could be in useEffect)
      material.current.uniforms.uSpeed.value = speed;
      material.current.uniforms.uDistortion.value = distortion;
      material.current.uniforms.uFrequency.value = frequency;
    }
  });

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

interface MistSceneProps extends AppState {}

const MistScene: React.FC<MistSceneProps> = (props) => {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }} dpr={[1, 2]}>
        <MistPlane {...props} />
      </Canvas>
    </div>
  );
};

export default MistScene;