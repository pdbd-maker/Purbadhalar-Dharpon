import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Type,
  Palette,
  Calendar,
  Sliders,
  Sparkles,
  Upload,
  RotateCcw,
  Sun,
  Contrast,
  SlidersHorizontal,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { PhotoCardData, ThemeId, FontFamily } from '../types';
import { THEMES, SAMPLE_NEWS_PRESETS } from '../data/themesAndPresets';

interface ControlsPanelProps {
  data: PhotoCardData;
  onChange: (updated: Partial<PhotoCardData>) => void;
  onApplyPreset: (presetId: string) => void;
  onResetTransforms: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  data,
  onChange,
  onApplyPreset,
  onResetTransforms,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'image' | 'design' | 'footer'>('content');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        localStorage.setItem('purbadhala_saved_logo', result);
        onChange({ logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          mainImgUrl: result,
          imgFit: 'contain',
          zoom: 1,
          posY: 0,
          posX: 0,
          rotation: 0,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl w-full max-w-md flex flex-col gap-4 text-slate-100">
      {/* Tab Navigation */}
      <div className="grid grid-cols-4 gap-1 bg-[#020617] p-1 rounded-xl border border-slate-800 text-xs font-semibold shadow-inner">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'content'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>সংবাদ</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'image'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>ছবি পজিশন</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'design'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>থিম ও ফন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'footer'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>ফুটার ও লোগো</span>
        </button>
      </div>

      {/* Quick Sample Presets Bar */}
      <div className="bg-[#020617]/70 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>দ্রুত রেডিমেড টেমপ্লেট:</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SAMPLE_NEWS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.id)}
              className="text-left bg-[#0f172a] hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between group shadow-sm"
            >
              <span className="font-semibold text-slate-300 group-hover:text-amber-400 truncate">
                {preset.title}
              </span>
              <span className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20 shrink-0">
                {preset.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: NEWS CONTENT */}
      {activeTab === 'content' && (
        <div className="flex flex-col gap-4">
          {/* Portal Logo Upload Section (Quick Access) */}
          <div className="flex flex-col gap-2 bg-[#020617] p-3 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>পোর্টাল লোগো আপলোড (PNG Transparent):</span>
              </label>
              {data.logoUrl ? (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  লোগো যুক্ত আছে ✓
                </span>
              ) : (
                <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  ডিফল্ট ব্র্যান্ডিং
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <label className="flex-1 flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg p-2.5 cursor-pointer text-xs font-bold text-amber-400 transition-all text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>{data.logoUrl ? 'নতুন লোগো পরিবর্তন' : 'লোগো ফাইল সিলেক্ট করুন'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              {data.logoUrl && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-8 bg-slate-900 border border-slate-700 rounded flex items-center justify-center p-1 overflow-hidden">
                    <img src={data.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <button
                    onClick={() => onChange({ logoUrl: '' })}
                    className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2.5 py-2 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    মুছুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Headline Text Area */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                ১. খবরের প্রধান শিরোনাম:
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {data.headline.length} অক্ষর
              </span>
            </div>
            <textarea
              rows={3}
              value={data.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              placeholder="এখানে আপনার নিউজ পোর্টালের ব্রেকিং অথবা প্রধান শিরোনামটি লিখুন..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none leading-relaxed resize-none transition-colors"
            />
          </div>

          {/* Detail Tag Option */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                ২. বিস্তারিত ট্যাগ (ঐচ্ছিক):
              </label>
              <input
                type="checkbox"
                checked={data.showDetailTag}
                onChange={(e) => onChange({ showDetailTag: e.target.checked })}
                className="accent-amber-500 rounded cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={data.detailTag}
              onChange={(e) => onChange({ detailTag: e.target.value })}
              placeholder="বিস্তারিত কমেন্টে"
              disabled={!data.showDetailTag}
              className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-xl p-2.5 outline-none disabled:opacity-40"
            />
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE POSITIONING & TRANSFORMS */}
      {activeTab === 'image' && (
        <div className="flex flex-col gap-4">
          {/* File Upload Box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ১. খবরের ছবি আপলোড করুন:
            </label>
            <label className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-950/80 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-3 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">
                নতুন ছবি নির্বাচন করুন (JPG / PNG)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImgUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Fit Mode Option */}
          <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>২. ছবি ডিসপ্লে মোড (অটো ক্রপ কাট রোধ):</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {data.imgFit === 'cover' ? 'ক্যানভাস ক্রপ' : data.imgFit === 'fill' ? 'টেনে ফিট' : 'পুরো ছবি (নো-ক্রপ)'}
              </span>
            </label>

            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold mt-0.5">
              <button
                type="button"
                onClick={() => onChange({ imgFit: 'contain' })}
                className={`py-2 px-1.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  !data.imgFit || data.imgFit === 'contain'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>🖼️ পুরো ছবি</span>
                <span className="text-[9px] opacity-80 font-normal">(অটো ক্রপ ছাড়া)</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ imgFit: 'cover' })}
                className={`py-2 px-1.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  data.imgFit === 'cover'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>✂️ ক্যানভাস জুম</span>
                <span className="text-[9px] opacity-80 font-normal">(ফুল ক্যানভাস)</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ imgFit: 'fill' })}
                className={`py-2 px-1.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  data.imgFit === 'fill'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>📐 টেনে ফিট</span>
                <span className="text-[9px] opacity-80 font-normal">(Fill Stretch)</span>
              </button>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                ২. ছবি জুম (Zoom In / Out):
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {Math.round(data.zoom * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={data.zoom}
              onChange={(e) => onChange({ zoom: parseFloat(e.target.value) })}
              className="accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
          </div>

          {/* Position Y Slider */}
          <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                ৩. উপরে-নিচে পজিশন (Position Y):
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {data.posY === 0
                  ? '0px (মাঝে)'
                  : data.posY > 0
                  ? `+${data.posY}px (নিচে)`
                  : `${data.posY}px (উপরে)`}
              </span>
            </div>
            <input
              type="range"
              min="-300"
              max="300"
              step="2"
              value={data.posY}
              onChange={(e) => onChange({ posY: parseInt(e.target.value, 10) })}
              className="accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
          </div>

          {/* Position X Slider */}
          <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                ৪. ডানে-বামে পজিশন (Position X):
              </span>
              <span className="font-mono text-sky-400 font-bold">
                {data.posX === 0
                  ? '0px (মাঝে)'
                  : data.posX > 0
                  ? `+${data.posX}px (ডানে)`
                  : `${data.posX}px (বামে)`}
              </span>
            </div>
            <input
              type="range"
              min="-300"
              max="300"
              step="2"
              value={data.posX}
              onChange={(e) => onChange({ posX: parseInt(e.target.value, 10) })}
              className="accent-sky-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
          </div>

          {/* Overlay Darkness & Image Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-semibold text-slate-300">
                  ডার্ক মাস্ক তীব্রতা:
                </span>
                <span className="font-mono text-amber-400 text-[11px]">
                  {Math.round(data.overlayOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.05"
                value={data.overlayOpacity}
                onChange={(e) =>
                  onChange({ overlayOpacity: parseFloat(e.target.value) })
                }
                className="accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-semibold text-slate-300">
                  উজ্জ্বলতা (Brightness):
                </span>
                <span className="font-mono text-amber-400 text-[11px]">
                  {data.filterBrightness}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                step="5"
                value={data.filterBrightness}
                onChange={(e) =>
                  onChange({ filterBrightness: parseInt(e.target.value, 10) })
                }
                className="accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>
          </div>

          {/* Reset Transforms Button */}
          <button
            onClick={onResetTransforms}
            className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl py-2 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ছবি রিসেট করুন (100% Zoom & 0px)</span>
          </button>
        </div>
      )}

      {/* TAB 3: DESIGN, THEME & TYPOGRAPHY */}
      {activeTab === 'design' && (
        <div className="flex flex-col gap-4">
          {/* Theme Picker Cards */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ১. নিউজ ফটোকার্ড থিম:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map((theme) => {
                const isActive = data.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onChange({ themeId: theme.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 relative overflow-hidden ${
                      isActive
                        ? 'border-amber-500 bg-slate-950 ring-1 ring-amber-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        {theme.name}
                      </span>
                      {isActive && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    {/* Visual Color Bar */}
                    <div
                      className="w-full h-3 rounded-md border border-slate-800 flex overflow-hidden"
                      style={{ background: theme.topBarGradient }}
                    >
                      <div
                        className="w-1/3 h-full"
                        style={{ backgroundColor: theme.topBarBorder }}
                      />
                      <div
                        className="w-1/3 h-full"
                        style={{ backgroundColor: theme.footerBg }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Family Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ২. বাংলা ফন্ট ফ্যামিলি:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'SolaimanLipi', label: 'সোলাইমান লিপি (ডিফল্ট)' },
                { name: 'Hind Siliguri', label: 'হিন্দ শিলিগুড়ি (মডার্ন)' },
                { name: 'Anek Bangla', label: 'অনেক বাংলা (বোল্ড)' },
                { name: 'Noto Serif Bengali', label: 'নোটো সেরিফ (ক্লাসিক)' },
              ].map((font) => (
                <button
                  key={font.name}
                  onClick={() => onChange({ fontFamily: font.name as FontFamily })}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    data.fontFamily === font.name
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                  style={{ fontFamily: font.name }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                ৩. শিরোনাম ফন্ট সাইজ:
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {data.fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="42"
              value={data.fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value, 10) })}
              className="accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
          </div>

          {/* Line Height & Alignment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">লাইন হাইট:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {data.lineHeight}
                </span>
              </div>
              <input
                type="range"
                min="1.1"
                max="1.8"
                step="0.05"
                value={data.lineHeight}
                onChange={(e) => onChange({ lineHeight: parseFloat(e.target.value) })}
                className="accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <label className="text-xs font-semibold text-slate-300">
                টেক্সট অ্যালাইনমেন্ট:
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => onChange({ textAlign: align })}
                    className={`py-1 rounded font-bold transition-all capitalize ${
                      data.textAlign === align
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {align === 'left' ? 'বামে' : align === 'center' ? 'মাঝে' : 'ডানে'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FOOTER LINKS & PORTAL LOGO */}
      {activeTab === 'footer' && (
        <div className="flex flex-col gap-4">
          {/* Logo Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ১. নিউজ পোর্টাল লোগো আপলোড:
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-xl p-2.5 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-300">
                  লোগো বেছে নিন (PNG Transparent)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {data.logoUrl && (
                <button
                  onClick={() => onChange({ logoUrl: '' })}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl font-semibold"
                >
                  রিমুভ
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              * লোগো না থাকলে স্বয়ংক্রিয়ভাবে &quot;পূর্বধলার দর্পণ&quot; টেক্সট ব্র্যান্ডিং দেখাবে।
            </p>
          </div>

          {/* Social Handles */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-300">
              ২. ফুটার সোশ্যাল মিডিয়া লিংক:
            </label>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
              <i className="fab fa-facebook text-sky-400"></i>
              <input
                type="text"
                value={data.fbHandle}
                onChange={(e) => onChange({ fbHandle: e.target.value })}
                placeholder="@purbadhala"
                className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
              <i className="fab fa-youtube text-red-500"></i>
              <input
                type="text"
                value={data.ytHandle}
                onChange={(e) => onChange({ ytHandle: e.target.value })}
                placeholder="@purbadhala"
                className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
              <i className="fas fa-globe text-amber-400"></i>
              <input
                type="text"
                value={data.websiteUrl}
                onChange={(e) => onChange({ websiteUrl: e.target.value })}
                placeholder="www.pdonline.com.bd"
                className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
