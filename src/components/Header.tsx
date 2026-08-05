import React from 'react';
import { Download, Code2, Youtube, Facebook } from 'lucide-react';
import { AspectRatio, ThemeId, AppMode } from '../types';
import { THEMES } from '../data/themesAndPresets';

interface HeaderProps {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  activeThemeId: ThemeId;
  setThemeId: (themeId: ThemeId) => void;
  onApplyPreset: (presetId: string) => void;
  onOpenOfflineCodeModal: () => void;
  onDownloadPNG: () => void;
  isDownloading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  appMode,
  setAppMode,
  aspectRatio,
  setAspectRatio,
  activeThemeId,
  setThemeId,
  onOpenOfflineCodeModal,
  onDownloadPNG,
  isDownloading,
}) => {
  return (
    <header className="bg-[#020617]/90 backdrop-blur-md border-b border-slate-800/90 sticky top-0 z-40 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Logo & Portal Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-sky-500 p-0.5 shadow-lg shadow-sky-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
              <span className="text-amber-400 font-extrabold text-xl">দ</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                পূর্বধলার দর্পণ
              </h1>
              <span className="bg-sky-500/10 text-sky-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-sky-500/20 shadow-sm">
                পেশাদার মিডিয়া স্টুডিও
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ফেসবুক ফটোকার্ড ও ইউটিউব থিউমনেইল জেনারেটর
            </p>
          </div>
        </div>

        {/* Main App Mode Tabs (Facebook vs YouTube) */}
        <div className="flex bg-[#0f172a] p-1.5 rounded-xl border border-slate-800 text-xs shadow-inner">
          <button
            onClick={() => setAppMode('photocard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              appMode === 'photocard'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Facebook className="w-4 h-4 text-blue-500" />
            <span>ফেসবুক ফটোকার্ড</span>
          </button>

          <button
            onClick={() => setAppMode('youtube_thumbnail')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              appMode === 'youtube_thumbnail'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span>ইউটিউব থাম্বনেইল মেকার</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black">
              ২০টি
            </span>
          </button>
        </div>

        {/* Quick Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ratio Selector (only in Photocard mode) */}
          {appMode === 'photocard' ? (
            <div className="flex bg-[#0f172a] p-1 rounded-xl border border-slate-800 text-xs shadow-inner">
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  aspectRatio === '1:1'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ১:১ (1080px)
              </button>
              <button
                onClick={() => setAspectRatio('4:5')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  aspectRatio === '4:5'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ৪:৫ (1350px)
              </button>
            </div>
          ) : (
            <div className="bg-[#0f172a] px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-amber-400">
              ১৬:৯ (1280×720 HD)
            </div>
          )}

          {/* Theme Quick Selector */}
          <select
            value={activeThemeId}
            onChange={(e) => setThemeId(e.target.value as ThemeId)}
            className="bg-[#0f172a] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-amber-500 outline-none shadow-sm cursor-pointer"
          >
            {Object.values(THEMES).map((theme) => (
              <option key={theme.id} value={theme.id}>
                🎨 {theme.name}
              </option>
            ))}
          </select>

          {/* Offline HTML Export Button */}
          <button
            onClick={onOpenOfflineCodeModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0f172a] hover:bg-slate-800 text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/30 transition-all shadow-sm"
            title="সম্পূর্ণ অফলাইন HTML ফাইল পান"
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>অফলাইন HTML</span>
          </button>

          {/* Download PNG Button */}
          <button
            onClick={onDownloadPNG}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 via-amber-600 to-sky-600 hover:from-red-500 hover:to-sky-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-sky-950/50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {isDownloading
                ? 'ডাউনলোড হচ্ছে...'
                : appMode === 'youtube_thumbnail'
                ? 'থাম্বনেইল ডাউনলোড (PNG)'
                : 'ফটোকার্ড ডাউনলোড (PNG)'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

