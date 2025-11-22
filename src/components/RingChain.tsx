"use client";

import React, { useEffect, useRef, useState } from "react";

type RingPos = { x: number; y: number; angle: number; delay: number };

const RingChain: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [rings, setRings] = useState<RingPos[]>([]);

  useEffect(() => {
    const compute = () => {
      const path = pathRef.current;
      if (!path) return;

      const length = path.getTotalLength();
      const gap = length / (count - 1);
      const points: RingPos[] = [];

      for (let i = 0; i < count; i++) {
        const dist = i * gap;
        const p = path.getPointAtLength(dist);
        const ahead = Math.min(dist + 2, length);
        const p2 = path.getPointAtLength(ahead);
        const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
        points.push({ x: p.x, y: p.y, angle, delay: (i % 8) * 0.04 });
      }

      setRings(points);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [count]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      className="w-full h-full absolute left-0 top-0 pointer-events-none z-50"
      aria-hidden
    >
      {/* invisible path used to place rings */}
      <path
        ref={pathRef}
        d="M120 100 C 260 60, 520 60, 600 100 C 680 140, 940 140, 1080 100"
        fill="none"
        stroke="none"
      />

      <defs>
        <style>{`
          .ring-anim { animation: ringFloat 2.6s ease-in-out infinite; transform-origin: center; }
          @keyframes ringFloat {
            0% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-3px) rotate(2deg) scale(1.03); }
            100% { transform: translateY(0) rotate(0deg) scale(1); }
          }
        `}</style>
      </defs>

      {/* place rings along the computed points */}
      {rings.map((r, idx) => (
        <g key={idx} transform={`translate(${r.x} ${r.y}) rotate(${r.angle})`}>
          <g className="ring-anim" style={{ animationDelay: `${r.delay}s` }}>
            <image href="/glass/ring.svg" x={-14} y={-14} width={28} height={28} />
          </g>
        </g>
      ))}
    </svg>
  );
};

export default RingChain;
