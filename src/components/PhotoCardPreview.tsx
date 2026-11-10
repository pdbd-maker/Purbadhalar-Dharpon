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
    const isLandscape = data.aspectRatio === '16:9';

    // Preview Dimensions (540px wide for 1:1, 540x675 for 4:5, 640x360 for 16:9)
    const cardWidth = isLandscape ? 640 : 540;
    const cardHeight = isLandscape ? 360 : (isPortrait ? 675 : 540);
    const isSplitEditorial = data.cardType === 'opinion' && data.opinionStyle === 'split_editorial';

    // ==========================================
    // 1. "মত-দ্বিমত" SPLEET EDITORIAL DESIGN
    // (Requested from user's attached photo)
    // ==========================================
    if (isSplitEditorial) {
      const avatarSize = isLandscape ? 120 : (data.authorImgSize ? Math.max(data.authorImgSize, 115) : 138);
      const avatarTop = isLandscape ? 100 : (isPortrait ? 210 : 160);
      const badgeBg = data.badgeBgColor || '#c2410c';

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
              backgroundColor: '#edf2f7',
              border: '1px solid #cbd5e1',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.45)',
            }}
            className="relative overflow-hidden rounded-sm transition-all select-none"
          >
            {/* SVG Definitions for the angled rounded mask */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="editorial-split-clip" clipPathUnits="userSpaceOnUse">
                  <path
                    d={`M ${cardWidth * 0.58} 0 
                        L ${cardWidth} 0 
                        L ${cardWidth} ${cardHeight} 
                        L ${cardWidth * 0.52} ${cardHeight} 
                        L ${cardWidth * 0.43} ${cardHeight * 0.53} 
                        Q ${cardWidth * 0.40} ${cardHeight * 0.50} ${cardWidth * 0.43} ${cardHeight * 0.47} 
                        Z`}
                  />
                </clipPath>
              </defs>
            </svg>

            {/* Subtle Newspaper Dot Grid Background on Left */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage: 'radial-gradient(circle, #0f172a 12%, transparent 13%)',
                backgroundSize: '5px 5px',
              }}
            />

            {/* RIGHT SIDE: Main Topic Image inside the Angled Rounded Mask */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden z-0"
              style={{
                clipPath: 'url(#editorial-split-clip)',
              }}
            >
              {data.mainImgUrl ? (
                <div className="w-full h-full relative">
                  <img
                    id="fg-main"
                    src={data.mainImgUrl}
                    alt="Main Topic"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${data.posX}px, ${data.posY}px) scale(${data.zoom}) rotate(${data.rotation}deg)`,
                      filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%) saturate(${data.filterSaturate || 100}%)`,
                      transformOrigin: 'center center',
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1280&q=80';
                    }}
                  />
                  {/* Dark gradient overlay on topic photo for high-contrast contrast */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.30) 100%)',
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs">
                  খবরের ছবি নির্বাচন করুন
                </div>
              )}
            </div>

            {/* White Contour Outline with Drop Shadow */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{
                filter: 'drop-shadow(-5px 0px 8px rgba(0,0,0,0.32))',
              }}
            >
              <path
                d={`M ${cardWidth * 0.58} -2 
                    L ${cardWidth * 0.43} ${cardHeight * 0.47} 
                    Q ${cardWidth * 0.40} ${cardHeight * 0.50} ${cardWidth * 0.43} ${cardHeight * 0.53} 
                    L ${cardWidth * 0.52} ${cardHeight + 2}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* LEFT SIDE CONTENT */}

            {/* 1. TOP: Category Badge ("মত-দ্বিমত") & Topic ("জাতীয় অর্থনীতি") */}
            <div
              className="absolute z-20 flex flex-col items-start"
              style={{
                left: '24px',
                top: isLandscape ? '16px' : '22px',
                maxWidth: `${cardWidth * 0.40}px`,
              }}
            >
              {/* Category Badge Pill (curved on right side) */}
              <div
                id="out-tag"
                className="inline-flex items-center text-white font-extrabold tracking-wide shadow-md"
                style={{
                  backgroundColor: badgeBg,
                  borderRadius: '4px 24px 24px 4px',
                  padding: isLandscape ? '4px 18px' : '6px 22px',
                  fontSize: isLandscape ? '18px' : '21px',
                  boxShadow: '0 4px 12px rgba(194, 65, 12, 0.35)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {data.category || 'মত-দ্বিমত'}
              </div>

              {/* Topic / Subheading */}
              <div
                className="font-black tracking-tight text-slate-900 mt-2 flex items-center gap-1.5"
                style={{
                  fontSize: isLandscape ? '18px' : '22px',
                  lineHeight: 1.2,
                  color: '#0f172a',
                }}
              >
                <span>{data.opinionTopic || 'জাতীয় অর্থনীতি'}</span>
                <span className="text-sky-700 text-sm">📈</span>
              </div>

              {/* Optional Headline / Quote if provided */}
              {data.headline && (
                <div
                  className="text-xs font-semibold text-slate-600 line-clamp-2 mt-1.5 leading-snug"
                  style={{ maxWidth: '240px' }}
                >
                  {data.headline}
                </div>
              )}
            </div>

            {/* 2. CENTER: Dark Navy Ribbon & Columnist Avatar */}
            {/* Dark Navy Ribbon behind avatar */}
            <div
              className="absolute z-10 pointer-events-none"
              style={{
                left: '16px',
                top: `${avatarTop + avatarSize * 0.36}px`,
                width: `${cardWidth * 0.38}px`,
                height: isLandscape ? '40px' : '46px',
                backgroundColor: '#172554',
                borderRadius: '24px 0 0 24px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.35)',
              }}
            />

            {/* Columnist Avatar Circle */}
            <div
              className="absolute z-20 flex items-center justify-center rounded-full overflow-hidden"
              style={{
                left: '24px',
                top: `${avatarTop}px`,
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                border: '4.5px solid #ffffff',
                boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#f8fafc',
              }}
            >
              {data.authorImgUrl ? (
                <img
                  id="out-author-img"
                  src={data.authorImgUrl}
                  alt={data.authorName || 'লেখক'}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-600 font-bold text-3xl">
                  ✍️
                </div>
              )}
            </div>

            {/* 3. BOTTOM: Author Name, Designation, Accent Line & Portal Logo */}
            <div
              className="absolute z-20 flex items-end justify-between"
              style={{
                left: '24px',
                bottom: isLandscape ? '16px' : '22px',
                width: `${cardWidth * 0.39}px`,
              }}
            >
              <div className="flex flex-col min-w-0 flex-1 pr-2">
                {/* Author Name */}
                <span
                  className="font-extrabold tracking-tight truncate"
                  style={{
                    color: '#0f172a',
                    fontSize: isLandscape ? '16px' : '19px',
                    lineHeight: 1.15,
                  }}
                >
                  {data.authorName || 'এম গোলাম মোস্তফা ভুইয়া'}
                </span>

                {/* Author Designation */}
                <span
                  className="font-semibold text-slate-600 truncate mt-0.5"
                  style={{
                    fontSize: isLandscape ? '11px' : '13px',
                    lineHeight: 1.2,
                  }}
                >
                  {data.authorDesignation || 'রাজনৈতিক বিশ্লেষক ও কলাম লেখক'}
                </span>

                {/* Red/Orange Accent Underline */}
                <div
                  className="w-full mt-1.5"
                  style={{
                    height: '3px',
                    backgroundColor: badgeBg,
                    borderRadius: '2px',
                  }}
                />
              </div>

              {/* Portal Media Logo Box */}
              <div
                className="shrink-0 flex items-center justify-center bg-white rounded shadow-sm"
                style={{
                  width: isLandscape ? '38px' : '44px',
                  height: isLandscape ? '38px' : '44px',
                  border: '2px solid #1e3a8a',
                  padding: '2px',
                }}
              >
                {data.logoUrl ? (
                  <img
                    id="card-logo"
                    src={data.logoUrl}
                    alt="Logo"
                    crossOrigin="anonymous"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="font-extrabold text-[#1e3a8a] text-sm tracking-tighter">
                    দর্পণ
                  </span>
                )}
              </div>
            </div>

            {/* Subtle Portal Branding on Bottom Right Watermark */}
            <div className="absolute right-3 bottom-2 text-[10px] text-white/60 font-semibold px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm z-20 pointer-events-none">
              pdonline.com.bd
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 2. STANDARD NEWS & CLASSIC OPINION CARDS
    // ==========================================

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
                    filter: `brightness(${data.filterBrightness}%) contrast(${data.filterContrast}%) saturate(${data.filterSaturate || 100}%)`,
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

            {/* Date Box (Day, English & Bengali Era) */}
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
            </div>
          </div>

          {/* Content Area (Headline / Opinion Column + Detail Tag + Reporter) */}
          <div
            className="absolute left-[22px] right-[22px] z-20 text-left transition-all duration-200 flex flex-col items-start gap-2.5"
            style={{
              bottom: '58px',
            }}
          >
            {data.cardType === 'opinion' ? (
              /* OPINION / COLUMN CARD LAYOUT */
              <div className="w-full flex flex-col gap-2.5">
                {/* Author / Columnist Profile Card */}
                <div
                  className="flex items-center gap-3.5 p-3 rounded-2xl border backdrop-blur-md shadow-2xl w-full"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.90)',
                    borderColor: 'rgba(255, 255, 255, 0.20)',
                    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {data.showAuthorImg !== false && (
                    <div
                      className="relative shrink-0 flex items-center justify-center"
                      style={{
                        width: `${data.authorImgSize || 90}px`,
                        height: `${data.authorImgSize || 90}px`,
                      }}
                    >
                      {data.authorImgUrl ? (
                        <img
                          id="out-author-img"
                          src={data.authorImgUrl}
                          alt={data.authorName || 'লেখক'}
                          crossOrigin="anonymous"
                          className="w-full h-full rounded-full object-cover shadow-xl"
                          style={{
                            border: `3px solid ${theme.accentColor || '#f59e0b'}`,
                          }}
                        />
                      ) : (
                        <div
                          id="out-author-img-placeholder"
                          className="w-full h-full rounded-full flex items-center justify-center font-bold shadow-xl"
                          style={{
                            backgroundColor: theme.titleBorderColor || '#e50914',
                            color: '#ffffff',
                            border: `3px solid ${theme.accentColor || '#f59e0b'}`,
                            fontSize: `${Math.round((data.authorImgSize || 90) * 0.42)}px`,
                          }}
                        >
                          ✍️
                        </div>
                      )}
                      <div
                        className="absolute -bottom-1 -right-1 text-[10px] font-black px-2 py-0.5 rounded shadow-md tracking-wider"
                        style={{
                          backgroundColor: theme.accentColor || '#f59e0b',
                          color: '#0f172a',
                        }}
                      >
                        কলাম
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col min-w-0 flex-1 justify-center">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-extrabold text-lg sm:text-xl leading-tight truncate tracking-wide"
                        style={{
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                        }}
                      >
                        {data.authorName || 'মাহবুবুর রহমান'}
                      </span>
                    </div>

                    <span
                      className="text-xs sm:text-sm font-semibold leading-tight line-clamp-1 mt-1"
                      style={{
                        color: theme.accentColor || '#fbbf24',
                      }}
                    >
                      {data.authorDesignation || 'কলামিস্ট ও লেখক'}
                    </span>

                    {data.opinionTopic && (
                      <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate mt-1 opacity-95">
                        বিষয়: {data.opinionTopic}
                      </span>
                    )}
                  </div>
                </div>

                {/* Opinion Quote / Headline */}
                <div
                  className="pl-3.5 relative w-full"
                  style={{
                    borderLeft: `4px solid ${theme.accentColor || '#f59e0b'}`,
                  }}
                >
                  <span
                    className="absolute -top-3.5 left-1 text-2xl font-serif font-black select-none pointer-events-none opacity-40"
                    style={{ color: theme.accentColor || '#fbbf24' }}
                  >
                    “
                  </span>
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
                    {data.headline || 'মতামত বা কলামের মূল উদ্ধৃতি বা বক্তব্য এখানে লিখুন...'}
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD NEWS CARD LAYOUT */
              <>
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
              </>
            )}

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
