import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import Model, { type ModelKey } from './Model';

const MODEL_CONFIG: Record<ModelKey, { scale: number; yOffset: number }> = {
  earbuds: { scale: 0.22, yOffset: -0.02 },
  mouse: { scale: 0.35, yOffset: -0.02 },
  keyboard: { scale: 0.3, yOffset: -0.06 },
  speaker: { scale: 0.4, yOffset: -0.02 },
  smartwatch: { scale: 0.28, yOffset: -0.02 },
};

interface Hero3DProps {
  modelKey: ModelKey;
  theme?: 'light' | 'dark';
  enableAutoRotate?: boolean;
}

export default function Hero3D({
  modelKey,
  theme = 'light',
  enableAutoRotate = false,
}: Hero3DProps) {
  const model = MODEL_CONFIG[modelKey];
  const [isDocumentVisible, setIsDocumentVisible] = useState(() =>
    typeof document === 'undefined' ? true : !document.hidden
  );
  const shouldAutoRotate = enableAutoRotate && isDocumentVisible;

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={shouldAutoRotate ? 'always' : 'demand'}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 2.2], fov: 35 }}
        className="absolute inset-0"
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[2, 2, 3]}
          intensity={1.2}
        />
        <pointLight position={[-1.25, 1.1, -1.8]} intensity={0.22} color="#e2e8f0" />

        <Suspense fallback={null}>
          <group position={[0, model.yOffset, 0]}>
            <Center>
              <group rotation={[0, 0.18, 0]}>
                <Model key={modelKey} modelKey={modelKey} scale={model.scale} theme={theme} />
              </group>
            </Center>
          </group>
          <OrbitControls
            autoRotate={shouldAutoRotate}
            autoRotateSpeed={0.45}
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
