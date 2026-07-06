"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Compass, Rocket, ShieldCheck, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { readVisitorProfile, recordVisitorActivity, saveVisitorProfile, type VisitorFocus } from "@/lib/personalization";
import * as THREE from "three";

type FocusMode = VisitorFocus | "default";

type FocusOption = {
  key: FocusMode;
  label: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  glow: string;
};

const focusOptions: FocusOption[] = [
  {
    key: "default",
    label: "Trust signal",
    blurb: "A calm, credible experience for every visitor.",
    icon: ShieldCheck,
    accent: "#4f8cff",
    glow: "#8fb7ff",
  },
  {
    key: "website",
    label: "Premium website",
    blurb: "Luxury positioning with clarity and momentum.",
    icon: Compass,
    accent: "#d6b25e",
    glow: "#ffe7a2",
  },
  {
    key: "platform",
    label: "Operational platform",
    blurb: "A resilient system that scales with confidence.",
    icon: BarChart3,
    accent: "#5ee7d7",
    glow: "#aef1e4",
  },
  {
    key: "mobile",
    label: "Mobile product",
    blurb: "Fast, refined, and friction-free on every device.",
    icon: Rocket,
    accent: "#ff7a59",
    glow: "#ffc6b2",
  },
  {
    key: "growth",
    label: "Growth strategy",
    blurb: "A thoughtful upgrade path for serious teams.",
    icon: Zap,
    accent: "#b08cff",
    glow: "#d8c0ff",
  },
];

function TrustOrb({ accent, glow }: { accent: string; glow: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.6;
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.8) * 0.22;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.4} rotationIntensity={0.32} floatIntensity={0.65}>
        <mesh castShadow position={[0, 0.15, 0]}>
          <icosahedronGeometry args={[1.1, 2]} />
          <meshPhysicalMaterial
            color={accent}
            roughness={0.18}
            metalness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive={glow}
            emissiveIntensity={0.35}
            transmission={0.08}
          />
        </mesh>
      </Float>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
        <ringGeometry args={[0.92, 1.55, 110]} />
        <meshBasicMaterial color={glow} transparent opacity={0.9} />
      </mesh>

      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[1.55, 0.045, 14, 130]} />
        <meshBasicMaterial color={glow} transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.9, 0.3, -0.4]}>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial color={accent} emissive={glow} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[-0.8, -0.4, 0.7]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color={accent} emissive={glow} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export function TrustScene() {
  const [profile, setProfile] = useState(() => readVisitorProfile());
  const [selectedFocus, setSelectedFocus] = useState<FocusMode>("default");

  useEffect(() => {
    const currentProfile = readVisitorProfile();
    setProfile(currentProfile);
    setSelectedFocus((currentProfile.focus || "default") as FocusMode);
  }, []);

  const activeOption = useMemo(() => focusOptions.find((option) => option.key === selectedFocus) ?? focusOptions[0], [selectedFocus]);

  function handleFocusChange(option: FocusOption) {
    const currentProfile = readVisitorProfile();
    const nextProfile = saveVisitorProfile({
      ...currentProfile,
      focus: option.key === "default" ? "" : option.key,
    });
    recordVisitorActivity("focus-selected", `${option.label} selected`);
    setProfile(nextProfile);
    setSelectedFocus(option.key);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 22 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, delay: 0.18 }}
      className="rounded-[2rem] border border-white/10 bg-[#0f0f10]/90 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(79,140,255,0.18),_transparent_40%),linear-gradient(135deg,_rgba(12,12,12,0.98),_rgba(24,24,24,0.92))] p-4 sm:p-5">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
            <Sparkles size={15} className="text-[#d6b25e]" />
            Adaptive trust layer
          </span>
          <span className="rounded-full border border-[#4f8cff]/20 bg-[#4f8cff]/10 px-3 py-1 text-[#8fb7ff]">Live</span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-3">
            <div className="relative h-[260px] overflow-hidden rounded-[1rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(6,6,6,0.95),_rgba(25,25,25,0.95))]">
              <Canvas camera={{ position: [0, 0, 5], fov: 36 }} shadows>
                <ambientLight intensity={0.9} />
                <directionalLight position={[4, 6, 3]} intensity={1.7} castShadow />
                <pointLight position={[-3, 2.4, -3]} color={activeOption.glow} intensity={3.2} />
                <pointLight position={[3, -2, 2]} color={activeOption.accent} intensity={1.6} />
                <TrustOrb accent={activeOption.accent} glow={activeOption.glow} />
              </Canvas>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-[11px] uppercase tracking-[0.24em] text-white/70">
                <span>Signal {profile.activityCount + 1}</span>
                <span>{profile.focus ? "Tailored" : "Calm"}</span>
              </div>
            </div>
            <div className="mt-3 rounded-[1rem] border border-white/10 bg-white/5 p-3 text-sm text-white/75">
              <p className="font-semibold text-white">{profile.name ? `${profile.name} is seeing a tailored overview.` : "A realistic experience is being shaped for your visit."}</p>
              <p className="mt-1 text-xs leading-6 text-white/60">The scene responds to the direction you choose so the experience feels intelligent rather than templated.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[1.15rem] border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-sm text-[#d6b25e]">
                <ShieldCheck size={15} />
                Trusted by founders building serious digital products
              </div>
              <p className="mt-2 text-lg font-semibold text-white">{activeOption.label}</p>
              <p className="mt-1 text-sm leading-7 text-white/65">{activeOption.blurb}</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {focusOptions.map((option) => {
                const Icon = option.icon;
                const active = option.key === selectedFocus;
                return (
                  <motion.button
                    key={option.key}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleFocusChange(option)}
                    className={`rounded-[1rem] border px-3 py-3 text-left text-sm transition ${
                      active ? "border-[#4f8cff]/45 bg-[#4f8cff]/12 text-white" : "border-white/10 bg-black/20 text-white/70 hover:border-[#d6b25e]/30 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: `${option.accent}22`, color: option.accent }}>
                        <Icon size={15} />
                      </span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-white/60">{option.blurb}</p>
                  </motion.button>
                );
              })}
            </div>

            <div className="rounded-[1.15rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(79,140,255,0.12),_rgba(214,178,94,0.08))] p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{profile.name || "New visitor"}</p>
                  <p className="text-xs text-white/60">{profile.company || "Your details are being shaped in real time"}</p>
                </div>
                <a href="/packages" className="btn-secondary px-3 py-2 text-sm">
                  Explore <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
