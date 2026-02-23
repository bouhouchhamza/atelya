import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Electronic components
function WirelessEarbuds({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Left earbud */}
      <mesh position={[-0.3, 0, 0]}>
        <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right earbud */}
      <mesh position={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Case */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1, 0.3, 0.8]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Smartwatch({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Watch band */}
      <mesh position={[0, 0, -0.2]}>
        <torusGeometry args={[0.8, 0.15, 8, 16]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.8} />
      </mesh>
      {/* Watch face */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.5, 0.5, 0.01, 32]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#00ffff" emissiveIntensity={0.2} />
      </mesh>
      {/* Digital crown */}
      <mesh position={[0.65, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function MechanicalKeyboard({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Keyboard base */}
      <mesh>
        <boxGeometry args={[3.5, 0.3, 1.2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Keys */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-1.2 + i * 0.6, 0.16, 0]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.9} />
        </mesh>
      ))}
      {/* Keycaps */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`cap-${i}`} position={[-1.2 + i * 0.6, 0.22, 0]}>
          <boxGeometry args={[0.45, 0.05, 0.45]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function GamingMouse({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.18;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9) * 0.07;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Mouse body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Mouse buttons */}
      <mesh position={[0, 0.1, 0.2]}>
        <boxGeometry args={[0.6, 0.05, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.4} />
      </mesh>
      {/* RGB lighting */}
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[0.35, 0.05, 4, 16]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function PortableSpeaker({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.14;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.09;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Speaker cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
        <meshStandardMaterial color="#4a90e2" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Speaker grill */}
      <mesh position={[0, 0, 0.51]}>
        <cylinderGeometry args={[0.48, 0.48, 0.02, 16]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      {/* Speaker cone */}
      <mesh position={[0, 0, 0.52]}>
        <cylinderGeometry args={[0.3, 0.3, 0.01, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Control buttons */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

interface ElectronicsSceneProps {
  selectedItem: number;
}

export default function ElectronicsScene({ selectedItem }: ElectronicsSceneProps) {
  const items = [
    { component: WirelessEarbuds, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { component: Smartwatch, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { component: MechanicalKeyboard, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { component: GamingMouse, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { component: PortableSpeaker, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
  ];

  const currentItem = items[selectedItem];

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} castShadow />
        
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {currentItem && <currentItem.component {...currentItem} />}
          </Float>
          
          <Environment preset="studio" />
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// WebGL Fallback Component
export function WebGLFallback() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-dark-800 dark:to-dark-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-primary-500 dark:bg-primary-600 rounded-3xl flex items-center justify-center">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            ATELYA ELECTRONICS
          </h2>
          <p className="text-lg text-primary-700 dark:text-primary-300 mb-8">
            Premium Electronics for Modern Living
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {['Audio', 'Wearables', 'Computing', 'Gaming', 'Mobile'].map((category, index) => (
            <div key={index} className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-lg">
              <div className="w-12 h-12 mx-auto mb-2 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-primary-500 rounded"></div>
              </div>
              <p className="text-sm font-medium text-primary-900 dark:text-primary-100">{category}</p>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-primary-600 dark:text-primary-400">
          For the best experience, please use a modern browser with WebGL support.
        </p>
      </div>
    </div>
  );
}
