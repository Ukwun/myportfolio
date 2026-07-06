"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Html, Lightformer, PresentationControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Phase = "enter" | "hold" | "exit";

const models = [
  { url: "/uploads_files_5117985_iphone+16.glb", label: "Mobile product", detail: "Interface & product craft" },
  { url: "/uploads_files_6277401_TV+Stand.glb", label: "Digital spaces", detail: "Premium visual systems" },
  { url: "/gaming%20setup1%20(1).glb", label: "Immersive experience", detail: "Interactive 3D direction" },
  { url: "/uploads_files_6830356_modern+airport+terminal+3d+model.glb", label: "Built environment", detail: "Architectural storytelling" },
] as const;

function ShowcaseModel({ url, phase }: { url: string; phase: Phase }) {
  const { scene } = useGLTF(url);
  const motionRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  const normalizedModel = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const materials = sourceMaterials.map((source) => {
        const material = source.clone();
        if (material instanceof THREE.MeshStandardMaterial) {
          material.envMapIntensity = 1.65;
          material.roughness = Math.min(material.roughness, 0.42);
        }
        return material;
      });
      object.material = Array.isArray(object.material) ? materials : materials[0];
    });

    clone.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z) || 1;
    const normalizedScale = 2.7 / largestDimension;

    clone.position.set(-center.x, -center.y, -center.z);
    clone.scale.setScalar(normalizedScale);
    return clone;
  }, [scene]);

  useEffect(() => {
    if (!motionRef.current) return;
    motionRef.current.position.x = 4.2;
    motionRef.current.position.y = -0.05;
    motionRef.current.scale.setScalar(0.72);
  }, [normalizedModel]);

  useFrame(({ clock, pointer }, delta) => {
    if (!motionRef.current || !spinRef.current) return;
    const entering = phase === "enter";
    const exiting = phase === "exit";
    const targetX = exiting ? -4.2 : 0;
    const targetY = exiting ? 0.35 : Math.sin(clock.elapsedTime * 0.8) * 0.055;
    const targetScale = entering ? 1 : exiting ? 0.74 : 1;

    motionRef.current.position.x = THREE.MathUtils.damp(motionRef.current.position.x, targetX, exiting ? 4.8 : 5.5, delta);
    motionRef.current.position.y = THREE.MathUtils.damp(motionRef.current.position.y, targetY, 3.5, delta);
    const scale = THREE.MathUtils.damp(motionRef.current.scale.x, targetScale, 5, delta);
    motionRef.current.scale.setScalar(scale);

    spinRef.current.rotation.y += delta * 0.22;
    spinRef.current.rotation.x = THREE.MathUtils.damp(spinRef.current.rotation.x, pointer.y * 0.08, 3, delta);
    spinRef.current.rotation.z = THREE.MathUtils.damp(spinRef.current.rotation.z, -pointer.x * 0.04, 3, delta);
  });

  return (
    <group ref={motionRef}>
      <Float speed={1.25} rotationIntensity={0.05} floatIntensity={0.12}>
        <group ref={spinRef} rotation={[0.03, -0.35, 0]}>
          <primitive object={normalizedModel} />
        </group>
      </Float>
    </group>
  );
}

function LoadingModel() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.8;
  });
  return (
    <group>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.025, 16, 96]} />
        <meshBasicMaterial color="#4f8cff" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <Html center position={[0, -0.12, 0]} style={{ pointerEvents: "none" }}>
        <span className="hero-model-loading">Loading model</span>
      </Html>
    </group>
  );
}

function Pedestal() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.elapsedTime * 0.12;
  });
  return (
    <>
      <mesh ref={ring} position={[0, -1.48, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.12, 1.16, 128]} />
        <meshBasicMaterial color="#d6b25e" transparent opacity={0.58} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.52, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.46, 1.62, 0.14, 96]} />
        <meshPhysicalMaterial color="#0b0d11" roughness={0.19} metalness={0.88} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <ContactShadows position={[0, -1.44, 0]} opacity={0.78} scale={5.2} blur={2.4} far={3.5} color="#000000" />
    </>
  );
}

export function Hero3D() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("enter");
  const activeModel = models[index];

  useEffect(() => {
    const duration = phase === "enter" ? 1100 : phase === "hold" ? 5200 : 950;
    const timer = window.setTimeout(() => {
      if (phase === "enter") setPhase("hold");
      else if (phase === "hold") setPhase("exit");
      else {
        setIndex((current) => (current + 1) % models.length);
        setPhase("enter");
      }
    }, duration);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div className="hero-model-shell" aria-label="Live rotating showcase of branded 3D work">
      <div className="hero-model-grid" />
      <div className="hero-model-orbit hero-model-orbit-one" />
      <div className="hero-model-orbit hero-model-orbit-two" />
      <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 0.05, 6.2], fov: 34 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.65} />
        <spotLight position={[4, 6, 5]} angle={0.38} penumbra={0.9} intensity={85} castShadow shadow-bias={-0.0001} />
        <pointLight position={[-3.5, 0.5, 2]} color="#4f8cff" intensity={22} distance={8} />
        <pointLight position={[3, -1, 1]} color="#d6b25e" intensity={16} distance={7} />

        <PresentationControls global polar={[-0.12, 0.12]} azimuth={[-0.3, 0.3]} damping={0.18} snap>
          <Suspense fallback={<LoadingModel />}>
            <ShowcaseModel key={activeModel.url} url={activeModel.url} phase={phase} />
          </Suspense>
        </PresentationControls>
        <Pedestal />

        <Html position={[-1.48, 1.35, 0]} center transform distanceFactor={7.5} style={{ pointerEvents: "none" }}>
          <div className="hero-model-mark">
            <Image src="/new%20brandlogo2.png" alt="" width={22} height={22} />
            <span>8_GIGABYTES</span>
          </div>
        </Html>
        <Environment resolution={256}>
          <Lightformer intensity={3.5} color="white" position={[0, 5, -4]} scale={[6, 2, 1]} />
          <Lightformer intensity={2.4} color="#80aaff" position={[-5, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[4, 2, 1]} />
          <Lightformer intensity={2.1} color="#e6c46f" position={[5, -1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 2, 1]} />
        </Environment>
      </Canvas>

      <div className="hero-model-title" key={activeModel.label}>
        <span>0{index + 1} / 0{models.length}</span>
        <strong>{activeModel.label}</strong>
        <small>{activeModel.detail}</small>
      </div>
      <div className="hero-model-caption">
        <span><i /> Live 3D showcase</span>
        <strong>Drag to explore</strong>
      </div>
      <div className="hero-model-progress" key={`${index}-${phase}`} data-phase={phase} />
    </div>
  );
}

useGLTF.preload(models[0].url);

export default Hero3D;
