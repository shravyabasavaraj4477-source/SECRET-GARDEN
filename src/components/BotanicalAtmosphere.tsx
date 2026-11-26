import React from 'react';

interface BotanicalAtmosphereProps {
  intensity?: 'subtle' | 'celebration';
}

const PETAL_SEEDS = [
  { left: '7%', delay: '0s', duration: '17s', color: '#D88F9A', size: 12 },
  { left: '21%', delay: '-5s', duration: '20s', color: '#E7BC52', size: 10 },
  { left: '38%', delay: '-11s', duration: '16s', color: '#F3B9C5', size: 13 },
  { left: '59%', delay: '-3s', duration: '19s', color: '#B9A4D4', size: 11 },
  { left: '76%', delay: '-9s', duration: '18s', color: '#8FB89A', size: 12 },
  { left: '91%', delay: '-14s', duration: '21s', color: '#D88F9A', size: 10 },
];

const CELEBRATION_EXTRA_PETALS = [
  { left: '14%', delay: '-2s', duration: '13s', color: '#F3B9C5', size: 14 },
  { left: '31%', delay: '-7s', duration: '14s', color: '#E7BC52', size: 12 },
  { left: '49%', delay: '-1s', duration: '12s', color: '#D88F9A', size: 13 },
  { left: '67%', delay: '-6s', duration: '15s', color: '#B9A4D4', size: 14 },
  { left: '84%', delay: '-4s', duration: '13s', color: '#8FB89A', size: 12 },
];

const BUTTERFLIES = [
  { top: '16%', left: '8%', color: '#D88F9A', duration: '12s', delay: '0s', scale: 0.9 },
  { top: '24%', right: '9%', color: '#E7BC52', duration: '14s', delay: '-4s', scale: 0.85 },
  { top: '68%', right: '6%', color: '#B9A4D4', duration: '13s', delay: '-7s', scale: 0.78 },
];

export const AnimatedButterfly: React.FC<{
  color: string;
  className?: string;
  size?: number;
}> = ({ color, className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <g className="animate-wing">
      <path
        d="M20 20C14 10 5 9 5 17C5 22 11 24 19 22Z"
        fill={color}
        fillOpacity="0.72"
        stroke="#344B38"
        strokeWidth="1"
      />
      <path
        d="M20 22C13 24 9 29 12 33C15 35 19 30 20 23Z"
        fill={color}
        fillOpacity="0.52"
        stroke="#344B38"
        strokeWidth="1"
      />
      <path
        d="M20 20C26 10 35 9 35 17C35 22 29 24 21 22Z"
        fill={color}
        fillOpacity="0.72"
        stroke="#344B38"
        strokeWidth="1"
      />
      <path
        d="M20 22C27 24 31 29 28 33C25 35 21 30 20 23Z"
        fill={color}
        fillOpacity="0.52"
        stroke="#344B38"
        strokeWidth="1"
      />
    </g>
    <line x1="20" y1="13" x2="20" y2="29" stroke="#344B38" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M20 14C18 10 16 9 15 9" stroke="#344B38" strokeWidth="1" strokeLinecap="round" />
    <path d="M20 14C22 10 24 9 25 9" stroke="#344B38" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const BotanicalLeafSprig: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 44"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4 34C32 24 72 18 114 14"
      stroke="#8A9A75"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M28 27C22 16 32 8 42 15C38 22 33 25 28 27Z"
      fill="#8FB89A"
      fillOpacity="0.35"
      stroke="#8A9A75"
      strokeWidth="1.1"
    />
    <path
      d="M54 22C49 11 60 5 69 12C65 18 60 21 54 22Z"
      fill="#8FB89A"
      fillOpacity="0.35"
      stroke="#8A9A75"
      strokeWidth="1.1"
    />
    <path
      d="M80 18C77 9 87 4 95 10C91 15 86 17 80 18Z"
      fill="#8FB89A"
      fillOpacity="0.35"
      stroke="#8A9A75"
      strokeWidth="1.1"
    />
    <path
      d="M44 25C49 34 60 36 66 28C59 24 51 24 44 25Z"
      fill="#8A9A75"
      fillOpacity="0.28"
      stroke="#8A9A75"
      strokeWidth="1.1"
    />
    <path
      d="M72 20C76 29 87 31 93 23C86 19 78 19 72 20Z"
      fill="#8A9A75"
      fillOpacity="0.28"
      stroke="#8A9A75"
      strokeWidth="1.1"
    />
  </svg>
);

export const BotanicalAtmosphere: React.FC<BotanicalAtmosphereProps> = ({
  intensity = 'subtle',
}) => {
  const petals =
    intensity === 'celebration'
      ? [...PETAL_SEEDS, ...CELEBRATION_EXTRA_PETALS]
      : PETAL_SEEDS;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {/* Floating petals */}
      {petals.map((petal, idx) => (
        <span
          key={idx}
          className="animate-float-petal absolute top-0"
          style={
            {
              left: petal.left,
              '--petal-duration': petal.duration,
              '--petal-delay': petal.delay,
            } as React.CSSProperties
          }
        >
          <svg width={petal.size} height={petal.size * 1.3} viewBox="0 0 14 18" fill="none">
            <path
              d="M7 1C11 4.5 13 9.5 10.5 14C8.8 16.8 5.2 16.8 3.5 14C1 9.5 3 4.5 7 1Z"
              fill={petal.color}
              fillOpacity={intensity === 'celebration' ? 0.58 : 0.34}
            />
          </svg>
        </span>
      ))}

      {/* Gentle butterflies */}
      {BUTTERFLIES.map((bf, idx) => (
        <div
          key={idx}
          className="animate-butterfly absolute hidden md:block"
          style={
            {
              top: bf.top,
              left: bf.left,
              right: bf.right,
              '--bf-duration': bf.duration,
              '--bf-delay': bf.delay,
              opacity: intensity === 'celebration' ? 0.88 : 0.48,
            } as React.CSSProperties
          }
        >
          <AnimatedButterfly color={bf.color} size={Math.round(30 * bf.scale)} />
        </div>
      ))}
    </div>
  );
};
