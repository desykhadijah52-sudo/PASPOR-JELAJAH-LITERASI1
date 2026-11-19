import React, { useState } from 'react';
import { RegionInfo } from '../types/game';

export const PassportCrestSVG: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="29" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
    <circle cx="32" cy="32" r="24" fill="#122643" stroke="#F59E0B" strokeWidth="2" />
    <path
      d="M17 22C21.5 20.5 27.5 21 32 23.5C36.5 21 42.5 20.5 47 22V43C42.5 41.5 36.5 42 32 44.5C27.5 42 21.5 41.5 17 43V22Z"
      fill="#F8FAFC"
      stroke="#F59E0B"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M32 23.5V44.5" stroke="#0F1F38" strokeWidth="1.5" />
    <path d="M21 27.5H28M21 32H28M21 36.5H26" stroke="#0F1F38" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M36 27.5H43M36 32H43M36 36.5H41" stroke="#0F1F38" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M32 10L34 15L39 15.5L35 19L36 24L32 21.3L28 24L29 19L25 15.5L30 15L32 10Z" fill="#F59E0B" />
  </svg>
);

export const SchoolLogo: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return <PassportCrestSVG className={className} />;
  }

  return (
    <img
      src="/assets/aistudio/LOGO_SMPN_9_a8d1b2ad.png"
      alt="Logo SMP Negeri 9 Penajam Paser Utara"
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`${className} object-contain drop-shadow-md`}
    />
  );
};

export const VisaStampSVG: React.FC<{
  region: RegionInfo;
  earned: boolean;
  dateLabel?: string;
  animate?: boolean;
}> = ({ region, earned, dateLabel, animate = false }) => {
  const color = earned ? region.accentHex : '#64748B';
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 select-none ${
        animate ? 'animate-stamp-slam' : ''
      } ${earned ? 'opacity-100' : 'opacity-35'}`}
    >
      <svg viewBox="0 0 120 120" className="w-24 h-24" aria-label={`Stempel ${region.name}`}>
        <circle
          cx="60"
          cy="60"
          r="54"
          fill={earned ? `${color}12` : 'transparent'}
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={earned ? 'none' : '5 4'}
        />
        <circle cx="60" cy="60" r="46" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />
        <path d="M22 60H98" stroke={color} strokeWidth="1" opacity="0.45" />
        <text
          x="60"
          y="33"
          textAnchor="middle"
          fill={color}
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="1.3"
        >
          {region.stampCode}
        </text>
        <text
          x="60"
          y="55"
          textAnchor="middle"
          fill={color}
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.5"
        >
          {region.name.toUpperCase()}
        </text>
        <text x="60" y="74" textAnchor="middle" fill={color} fontSize="8" fontWeight="600">
          {earned ? 'TERVERIFIKASI' : 'BELUM TERBIT'}
        </text>
        <text x="60" y="91" textAnchor="middle" fill={color} fontSize="7.5" fontWeight="600">
          {earned ? dateLabel || 'TUNTAS' : 'PASPOR LITERASI'}
        </text>
      </svg>
    </div>
  );
};

export const RegionArtwork: React.FC<{ region: RegionInfo; className?: string }> = ({
  region,
  className = 'w-full h-36',
}) => {
  const [imgError, setImgError] = useState(false);

  if (region.imageUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
        <img
          src={region.imageUrl}
          alt={`Ilustrasi ${region.name}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  // Bespoke cartographic SVG plate for regions without external bitmap
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, #0F1F38 0%, ${region.accentHex}33 100%)`,
      }}
    >
      <svg viewBox="0 0 240 140" className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern id={`grid-${region.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="240" height="140" fill={`url(#grid-${region.id})`} />
        <circle cx="120" cy="70" r="46" stroke={region.accentHex} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <circle cx="120" cy="70" r="34" fill="#0B192C" fillOpacity="0.65" stroke="#F8FAFC" strokeOpacity="0.25" />
        {region.id === 'warta' && (
          <g stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="98" y="48" width="44" height="44" rx="4" fill="#1E293B" />
            <path d="M106 58H134M106 66H134M106 74H124M106 82H118" stroke="#F59E0B" />
          </g>
        )}
        {region.id === 'pustaka' && (
          <g stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M96 86V54L120 46L144 54V86L120 79L96 86Z" fill="#1E293B" />
            <path d="M120 46V79" stroke="#F59E0B" />
          </g>
        )}
        {region.id === 'syair' && (
          <g stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M96 82C104 66 116 54 140 48C136 68 124 80 104 84L94 92" fill="#1E293B" />
            <path d="M104 78L128 56" stroke="#F59E0B" />
          </g>
        )}
        {(region.id === 'bahari' || region.id === 'aksara' || region.id === 'sains') && (
          <path d="M104 80L120 48L136 80H104Z" fill="#F59E0B" opacity="0.8" />
        )}
      </svg>
    </div>
  );
};
