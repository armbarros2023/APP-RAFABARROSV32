import React from 'react';

interface BrandLogoProps {
  className?: string;
}

interface BrandLogoSvgProps {
  className?: string;
  mode: 'light' | 'dark';
}

const BrandLogoSvg: React.FC<BrandLogoSvgProps> = ({ className = '', mode }) => {
  const textColor = mode === 'dark' ? '#ffffff' : '#050505';
  const strokeColor = mode === 'dark' ? '#d9ff33' : '#111111';
  const panelFill = '#e8ff3b';
  const bulbGlow = mode === 'dark' ? '#d9ff33' : '#ffffff';

  return (
    <svg
      viewBox="0 0 640 340"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Equipe Rafael Barros"
      preserveAspectRatio="xMinYMid meet"
      overflow="visible"
      className={className}
    >
      <g transform="translate(16 14)">
        <g transform="rotate(-4 88 30)">
          <rect x="18" y="8" width="166" height="56" rx="12" fill={panelFill} stroke="#111111" strokeWidth="4" />
          <text
            x="101"
            y="47"
            textAnchor="middle"
            fill="#111111"
            fontFamily="'Trebuchet MS', 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="28"
            letterSpacing="1.5"
          >
            EQUIPE
          </text>
        </g>

        <text
          x="18"
          y="128"
          fill={textColor}
          fontFamily="Impact, Haettenschweiler, 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="112"
          letterSpacing="-5"
        >
          RAFAEL
        </text>

        <text
          x="64"
          y="222"
          fill={textColor}
          fontFamily="Impact, Haettenschweiler, 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="104"
          letterSpacing="-5"
        >
          BARROS
        </text>

        <path
          d="M468 176c18 0 32 14 32 31 0 12-6 22-16 28-7 4-12 9-15 16l-7 18h-27l-7-18c-3-7-8-12-15-16-10-6-16-16-16-28 0-17 14-31 32-31 8 0 15 2 21 6 6-4 13-6 18-6z"
          fill={bulbGlow}
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M439 262h20M433 247h32"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M495 220c14 3 26 12 34 25 10 17 9 39-2 55m-3 0c-7 11-16 20-16 30m-42-9c8 5 13 13 15 23"
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        <g transform="translate(424 182)">
          <ellipse cx="30" cy="26" rx="30" ry="26" fill="#ffffff" stroke="#6c63a8" strokeWidth="4" />
          <path
            d="M12 24c2-10 9-16 18-16 4 0 8 1 11 4 4-2 9-1 13 2 5 4 7 10 5 16-1 5-5 8-9 10-3 1-7 1-10-1-3 2-7 3-11 2-10-2-18-10-17-17z"
            fill="#ff9fc2"
            stroke="#d46fa5"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M22 14c-4 2-6 5-6 9m12-11c-2 2-3 5-2 8m9-7c2 2 3 5 2 8m10-3c2 2 3 5 2 8M18 31c2-1 4-1 6 0m10-1c2-1 4-1 6 0"
            fill="none"
            stroke="#d46fa5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {mode === 'dark' && (
          <g stroke={strokeColor} strokeWidth="4" strokeLinecap="round">
            <path d="M404 244l8 8" />
            <path d="M520 172l8-8" />
            <path d="M532 214h12" />
          </g>
        )}
      </g>
    </svg>
  );
};

const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center overflow-visible ${className}`}>
      <BrandLogoSvg mode="light" className="h-full w-full dark:hidden" />
      <BrandLogoSvg mode="dark" className="hidden h-full w-full dark:block" />
    </span>
  );
};

export default BrandLogo;
