"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent } from "react";

export function AboutPortrait() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 65, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 65, damping: 20 });

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 3.5);
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 3.5);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="relative mx-auto aspect-square w-full max-w-[600px] [perspective:1200px]"
    >
      <motion.div
        style={{ rotateX: smoothX, rotateY: smoothY }}
        className="absolute inset-0 [transform-style:preserve-3d]"
      >
        <motion.div
          animate={{ opacity: [0.26, 0.48, 0.26], scale: [0.94, 1.04, 0.94] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-x-[12%] bottom-[9%] h-[32%] rounded-full bg-[#4f8cff]/20 blur-[65px]"
        />
        <div className="absolute inset-x-[17%] bottom-[5%] h-[18%] rounded-full bg-black/45 blur-[34px]" />
        <div className="absolute inset-x-[23%] bottom-[10%] h-[13%] rounded-full bg-black/30 blur-[55px]" />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_92%_88%_at_50%_48%,black_68%,transparent_100%)]"
        >
          <Image
            src="/2wd.png"
            alt="John Solace working at his development workstation"
            fill
            priority
            sizes="(max-width: 1024px) 94vw, 46vw"
            className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.28)] transition-transform duration-700 hover:scale-[1.018]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
