import React from 'react';
import { ArrowLeft, CheckCircle2, Compass, Flag, Music, Trophy, Volume2, VolumeX } from 'lucide-react';
import { REGIONS } from '../data/literacyData';
import { RegionId, RegionInfo } from '../types/game';
import { RegionArtwork, SchoolLogo, VisaStampSVG } from './PassportEmblems';

interface PassportMapViewProps {
  studentName: string;
  studentClass: string;
  stampsCollected: RegionId[];
  muted: boolean;
  musicEnabled: boolean;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  onBackTitle: () => void;
  onSelectRegion: (region: RegionInfo) => void;
  onOpenRace: () => void;
  onOpenRekapan: () => void;
}

function getExplorerRank(count: number): string {
  if (count >= 6) return 'Duta Literasi Nusantara';
  if (count >= 4) return 'Navigator Pustaka';
  if (count >= 2) return 'Penjelajah Kata';
  return 'Perintis Membaca';
}

export const PassportMapView: React.FC<PassportMapViewProps> = ({
  studentName,
  studentClass,
  stampsCollected,
  muted,
  musicEnabled,
  onToggleMute,
  onToggleMusic,
  onBackTitle,
  onSelectRegion,
  onOpenRace,
  onOpenRekapan,
}) => {
  const rankTitle = getExplorerRank(stampsCollected.length);

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 flex flex-col">
      {/* Compact Game Header */}
      <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4 border-b border-slate-800 bg-[#091424]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackTitle}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-sm font-medium text-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </button>
          <span className="font-display text-lg font-bold text-white hidden sm:inline whitespace-nowrap">
            Buku Paspor Literasi
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenRace}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>Mode Balapan</span>
          </button>
          <button
            type="button"
            onClick={onOpenRekapan}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-sm font-medium text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Rekapan Siswa</span>
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={musicEnabled ? 'Matikan musik latar' : 'Nyalakan musik latar'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-slate-100 transition-colors cursor-pointer"
          >
            <Music className={`w-5 h-5 ${musicEnabled && !muted ? 'text-amber-400' : 'text-slate-400'}`} />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#122643] hover:bg-[#1B355B] border border-slate-700 text-slate-100 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Open Passport 2-Page Spread */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Page: Official Passport Booklet Identity & Visa Stamps */}
        <section className="lg:col-span-5 rounded-2xl bg-[#F8FAFC] text-slate-900 border border-slate-200 p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <SchoolLogo className="w-12 h-12 shrink-0" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    SMP Negeri 9 Penajam Paser Utara
                  </p>
                  <h2 className="font-display text-2xl font-bold text-[#0F1F38]">
                    Paspor Penjelajah
                  </h2>
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                ID-{studentClass.replace(/\s+/g, '')}
              </span>
            </div>

            {/* Identity Details */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Nama Pemegang</p>
                <p className="text-base font-bold text-slate-900 truncate">{studentName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Kelas</p>
                <p className="text-base font-bold text-slate-900">{studentClass}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Peringkat Literasi</p>
                <p className="text-sm font-semibold text-emerald-700">{rankTitle}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Stempel Visa</p>
                <p className="font-mono-tabular text-base font-bold text-slate-900">
                  {stampsCollected.length} / {REGIONS.length} Stempel
                </p>
              </div>
            </div>

            {/* 6 Visa Stamp Slots */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">Halaman Stempel Destinasi</h3>
                <span className="text-xs text-slate-500 tabular-nums">
                  Minimal akurasi 75% untuk stempel
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100/80 border border-slate-200 p-2">
                {REGIONS.map((region) => (
                  <VisaStampSVG
                    key={region.id}
                    region={region}
                    earned={stampsCollected.includes(region.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-4 mt-4 border-t border-slate-200">
            Pilih salah satu destinasi di sebelah kanan untuk memulai misi membaca dan mengesahkan stempel paspor Anda.
          </p>
        </section>

        {/* Right Page: 6 Archipelago Destinations */}
        <section className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Peta Destinasi Penajam Paser Utara
              </h2>
              <p className="text-sm text-slate-300">
                Setiap destinasi memuat 4 bacaan khas Benuo Taka lintas aspek pemahaman.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 tabular-nums">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{REGIONS.length} Destinasi PPU</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {REGIONS.map((region) => {
              const hasStamp = stampsCollected.includes(region.id);
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => onSelectRegion(region)}
                  className="group text-left rounded-xl overflow-hidden bg-[#122643] hover:bg-[#173054] border border-slate-700/80 hover:border-amber-400/70 transition-all duration-150 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <RegionArtwork region={region} className="w-full h-32 shrink-0" />
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-amber-300">{region.genre}</span>
                        {hasStamp ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tuntas</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">4 Bacaan</span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-white mt-0.5 group-hover:text-amber-300 transition-colors">
                        {region.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {region.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span>{region.subtitle}</span>
                      <span className="text-amber-300 group-hover:translate-x-0.5 transition-transform">
                        Mulai Misi &rarr;
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
