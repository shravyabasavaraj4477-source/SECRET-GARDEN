import React, { useState } from 'react';

interface BotanicalImageProps {
  src: string;
  alt: string;
  className?: string;
  accentColor?: string;
  blendOnCream?: boolean;
  animate?: 'sway' | 'float' | 'none';
}

export const BotanicalImage: React.FC<BotanicalImageProps> = ({
  src,
  alt,
  className = '',
  accentColor = '#8A9A75',
  blendOnCream = true,
  animate = 'none',
}) => {
  const [failed, setFailed] = useState(false);

  const animClass =
    animate === 'sway'
      ? 'animate-gentle-sway'
      : animate === 'float'
      ? 'animate-bloom-float'
      : '';

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center rounded-xl bg-[#FAF2E4] border border-[#344B38]/10 p-4 text-center ${className}`}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={animClass}
        >
          <path
            d="M32 54V26"
            stroke="#344B38"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M32 42C22 42 18 34 18 28C24 28 32 32 32 42Z"
            fill="#8A9A75"
            fillOpacity="0.45"
            stroke="#344B38"
            strokeWidth="1.5"
          />
          <path
            d="M32 36C42 36 46 28 46 22C40 22 32 26 32 36Z"
            fill="#8A9A75"
            fillOpacity="0.45"
            stroke="#344B38"
            strokeWidth="1.5"
          />
          <circle cx="32" cy="20" r="10" fill={accentColor} fillOpacity="0.85" />
          <circle cx="32" cy="20" r="4" fill="#FFF9F0" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${blendOnCream ? 'mix-blend-multiply' : ''} ${animClass} ${className}`}
    />
  );
};
