"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bounds,
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/uploads_files_5117985_iphone+16.glb";

function ProductModel() {
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      object.material = materials.map((source) => {
        const material = source.clone();
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 1.8;
          material.roughness = Math.min(material.roughness, 0.36);
          material.metalness = Math.max(material.metalness, 0.15);
        }
        return material;
      });
    });
  }, [model]);

  useFrame(({ clock, pointer }, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.16;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      pointer.y * 0.08 + Math.sin(clock.elapsedTime * 0.7) * 0.025,
      0.045,
    );
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -pointer.x * 0.035, 0.045);
  });

  return (
    <Float speed={1.45} rotationIntensity={0.08} floatIntensity={0.28} floatingRange={[-0.08, 0.08]}>
      <group ref={ref} rotation={[0.02, -0.34, -0.035]}>
        <Bounds fit clip observe margin={1.18}>
          <primitive object={model} />
        </Bounds>
      </group>
    </Float>
  );
}

function Stage() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.elapsedTime * 0.12;
  });

  return (
    <>
      <PresentationControls global polar={[-0.12, 0.12]} azimuth={[-0.25, 0.25]} damping={0.18} snap>
        <ProductModel />
      </PresentationControls>

      <mesh ref={ring} position={[0, -1.42, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.12, 1.15, 128]} />
        <meshBasicMaterial color="#d6b25e" transparent opacity={0.58} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.46, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.46, 1.62, 0.14, 96]} />
        <meshPhysicalMaterial color="#0b0d11" roughness={0.19} metalness={0.88} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <ContactShadows position={[0, -1.38, 0]} opacity={0.72} scale={5.2} blur={2.5} far={3.5} color="#000000" />

      <Html position={[-1.45, 1.28, 0]} center transform distanceFactor={7.5} style={{ pointerEvents: "none" }}>
        <div className="hero-model-mark">
          <Image src="/new%20brandlogo2.png" alt="" width={22} height={22} />
          <span>8_GIGABYTES</span>
        </div>
      </Html>
    </>
  );
}

export function Hero3D() {
  return (
    <div className="hero-model-shell" aria-label="Interactive branded 3D product showcase">
      <div className="hero-model-grid" />
      <div className="hero-model-orbit hero-model-orbit-one" />
      <div className="hero-model-orbit hero-model-orbit-two" />
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.1, 6.2], fov: 34 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.32} />
        <spotLight position={[4, 6, 5]} angle={0.34} penumbra={0.9} intensity={75} castShadow shadow-bias={-0.0001} />
        <pointLight position={[-3.5, 0.5, 2]} color="#4f8cff" intensity={18} distance={8} />
        <pointLight position={[3, -1, 1]} color="#d6b25e" intensity={12} distance={7} />
        <Suspense fallback={null}>
          <Stage />
          <Environment resolution={256}>
            <Lightformer intensity={3.5} color="white" position={[0, 5, -4]} scale={[6, 2, 1]} />
            <Lightformer intensity={2.2} color="#80aaff" position={[-5, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[4, 2, 1]} />
            <Lightformer intensity={2} color="#e6c46f" position={[5, -1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 2, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
      <div className="hero-model-caption">
        <span><i /> Live digital craft</span>
        <strong>Drag to explore</strong>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_URL);

export default Hero3D;
