import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Material } from 'three';
import type { Mesh, Object3D } from 'three';

export const MODEL_PATHS = {
  earbuds: '/models/earbuds.glb',
  mouse: '/models/mouse.glb',
  keyboard: '/models/keyboard.glb',
  speaker: '/models/speaker.glb',
  smartwatch: '/models/smartwatch.glb',
} as const;

export type ModelKey = keyof typeof MODEL_PATHS;

interface ModelProps {
  modelKey: ModelKey;
  scale: number;
  theme?: 'light' | 'dark';
}

interface ThemedMaterial {
  clone: () => ThemedMaterial;
  needsUpdate?: boolean;
  color?: { set: (value: string) => void };
  metalness?: number;
  roughness?: number;
  envMapIntensity?: number;
}

export default function Model({ modelKey, scale, theme = 'light' }: ModelProps) {
  const { scene } = useGLTF(MODEL_PATHS[modelKey]);

  const modelScene = useMemo(() => {
    const cloned = scene.clone(true) as Object3D;
    const earbudsMaterial =
      theme === 'dark'
        ? { color: '#121418', metalness: 0.18, roughness: 0.62, envMapIntensity: 0.82 }
        : { color: '#f5f6f8', metalness: 0.34, roughness: 0.16, envMapIntensity: 1.15 };

    cloned.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (modelKey !== 'earbuds' || !mesh.material) {
        return;
      }

      const patchMaterial = (material: unknown) => {
        const source = material as ThemedMaterial;
        const clonedMaterial = source.clone();

        if (clonedMaterial.color?.set) {
          clonedMaterial.color.set(earbudsMaterial.color);
        }
        if (typeof clonedMaterial.metalness === 'number') {
          clonedMaterial.metalness = earbudsMaterial.metalness;
        }
        if (typeof clonedMaterial.roughness === 'number') {
          clonedMaterial.roughness = earbudsMaterial.roughness;
        }
        if (typeof clonedMaterial.envMapIntensity === 'number') {
          clonedMaterial.envMapIntensity = earbudsMaterial.envMapIntensity;
        }

        clonedMaterial.needsUpdate = true;
        return clonedMaterial;
      };

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => patchMaterial(material) as unknown as Material);
      } else {
        mesh.material = patchMaterial(mesh.material) as unknown as Material;
      }
    });

    return cloned;
  }, [modelKey, scene, theme]);

  return <primitive object={modelScene} scale={scale} dispose={null} />;
}

useGLTF.preload(MODEL_PATHS.earbuds);
