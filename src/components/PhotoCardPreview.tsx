import React, { forwardRef } from 'react';
import { PhotoCardData } from '../types';
import { THEMES } from '../data/themesAndPresets';

interface PhotoCardPreviewProps {
  data: PhotoCardData;
}

export const PhotoCardPreview = forwardRef<HTMLDivElement, PhotoCardPreviewProps>(
  ({ data }, ref) => {
    const theme = THEMES[data.themeId] || THEMES.royal_blue;
    const isPortrait = data.aspectRatio === '4:5';

    // Preview Dimensions (scaled smoothly on screen, 540px wide for 1:1, 540x675 for 4:5)
    const cardWidth = 540;
    const cardHeight = isPortrait ? 675 : 540;

    return (
      <div className="flex flex-col items-center">
        {/* Container Frame */}
        <div
          ref={ref}
          id="photocard"
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            fontFamily: `'${data.fontFamily}', 'SolaimanLipi', 'Hind Siliguri', sans-serif`,
            backgroundColor: '#020617',
            border: '1px solid #1e293b',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
          className="relative overflow-hidden rounded-sm transition-all select-none"
        >
          {/* Main Background Image & Transform */}
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden"
            style={{ backgroundColor: '#0f172a' }}
          >
            {data.mainImgUrl ? (
              <>
                {(data.imgFit || 'contain') === 'contain' && (
                  <img
                    src={data.mainImgUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-45 scale-110 pointer-events-none"
                    style={{
                      filter: `brightness(${data.filterBrightness * 0.9}%) contrast(${data.filterContrast}%) blur(16px)`,
                    }}
                  />
                )}
                <img
                  id="fg-main"
                  src={data.mainImgUrl}
                  alt="Main News"
                  crossOrigin="anonymous"
                  className={`w-full h-full relative transition-transform duration-75 ease-out ${
                    (data.imgFit || 'contain') === 'contain'
                      ? 'object-contain'
                      : (data.imgFit || 'contain') === 'fill'
                      ? 'object-fill'
                      : 'object-cover'
                  }`}
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="100%" height="100%" fill="%230f172a"/><circle cx="540" cy="540" r="300" fill="%231e293b" opacity="0.6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="32" font-family="sans-serif">পূর্বধলার দর্পণ - ছবি নির্বাচন করুন</text></svg>';
                  }}
                  style={{
                    transform: `translate(${data.posX}px, ${data.posY}px) scale(${data.zoom}) rotate(${data.rotation}deg)`,
                    filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
                    transformOrigin: 'center center',
                  }}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2" style={{ color: '#64748b' }}>
                <span className="text-sm">খবরের ছবি আপলোড করুন</span>
              </div>
            )}
          </div>

          {/* Fixed Top Header Bar */}
          <div
            className="absolute top-0 left-0 w-full z-10 transition-colors duration-300"
            style={{
              height: '85px',
              background: theme.topBarGradient,
              borderBottom: `3.5px solid ${theme.topBarBorder}`,
            }}
          />

          {/* Bottom Dark Gradient Mask for Text Readability */}
          <div
            className="absolute bottom-[45px] left-0 w-full z-10 pointer-events-none transition-all duration-300"
            style={{
              height: isPortrait ? '260px' : '200px',
              background: `linear-gradient(0deg, rgba(0,0,0,${data.overlayOpacity}) 0%, rgba(0,0,0,${
                data.overlayOpacity * 0.7
              }) 60%, transparent 100%)`,
            }}
          />

          {/* Newsprint Subtle Texture Dot Overlay */}
          <div
            className="absolute bottom-0 left-0 w-full z-[11] opacity-[0.03] pointer-events-none"
            style={{
              height: '40%',
              backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 11%)',
              backgroundSize: '5px 5px',
            }}
          />

          {/* Top Header Content Box */}
          <div className="absolute top-[15px] left-[22px] right-[22px] flex items-center justify-between z-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              {data.logoUrl ? (
                <div className="max-w-[160px] max-h-[50px] flex items-center">
                  <img
                    id="card-logo"
                    src={data.logoUrl}
                    alt="Logo"
                    crossOrigin="anonymous"
                    className="max-w-full max-h-[50px] object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <span
                    className="font-extrabold text-2xl tracking-tight"
                    style={{
                      color: '#ffffff',
                      textShadow: '0px 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    পূর্বধলার দর্পণ
                  </span>
                  <span
                    className="text-[10px] font-semibold tracking-wider -mt-1"
                    style={{ color: '#fbbf24', opacity: 0.95 }}
                  >
                    pdonline.com.bd
                  </span>
                </div>
              )}
            </div>

            {/* Category Badge in Top Header */}
            {(data.category || data.customCategory) && (
              <div
                id="out-category"
                className="px-3 py-1 rounded-md text-xs font-bold shadow-md tracking-wide"
                style={{
                  backgroundColor: data.badgeBgColor || theme.defaultBadgeBg || '#dc2626',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                {data.customCategory || data.category}
              </div>
            )}

            {/* Date & Time Box */}
            <div className="text-right leading-tight flex flex-col items-end" style={{ color: '#ffffff' }}>
              <div
                id="out-day"
                className="font-bold text-sm tracking-wide"
                style={{ color: theme.accentColor }}
              >
                {data.customDay}
              </div>
              <div id="out-eng" className="text-xs font-semibold my-0.5" style={{ opacity: 0.95 }}>
                {data.customEngDate}
              </div>
              <div id="out-bng" className="text-[11px]" style={{ opacity: 0.85 }}>
                {data.customBngDate}
              </div>
              {data.showTime && data.customTime && (
                <div
                  id="out-time"
                  className="text-[10px] font-bold mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10"
                  style={{ color: '#fde047' }}
                >
                  <span>🕒</span>
                  <span>{data.customTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area (Headline + Detail Tag + Reporter) */}
          <div
            className="absolute left-[22px] right-[22px] z-20 text-left transition-all duration-200 flex flex-col items-start gap-2.5"
            style={{
              bottom: '58px',
            }}
          >
            {/* Title Wrapper with Left Border Accent */}
            <div
              className="pl-3 w-full"
              style={{
                borderLeft: `4px solid ${theme.titleBorderColor}`,
              }}
            >
              <div
                id="out-title"
                style={{
                  fontSize: `${data.fontSize}px`,
                  lineHeight: data.lineHeight,
                  textAlign: data.textAlign,
                  color: '#ffffff',
                  textShadow:
                    '0px 2px 4px rgba(0,0,0,1), 0px 4px 10px rgba(0,0,0,0.95)',
                }}
                className="font-bold tracking-normal break-words"
              >
                {data.headline || 'এখানে আপনার নিউজ পোর্টালের প্রধান শিরোনামটি লিখুন...'}
              </div>
            </div>

            {/* Tags & Reporter Bar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {data.showDetailTag && data.detailTag && (
                <div
                  id="out-tag"
                  className="inline-flex items-center justify-center px-4 rounded font-bold text-xs shadow-lg"
                  style={{
                    background: theme.detailTagBg,
                    color: theme.detailTagText,
                    height: '30px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.2',
                    boxSizing: 'border-box',
                  }}
                >
                  <span className="inline-flex items-center justify-center leading-none">
                    {data.detailTag}
                  </span>
                </div>
              )}

              {data.showReporter && data.reporterName && (
                <div
                  id="out-reporter-box"
                  className="inline-flex items-center gap-1.5 px-3 rounded font-semibold text-xs shadow-md"
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    height: '30px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  <span style={{ color: theme.accentColor }}>✍️</span>
                  <span id="out-reporter">{data.reporterName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Social Bar */}
          <div
            id="card-footer-bar"
            className="absolute bottom-0 left-0 w-full h-[45px] z-30 flex items-center justify-around px-4 transition-colors duration-300"
            style={{
              backgroundColor: theme.footerBg,
              color: theme.footerTextColor,
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="footer-social-item flex items-center gap-1.5 text-xs font-extrabold"
              style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fab fa-facebook text-sm flex items-center justify-center"></i>
              <span className="inline-flex items-center leading-none">
                {data.fbHandle || '@purbadhala'}
              </span>
            </div>
            <div
              className="footer-social-item flex items-center gap-1.5 text-xs font-extrabold"
              style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fab fa-youtube text-sm flex items-center justify-center"></i>
              <span className="inline-flex items-center leading-none">
                {data.ytHandle || '@purbadhala'}
              </span>
            </div>
            <div
              className="footer-social-item flex items-center gap-1.5 text-xs font-extrabold"
              style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-globe text-sm flex items-center justify-center"></i>
              <span className="inline-flex items-center leading-none">
                {data.websiteUrl || 'www.pdonline.com.bd'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between w-[540px] text-xs text-slate-400 px-1">
          <span>
            ক্যানভাস সাইজ:{' '}
            <strong className="text-sky-400">
              {isPortrait ? '১০৮০ × ১৩৫০ (৪:৫)' : '১০৮০ × ১০৮০ (১:১)'}
            </strong>
          </span>
          <span className="text-slate-400">পূর্বধলার দর্পণ অফিসিয়াল ফটোকার্ড টেমপ্লেট</span>
        </div>
      </div>
    );
  }
);

PhotoCardPreview.displayName = 'PhotoCardPreview';
