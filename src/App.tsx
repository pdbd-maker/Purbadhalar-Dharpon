import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import { Header } from './components/Header';
import { PhotoCardPreview } from './components/PhotoCardPreview';
import { ControlsPanel } from './components/ControlsPanel';
import { OfflineCodeModal } from './components/OfflineCodeModal';
import { PhotoCardData, AppMode } from './types';
import { SAMPLE_NEWS_PRESETS } from './data/themesAndPresets';
import { getFullBengaliDateTimeBundle } from './utils/dateUtils';

export default function App() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [appMode, setAppMode] = useState<AppMode>('photocard');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initial Facebook PhotoCard State
  const [cardData, setCardData] = useState<PhotoCardData>(() => {
    const today = new Date();
    const dtBundle = getFullBengaliDateTimeBundle(today);
    const savedLogo = localStorage.getItem('purbadhala_saved_logo') || '';

    return {
      cardType: 'news',
      opinionStyle: 'split_editorial',
      showCategory: false,
      authorName: 'এম গোলাম মোস্তফা ভুইয়া',
      authorDesignation: 'রাজনৈতিক বিশ্লেষক ও কলাম লেখক',
      authorImgUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      showAuthorImg: true,
      authorImgSize: 92,
      opinionTopic: 'জাতীয় অর্থনীতি',
      logoUrl: savedLogo,
      logoText: 'পূর্বধলার দর্পণ',
      showLogoText: !savedLogo,
      mainImgUrl:
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1080&q=80',
      zoom: 1,
      posY: 0,
      posX: 0,
      rotation: 0,
      category: '',
      customCategory: '',
      badgeBgColor: '#e50914',
      headline:
        'পূর্বধলায় ঐতিহ্যবাহী উৎসব উদ্যাপনে প্রস্তুত এলাকাবাসী, নিরাপত্তা ব্যবস্থা জোরদার',
      fontSize: 26,
      lineHeight: 1.38,
      textAlign: 'left',
      fontFamily: 'SolaimanLipi',
      reporterName: '',
      showReporter: false,
      useCustomDate: false,
      customDay: dtBundle.day,
      customEngDate: dtBundle.engDate,
      customBngDate: dtBundle.bngDate,
      customTime: '',
      showTime: false,
      selectedDateIso: dtBundle.isoDate,
      selectedTimeStr: '',
      detailTag: 'বিস্তারিত কমেন্টে',
      showDetailTag: true,
      fbHandle: '@purbadhala',
      ytHandle: '@purbadhala',
      websiteUrl: 'www.pdonline.com.bd',
      aspectRatio: '1:1',
      imgFit: 'contain',
      themeId: 'royal_blue',
      overlayOpacity: 0.85,
      filterBrightness: 100,
      filterContrast: 100,
      filterSaturate: 100,
    };
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateCardData = (updated: Partial<PhotoCardData>) => {
    setCardData((prev) => ({ ...prev, ...updated }));
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = SAMPLE_NEWS_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCardData((prev) => ({
        ...prev,
        headline: preset.headline,
        category: preset.category,
        reporterName: preset.reporterName || prev.reporterName,
        detailTag: preset.detailTag || prev.detailTag,
        mainImgUrl: preset.sampleImgUrl,
        themeId: preset.themeId,
        cardType: preset.cardType || 'news',
        opinionStyle: preset.opinionStyle || prev.opinionStyle || 'split_editorial',
        opinionTopic: preset.opinionTopic || prev.opinionTopic,
        badgeBgColor: preset.badgeBgColor || prev.badgeBgColor,
        aspectRatio: preset.aspectRatio || prev.aspectRatio,
        authorName: preset.authorName || prev.authorName,
        authorDesignation: preset.authorDesignation || prev.authorDesignation,
        authorImgUrl: preset.authorImgUrl || prev.authorImgUrl,
        showCategory: preset.showCategory !== undefined ? preset.showCategory : true,
        zoom: 1,
        posY: 0,
        posX: 0,
      }));
      showToast(`'${preset.title}' টেমপ্লেট সফলভাবে যুক্ত হয়েছে!`);
    }
  };

  const handleResetTransforms = () => {
    setCardData((prev) => ({
      ...prev,
      zoom: 1,
      posY: 0,
      posX: 0,
      rotation: 0,
      overlayOpacity: 0.85,
      filterBrightness: 100,
      filterContrast: 100,
      filterSaturate: 100,
    }));
    showToast('ছবির পজিশন ও জুম রিসেট করা হয়েছে!');
  };

  // Helper to safely convert external image URLs to Base64 Data URLs for html2canvas
  const getImageDataUrl = async (url: string): Promise<string> => {
    if (!url || url.startsWith('data:')) return url;
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      // Ignore fetch CORS error, fallback to canvas draw
    }

    return new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width || 800;
          canvas.height = img.naturalHeight || img.height || 600;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
            return;
          }
        } catch {
          // Tainted canvas
        }
        resolve(url);
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  };

  // High-Resolution Export Handler
  const handleDownloadPNG = async () => {
    const targetRef = cardRef.current;
    if (!targetRef) return;
    setIsDownloading(true);

    try {
      // Wait for web fonts (Hind Siliguri, Anek Bangla, SolaimanLipi) to finish loading
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const currentMainImg = cardData.mainImgUrl;
      const currentLogo = cardData.logoUrl;
      const currentAuthorImg = cardData.authorImgUrl || '';

      // Pre-convert image sources to Base64 Data URLs
      const [dataMainImg, dataLogo, dataAuthorImg] = await Promise.all([
        getImageDataUrl(currentMainImg),
        getImageDataUrl(currentLogo),
        currentAuthorImg ? getImageDataUrl(currentAuthorImg) : Promise.resolve(''),
      ]);

      const element = targetRef;
      const isPortrait = cardData.aspectRatio === '4:5';
      const isLandscape = cardData.aspectRatio === '16:9';
      const targetWidth = isLandscape ? 640 : 540;
      const targetHeight = isLandscape ? 360 : (isPortrait ? 675 : 540);

      const canvas = await html2canvas(element, {
        scale: 2, // 2x HD DPI resolution (1080x1080, 1080x1350, 1280x720)
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        width: targetWidth,
        height: targetHeight,
        windowWidth: 1200,
        windowHeight: 1000,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc, clonedElement) => {
          if (clonedDoc.body) {
            clonedDoc.body.style.width = '1200px';
            clonedDoc.body.style.minWidth = '1200px';
            clonedDoc.body.style.overflow = 'visible';
          }
          if (clonedDoc.documentElement) {
            clonedDoc.documentElement.style.width = '1200px';
            clonedDoc.documentElement.style.minWidth = '1200px';
            clonedDoc.documentElement.style.overflow = 'visible';
          }

          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.position = 'relative';
            clonedElement.style.left = '0';
            clonedElement.style.top = '0';
            clonedElement.style.width = `${targetWidth}px`;
            clonedElement.style.height = `${targetHeight}px`;
          }

          const clonedMainImg = clonedDoc.getElementById('fg-main') as HTMLImageElement | null;
          if (clonedMainImg && dataMainImg) {
            clonedMainImg.src = dataMainImg;
          }
          const clonedLogo = clonedDoc.getElementById('card-logo') as HTMLImageElement | null;
          if (clonedLogo && dataLogo) {
            clonedLogo.src = dataLogo;
          }
          const clonedAuthorImg =
            (clonedDoc.getElementById('out-author-img') as HTMLImageElement | null) ||
            (clonedDoc.querySelector('img[alt="' + (cardData.authorName || 'লেখক') + '"]') as HTMLImageElement | null);
          if (clonedAuthorImg && dataAuthorImg) {
            clonedAuthorImg.src = dataAuthorImg;
          }

          // Force flex centering in html2canvas clone
          const clonedTag = clonedDoc.getElementById('out-tag');
          if (clonedTag) {
            clonedTag.style.display = 'inline-flex';
            clonedTag.style.alignItems = 'center';
            clonedTag.style.justifyContent = 'center';
            clonedTag.style.height = '30px';
            clonedTag.style.lineHeight = '1.2';
            clonedTag.style.padding = '0 16px';
            const tagSpan = clonedTag.querySelector('span');
            if (tagSpan) {
              tagSpan.style.display = 'inline-flex';
              tagSpan.style.alignItems = 'center';
              tagSpan.style.justifyContent = 'center';
              tagSpan.style.lineHeight = '1.2';
              tagSpan.style.height = 'auto';
              tagSpan.style.transform = 'none';
            }
          }

          const clonedFooter = clonedDoc.getElementById('card-footer-bar');
          if (clonedFooter) {
            clonedFooter.style.display = 'flex';
            clonedFooter.style.alignItems = 'center';
            clonedFooter.style.justifyContent = 'space-around';
            clonedFooter.style.height = '45px';
            clonedFooter.style.lineHeight = '1.2';
            const items = clonedFooter.querySelectorAll('.footer-social-item');
            items.forEach((item) => {
              if (item instanceof HTMLElement) {
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.justifyContent = 'center';
                item.style.height = '100%';
                item.style.lineHeight = '1.2';
                const icon = item.querySelector('i');
                if (icon) {
                  icon.style.display = 'inline-flex';
                  icon.style.alignItems = 'center';
                  icon.style.justifyContent = 'center';
                  icon.style.lineHeight = '1';
                  icon.style.height = 'auto';
                }
                const span = item.querySelector('span');
                if (span) {
                  span.style.display = 'inline-flex';
                  span.style.alignItems = 'center';
                  span.style.lineHeight = '1.2';
                  span.style.height = 'auto';
                  span.style.transform = 'none';
                }
              }
            });
          }
        },
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Purbadhalar_Dhorpon_PhotoCard_${Date.now()}.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('ফটোকার্ড সফলভাবে এইচডি PNG হিসেবে ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('ডাউনলোডে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold shadow-2xl border border-amber-300 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs flex items-center gap-2">
          <span>✨ {notification}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <Header
        appMode={appMode}
        setAppMode={setAppMode}
        aspectRatio={cardData.aspectRatio}
        setAspectRatio={(ratio) => updateCardData({ aspectRatio: ratio })}
        activeThemeId={cardData.themeId}
        setThemeId={(themeId) => updateCardData({ themeId })}
        onApplyPreset={handleApplyPreset}
        onOpenOfflineCodeModal={() => setIsOfflineModalOpen(true)}
        onDownloadPNG={handleDownloadPNG}
        isDownloading={isDownloading}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls Panel */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <ControlsPanel
            data={cardData}
            onChange={updateCardData}
            onApplyPreset={handleApplyPreset}
            onResetTransforms={handleResetTransforms}
          />
        </div>

        {/* Right Side: Live Canvas Stage */}
        <div className="lg:col-span-7 w-full flex flex-col items-center justify-center bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-4 md:p-8 min-h-[600px] shadow-2xl relative">
          <div className="mb-4 text-center flex items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-sky-500/20 shadow-sm">
              ফেসবুক ফটোকার্ড প্রিভিউ (Live Canvas)
            </span>
          </div>

          {/* Interactive Card Canvas Component */}
          <div className="w-full flex justify-center overflow-x-auto py-2">
            <PhotoCardPreview ref={cardRef} data={cardData} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#020617] py-4 text-center text-xs text-slate-400">
        পূর্বধলার দর্পণ (Purbadhalar Dhorpon) - সর্বস্বত্ব সংরক্ষিত © {new Date().getFullYear()}
      </footer>

      {/* Offline Standalone Code Modal */}
      <OfflineCodeModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        cardData={cardData}
        appMode={appMode}
      />
    </div>
  );
}

