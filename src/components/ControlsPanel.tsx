import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Type,
  Palette,
  Calendar,
  Clock,
  Sparkles,
  Upload,
  RotateCcw,
  Share2,
  CheckCircle2,
  RefreshCw,
  Tag,
  User,
} from 'lucide-react';
import { PhotoCardData, ThemeId, FontFamily } from '../types';
import { THEMES, SAMPLE_NEWS_PRESETS } from '../data/themesAndPresets';
import {
  getFullBengaliDateTimeBundle,
  getBengaliDayName,
  getFormattedEnglishDate,
  getFormattedBengaliEraDate,
  getFormattedBengaliTime,
} from '../utils/dateUtils';

interface ControlsPanelProps {
  data: PhotoCardData;
  onChange: (updated: Partial<PhotoCardData>) => void;
  onApplyPreset: (presetId: string) => void;
  onResetTransforms: () => void;
}

const CATEGORY_OPTIONS = [
  'পূর্বধলা',
  'ব্রেকিং নিউজ',
  'বিশেষ সংবাদ',
  'জাতীয়',
  'রাজনীতি',
  'অপরাধ ও দুর্নীতি',
  'অর্থনীতি',
  'খেলাধুলা',
  'আন্তর্জাতিক',
  'সারাদেশ',
  'বিনোদন',
  'শিক্ষা',
];

const REPORTER_OPTIONS = [
  'পূর্বধলা প্রতিনিধি',
  'নিজস্ব প্রতিবেদক',
  'ডেস্ক রিপোর্ট',
  'বিশেষ প্রতিনিধি',
  'নেত্রকোনা প্রতিনিধি',
  'ক্রাইম রিপোর্টার',
];

const OPINION_CATEGORY_OPTIONS = [
  'মত-দ্বিমত',
  'মতামত',
  'কলাম',
  'মুক্তমত',
  'সম্পাদকীয়',
  'দৃষ্টিভঙ্গি',
  'খোলা চিঠি',
  'পূর্বধলা',
  'বিশেষ কলাম',
];

const OPINION_SAMPLE_AUTHORS = [
  { name: 'এম গোলাম মোস্তফা ভুইয়া', desig: 'রাজনৈতিক বিশ্লেষক ও কলাম লেখক', topic: 'জাতীয় অর্থনীতি' },
  { name: 'মাহবুবুর রহমান', desig: 'কলামিস্ট ও লেখক', topic: 'উন্নয়ন ও সম্ভাবনা' },
  { name: 'ডা. মোহাম্মদ ফায়সাল', desig: 'চিকিৎসক ও কলামিস্ট', topic: 'স্বাস্থ্য ও চিকিৎসা' },
  { name: 'ড. রফিকুল ইসলাম', desig: 'শিক্ষাবিদ ও গবেষক', topic: 'শিক্ষা সংস্কার' },
  { name: 'আনোয়ার সাদাত', desig: 'লেখক ও রাজনীতি বিশ্লেষক', topic: 'জাতীয় রাজনীতি' },
];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  data,
  onChange,
  onApplyPreset,
  onResetTransforms,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'datetime' | 'image' | 'design' | 'footer'>('content');

  const handleSyncLiveDateTime = () => {
    const now = new Date();
    const bundle = getFullBengaliDateTimeBundle(now);
    onChange({
      customDay: bundle.day,
      customEngDate: bundle.engDate,
      customBngDate: bundle.bngDate,
      customTime: bundle.time,
      selectedDateIso: bundle.isoDate,
      selectedTimeStr: bundle.timeStr,
      useCustomDate: false,
      showTime: true,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value;
    if (!isoVal) return;
    const [yearStr, monthStr, dayStr] = isoVal.split('-');
    const d = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10), 12, 0, 0);
    const bundle = getFullBengaliDateTimeBundle(d);
    onChange({
      selectedDateIso: isoVal,
      customDay: bundle.day,
      customEngDate: bundle.engDate,
      customBngDate: bundle.bngDate,
      useCustomDate: true,
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = e.target.value;
    if (!timeVal) return;
    const [hhStr, mmStr] = timeVal.split(':');
    const tempD = new Date();
    tempD.setHours(parseInt(hhStr, 10), parseInt(mmStr, 10), 0);
    const formattedTime = getFormattedBengaliTime(tempD);
    onChange({
      selectedTimeStr: timeVal,
      customTime: formattedTime,
      showTime: true,
    });
  };

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

  const handleAuthorImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({
          authorImgUrl: result,
          showAuthorImg: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl w-full max-w-md flex flex-col gap-4 text-slate-100">
      {/* Tab Navigation (5 Tabs) */}
      <div className="grid grid-cols-5 gap-1 bg-[#020617] p-1 rounded-xl border border-slate-800 text-[11px] font-semibold shadow-inner">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-lg transition-all ${
            activeTab === 'content'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>সংবাদ</span>
        </button>

        <button
          onClick={() => setActiveTab('datetime')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-lg transition-all ${
            activeTab === 'datetime'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>তারিখ-সময়</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-lg transition-all ${
            activeTab === 'image'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>ছবি</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-lg transition-all ${
            activeTab === 'design'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>ডিজাইন</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-lg transition-all ${
            activeTab === 'footer'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>ব্র্যান্ডিং</span>
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
          {/* Card Type Selector (News vs Opinion Column) */}
          <div className="bg-[#020617] p-2.5 rounded-xl border border-slate-800 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>কার্ডের ধরন নির্বাচন করুন:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ cardType: 'news' })}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  data.cardType !== 'opinion'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>📰</span>
                <span>সাধারণ সংবাদ</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    cardType: 'opinion',
                    category: data.category === 'পূর্বধলা' ? 'মতামত' : data.category,
                  })
                }
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  data.cardType === 'opinion'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>✍️</span>
                <span>মতামত ও কলাম</span>
              </button>
            </div>
          </div>

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

          {/* Category / Badge Selector (Optional Toggle) */}
          <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>ক্যাটাগরি / ব্যাজ (ঐচ্ছিক):</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold cursor-pointer bg-slate-900 hover:bg-slate-850 px-2 py-0.5 rounded border border-slate-700">
                  <input
                    type="checkbox"
                    checked={data.showCategory !== false}
                    onChange={(e) => onChange({ showCategory: e.target.checked })}
                    className="accent-amber-500 rounded cursor-pointer w-3.5 h-3.5"
                  />
                  <span>{data.showCategory !== false ? 'অন (দেখাবেন)' : 'অফ (লুকানো)'}</span>
                </label>
                {data.showCategory !== false && (
                  <input
                    type="color"
                    value={data.badgeBgColor || '#e50914'}
                    onChange={(e) => onChange({ badgeBgColor: e.target.value })}
                    title="ব্যাজের ব্যাকগ্রাউন্ড কালার"
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                )}
              </div>
            </div>

            {data.showCategory !== false ? (
              <>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(data.cardType === 'opinion' ? OPINION_CATEGORY_OPTIONS : CATEGORY_OPTIONS.slice(0, 6)).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onChange({ category: cat, customCategory: '', showCategory: true })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all truncate border ${
                        data.category === cat && !data.customCategory
                          ? 'bg-red-600 text-white border-red-500 shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {data.cardType !== 'opinion' && (
                  <div className="grid grid-cols-3 gap-1">
                    {CATEGORY_OPTIONS.slice(6).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => onChange({ category: cat, customCategory: '', showCategory: true })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all truncate border ${
                          data.category === cat && !data.customCategory
                            ? 'bg-red-600 text-white border-red-500 shadow'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={data.customCategory || ''}
                  onChange={(e) => onChange({ customCategory: e.target.value, showCategory: true })}
                  placeholder="অথবা কাস্টম ব্যাজ টেক্সট লিখুন..."
                  className="mt-1 bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none"
                />
              </>
            ) : (
              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 italic flex items-center justify-between">
                <span>ফটোকার্ডে ক্যাটাগরি ব্যাজ বর্তমানে বন্ধ রয়েছে।</span>
                <button
                  type="button"
                  onClick={() => onChange({ showCategory: true })}
                  className="text-[10px] font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  চালু করুন
                </button>
              </div>
            )}
          </div>

          {/* OPINION / COLUMNIST SPECIFIC INPUTS */}
          {data.cardType === 'opinion' ? (
            <div className="flex flex-col gap-3">
              {/* Layout Style Selector for Opinion & Column */}
              <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-xl border border-amber-500/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>মতামত ফটোকার্ডের ডিজাইন স্টাইল:</span>
                  </label>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded">
                    {(data.opinionStyle || 'split_editorial') === 'split_editorial' ? 'স্প্লিট ব্যানার' : 'ক্লাসিক ডার্ক'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        opinionStyle: 'split_editorial',
                        category: data.category || 'মত-দ্বিমত',
                        badgeBgColor: data.badgeBgColor || '#c2410c',
                        aspectRatio: data.aspectRatio || '16:9',
                      })
                    }
                    className={`p-2.5 rounded-lg text-xs font-bold transition-all border flex flex-col items-center text-center gap-1 ${
                      (data.opinionStyle || 'split_editorial') === 'split_editorial'
                        ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm">📰 মত-দ্বিমত (স্প্লিট)</span>
                    <span className="text-[10px] font-normal text-slate-400">ছবিতে দেয়া নতুন স্প্লিট ডিজাইন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange({ opinionStyle: 'classic_overlay' })}
                    className={`p-2.5 rounded-lg text-xs font-bold transition-all border flex flex-col items-center text-center gap-1 ${
                      data.opinionStyle === 'classic_overlay'
                        ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm">🖼️ ক্লাসিক ডার্ক</span>
                    <span className="text-[10px] font-normal text-slate-400">ফুল ব্যাকগ্রাউন্ড ডার্ক ওভারলে</span>
                  </button>
                </div>
              </div>

              {/* Columnist / Author Info Section */}
              <div className="flex flex-col gap-2.5 bg-slate-950 p-3 rounded-xl border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>কলামিস্ট / লেখকের তথ্য:</span>
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.showAuthorImg !== false}
                      onChange={(e) => onChange({ showAuthorImg: e.target.checked })}
                      className="accent-amber-500 rounded cursor-pointer"
                    />
                    <span>ছবি দেখাবেন</span>
                  </label>
                </div>

                {/* Quick Author suggestions */}
                <div className="flex flex-wrap gap-1">
                  {OPINION_SAMPLE_AUTHORS.map((auth) => (
                    <button
                      key={auth.name}
                      type="button"
                      onClick={() =>
                        onChange({
                          authorName: auth.name,
                          authorDesignation: auth.desig,
                          opinionTopic: auth.topic || data.opinionTopic,
                        })
                      }
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      {auth.name}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">লেখকের নাম:</label>
                  <input
                    type="text"
                    value={data.authorName || ''}
                    onChange={(e) => onChange({ authorName: e.target.value })}
                    placeholder="যেমন: এম গোলাম মোস্তফা ভুইয়া / মাহবুবুর রহমান"
                    className="bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-100 text-xs rounded-lg p-2.5 outline-none font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400 font-semibold">লেখকের পরিচিতি / পদবি:</label>
                  <input
                    type="text"
                    value={data.authorDesignation || ''}
                    onChange={(e) => onChange({ authorDesignation: e.target.value })}
                    placeholder="যেমন: রাজনৈতিক বিশ্লেষক ও কলাম লেখক"
                    className="bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-amber-300 font-bold flex items-center justify-between">
                    <span>কলামের বিষয় / টপিক (বড় হেডার):</span>
                    <span className="text-[10px] text-slate-400">যেমন: জাতীয় অর্থনীতি</span>
                  </label>
                  <input
                    type="text"
                    value={data.opinionTopic || ''}
                    onChange={(e) => onChange({ opinionTopic: e.target.value })}
                    placeholder="যেমন: জাতীয় অর্থনীতি / উন্নয়ন ভাবনা"
                    className="bg-slate-900 border border-amber-500/40 focus:border-amber-400 text-amber-200 text-xs rounded-lg p-2 outline-none font-semibold"
                  />
                </div>

                {/* Author Photo Upload */}
                <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-slate-800">
                  <label className="text-[11px] text-slate-300 font-semibold flex items-center justify-between">
                    <span>লেখকের ছবি আপলোড:</span>
                    {data.authorImgUrl && (
                      <button
                        type="button"
                        onClick={() => onChange({ authorImgUrl: '' })}
                        className="text-red-400 hover:text-red-300 text-[10px] font-bold"
                      >
                        ছবি মুছুন
                      </button>
                    )}
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg p-2 cursor-pointer text-xs font-bold text-amber-400 transition-all text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{data.authorImgUrl ? 'নতুন ছবি পরিবর্তন' : 'লেখকের ছবি ফাইল সিলেক্ট করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAuthorImgUpload}
                        className="hidden"
                      />
                    </label>
                    {data.authorImgUrl && (
                      <img
                        src={data.authorImgUrl}
                        alt="Author Preview"
                        className="w-10 h-10 rounded-full object-cover border border-amber-400 shrink-0"
                      />
                    )}
                  </div>
                </div>

                {/* Author Photo Size Controls */}
                {data.showAuthorImg !== false && (
                  <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-amber-400 font-bold">
                        কলামিস্টের ছবির সাইজ:
                      </span>
                      <span className="text-[11px] text-slate-300 font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                        {data.authorImgSize || 90}px
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onChange({ authorImgSize: 72 })}
                        className={`py-1 px-2 rounded-lg text-xs font-bold transition-all border ${
                          (data.authorImgSize || 90) === 72
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        মাঝারি (৭২px)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ authorImgSize: 92 })}
                        className={`py-1 px-2 rounded-lg text-xs font-bold transition-all border ${
                          (data.authorImgSize || 90) === 92 || (data.authorImgSize || 90) === 90
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        বড় (৯২px)
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ authorImgSize: 110 })}
                        className={`py-1 px-2 rounded-lg text-xs font-bold transition-all border ${
                          (data.authorImgSize || 90) === 110
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        অতিরিক্ত বড় (১১০px)
                      </button>
                    </div>

                    <input
                      type="range"
                      min={60}
                      max={130}
                      step={2}
                      value={data.authorImgSize || 90}
                      onChange={(e) => onChange({ authorImgSize: Number(e.target.value) })}
                      className="w-full accent-amber-500 cursor-pointer mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Opinion Headline / Quote Text Area */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    মতামত / কলামের মূল উদ্ধৃতি বা বক্তব্য:
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {data.headline.length} অক্ষর
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={data.headline}
                  onChange={(e) => onChange({ headline: e.target.value })}
                  placeholder="এখানে মতামত বা কলামের আকর্ষণীয় মূল বাক্য বা উদ্ধৃতি লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none leading-relaxed resize-none transition-colors"
                />
              </div>
            </div>
          ) : (
            /* STANDARD NEWS INPUTS */
            <>
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

              {/* Reporter / Desk Selection */}
              <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>প্রতিবেদক / রিপোর্টার:</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.showReporter}
                      onChange={(e) => onChange({ showReporter: e.target.checked })}
                      className="accent-amber-500 rounded cursor-pointer"
                    />
                    <span>দেখাবেন</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-1 mt-1">
                  {REPORTER_OPTIONS.map((rep) => (
                    <button
                      key={rep}
                      type="button"
                      onClick={() => onChange({ reporterName: rep, showReporter: true })}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all truncate border ${
                        data.reporterName === rep && data.showReporter
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {rep}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={data.reporterName || ''}
                  onChange={(e) => onChange({ reporterName: e.target.value })}
                  placeholder="অথবা প্রতিবেদকের নাম লিখুন..."
                  className="mt-1 bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none"
                />
              </div>
            </>
          )}

          {/* Detail Tag Option */}
          <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                {data.cardType === 'opinion' ? 'বিস্তারিত ট্যাগ (ঐচ্ছিক):' : '২. বিস্তারিত ট্যাগ (ঐচ্ছিক):'}
              </label>
              <input
                type="checkbox"
                checked={data.showDetailTag}
                onChange={(e) => onChange({ showDetailTag: e.target.checked })}
                className="accent-amber-500 rounded cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-3 gap-1 mt-1">
              {(data.cardType === 'opinion'
                ? ['বিস্তারিত কলামে', 'বিস্তারিত নিবন্ধে', 'বিস্তারিত কমেন্টে']
                : ['বিস্তারিত কমেন্টে', 'বিস্তারিত ক্যাপশনে', 'বিস্তারিত ওয়েবসাইটে']
              ).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onChange({ detailTag: tag, showDetailTag: true })}
                  className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                    data.detailTag === tag && data.showDetailTag
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATE & ACCURATE TIME */}
      {activeTab === 'datetime' && (
        <div className="flex flex-col gap-4">
          {/* Real-time Sync Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-sky-500/20 p-3.5 rounded-xl border border-amber-500/30 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-400">
                  সঠিক বাংলা সন, তারিখ ও সময়
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                বাংলা একাডেমি মান ২০১৯
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              সঠিক গ্রেগরীয় ও বাংলা সনের হিসাব স্বয়ংক্রিয়ভাবে তৈরি হয়। এক ক্লিকে বর্তমান লাইভ টাইম ও তারিখ সেট করুন:
            </p>

            <button
              type="button"
              onClick={handleSyncLiveDateTime}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-lg cursor-pointer transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>বর্তমান সঠিক সময় ও তারিখ লোড করুন</span>
            </button>
          </div>

          {/* Date & Time Picker Controls */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-400" />
                <span>তারিখ সিলেক্টর:</span>
              </label>
              <input
                type="date"
                value={data.selectedDateIso || ''}
                onChange={handleDateChange}
                className="bg-slate-900 border border-slate-700 focus:border-amber-500 text-slate-100 text-xs rounded-lg p-2 outline-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>সময় সিলেক্টর:</span>
              </label>
              <input
                type="time"
                value={data.selectedTimeStr || ''}
                onChange={handleTimeChange}
                className="bg-slate-900 border border-slate-700 focus:border-amber-500 text-slate-100 text-xs rounded-lg p-2 outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Time Display Toggle */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                ফটোকার্ডে সময় প্রদর্শন করুন
              </span>
            </div>
            <input
              type="checkbox"
              checked={data.showTime !== false}
              onChange={(e) => onChange({ showTime: e.target.checked })}
              className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Direct Manual Customization Box */}
          <div className="flex flex-col gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300">
              ম্যানুয়াল টেক্সট এডিট (কাস্টম পরিবর্তন):
            </span>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">বারের নাম:</label>
              <input
                type="text"
                value={data.customDay}
                onChange={(e) => onChange({ customDay: e.target.value })}
                placeholder="মঙ্গলবার"
                className="bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">ইংরেজি তারিখ (বাংলায়):</label>
              <input
                type="text"
                value={data.customEngDate}
                onChange={(e) => onChange({ customEngDate: e.target.value })}
                placeholder="০১ সেপ্টেম্বর ২০২৬"
                className="bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">বাংলা সন ও তারিখ (বঙ্গাব্দ):</label>
              <input
                type="text"
                value={data.customBngDate}
                onChange={(e) => onChange({ customBngDate: e.target.value })}
                placeholder="১৭ ভাদ্র ১৪৩৩ বঙ্গাব্দ"
                className="bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none font-semibold text-amber-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">সময় ফরম্যাট:</label>
              <input
                type="text"
                value={data.customTime || ''}
                onChange={(e) => onChange({ customTime: e.target.value })}
                placeholder="সন্ধ্যা ০৭:২৭"
                className="bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs rounded-lg p-2 outline-none font-semibold text-yellow-300"
              />
            </div>
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
