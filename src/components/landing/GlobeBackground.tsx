"use client";

import React, { useRef, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";

type Props = {
  className?: string;
  speed?: number;
};

function Model({ url, speed = 0.08 }: { url: string; speed?: number }) {
  const { scene } = useGLTF(url) as any;
  const ref = useRef<any>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return <primitive ref={ref} object={scene} scale={1.0} position={[0, -0.5, 0]} />;
}

export default function GlobeBackground({ className = "", speed = 0.08 }: Props) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    // prefer .glb if present, otherwise fall back to .gltf
    let mounted = true;
    async function probe() {
      try {
        const glbResp = await fetch('/models/scene.glb', { method: 'HEAD' });
        if (mounted && glbResp.ok) {
          setModelUrl('/models/scene.glb');
          return;
        }
      } catch (e) {
        // ignore
      }

      try {
        const gltfResp = await fetch('/models/scene.gltf', { method: 'HEAD' });
        if (mounted && gltfResp.ok) {
          setModelUrl('/models/scene.gltf');
          return;
        }
      } catch (e) {
        // ignore
      }

      // if neither found, leave null
    }

    probe();
    return () => {
      mounted = false;
    };
  }, []);

  if (!modelUrl) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none translate-y-100 ${className}`}>
      <Canvas camera={{ position: [0, 0, -230], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.8} position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <Model url={modelUrl} speed={speed} />
          </group>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/scene.gltf");
