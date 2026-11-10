import React, { forwardRef } from 'react';
import { YouTubeThumbnailData } from '../types';
import { THEMES } from '../data/themesAndPresets';

interface YouTubeThumbnailPreviewProps {
  data: YouTubeThumbnailData;
}

export const YouTubeThumbnailPreview = forwardRef<
  HTMLDivElement,
  YouTubeThumbnailPreviewProps
>(({ data }, ref) => {
  const theme = THEMES[data.themeId] || THEMES.breaking_red;

  // Render Headline with Highlight Word as a high-contrast pill
  const renderHighlightedHeadline = () => {
    const rawHeadline = data.headline || 'এখানে ইউটিউব ভিডিওর আকর্ষণীয় শিরোনাম লিখুন...';
    const rawHighlight = data.highlightWord ? data.highlightWord.trim() : '';

    if (!rawHighlight) {
      return <span>{rawHeadline}</span>;
    }

    // Split highlightWords by comma or pipe to allow highlighting multiple terms e.g. "বড়, স্থগিত"
    const searchTerms = rawHighlight
      .split(/[,|\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (searchTerms.length === 0) {
      return <span>{rawHeadline}</span>;
    }

    // Sort terms by length descending so longer phrases match before shorter individual words
    searchTerms.sort((a, b) => b.length - a.length);

    // Escape special regex characters
    const escapedTerms = searchTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

    const parts = rawHeadline.split(regex);
    if (parts.length <= 1) {
      return <span>{rawHeadline}</span>;
    }

    return (
      <span>
        {parts.map((part, idx) => {
          const isMatch = searchTerms.some(
            (term) => term.toLowerCase() === part.toLowerCase()
          );

          if (isMatch) {
            return (
              <span
                key={idx}
                className="inline-block px-2.5 py-0.5 mx-1 rounded-md font-extrabold shadow-md transform -rotate-1"
                style={{
                  backgroundColor: data.highlightBg || '#facc15',
                  color: '#020617',
                  textShadow: 'none',
                }}
              >
                {part}
              </span>
            );
          }
          return <React.Fragment key={idx}>{part}</React.Fragment>;
        })}
      </span>
    );
  };

  // Render Background Images (Supports 1, 2, 3, or 4 images auto-collage)
  const renderBackgroundImages = () => {
    const images = [data.mainImgUrl, ...(data.galleryImages || [])].filter(Boolean);

    if (images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-2" style={{ color: '#64748b' }}>
          <span className="text-sm font-semibold">ইউটিউব থাম্বনেইলের ছবি আপলোড করুন</span>
        </div>
      );
    }

    // Single Image Mode
    if (images.length === 1) {
      const fit = data.imgFit || 'cover';
      return (
        <>
          {fit === 'contain' && (
            <img
              src={images[0]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none"
              style={{
                filter: `brightness(${data.filterBrightness * 0.9}%) contrast(${data.filterContrast}%) blur(16px)`,
              }}
            />
          )}
          <img
            id="fg-main"
            src={images[0]}
            alt="Thumbnail BG"
            crossOrigin="anonymous"
            className={`w-full h-full relative transition-transform duration-75 ease-out ${
              fit === 'contain'
                ? 'object-contain'
                : fit === 'fill'
                ? 'object-fill'
                : 'object-cover'
            }`}
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="100%" height="100%" fill="%230f172a"/><circle cx="640" cy="360" r="250" fill="%231e293b" opacity="0.6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="28" font-family="sans-serif">পূর্বধলার দর্পণ - ছবি যুক্ত করুন</text></svg>';
            }}
            style={{
              transform: `translate(${data.posX}px, ${data.posY}px) scale(${data.zoom}) rotate(${data.rotation}deg)`,
              filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%) saturate(${data.filterSaturate || 100}%)`,
            }}
          />
        </>
      );
    }

    // Determine collage style
    let effectiveStyle = data.collageStyle || 'auto';
    if (effectiveStyle === 'auto') {
      if (images.length === 2) effectiveStyle = 'split_2';
      else if (images.length === 3) effectiveStyle = 'featured_3';
      else effectiveStyle = 'grid_4';
    }

    // 2 Images Collage Layout (Vertical Split or Diagonal)
    if (images.length === 2 || effectiveStyle === 'split_2' || effectiveStyle === 'diagonal_2') {
      if (effectiveStyle === 'diagonal_2') {
        return (
          <div className="relative w-full h-full overflow-hidden flex">
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 56% 0, 44% 100%, 0 100%)' }}
            >
              <img
                id="fg-main"
                src={images[0]}
                alt="Split 1"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{
                  filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
                }}
              />
            </div>
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: 'polygon(56% 0, 100% 0, 100% 100%, 44% 100%)' }}
            >
              <img
                src={images[1]}
                alt="Split 2"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{
                  filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
                }}
              />
            </div>
            {/* Sleek Golden-Red Gradient Seam Line */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-90"
              style={{
                background:
                  'linear-gradient(105deg, transparent 48.8%, #facc15 49.5%, #dc2626 50.5%, transparent 51.2%)',
              }}
            />
          </div>
        );
      }

      return (
        <div className="grid grid-cols-2 w-full h-full gap-0 bg-slate-950 overflow-hidden relative">
          <div className="relative w-full h-full overflow-hidden border-r-2 border-amber-400/80 shadow-[0_0_20px_rgba(250,204,21,0.4)] z-1">
            <img
              id="fg-main"
              src={images[0]}
              alt="Col 1"
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
              }}
            />
            {/* Soft inner shadow blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/40 pointer-events-none" />
          </div>
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={images[1]}
              alt="Col 2"
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
              }}
            />
            {/* Soft inner shadow blending */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-950/40 pointer-events-none" />
          </div>
        </div>
      );
    }

    // 3 Images Collage Layout (1 Big Left + 2 Small Right)
    if (images.length === 3 || effectiveStyle === 'featured_3') {
      return (
        <div className="grid grid-cols-12 w-full h-full gap-0.5 bg-slate-950 overflow-hidden">
          {/* Left 7 cols (Featured) */}
          <div className="col-span-7 relative w-full h-full overflow-hidden border-r-2 border-amber-500/60 shadow-lg">
            <img
              id="fg-main"
              src={images[0]}
              alt="Main 1"
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/30 pointer-events-none" />
          </div>

          {/* Right 5 cols (2 stacked) */}
          <div className="col-span-5 grid grid-rows-2 h-full gap-0.5">
            <div className="relative w-full h-full overflow-hidden border-b border-amber-500/40">
              <img
                src={images[1]}
                alt="Side 1"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{
                  filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
                }}
              />
            </div>
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={images[2]}
                alt="Side 2"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{
                  filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    // 4 Images Collage Layout (2x2 Grid)
    return (
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5 bg-slate-950 overflow-hidden">
        {images.slice(0, 4).map((img, idx) => (
          <div
            key={idx}
            className="relative w-full h-full overflow-hidden border border-slate-800/80"
          >
            <img
              id={idx === 0 ? 'fg-main' : undefined}
              src={img}
              alt={`Grid ${idx + 1}`}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{
                filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%)`,
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const isVertical = data.aspectRatio === '9:16';

  return (
    <div className={`flex flex-col items-center w-full ${isVertical ? 'max-w-[380px]' : 'max-w-[640px]'}`}>
      {/* Aspect Ratio Frame Container (640x360 for 16:9 or 360x640 for 9:16) */}
      <div
        ref={ref}
        id="yt-thumbnail-canvas"
        style={{
          width: isVertical ? '360px' : '640px',
          height: isVertical ? '640px' : '360px',
          fontFamily: `'${data.fontFamily}', 'SolaimanLipi', 'Hind Siliguri', sans-serif`,
          backgroundColor: '#020617',
          border: '1px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        className="relative overflow-hidden rounded-md transition-all select-none"
      >
        {/* Background Image Container with transforms */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center z-0 overflow-hidden"
          style={{ backgroundColor: '#0f172a' }}
        >
          {renderBackgroundImages()}
        </div>

        {/* Dynamic Dark Gradient Overlay for High Readability */}
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity"
          style={{
            background:
              data.layoutStyle === 'left_bar'
                ? 'linear-gradient(90deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.75) 55%, rgba(2,6,23,0.2) 100%)'
                : data.layoutStyle === 'center_hero'
                ? 'linear-gradient(180deg, rgba(2,6,23,0.4) 0%, rgba(2,6,23,0.85) 60%, rgba(2,6,23,0.98) 100%)'
                : 'linear-gradient(180deg, rgba(2,6,23,0.5) 0%, rgba(2,6,23,0.3) 30%, rgba(2,6,23,0.9) 70%, rgba(2,6,23,0.98) 100%)',
            opacity: data.overlayOpacity,
          }}
        />

        {/* Top Header Watermark & Channel Logo Bar */}
        <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between">
          {/* Channel Logo / Branding Badge */}
          {data.showChannelLogo && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-lg"
              style={{
                backgroundColor: 'rgba(2, 6, 23, 0.85)',
                borderColor: 'rgba(30, 41, 59, 0.8)',
              }}
            >
              {data.logoUrl ? (
                <img
                  id="card-logo"
                  src={data.logoUrl}
                  alt="Channel Logo"
                  crossOrigin="anonymous"
                  className="h-6 object-contain"
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs shadow"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
                      color: '#ffffff',
                    }}
                  >
                    দ
                  </div>
                  <span
                    className="font-extrabold text-sm tracking-tight"
                    style={{ color: '#ffffff' }}
                  >
                    {data.channelName || 'পূর্বধলার দর্পণ'}
                  </span>
                </div>
              )}

              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                style={{
                  color: '#facc15',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                }}
              >
                HD
              </span>
            </div>
          )}

          {/* Right Corner Badge (e.g. 🔴 LIVE / 🎙️ TALK SHOW) */}
          <div className="flex items-center gap-2">
            {data.showLiveDot && (
              <div
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md shadow-md font-extrabold"
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#ffffff' }}
                ></span>
                <span style={{ color: '#ffffff' }}>LIVE</span>
              </div>
            )}

            {data.badgeText && (
              <div
                className="px-3 py-1 rounded-md font-extrabold text-xs tracking-wide shadow-md uppercase border"
                style={{
                  backgroundColor: data.badgeBg || '#dc2626',
                  color: data.badgeTextColor || '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                {data.badgeText}
              </div>
            )}
          </div>
        </div>

        {/* Center/Bottom Main Headline Content Area */}
        <div
          className={`absolute left-4 right-4 z-20 transition-all duration-200 ${
            data.layoutStyle === 'left_bar'
              ? 'top-16 bottom-10 left-4 max-w-[380px] flex flex-col justify-center'
              : data.layoutStyle === 'center_hero'
              ? 'bottom-8 text-center flex flex-col items-center'
              : 'bottom-6 flex flex-col items-start'
          }`}
        >
          {/* Optional Subtitle / Topic Pill */}
          {data.subTitle && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-extrabold mb-2 shadow-lg border"
              style={{
                backgroundColor: theme.accentColor || '#f59e0b',
                color: '#020617',
                borderColor: 'rgba(251, 191, 36, 0.4)',
              }}
            >
              <span style={{ color: '#020617' }}>{data.subTitle}</span>
            </div>
          )}

          {/* Main Huge Mobile-Friendly Bangla Headline */}
          <div
            className="font-black tracking-normal leading-tight break-words"
            style={{
              color: '#ffffff',
              fontSize: `${data.fontSize}px`,
              lineHeight: data.lineHeight,
              textShadow:
                '0px 3px 6px rgba(0,0,0,1), 0px 6px 16px rgba(0,0,0,0.95), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {renderHighlightedHeadline()}
          </div>
        </div>

        {/* Bottom Bar Platform Watermark / Handle */}
        <div className="absolute bottom-2 right-3 z-20 flex items-center gap-2 opacity-95">
          {data.showPlayIcon && (
            <>
              {data.targetPlatform === 'facebook' ? (
                <div
                  className="px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-black shadow-md border border-white/20"
                  style={{ backgroundColor: '#1877f2', color: '#ffffff' }}
                >
                  <i className="fab fa-facebook-f text-[11px]"></i>
                  <span>FB WATCH</span>
                </div>
              ) : data.targetPlatform === 'tiktok' ? (
                <div
                  className="px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-black shadow-md border border-cyan-400/30"
                  style={{ backgroundColor: '#0f172a', color: '#25f4ee' }}
                >
                  <i className="fab fa-tiktok text-[11px] text-[#fe2c55]"></i>
                  <span>TIKTOK</span>
                </div>
              ) : data.targetPlatform === 'all' ? (
                <div
                  className="px-2 py-0.5 rounded-md flex items-center gap-1.5 text-[10px] font-black shadow-md border border-amber-400/40"
                  style={{
                    background: 'linear-gradient(135deg, #1877f2 0%, #dc2626 50%, #fe2c55 100%)',
                    color: '#ffffff',
                  }}
                >
                  <i className="fab fa-youtube text-[10px]"></i>
                  <i className="fab fa-facebook-f text-[10px]"></i>
                  <i className="fab fa-tiktok text-[10px]"></i>
                </div>
              ) : (
                <div
                  className="w-6 h-4 rounded-sm flex items-center justify-center text-[9px] font-black shadow"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                  }}
                >
                  ▶
                </div>
              )}
            </>
          )}
          <span
            className="text-[11px] font-bold tracking-wider"
            style={{
              color: '#f8fafc',
              textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)',
            }}
          >
            {data.ytHandle ||
              (data.targetPlatform === 'facebook'
                ? 'Facebook / @purbadhala'
                : data.targetPlatform === 'tiktok'
                ? 'TikTok / @purbadhala'
                : data.targetPlatform === 'all'
                ? 'Social Media / @purbadhala'
                : 'YouTube / @purbadhala')}
          </span>
        </div>
      </div>

      {/* Info Legend below canvas */}
      <div className={`mt-3 flex items-center justify-between w-full ${isVertical ? 'max-w-[360px]' : 'max-w-[640px]'} text-xs text-slate-400 px-1`}>
        <span>
          ক্যানভাস রেজুলেশন:{' '}
          <strong className="text-amber-400">
            {isVertical ? '১০৮০ × ১৯২০ পিক্সেল (৯:১৬ শটস/রিলস)' : '১২৮০ × ৭২০ পিক্সেল (১৬:৯ HD)'}
          </strong>
        </span>
        <span className="text-slate-300 font-medium">
          {isVertical ? 'শটস & রিলস থাম্বনেইল' : 'ইউটিউব, ফেসবুক ও টিকটক ব্যানার'}
        </span>
      </div>
    </div>
  );
});

YouTubeThumbnailPreview.displayName = 'YouTubeThumbnailPreview';
