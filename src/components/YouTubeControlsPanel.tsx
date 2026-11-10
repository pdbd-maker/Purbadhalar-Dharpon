import React, { useState } from 'react';
import {
  Type,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Upload,
  RotateCcw,
  Youtube,
  Sliders,
  CheckCircle2,
  Info,
  Images,
  Trash2,
  Grid,
  Columns,
  Layers,
  Wand2,
  Sun,
} from 'lucide-react';
import { YouTubeThumbnailData, ThemeId, FontFamily } from '../types';
import { THEMES } from '../data/themesAndPresets';
import { YOUTUBE_PRESETS } from '../data/youtubePresets';
import { analyzeImageLighting, enhanceImageMagicCanvas } from '../utils/imageEnhance';

interface YouTubeControlsPanelProps {
  data: YouTubeThumbnailData;
  onChange: (updated: Partial<YouTubeThumbnailData>) => void;
  onApplyPreset: (presetId: string) => void;
  onResetTransforms: () => void;
}

export const YouTubeControlsPanel: React.FC<YouTubeControlsPanelProps> = ({
  data,
  onChange,
  onApplyPreset,
  onResetTransforms,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'image' | 'design'>('content');
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<string>('সব');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [enhanceMessage, setEnhanceMessage] = useState<string>('');

  const triggerMagicEnhance = async (imgUrl: string, notify = true) => {
    if (!imgUrl) return;
    setIsEnhancing(true);
    if (notify) setEnhanceMessage('থাম্বনেইল ছবির আলো ও কন্ট্রাস্ট অ্যাডজাস্ট হচ্ছে...');
    try {
      const stats = await analyzeImageLighting(imgUrl);
      onChange({
        filterBrightness: stats.suggestedBrightness,
        filterContrast: stats.suggestedContrast,
        filterSaturate: stats.suggestedSaturate,
        autoEnhanced: true,
      });
      if (notify) {
        setEnhanceMessage(`✨ ${stats.description}`);
        setTimeout(() => setEnhanceMessage(''), 4500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDeepPixelEnhance = async () => {
    if (!data.mainImgUrl) return;
    setIsEnhancing(true);
    setEnhanceMessage('পিক্সেল-লেভেল শার্পনেস ও লাইট ফিক্স হচ্ছে...');
    try {
      const enhancedDataUrl = await enhanceImageMagicCanvas(data.mainImgUrl);
      onChange({
        mainImgUrl: enhancedDataUrl,
        filterBrightness: 100,
        filterContrast: 100,
        filterSaturate: 100,
        autoEnhanced: true,
      });
      setEnhanceMessage('🎉 ছবি নিখুঁত এইচডি কোয়ালিটিতে ফিক্স হয়েছে!');
      setTimeout(() => setEnhanceMessage(''), 4500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const filteredPresets =
    presetCategoryFilter === 'সব'
      ? YOUTUBE_PRESETS
      : YOUTUBE_PRESETS.filter((p) => {
          if (presetCategoryFilter === '🔴 ব্রেকিং') return p.category === 'জরুরি সংবাদ';
          if (presetCategoryFilter === '🎙️ টকশো / ইন্টারভিউ') return p.category === 'টকশো ও অনলাইন';
          if (presetCategoryFilter === '🔍 বিশেষ রিপোর্ট') return p.category === 'সরেজমিনে' || p.category === 'বিশেষ প্রতিবেদন' || p.category === 'খেলা ও বিবিধ';
          return true;
        });

  // Extract words from headline for quick-click highlight selection
  const headlineWords = Array.from(
    new Set(
      (data.headline || '')
        .replace(/[,|।!?:;'"()]/g, ' ')
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 2)
    )
  ).slice(0, 8);

  // Single Main Image Upload Handler
  const handleMainImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          mainImgUrl: result,
          zoom: 1,
          posY: 0,
          posX: 0,
          rotation: 0,
        });
        triggerMagicEnhance(result, true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Multi Image Upload Handler (Supports 1 to 4 images at once)
  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = (Array.from(files) as File[]).slice(0, 4);
    const readPromises = fileList.map(
      (file: File) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve((ev.target?.result as string) || '');
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readPromises).then((results) => {
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        onChange({
          mainImgUrl: valid[0],
          galleryImages: valid.slice(1, 4),
          zoom: 1,
          posX: 0,
          posY: 0,
        });
      }
    });
  };

  // Remove individual image from collage
  const handleRemoveImage = (indexToRemove: number) => {
    const allImgs = [data.mainImgUrl, ...(data.galleryImages || [])].filter(Boolean);
    const updated = allImgs.filter((_, idx) => idx !== indexToRemove);
    if (updated.length === 0) {
      onChange({ mainImgUrl: '', galleryImages: [] });
    } else {
      onChange({
        mainImgUrl: updated[0],
        galleryImages: updated.slice(1),
      });
    }
  };

  // Channel Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          logoUrl: result,
          showChannelLogo: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl w-full max-w-md flex flex-col gap-4 text-slate-100">
      {/* Top Banner Title & Aspect Ratio Toggle */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/20 border border-red-500/30 rounded-xl text-red-400">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                ইউটিউব & সোশ্যাল থাম্বনেইল
              </h2>
              <p className="text-[11px] text-amber-400 font-semibold">
                পূর্বধলার দর্পণ চ্যানেল ব্র্যান্ডিং
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full shadow">
            {data.aspectRatio === '9:16' ? '৯:১৬ শটস' : '১৬:৯ HD'}
          </span>
        </div>

        {/* Aspect Ratio Selector (16:9 vs 9:16) */}
        <div className="flex items-center gap-2 bg-[#020617] p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-bold text-slate-300 pl-1 shrink-0">সাইজ:</span>
          <div className="grid grid-cols-2 gap-1.5 w-full font-bold">
            <button
              type="button"
              onClick={() => onChange({ aspectRatio: '16:9' })}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !data.aspectRatio || data.aspectRatio === '16:9'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>১৬:৯ HD (ল্যান্ডস্কেপ)</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ aspectRatio: '9:16' })}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                data.aspectRatio === '9:16'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>৯:১৬ (শটস/রিলস/টিকটক)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Tab Navigation */}
      <div className="grid grid-cols-3 gap-1 bg-[#020617] p-1 rounded-xl border border-slate-800 text-xs font-semibold shadow-inner">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'content'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>লেখা ও কন্টেন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'image'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>ছবি সাজানো</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'design'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>থিম ও ফন্ট</span>
        </button>
      </div>

      {/* 20 Ready-made YouTube Design Templates Bar */}
      <div className="bg-[#020617]/70 p-3 rounded-xl border border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>২০টি তৈরি ডিজাইনের টেমপ্লেট:</span>
          </span>
          <span className="text-[10px] text-slate-400">
            ({filteredPresets.length}টি দেখাচ্ছে)
          </span>
        </div>

        {/* Simplified Category Pills Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-[11px]">
          {['সব', '🔴 ব্রেকিং', '🎙️ টকশো / ইন্টারভিউ', '🔍 বিশেষ রিপোর্ট'].map((cat) => (
            <button
              key={cat}
              onClick={() => setPresetCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg shrink-0 font-bold transition-all cursor-pointer ${
                presetCategoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scrollable Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.id)}
              className="text-left bg-[#0f172a] hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 p-2 rounded-lg text-xs transition-all flex flex-col gap-1 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 group-hover:text-amber-400 truncate text-[11px]">
                  {preset.title}
                </span>
                <span className="text-[9px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded shrink-0">
                  {preset.badgeText.slice(0, 10)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                {preset.headline}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Content Controls */}
      {activeTab === 'content' && (
        <div className="flex flex-col gap-3">
          {/* Main Headline Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ১. থাম্বনেইলের মূল আকর্ষণীয় শিরোনাম:
            </label>
            <textarea
              value={data.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              rows={3}
              placeholder="এখানে বড় ফন্টের পরিষ্কার শিরোনামটি লিখুন..."
              className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 text-xs rounded-xl p-3 outline-none resize-none leading-snug"
            />
          </div>

          {/* Highlighted Word/Phrase */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-amber-400">
                হাইলাইট করার শব্দ/শব্দাংশ:
              </label>
              <input
                type="text"
                value={data.highlightWord}
                onChange={(e) => onChange({ highlightWord: e.target.value })}
                placeholder="যেমন: সরাসরি স্থগিত"
                className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-xl p-2.5 outline-none font-semibold"
              />
              {headlineWords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {headlineWords.map((word) => {
                    const isSelected = (data.highlightWord || '').trim().includes(word);
                    return (
                      <button
                        key={word}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            onChange({ highlightWord: '' });
                          } else {
                            onChange({ highlightWord: word });
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-900 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                হাইলাইট ব্যাকগ্রাউন্ড রঙ:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.highlightBg || '#facc15'}
                  onChange={(e) => onChange({ highlightBg: e.target.value })}
                  className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-lg p-0.5 cursor-pointer"
                />
                <div className="flex gap-1">
                  {['#facc15', '#f59e0b', '#0284c7', '#dc2626', '#16a34a'].map((c) => (
                    <button
                      key={c}
                      onClick={() => onChange({ highlightBg: c })}
                      className="w-6 h-6 rounded-md border border-slate-700 shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle / Topic Pill */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ২. সাব-টাইটেল / বিশেষ বিষয়বস্তু (ঐচ্ছিক):
            </label>
            <input
              type="text"
              value={data.subTitle}
              onChange={(e) => onChange({ subTitle: e.target.value })}
              placeholder="যেমন: সরেজমিনে সরাসরি আপডেট"
              className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-xl p-2.5 outline-none"
            />
          </div>

          {/* Badge & LIVE Dot Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                ৩. ব্যাজ / টপিক টেক্সট:
              </label>
              <input
                type="text"
                value={data.badgeText}
                onChange={(e) => onChange({ badgeText: e.target.value })}
                placeholder="🔴 সরাসরি ব্রেকিং"
                className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-xl p-2.5 outline-none font-semibold text-amber-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                ব্যাজ এর কালার:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.badgeBg || '#dc2626'}
                  onChange={(e) => onChange({ badgeBg: e.target.value })}
                  className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-lg p-0.5 cursor-pointer"
                />
                <div className="flex gap-1">
                  {['#dc2626', '#f59e0b', '#0284c7', '#059669', '#1e293b'].map((c) => (
                    <button
                      key={c}
                      onClick={() => onChange({ badgeBg: c })}
                      className="w-6 h-6 rounded-md border border-slate-700 shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Toggles (LIVE Indicator, Play Icon, Channel Watermark) */}
          <div className="grid grid-cols-2 gap-2 bg-[#020617] p-3 rounded-xl border border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={data.showLiveDot}
                onChange={(e) => onChange({ showLiveDot: e.target.checked })}
                className="accent-red-600 rounded cursor-pointer"
              />
              <span>🔴 LIVE ফ্ল্যাশ অন</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={data.showChannelLogo}
                onChange={(e) => onChange({ showChannelLogo: e.target.checked })}
                className="accent-amber-500 rounded cursor-pointer"
              />
              <span>চ্যানেল লোগো/নাম</span>
            </label>
          </div>

          {/* Target Social Platform Selector */}
          <div className="flex flex-col gap-2 bg-[#020617] p-3 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>৪. সোশ্যাল প্ল্যাটফর্ম ওয়াটারমার্ক (Target Platform):</span>
              <span className="text-[10px] text-slate-400 font-normal">ফুটার ব্যাজ</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    targetPlatform: 'youtube',
                    ytHandle:
                      data.ytHandle.includes('Facebook') ||
                      data.ytHandle.includes('TikTok') ||
                      data.ytHandle.includes('Social')
                        ? 'YouTube / @purbadhala'
                        : data.ytHandle || 'YouTube / @purbadhala',
                  })
                }
                className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !data.targetPlatform || data.targetPlatform === 'youtube'
                    ? 'bg-red-600/20 border-red-500 text-red-400 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <i className="fab fa-youtube text-red-500"></i>
                <span>ইউটিউব</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    targetPlatform: 'facebook',
                    ytHandle:
                      data.ytHandle.includes('YouTube') ||
                      data.ytHandle.includes('TikTok') ||
                      data.ytHandle.includes('Social')
                        ? 'Facebook / @purbadhala'
                        : data.ytHandle || 'Facebook / @purbadhala',
                  })
                }
                className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  data.targetPlatform === 'facebook'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <i className="fab fa-facebook-f text-blue-400"></i>
                <span>ফেসবুক</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    targetPlatform: 'tiktok',
                    ytHandle:
                      data.ytHandle.includes('YouTube') ||
                      data.ytHandle.includes('Facebook') ||
                      data.ytHandle.includes('Social')
                        ? 'TikTok / @purbadhala'
                        : data.ytHandle || 'TikTok / @purbadhala',
                  })
                }
                className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  data.targetPlatform === 'tiktok'
                    ? 'bg-pink-600/20 border-pink-500 text-pink-400 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <i className="fab fa-tiktok text-pink-400"></i>
                <span>টিকটক</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    targetPlatform: 'all',
                    ytHandle: 'Social / @purbadhala',
                  })
                }
                className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  data.targetPlatform === 'all'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🌐 সবগুলো</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[10px] text-slate-400">ফুটার টেক্সট / ইউজারনেম কাস্টমাইজ:</span>
              <input
                type="text"
                value={data.ytHandle}
                onChange={(e) => onChange({ ytHandle: e.target.value })}
                placeholder="যেমন: YouTube / @purbadhala"
                className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Image & Position Adjustment */}
      {activeTab === 'image' && (
        <div className="flex flex-col gap-3">
          {/* MAGIC PHOTO LIGHTING & CLARITY ENHANCER */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-emerald-950/40 p-3 rounded-xl border border-amber-500/40 flex flex-col gap-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300">
                  ম্যাজিক থাম্বনেইল লাইট ও কোয়ালিটি ফিক্সার
                </span>
              </div>
              {data.autoEnhanced && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  অটো ফিক্সড
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isEnhancing || !data.mainImgUrl}
                onClick={() => triggerMagicEnhance(data.mainImgUrl, true)}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs py-2 px-3 rounded-lg shadow cursor-pointer transition-all active:scale-[0.98]"
              >
                <Sun className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>⚡ ১-ক্লিক অটো আলো ফিক্স</span>
              </button>

              <button
                type="button"
                disabled={isEnhancing || !data.mainImgUrl}
                onClick={handleDeepPixelEnhance}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-xs py-2 px-3 rounded-lg shadow cursor-pointer transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>🪄 ফুল এইচডি পিক্সেল ফিক্স</span>
              </button>
            </div>

            {enhanceMessage && (
              <div className="bg-slate-900 border border-amber-500/30 rounded p-1.5 text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{enhanceMessage}</span>
              </div>
            )}
          </div>

          {/* Multi Image Collage Section */}
          <div className="flex flex-col gap-2 bg-[#020617] p-3 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Images className="w-4 h-4 text-amber-400" />
                <span>একাধিক ছবি কোলাজ অপশন (২, ৩ বা ৪টি ছবি):</span>
              </label>
              <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                {[data.mainImgUrl, ...(data.galleryImages || [])].filter(Boolean).length} / ৪ টি
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              একাদিক ছবি দিলে অটোমেটিক আকর্ষণীয় ইউটিউব লেআউট ও সাইজে সেট হয়ে যাবে (যেমন: ১টি বড়, ২টিতে VS স্প্লিট, ৩ বা ৪টি ছবি কোলাজ Grid)!
            </p>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <label className="flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg p-2 cursor-pointer text-xs font-bold text-amber-400 transition-all text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>একাধিক ছবি সিলেক্ট</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiImageUpload}
                  className="hidden"
                />
              </label>

              <label className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg p-2 cursor-pointer text-xs font-semibold text-slate-300 transition-all text-center">
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>১টি প্রধান ছবি সেট</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImgUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Current Images Thumbnails Preview & Management */}
            {[data.mainImgUrl, ...(data.galleryImages || [])].filter(Boolean).length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span>আপলোড করা ছবিসমূহ:</span>
                  <button
                    onClick={() => onChange({ mainImgUrl: '', galleryImages: [] })}
                    className="text-[10px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> সব মুছুন
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[data.mainImgUrl, ...(data.galleryImages || [])].filter(Boolean).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-md overflow-hidden border border-slate-700 aspect-video bg-slate-900"
                    >
                      <img src={img} alt={`Img ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute top-0.5 left-0.5 bg-slate-950/90 text-amber-400 text-[8px] font-black px-1 rounded">
                        {idx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-950/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        title="ছবিটি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-300" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collage Layout Style Selector */}
            {[data.mainImgUrl, ...(data.galleryImages || [])].filter(Boolean).length > 1 && (
              <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Grid className="w-3.5 h-3.5 text-amber-400" />
                  <span>লেআউট কাস্টমাইজেশন:</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onChange({ collageStyle: 'auto' })}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      (data.collageStyle || 'auto') === 'auto'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>⚡ অটো সাইজ (Auto)</span>
                  </button>

                  <button
                    onClick={() => onChange({ collageStyle: 'split_2' })}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      data.collageStyle === 'split_2'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>VS স্প্লিট (৫০:৫০)</span>
                  </button>

                  <button
                    onClick={() => onChange({ collageStyle: 'diagonal_2' })}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      data.collageStyle === 'diagonal_2'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>📐 কোনাকুনি বিভাজন</span>
                  </button>

                  <button
                    onClick={() => onChange({ collageStyle: 'featured_3' })}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      data.collageStyle === 'featured_3'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🖼️ ১ বড় + ২টি ছোট</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Channel Logo Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ২. কাস্টম চ্যানেল লোগো আপলোড (ঐচ্ছিক):
            </label>
            <label className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl p-2.5 cursor-pointer text-xs font-medium text-slate-300 transition-all">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>লোগো পিএনজি আপলোড করুন</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Zoom Slider */}
          <div className="flex flex-col gap-1 bg-[#020617] p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">ছবি জুম (Zoom Scale):</span>
              <span className="text-amber-400">{data.zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={data.zoom}
              onChange={(e) => onChange({ zoom: parseFloat(e.target.value) })}
              className="accent-amber-500 cursor-pointer w-full"
            />
          </div>

          {/* Pos X and Pos Y Sliders */}
          <div className="grid grid-cols-2 gap-3 bg-[#020617] p-3 rounded-xl border border-slate-800">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">ডানে-বামে (X):</span>
                <span className="text-amber-400">{data.posX}px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                step="5"
                value={data.posX}
                onChange={(e) => onChange({ posX: parseInt(e.target.value) })}
                className="accent-amber-500 cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">উপরে-নিচে (Y):</span>
                <span className="text-amber-400">{data.posY}px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                step="5"
                value={data.posY}
                onChange={(e) => onChange({ posY: parseInt(e.target.value) })}
                className="accent-amber-500 cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Brightness & Contrast */}
          <div className="grid grid-cols-2 gap-3 bg-[#020617] p-3 rounded-xl border border-slate-800">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">উজ্জ্বলতা (Brightness):</span>
                <span className="text-amber-400">{data.filterBrightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={data.filterBrightness}
                onChange={(e) =>
                  onChange({ filterBrightness: parseInt(e.target.value) })
                }
                className="accent-amber-500 cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">কন্ট্রাস্ট (Contrast):</span>
                <span className="text-amber-400">{data.filterContrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={data.filterContrast}
                onChange={(e) =>
                  onChange({ filterContrast: parseInt(e.target.value) })
                }
                className="accent-amber-500 cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Dark Overlay Slider */}
          <div className="flex flex-col gap-1 bg-[#020617] p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">ডার্ক ব্যাকগ্রাউন্ড শ্যাডো:</span>
              <span className="text-amber-400">
                {Math.round(data.overlayOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={data.overlayOpacity}
              onChange={(e) => onChange({ overlayOpacity: parseFloat(e.target.value) })}
              className="accent-amber-500 cursor-pointer w-full"
            />
          </div>

          {/* Reset Transforms Button */}
          <button
            onClick={onResetTransforms}
            className="flex items-center justify-center gap-1.5 py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>ছবি রিসেট করুন</span>
          </button>
        </div>
      )}

      {/* Tab 3: Design, Font & Theme */}
      {activeTab === 'design' && (
        <div className="flex flex-col gap-3">
          {/* Theme Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ১. কালার ও থিম মেজাজ:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onChange({ themeId: t.id as ThemeId })}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    data.themeId === t.id
                      ? 'bg-slate-950 border-amber-500 text-amber-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{t.name}</span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: t.accentColor }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Layout Style Preset */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ২. কন্টেন্ট প্লেসমেন্ট লেআউট:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'bottom_pill', name: 'নিচে বামে' },
                { id: 'left_bar', name: 'বামে চওড়া' },
                { id: 'center_hero', name: 'মাঝখানে' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() =>
                    onChange({
                      layoutStyle: style.id as YouTubeThumbnailData['layoutStyle'],
                    })
                  }
                  className={`p-2 rounded-xl border font-semibold transition-all text-center ${
                    data.layoutStyle === style.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              ৩. বাংলা ফন্ট ফ্যামিলি:
            </label>
            <select
              value={data.fontFamily}
              onChange={(e) =>
                onChange({ fontFamily: e.target.value as FontFamily })
              }
              className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-xl p-2.5 font-semibold outline-none"
            >
              <option value="SolaimanLipi">সোলাইমান লিপি (ক্লাসিক ডার্ক)</option>
              <option value="Hind Siliguri">হিন্দ শিলিগুড়ি (আধুনিক ডিজিটাল)</option>
              <option value="Anek Bangla">অনেক বাংলা (বোল্ড হেডলাইন)</option>
              <option value="Noto Serif Bengali">নোটো সিফ (খবরের কাগজ)</option>
            </select>
          </div>

          {/* Font Size Slider */}
          <div className="flex flex-col gap-1 bg-[#020617] p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">শিরোনামের ফন্ট সাইজ:</span>
              <span className="text-amber-400">{data.fontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="52"
              step="1"
              value={data.fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
              className="accent-amber-500 cursor-pointer w-full"
            />
          </div>
        </div>
      )}

      {/* YouTube Growth Best Practice Guidance Box */}
      <div className="mt-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>ইউটিউব থিউমনেইল সেরা নির্দেশিকা (Best Practices):</span>
        </div>
        <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc leading-tight">
          <li>
            <strong className="text-white">ব্র্যান্ড সামঞ্জস্যতা:</strong> একই লাল/সোনালী কালার স্কিম ও লোগো ব্যবহার করলে সাবস্ক্রাইবার বাড়ে।
          </li>
          <li>
            <strong className="text-white">ক্লিকবেট পরিহার:</strong> বিভ্রান্তিকর থাম্বনেইল না দিয়ে আসল তথ্য দিন (মিসলিডিং মেটাডেটা এড়াতে)।
          </li>
          <li>
            <strong className="text-white">মোবাইল ফ্রেন্ডলি:</strong> ৭০%+ ভিউ আসে মোবাইলে, তাই লেখা বড় ও হাই-কন্ট্রাস্ট ব্লকে রাখুন।
          </li>
        </ul>
      </div>
    </div>
  );
};
