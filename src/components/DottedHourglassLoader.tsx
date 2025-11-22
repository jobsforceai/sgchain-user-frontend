// components/DottedHourglassGradient.tsx
'use client';

export function DottedHourglassLoader() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-24"
    >
      <div
        className="h-full w-full"
        style={{
          // Dense dot pattern: gray + dark blue
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(148,163,184,0.5) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(1,33,203,0.95) 1px, transparent 0)
          `,
          backgroundSize: '10px 10px, 20px 20px',
          backgroundPosition: '0 0, 5px 5px',

          // Elliptical mask → densest at center, fading toward sides
          // Also keeps the band thin in height.
          maskImage:
            'radial-gradient(ellipse at center, black 0%, black 35%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 0%, black 35%, transparent 80%)',

          opacity: 0.9,
        }}
      />
    </div>
  );
}
