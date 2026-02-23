import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Bounds, useGLTF } from '@react-three/drei';

// Model loader component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <primitive object={scene} />
    </Float>
  );
}

// Loading component with percentage
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-primary-50 dark:bg-dark-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-primary-600 dark:text-primary-400 font-medium">Loading 3D Experience...</p>
      </div>
    </div>
  );
}

interface Hero3DProps {
  selectedModel: string;
}

export default function Hero3D({ selectedModel }: Hero3DProps) {
  const modelUrls = {
    earbuds: '/models/earbuds.glb',
    smartwatch: '/models/smartwatch.glb',
    keyboard: '/models/keyboard.glb',
    mouse: '/models/mouse.glb',
    speaker: '/models/speaker.glb',
  };

  const currentModel = modelUrls[selectedModel as keyof typeof modelUrls] || modelUrls.earbuds;

  return (
    <div className="absolute inset-0">
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 40 }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={40} />
        
        {/* 3-Point Lighting Setup */}
        <ambientLight intensity={0.4} />
        
        {/* Key Light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow={false}
          color="#ffffff"
        />
        
        {/* Fill Light */}
        <directionalLight
          position={[-5, 2, -5]}
          intensity={0.3}
          castShadow={false}
          color="#b0c4de"
        />
        
        {/* Rim Light */}
        <directionalLight
          position={[0, -5, 5]}
          intensity={0.4}
          castShadow={false}
          color="#ffffff"
        />
        
        {/* Soft point lights for depth */}
        <pointLight position={[2, 2, 2]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-2, -2, -2]} intensity={0.3} color="#87ceeb" />
        
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Model url={currentModel} />
          </Bounds>
          
          <Environment preset="studio" background={false} />
          
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
      
      <Suspense fallback={<Loader />}>
        <div />
      </Suspense>
    </div>
  );
}
