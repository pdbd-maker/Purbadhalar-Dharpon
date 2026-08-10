import { PhotoCardData, YouTubeThumbnailData } from '../types';

export interface GenerateOfflineHtmlOptions {
  cardData: PhotoCardData;
  ytData: YouTubeThumbnailData;
  activeMode?: 'photocard' | 'youtube';
}

export function generateOfflineHtml(
  input: GenerateOfflineHtmlOptions | PhotoCardData
): string {
  let cardData: PhotoCardData;
  let ytData: YouTubeThumbnailData;
  let activeMode: 'photocard' | 'youtube' = 'photocard';

  if ('cardData' in input && 'ytData' in input) {
    cardData = input.cardData;
    ytData = input.ytData;
    activeMode = input.activeMode || 'photocard';
  } else {
    cardData = input as PhotoCardData;
    ytData = {
      headline: cardData.headline || 'এখানে ভিডিওর আকর্ষণীয় বাংলা শিরোনাম লিখুন...',
      subTitle: 'বিশেষ নিউজ বুলেটিন',
      badgeText: '🔴 সরাসরি',
      badgeBg: '#dc2626',
      badgeTextColor: '#ffffff',
      highlightWord: 'সরাসরি',
      highlightBg: '#facc15',
      mainImgUrl: cardData.mainImgUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1280&q=80',
      galleryImages: [],
      collageStyle: 'auto',
      zoom: cardData.zoom || 1,
      posX: cardData.posX || 0,
      posY: cardData.posY || 0,
      rotation: 0,
      themeId: cardData.themeId || 'royal_blue',
      fontFamily: 'Hind Siliguri',
      fontSize: 28,
      lineHeight: 1.25,
      overlayOpacity: 70,
      showPlayIcon: true,
      showLiveDot: true,
      showChannelLogo: true,
      logoUrl: cardData.logoUrl || '',
      channelName: 'পূর্বধলার দর্পণ',
      ytHandle: '@purbadhala',
      layoutStyle: 'bottom_pill',
      filterBrightness: 100,
      filterContrast: 100,
    };
  }

  const isPortrait = cardData.aspectRatio === '4:5';
  const cardHeight = isPortrait ? '675px' : '540px';

  const defaultCardImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="100%" height="100%" fill="%230f172a"/><circle cx="540" cy="540" r="300" fill="%231e293b" opacity="0.6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="32" font-family="sans-serif">পূর্বধলার দর্পণ - ছবি নির্বাচন করুন</text></svg>';
  
  const defaultYtImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="100%" height="100%" fill="%230f172a"/><circle cx="640" cy="360" r="250" fill="%231e293b" opacity="0.6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="28" font-family="sans-serif">পূর্বধলার দর্পণ - ব্যাকগ্রাউন্ড ছবি যোগ করুন</text></svg>';

  // Clean initial URLs to avoid broken local blob URLs when opened from file://
  const initialCardImg = (cardData.mainImgUrl && !cardData.mainImgUrl.startsWith('blob:')) ? cardData.mainImgUrl : defaultCardImg;
  const initialYtImg = (ytData.mainImgUrl && !ytData.mainImgUrl.startsWith('blob:')) ? ytData.mainImgUrl : defaultYtImg;
  const initialLogoImg = (cardData.logoUrl && !cardData.logoUrl.startsWith('blob:')) ? cardData.logoUrl : '';

  return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>পূর্বধলার দর্পণ - অফলাইন গ্রাফিক্স জেনারেটর (ফটোকার্ড ও থাম্বনেইল)</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/solaimanlipi" rel="stylesheet">
    <!-- FontAwesome icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- html2canvas-pro for modern CSS oklab/oklch support -->
    <script src="https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'SolaimanLipi', 'Hind Siliguri', Arial, sans-serif; 
            background-color: #020617; 
            color: #f8fafc; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            padding: 20px 10px 40px; 
            min-height: 100vh;
        }

        .header-title { text-align: center; margin-bottom: 20px; max-width: 800px; }
        .header-title h1 { color: #f59e0b; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .header-title p { color: #94a3b8; font-size: 14px; margin-top: 4px; }

        /* Mode Tabs */
        .mode-tabs {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 16px;
            background: #0f172a;
            padding: 6px;
            border-radius: 12px;
            border: 1px solid #1e293b;
        }
        .tab-btn {
            background: transparent;
            color: #94a3b8;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
        }
        .tab-btn:hover { color: #ffffff; background: rgba(255,255,255,0.05); }
        .tab-btn.active {
            background: #f59e0b;
            color: #020617;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .main-wrapper { 
            display: flex; 
            gap: 25px; 
            max-width: 1200px; 
            width: 100%; 
            justify-content: center; 
            flex-wrap: wrap; 
            align-items: flex-start;
        }

        /* Controls Panel */
        .controls { 
            background: #0f172a; 
            padding: 24px; 
            border-radius: 16px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
            width: 450px; 
            max-width: 100%; 
            border: 1px solid #1e293b; 
        }

        .panel-title {
            font-size: 16px;
            font-weight: 800;
            color: #38bdf8;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #1e293b;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .preset-bar {
            background: #020617;
            padding: 10px;
            border-radius: 10px;
            border: 1px solid #1e293b;
            margin-bottom: 16px;
        }
        .preset-title { font-size: 12px; font-weight: 700; color: #f59e0b; margin-bottom: 6px; }
        .preset-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .preset-btn {
            background: #0f172a;
            border: 1px solid #334155;
            color: #cbd5e1;
            padding: 6px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-align: left;
            font-family: inherit;
            transition: all 0.15s;
        }
        .preset-btn:hover { border-color: #f59e0b; color: #fff; background: #1e293b; }

        .input-group { margin-bottom: 14px; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 6px; color: #cbd5e1; font-size: 13px; }
        input[type="text"], input[type="color"], textarea, select { 
            width: 100%; 
            padding: 10px 12px; 
            border: 1px solid #334155; 
            background: #020617; 
            color: #fff; 
            border-radius: 8px; 
            font-family: inherit; 
            font-size: 13px;
        }
        input:focus, textarea:focus, select:focus { border-color: #f59e0b; outline: none; }
        
        .row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .slider { -webkit-appearance: none; width: 100%; height: 6px; background: #1e293b; border-radius: 5px; outline: none; margin-top: 5px; }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #38bdf8; border-radius: 50%; cursor: pointer; }
        .slider-amber::-webkit-slider-thumb { background: #f59e0b; }
        .slider-emerald::-webkit-slider-thumb { background: #10b981; }

        .btn-download { 
            width: 100%; 
            padding: 14px; 
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
            color: #020617; 
            border: none; 
            border-radius: 10px; 
            font-size: 15px; 
            font-weight: 800; 
            cursor: pointer; 
            transition: 0.2s ease; 
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); 
            margin-top: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-family: inherit;
        }
        .btn-download:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5); }

        .btn-reset {
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
        }
        .btn-reset:hover { background: rgba(239, 68, 68, 0.2); }

        /* Preview Container */
        .preview-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* ---------------------------------- */
        /* 🎨 1. Photocard Canvas Style      */
        /* ---------------------------------- */
        #photocard { 
            width: 540px; 
            height: ${cardHeight}; 
            background-color: #090d16; 
            position: relative; 
            overflow: hidden; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.8); 
            border-radius: 6px; 
            transition: height 0.3s ease;
        }

        .main-img-container { 
            position: absolute; 
            top: 0; left: 0; 
            width: 100%; height: 100%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            z-index: 2; 
            overflow: hidden; 
            background-color: #0f172a;
        }
        .card-blur-bg {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            object-fit: cover;
            filter: blur(16px) brightness(0.9);
            opacity: 0.45;
            transform: scale(1.1);
            pointer-events: none;
        }
        .main-img { 
            width: 100%; 
            height: 100%; 
            object-fit: contain; 
            position: relative; 
            transform-origin: center center; 
            transition: transform 0.05s linear;
        }

        .fixed-top-bar { 
            position: absolute; 
            top: 0; left: 0; width: 100%; 
            height: 85px; 
            background: linear-gradient(180deg, #1e3a8a 0%, #172554 100%); 
            border-bottom: 3.5px solid #f59e0b; 
            z-index: 10; 
        }

        .content-bg-mask { 
            position: absolute; 
            bottom: 45px; left: 0; width: 100%; 
            height: 240px; 
            background: linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 65%, transparent 100%); 
            z-index: 10; 
            pointer-events: none; 
        }

        .header-box { 
            position: absolute; 
            top: 15px; left: 22px; right: 22px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            z-index: 15; 
        }

        .brand-section { display: flex; align-items: center; gap: 10px; }
        .logo-box { max-width: 160px; max-height: 50px; display: flex; align-items: center; }
        #card-logo { max-width: 100%; max-height: 50px; object-fit: contain; }
        .brand-text { color: #ffffff; font-size: 22px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.4); }

        .category-badge { 
            background: ${cardData.badgeBgColor || '#e50914'}; 
            color: #ffffff; 
            padding: 4px 12px; 
            border-radius: 4px; 
            font-size: 13px; 
            font-weight: 700; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
        }

        .date-box { text-align: right; color: white; line-height: 1.2; }
        .day-name { font-size: 15px; font-weight: bold; color: #f59e0b; }
        .eng-date { font-size: 13px; font-weight: 500; opacity: 0.95; margin: 1px 0; }
        .bng-date { font-size: 11px; opacity: 0.85; }

        .content-area { 
            position: absolute; 
            bottom: 55px; left: 22px; right: 22px; 
            z-index: 15; 
            text-align: left; 
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }

        .title-wrapper { 
            border-left: 4px solid #e50914; 
            padding-left: 12px; 
            width: 100%;
        }

        #out-title { 
            font-weight: 700; 
            line-height: ${cardData.lineHeight || 1.35}; 
            color: #ffffff; 
            font-size: ${cardData.fontSize || 26}px;
            text-shadow: 0px 2px 4px rgba(0,0,0,1), 0px 4px 10px rgba(0,0,0,0.9); 
        }

        .reporter-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #facc15;
            font-weight: 700;
            background: rgba(0,0,0,0.4);
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid rgba(250,204,21,0.3);
        }

        .detail-btn { 
            display: inline-flex; 
            align-items: center;
            justify-content: center;
            height: 30px;
            background: linear-gradient(135deg, #e50914 0%, #990000 100%); 
            color: #ffffff; 
            padding: 0 16px; 
            border-radius: 4px; 
            font-size: 13px; 
            font-weight: bold; 
            line-height: 1.2;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4); 
            box-sizing: border-box;
        }

        .footer-bar { 
            position: absolute; 
            bottom: 0; left: 0; width: 100%; 
            height: 45px; 
            background: #f59e0b; 
            z-index: 20; 
            display: flex; 
            align-items: center; 
            justify-content: space-around; 
            border-top: 1px solid rgba(0,0,0,0.1); 
            box-sizing: border-box;
        }

        .footer-item { 
            display: flex; 
            align-items: center; 
            justify-content: center;
            gap: 6px; 
            height: 100%;
            font-size: 13px; 
            font-weight: 700; 
            line-height: 1.2;
            color: #1e293b; 
        }
        .footer-item i { 
            font-size: 15px; 
            color: #1e293b; 
        }

        /* ---------------------------------- */
        /* 🎬 2. YouTube Thumbnail Style     */
        /* ---------------------------------- */
        #ytcard {
            width: 640px;
            height: 360px;
            background-color: #020617;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            border-radius: 6px;
        }

        .yt-mask-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(0deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.65) 45%, rgba(2,6,23,0.2) 100%);
            z-index: 10;
            pointer-events: none;
        }

        .yt-top-bar {
            position: absolute;
            top: 12px; left: 16px; right: 16px;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .yt-badge-logo {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(2, 6, 23, 0.85);
            border: 1px solid rgba(30, 41, 59, 0.8);
            padding: 6px 12px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }

        .yt-content-area {
            position: absolute;
            bottom: 20px; left: 20px; right: 20px;
            z-index: 20;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }

        .yt-subtitle-pill {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 800;
            background: #f59e0b;
            color: #020617;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            border: 1px solid rgba(251, 191, 36, 0.4);
        }

        .yt-headline-box {
            font-weight: 900;
            color: #ffffff;
            line-height: 1.25;
            word-break: break-word;
            text-shadow: 0px 3px 6px rgba(0,0,0,1), 0px 6px 15px rgba(0,0,0,0.9);
        }

        .yt-highlight-pill {
            display: inline-block;
            padding: 2px 10px;
            margin: 0 4px;
            border-radius: 6px;
            font-weight: 900;
            color: #020617;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transform: rotate(-1deg);
        }

        .yt-watermark {
            position: absolute;
            bottom: 10px; right: 14px;
            z-index: 20;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0.9;
        }
    </style>
</head>
<body>

    <div class="header-title">
        <h1>পূর্বধলার দর্পণ - অফলাইন গ্রাফিক্স জেনারেটর</h1>
        <p>সামাজিক মাধ্যমের জন্য খবর ফটোকার্ড ও ইউটিউব ১৬:৯ থাম্বনেইল প্রস্তুত করুন</p>
        
        <div class="mode-tabs">
            <button id="tab-btn-photocard" class="tab-btn ${activeMode === 'photocard' ? 'active' : ''}">
                <i class="fas fa-newspaper"></i> ফেসবুক ফটোকার্ড জেনারেটর
            </button>
            <button id="tab-btn-youtube" class="tab-btn ${activeMode === 'youtube' ? 'active' : ''}">
                <i class="fab fa-youtube"></i> ইউটিউব থাম্বনেইল (16:9 HD)
            </button>
        </div>
    </div>

    <!-- ============================================== -->
    <!-- 📰 PHOTO CARD SECTION                          -->
    <!-- ============================================== -->
    <div id="section-photocard" class="main-wrapper" style="${activeMode === 'photocard' ? 'display:flex;' : 'display:none;'}">
        <div class="controls">
            <div class="panel-title">
                <span><i class="fas fa-sliders-h"></i> ফটোকার্ড কাস্টমাইজেশন</span>
                <button class="btn-reset" id="btn-reset-card"><i class="fas fa-undo"></i> রিসেট</button>
            </div>

            <!-- Quick Presets -->
            <div class="preset-bar">
                <div class="preset-title"><i class="fas fa-bolt"></i> দ্রুত টেমপ্লেট নির্বাচন করুন:</div>
                <div class="preset-btns">
                    <button class="preset-btn" data-card-preset="breaking">🔴 ব্রেকিং নিউজ</button>
                    <button class="preset-btn" data-card-preset="special">⭐ বিশেষ সংবাদ</button>
                    <button class="preset-btn" data-card-preset="sports">⚽ খেলাধুলা</button>
                    <button class="preset-btn" data-card-preset="politics">🏛️ রাজনীতি</button>
                </div>
            </div>

            <div class="input-group">
                <label>১. থিম নির্বাচন করুন:</label>
                <select id="card-theme">
                    <option value="royal_blue" ${cardData.themeId === 'royal_blue' ? 'selected' : ''}>রয়্যাল ব্লু (স্বাক্ষর)</option>
                    <option value="breaking_red" ${cardData.themeId === 'breaking_red' ? 'selected' : ''}>ব্রেকিং নিউজ (জরুরি লাল)</option>
                    <option value="dark_navy" ${cardData.themeId === 'dark_navy' ? 'selected' : ''}>ডার্ক স্লট প্রিমিয়াম</option>
                    <option value="emerald_green" ${cardData.themeId === 'emerald_green' ? 'selected' : ''}>মরকত সবুজ (বিশেষ)</option>
                </select>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>২. অনুপাত (Aspect Ratio):</label>
                    <select id="card-aspect-ratio">
                        <option value="1:1" ${!isPortrait ? 'selected' : ''}>1:1 স্কয়ার (1080x1080)</option>
                        <option value="4:5" ${isPortrait ? 'selected' : ''}>4:5 পোর্ট্রেট (1080x1350)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>লোগো আপলোড:</label>
                    <input type="file" id="input-card-logo" accept="image/*">
                </div>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>৩. মূল খবরের ছবি আপলোড:</label>
                    <input type="file" id="input-card-img" accept="image/*">
                </div>
                <div class="input-group">
                    <label>ছবি ডিসপ্লে মোড (ক্রপ রোধ):</label>
                    <select id="card-img-fit">
                        <option value="contain" selected>🖼️ পুরো ছবি (অটো ক্রপ ছাড়া)</option>
                        <option value="cover">✂️ ক্যানভাস জুম (Cover)</option>
                        <option value="fill">📐 টেনে ফিট (Fill)</option>
                    </select>
                </div>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>ছবি জুম (Zoom):</label>
                    <input type="range" min="0.5" max="3" step="0.05" value="${cardData.zoom || 1}" class="slider slider-amber" id="cardZoom">
                    <span id="cardZoomDisplay" style="font-size:11px; color:#f59e0b; display:block; margin-top:2px;">100%</span>
                </div>
                <div class="input-group">
                    <label>উপরে-নিচে (PosY):</label>
                    <input type="range" min="-300" max="300" value="${cardData.posY || 0}" class="slider slider-emerald" id="cardPosY">
                    <span id="cardPosYDisplay" style="font-size:11px; color:#10b981; display:block; margin-top:2px;">0px</span>
                </div>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>ডানে-বামে (PosX):</label>
                    <input type="range" min="-300" max="300" value="${cardData.posX || 0}" class="slider" id="cardPosX">
                    <span id="cardPosXDisplay" style="font-size:11px; color:#38bdf8; display:block; margin-top:2px;">0px</span>
                </div>
                <div class="input-group">
                    <label>ঘোরানো (Rotation):</label>
                    <input type="range" min="-180" max="180" value="${cardData.rotation || 0}" class="slider" id="cardRot">
                    <span id="cardRotDisplay" style="font-size:11px; color:#a855f7; display:block; margin-top:2px;">0°</span>
                </div>
            </div>

            <div class="input-group">
                <label>৪. খবরের প্রধান শিরোনাম:</label>
                <textarea id="card-title-input" rows="3">${cardData.headline || 'এখানে আপনার প্রধান আকর্ষণীয় শিরোনামটি লিখুন...'}</textarea>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>ক্যাটাগরি ব্যাজ:</label>
                    <select id="card-category-select">
                        <option value="পূর্বধলা" ${cardData.category === 'পূর্বধলা' ? 'selected' : ''}>পূর্বধলা</option>
                        <option value="ব্রেকিং নিউজ" ${cardData.category === 'ব্রেকিং নিউজ' ? 'selected' : ''}>ব্রেকিং নিউজ</option>
                        <option value="বিশেষ সংবাদ" ${cardData.category === 'বিশেষ সংবাদ' ? 'selected' : ''}>বিশেষ সংবাদ</option>
                        <option value="রাজনীতি" ${cardData.category === 'রাজনীতি' ? 'selected' : ''}>রাজনীতি</option>
                        <option value="খেলাধুলা" ${cardData.category === 'খেলাধুলা' ? 'selected' : ''}>খেলাধুলা</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>ব্যাজ ব্যাকগ্রাউন্ড:</label>
                    <input type="color" id="card-badge-color" value="${cardData.badgeBgColor || '#e50914'}" style="height:38px; cursor:pointer;">
                </div>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>ফন্ট সাইজ:</label>
                    <input type="range" min="18" max="42" value="${cardData.fontSize || 26}" class="slider" id="cardFontSize">
                    <span id="cardFontDisplay" style="font-size:11px; color:#38bdf8; display:block; margin-top:2px;">${cardData.fontSize || 26}px</span>
                </div>
                <div class="input-group">
                    <label>প্রতিবেদকের নাম:</label>
                    <input type="text" id="card-reporter-input" value="${cardData.reporterName || 'পূর্বধলা প্রতিনিধি'}">
                </div>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>৫. বিস্তারিত ট্যাগ বাটন:</label>
                    <select id="card-tag-input">
                        <option value="বিস্তারিত কমেন্টে" ${cardData.detailTag === 'বিস্তারিত কমেন্টে' ? 'selected' : ''}>বিস্তারিত কমেন্টে</option>
                        <option value="বিস্তারিত ক্যাপশনে" ${cardData.detailTag === 'বিস্তারিত ক্যাপশনে' ? 'selected' : ''}>বিস্তারিত ক্যাপশনে</option>
                        <option value="বিস্তারিত ওয়েবসাইটে" ${cardData.detailTag === 'বিস্তারিত ওয়েবসাইটে' ? 'selected' : ''}>বিস্তারিত ওয়েবসাইটে</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>ওয়েবসাইট লিংক:</label>
                    <input type="text" id="card-web-input" value="${cardData.websiteUrl || 'www.pdonline.com.bd'}">
                </div>
            </div>

            <button class="btn-download" id="btn-download-card"><i class="fas fa-download"></i> ফটোকার্ড ডাউনলোড করুন (PNG)</button>
        </div>

        <div class="preview-container">
            <div id="photocard">
                <div class="main-img-container">
                    <img id="card-blur-bg" class="card-blur-bg" src="${initialCardImg}">
                    <img id="card-fg-img" class="main-img" src="${initialCardImg}">
                </div>
                
                <div class="fixed-top-bar" id="card-top-bar"></div>
                <div class="content-bg-mask"></div>

                <div class="header-box">
                    <div class="brand-section">
                        <div class="logo-box">
                            <img id="card-logo" src="${initialLogoImg}" style="${initialLogoImg ? '' : 'display:none;'}">
                        </div>
                        <div class="brand-text" id="brand-text" style="${initialLogoImg ? 'display:none;' : ''}">পূর্বধলার দর্পণ</div>
                    </div>
                    <div class="category-badge" id="out-category">${cardData.category || 'পূর্বধলা'}</div>
                    <div class="date-box">
                        <div class="day-name" id="out-day">রবিবার</div>
                        <div id="out-eng" class="eng-date">০২ আগস্ট ২০২৬</div>
                        <div id="out-bng" class="bng-date">১৮ শ্রাবণ ১৪৩৩</div>
                    </div>
                </div>

                <div class="content-area">
                    <div class="title-wrapper" id="card-title-wrapper">
                        <div id="out-title">${cardData.headline || 'এখানে আপনার প্রধান আকর্ষণীয় শিরোনামটি লিখুন...'}</div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="detail-btn" id="out-tag">${cardData.detailTag || 'বিস্তারিত কমেন্টে'}</div>
                        <div class="reporter-badge" id="out-reporter-box">
                            <i class="fas fa-user-edit"></i>
                            <span id="out-reporter">${cardData.reporterName || 'পূর্বধলা প্রতিনিধি'}</span>
                        </div>
                    </div>
                </div>

                <div class="footer-bar" id="card-footer-bar">
                    <div class="footer-item"><i class="fab fa-facebook"></i> <span id="out-fb">${cardData.fbHandle || '@purbadhala'}</span></div>
                    <div class="footer-item"><i class="fab fa-youtube"></i> <span id="out-yt">${cardData.ytHandle || '@purbadhala'}</span></div>
                    <div class="footer-item"><i class="fas fa-globe"></i> <span id="out-web">${cardData.websiteUrl || 'www.pdonline.com.bd'}</span></div>
                </div>
            </div>
        </div>
    </div>


    <!-- ============================================== -->
    <!-- 🎬 YOUTUBE THUMBNAIL SECTION                  -->
    <!-- ============================================== -->
    <div id="section-youtube" class="main-wrapper" style="${activeMode === 'youtube' ? 'display:flex;' : 'display:none;'}">
        <div class="controls">
            <div class="panel-title">
                <span><i class="fab fa-youtube" style="color:#ef4444;"></i> ইউটিউব থাম্বনেইল কাস্টমাইজেশন</span>
                <button class="btn-reset" id="btn-reset-yt"><i class="fas fa-undo"></i> রিসেট</button>
            </div>

            <!-- YouTube Presets -->
            <div class="preset-bar">
                <div class="preset-title"><i class="fas fa-bolt"></i> ইউটিউব থাম্বনেইল টেমপ্লেট:</div>
                <div class="preset-btns">
                    <button class="preset-btn" data-yt-preset="live">🔴 লাইভ বুলেটিন</button>
                    <button class="preset-btn" data-yt-preset="talkshow">🎙️ বিশেষ টকশো</button>
                    <button class="preset-btn" data-yt-preset="investigation">🔍 অনুসন্ধানী</button>
                    <button class="preset-btn" data-yt-preset="sports">🏆 খেলাধুলার খবর</button>
                </div>
            </div>

            <div class="input-group">
                <label>১. থাম্বনেইল ব্যাকগ্রাউন্ড ছবি আপলোড:</label>
                <input type="file" id="input-yt-img" accept="image/*">
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>ছবি জুম (Zoom):</label>
                    <input type="range" min="0.5" max="3" step="0.05" value="${ytData.zoom || 1}" class="slider slider-amber" id="ytZoom">
                    <span id="ytZoomDisplay" style="font-size:11px; color:#f59e0b; display:block; margin-top:2px;">100%</span>
                </div>
                <div class="input-group">
                    <label>উপরে-নিচে (PosY):</label>
                    <input type="range" min="-200" max="200" value="${ytData.posY || 0}" class="slider slider-emerald" id="ytPosY">
                    <span id="ytPosYDisplay" style="font-size:11px; color:#10b981; display:block; margin-top:2px;">0px</span>
                </div>
            </div>

            <div class="input-group">
                <label>২. আকর্ষনীয় ভিডিও শিরোনাম:</label>
                <textarea id="yt-title-input" rows="3">${ytData.headline || 'এখানে ইউটিউব ভিডিওর আকর্ষণীয় শিরোনাম লিখুন...'}</textarea>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>৩. হাইলাইট শব্দ/বাক্যাংশ:</label>
                    <input type="text" id="yt-highlight-input" value="${ytData.highlightWord || 'সরাসরি'}" placeholder="যেমন: সরাসরি">
                </div>
                <div class="input-group">
                    <label>হাইলাইট রঙ:</label>
                    <input type="color" id="yt-highlight-bg" value="${ytData.highlightBg || '#facc15'}" style="height:38px; cursor:pointer;">
                </div>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>৪. ব্যাজ টেক্সট (Category):</label>
                    <input type="text" id="yt-badge-input" value="${ytData.badgeText || '🔴 সরাসরি'}">
                </div>
                <div class="input-group">
                    <label>ব্যাজ ব্যাকগ্রাউন্ড:</label>
                    <input type="color" id="yt-badge-bg" value="${ytData.badgeBg || '#dc2626'}" style="height:38px; cursor:pointer;">
                </div>
            </div>

            <div class="input-group">
                <label>৫. সাবটাইটেল/বিষয়বস্তু পিল (ঐচ্ছিক):</label>
                <input type="text" id="yt-subtitle-input" value="${ytData.subTitle || 'বিশেষ নিউজ বুলেটিন'}" placeholder="যেমন: বিশেষ টকশো">
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>ক্যানভাস সাইজ (Aspect Ratio):</label>
                    <select id="yt-aspect-select" onchange="syncYt()">
                        <option value="16:9" ${ytData.aspectRatio === '16:9' ? 'selected' : ''}>১৬:৯ (1280x720 HD)</option>
                        <option value="9:16" ${ytData.aspectRatio === '9:16' ? 'selected' : ''}>৯:১৬ (1080x1920 Shorts/Reels/TikTok)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>সোশ্যাল মিডিয়া প্ল্যাটফর্ম:</label>
                    <select id="yt-platform-select" onchange="syncYt()">
                        <option value="youtube" ${ytData.targetPlatform === 'youtube' ? 'selected' : ''}>🔴 ইউটিউব (YouTube)</option>
                        <option value="facebook" ${ytData.targetPlatform === 'facebook' ? 'selected' : ''}>🔵 ফেসবুক (Facebook)</option>
                        <option value="tiktok" ${ytData.targetPlatform === 'tiktok' ? 'selected' : ''}>🎵 টিকটক (TikTok)</option>
                        <option value="all" ${ytData.targetPlatform === 'all' ? 'selected' : ''}>🌐 সবগুলো (Social)</option>
                    </select>
                </div>
            </div>

            <div class="row-grid">
                <div class="input-group">
                    <label>চ্যানেল হ্যাশট্যাগ/ইউজারনেম:</label>
                    <input type="text" id="yt-handle-input" value="${ytData.ytHandle || 'YouTube / @purbadhala'}">
                </div>
                <div class="input-group">
                    <label>ফন্ট সাইজ:</label>
                    <input type="range" min="18" max="42" value="${ytData.fontSize || 28}" class="slider" id="ytFontSize">
                    <span id="ytFontDisplay" style="font-size:11px; color:#38bdf8; display:block; margin-top:2px;">${ytData.fontSize || 28}px</span>
                </div>
            </div>

            <button class="btn-download" id="btn-download-yt"><i class="fas fa-download"></i> থাম্বনেইল ডাউনলোড (PNG)</button>
        </div>

        <div class="preview-container">
            <div id="ytcard">
                <div class="main-img-container">
                    <img id="yt-fg-img" class="main-img" src="${initialYtImg}">
                </div>

                <div class="yt-mask-gradient"></div>

                <div class="yt-top-bar">
                    <div class="yt-badge-logo">
                        <div style="width:22px; height:22px; border-radius:4px; background:linear-gradient(135deg, #dc2626, #f59e0b); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-size:11px;">দ</div>
                        <span style="font-weight:800; font-size:13px; color:#ffffff;" id="yt-channel-name">${ytData.channelName || 'পূর্বধলার দর্পণ'}</span>
                        <span style="font-size:9px; font-weight:800; color:#facc15; background:rgba(245,158,11,0.2); padding:1px 5px; border-radius:3px; border:1px solid rgba(245,158,11,0.3);">HD</span>
                    </div>

                    <div style="display:flex; align-items:center; gap:8px;">
                        <div id="yt-live-dot" style="display:flex; align-items:center; gap:6px; background:#dc2626; color:#fff; font-weight:800; font-size:11px; padding:4px 10px; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.4);">
                            <span style="width:8px; height:8px; border-radius:50%; background:#fff;"></span>
                            <span>LIVE</span>
                        </div>
                        <div id="yt-badge-display" style="background:${ytData.badgeBg || '#dc2626'}; color:${ytData.badgeTextColor || '#ffffff'}; padding:4px 12px; border-radius:6px; font-weight:800; font-size:11px; text-transform:uppercase; box-shadow:0 2px 8px rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.2);">
                            ${ytData.badgeText || '🔴 সরাসরি'}
                        </div>
                    </div>
                </div>

                <div class="yt-content-area">
                    <div id="yt-subtitle-pill" class="yt-subtitle-pill" style="${ytData.subTitle ? 'display:inline-flex;' : 'display:none;'}">
                        <span id="yt-subtitle-text">${ytData.subTitle || 'বিশেষ নিউজ বুলেটিন'}</span>
                    </div>

                    <div id="yt-headline-display" class="yt-headline-box" style="font-size:${ytData.fontSize || 28}px;">
                        ${ytData.headline || ''}
                    </div>
                </div>

                <div class="yt-watermark">
                    <div id="yt-platform-icon" style="min-width:24px; height:18px; padding:0 6px; background:#dc2626; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:bold;">▶</div>
                    <span style="font-weight:800; font-size:12px; color:#ffffff; text-shadow:0 2px 4px rgba(0,0,0,0.8);" id="yt-handle-display">${ytData.ytHandle || 'YouTube / @purbadhala'}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================== -->
    <!-- ⚙️ CLIENT JAVASCRIPT                           -->
    <!-- ============================================== -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            try {
                initApp();
            } catch (err) {
                console.error('App init error:', err);
            }
        });

        function initApp() {
            // Mode switching
            var tabPhotocard = document.getElementById('tab-btn-photocard');
            var tabYoutube = document.getElementById('tab-btn-youtube');
            if (tabPhotocard) tabPhotocard.addEventListener('click', function() { switchMode('photocard'); });
            if (tabYoutube) tabYoutube.addEventListener('click', function() { switchMode('youtube'); });

            // Date setup
            updateDate();

            // Photocard inputs binding
            bindEvent('card-theme', 'change', function(e) { changeCardTheme(e.target.value); });
            bindEvent('card-aspect-ratio', 'change', function(e) { changeCardAspectRatio(e.target.value); });
            bindEvent('input-card-logo', 'change', loadCardLogo);
            bindEvent('input-card-img', 'change', loadCardImg);

            bindEvent('cardZoom', 'input', updateCardImgTransform);
            bindEvent('cardPosY', 'input', updateCardImgTransform);
            bindEvent('cardPosX', 'input', updateCardImgTransform);
            bindEvent('cardRot', 'input', updateCardImgTransform);
            bindEvent('card-img-fit', 'change', updateCardImgTransform);

            bindEvent('card-title-input', 'input', syncCard);
            bindEvent('card-category-select', 'change', syncCard);
            bindEvent('card-badge-color', 'input', syncCard);
            bindEvent('card-badge-color', 'change', syncCard);
            bindEvent('card-fontSize', 'input', syncCard);
            bindEvent('card-reporter-input', 'input', syncCard);
            bindEvent('card-tag-input', 'change', syncCard);
            bindEvent('card-web-input', 'input', syncCard);

            bindEvent('btn-reset-card', 'click', resetCardTransforms);
            bindEvent('btn-download-card', 'click', downloadPhotoCard);

            // Photocard preset buttons
            var cardPresets = document.querySelectorAll('[data-card-preset]');
            for (var i = 0; i < cardPresets.length; i++) {
                cardPresets[i].addEventListener('click', function() {
                    applyCardPreset(this.getAttribute('data-card-preset'));
                });
            }

            // YouTube inputs binding
            bindEvent('input-yt-img', 'change', loadYtImg);
            bindEvent('ytZoom', 'input', updateYtImgTransform);
            bindEvent('ytPosY', 'input', updateYtImgTransform);

            bindEvent('yt-title-input', 'input', syncYt);
            bindEvent('yt-highlight-input', 'input', syncYt);
            bindEvent('yt-highlight-bg', 'input', syncYt);
            bindEvent('yt-badge-input', 'input', syncYt);
            bindEvent('yt-badge-bg', 'input', syncYt);
            bindEvent('yt-subtitle-input', 'input', syncYt);
            bindEvent('ytFontSize', 'input', syncYt);
            bindEvent('yt-handle-input', 'input', syncYt);

            bindEvent('btn-reset-yt', 'click', resetYtTransforms);
            bindEvent('btn-download-yt', 'click', downloadYouTubeThumbnail);

            // YouTube preset buttons
            var ytPresets = document.querySelectorAll('[data-yt-preset]');
            for (var j = 0; j < ytPresets.length; j++) {
                ytPresets[j].addEventListener('click', function() {
                    applyYtPreset(this.getAttribute('data-yt-preset'));
                });
            }

            // Initial sync
            syncCard();
            syncYt();
            checkSavedLogo();
        }

        function bindEvent(id, evt, fn) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener(evt, fn);
            }
        }

        function switchMode(mode) {
            var pSec = document.getElementById('section-photocard');
            var ySec = document.getElementById('section-youtube');
            var pBtn = document.getElementById('tab-btn-photocard');
            var yBtn = document.getElementById('tab-btn-youtube');

            if (pSec) pSec.style.display = (mode === 'photocard') ? 'flex' : 'none';
            if (ySec) ySec.style.display = (mode === 'youtube') ? 'flex' : 'none';

            if (pBtn) pBtn.className = 'tab-btn ' + (mode === 'photocard' ? 'active' : '');
            if (yBtn) yBtn.className = 'tab-btn ' + (mode === 'youtube' ? 'active' : '');
        }

        /* Date Updater */
        function updateDate() {
            var today = new Date();
            var days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
            var dayEl = document.getElementById('out-day');
            if (dayEl) dayEl.innerText = days[today.getDay()];

            var bngNum = function(n) {
                return n.toString().split('').map(function(d) {
                    return "০১২৩৪৫৬৭৮৯"[d] || d;
                }).join('');
            };

            var months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
            var engEl = document.getElementById('out-eng');
            if (engEl) {
                engEl.innerText = bngNum(today.getDate()) + ' ' + months[today.getMonth()] + ' ' + bngNum(today.getFullYear());
            }

            var bngDay = today.getDate() + 17; 
            var bngMonth = "শ্রাবণ";
            var bngYear = 1433;
            var bngEl = document.getElementById('out-bng');
            if (bngEl) {
                bngEl.innerText = bngNum(bngDay) + ' ' + bngMonth + ' ' + bngNum(bngYear);
            }
        }

        /* 📰 PhotoCard Sync */
        function syncCard() {
            var titleInput = document.getElementById('card-title-input');
            var titleOut = document.getElementById('out-title');
            if (titleInput && titleOut) {
                titleOut.innerText = titleInput.value;
            }

            var catSelect = document.getElementById('card-category-select');
            var catOut = document.getElementById('out-category');
            if (catSelect && catOut) {
                catOut.innerText = catSelect.value;
            }

            var bgPicker = document.getElementById('card-badge-color');
            if (bgPicker && catOut) {
                catOut.style.backgroundColor = bgPicker.value;
            }

            var fontSlider = document.getElementById('cardFontSize');
            var fontDisp = document.getElementById('cardFontDisplay');
            if (fontSlider && titleOut) {
                titleOut.style.fontSize = fontSlider.value + 'px';
                if (fontDisp) fontDisp.innerText = fontSlider.value + 'px';
            }

            var reporterInp = document.getElementById('card-reporter-input');
            var reporterOut = document.getElementById('out-reporter');
            if (reporterInp && reporterOut) {
                reporterOut.innerText = reporterInp.value;
            }

            var tagInput = document.getElementById('card-tag-input');
            var tagOut = document.getElementById('out-tag');
            if (tagInput && tagOut) {
                tagOut.innerText = tagInput.value;
            }

            var webInp = document.getElementById('card-web-input');
            var webOut = document.getElementById('out-web');
            if (webInp && webOut) {
                webOut.innerText = webInp.value;
            }
        }

        function changeCardAspectRatio(ratio) {
            var card = document.getElementById('photocard');
            if (card) {
                card.style.height = (ratio === '4:5') ? '675px' : '540px';
            }
        }

        function updateCardImgTransform() {
            var zoomEl = document.getElementById('cardZoom');
            var posYEl = document.getElementById('cardPosY');
            var posXEl = document.getElementById('cardPosX');
            var rotEl = document.getElementById('cardRot');
            var fitEl = document.getElementById('card-img-fit');

            var zoomVal = zoomEl ? zoomEl.value : 1;
            var posYVal = posYEl ? posYEl.value : 0;
            var posXVal = posXEl ? posXEl.value : 0;
            var rotVal = rotEl ? rotEl.value : 0;
            var fitVal = fitEl ? fitEl.value : 'contain';

            var img = document.getElementById('card-fg-img');
            var blurBg = document.getElementById('card-blur-bg');

            if (img) {
                img.style.transform = 'translate(' + posXVal + 'px, ' + posYVal + 'px) scale(' + zoomVal + ') rotate(' + rotVal + 'deg)';
                img.style.objectFit = fitVal;
            }

            if (blurBg) {
                blurBg.style.display = (fitVal === 'contain') ? 'block' : 'none';
            }

            var zoomDisp = document.getElementById('cardZoomDisplay');
            if (zoomDisp) zoomDisp.innerText = Math.round(zoomVal * 100) + '%';

            var posYDisp = document.getElementById('cardPosYDisplay');
            if (posYDisp) posYDisp.innerText = posYVal + 'px';

            var posXDisp = document.getElementById('cardPosXDisplay');
            if (posXDisp) posXDisp.innerText = posXVal + 'px';

            var rotDisp = document.getElementById('cardRotDisplay');
            if (rotDisp) rotDisp.innerText = rotVal + '°';
        }

        function resetCardTransforms() {
            var z = document.getElementById('cardZoom'); if (z) z.value = 1;
            var py = document.getElementById('cardPosY'); if (py) py.value = 0;
            var px = document.getElementById('cardPosX'); if (px) px.value = 0;
            var r = document.getElementById('cardRot'); if (r) r.value = 0;
            var fit = document.getElementById('card-img-fit'); if (fit) fit.value = 'contain';
            updateCardImgTransform();
        }

        function changeCardTheme(themeId) {
            var topBar = document.getElementById('card-top-bar');
            var footerBar = document.getElementById('card-footer-bar');
            var titleWrap = document.getElementById('card-title-wrapper');
            if (!topBar || !footerBar) return;
            
            if (themeId === 'breaking_red') {
                topBar.style.background = 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)';
                topBar.style.borderBottom = '3.5px solid #facc15';
                footerBar.style.background = '#991b1b';
                if (titleWrap) titleWrap.style.borderLeftColor = '#facc15';
                var items = footerBar.querySelectorAll('.footer-item');
                for (var i = 0; i < items.length; i++) { items[i].style.color = '#ffffff'; }
            } else if (themeId === 'emerald_green') {
                topBar.style.background = 'linear-gradient(180deg, #065f46 0%, #022c22 100%)';
                topBar.style.borderBottom = '3.5px solid #f59e0b';
                footerBar.style.background = '#022c22';
                if (titleWrap) titleWrap.style.borderLeftColor = '#34d399';
                var items2 = footerBar.querySelectorAll('.footer-item');
                for (var j = 0; j < items2.length; j++) { items2[j].style.color = '#34d399'; }
            } else if (themeId === 'dark_navy') {
                topBar.style.background = 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)';
                topBar.style.borderBottom = '3.5px solid #38bdf8';
                footerBar.style.background = '#1e293b';
                if (titleWrap) titleWrap.style.borderLeftColor = '#38bdf8';
                var items3 = footerBar.querySelectorAll('.footer-item');
                for (var k = 0; k < items3.length; k++) { items3[k].style.color = '#38bdf8'; }
            } else { // royal_blue
                topBar.style.background = 'linear-gradient(180deg, #1e3a8a 0%, #172554 100%)';
                topBar.style.borderBottom = '3.5px solid #f59e0b';
                footerBar.style.background = '#f59e0b';
                if (titleWrap) titleWrap.style.borderLeftColor = '#e50914';
                var items4 = footerBar.querySelectorAll('.footer-item');
                for (var l = 0; l < items4.length; l++) { items4[l].style.color = '#1e293b'; }
            }
        }

        function applyCardPreset(presetType) {
            var titleInp = document.getElementById('card-title-input');
            var catSel = document.getElementById('card-category-select');
            var themeSel = document.getElementById('card-theme');
            var badgeCol = document.getElementById('card-badge-color');

            if (presetType === 'breaking') {
                if (titleInp) titleInp.value = 'জরুরি জরুরি! পূর্বধলায় রাতারাতি বড় ধরনের উন্নয়ন প্রকল্প অনুমোদন';
                if (catSel) catSel.value = 'ব্রেকিং নিউজ';
                if (themeSel) { themeSel.value = 'breaking_red'; changeCardTheme('breaking_red'); }
                if (badgeCol) badgeCol.value = '#dc2626';
            } else if (presetType === 'special') {
                if (titleInp) titleInp.value = 'পূর্বধলার ঐতিহ্যবাহী লোকজ মেলায় হাজারো দর্শনার্থীর ঢল';
                if (catSel) catSel.value = 'বিশেষ সংবাদ';
                if (themeSel) { themeSel.value = 'royal_blue'; changeCardTheme('royal_blue'); }
                if (badgeCol) badgeCol.value = '#e50914';
            } else if (presetType === 'sports') {
                if (titleInp) titleInp.value = 'পূর্বধলা মিনি স্টেডিয়ামে জমজমাট ফুটবল ফাইনাল অনুষ্ঠিত';
                if (catSel) catSel.value = 'খেলাধুলা';
                if (themeSel) { themeSel.value = 'emerald_green'; changeCardTheme('emerald_green'); }
                if (badgeCol) badgeCol.value = '#059669';
            } else if (presetType === 'politics') {
                if (titleInp) titleInp.value = 'জনসাধারণের পাশে থাকার প্রতিশ্রুতি ব্যক্ত করলেন উপজেলা স্থানীয় নেতৃবৃন্দ';
                if (catSel) catSel.value = 'রাজনীতি';
                if (themeSel) { themeSel.value = 'dark_navy'; changeCardTheme('dark_navy'); }
                if (badgeCol) badgeCol.value = '#0284c7';
            }
            syncCard();
        }

        function checkSavedLogo() {
            try {
                var savedLogo = localStorage.getItem('purbadhala_saved_logo');
                if (savedLogo) {
                    var logoImg = document.getElementById('card-logo');
                    if (logoImg) {
                        logoImg.src = savedLogo;
                        logoImg.style.display = 'block';
                        var brandText = document.getElementById('brand-text');
                        if (brandText) brandText.style.display = 'none';
                    }
                }
            } catch (e) {
                console.log('LocalStorage unavailable');
            }
        }

        function loadCardLogo(e) { 
            if (!e.target || !e.target.files || !e.target.files[0]) return;
            var reader = new FileReader();
            reader.onload = function() {
                try { localStorage.setItem('purbadhala_saved_logo', reader.result); } catch(err){}
                var logoImg = document.getElementById('card-logo');
                if (logoImg) {
                    logoImg.src = reader.result;
                    logoImg.style.display = 'block';
                }
                var brandText = document.getElementById('brand-text');
                if (brandText) brandText.style.display = 'none';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        
        function loadCardImg(e) { 
            if (!e.target || !e.target.files || !e.target.files[0]) return;
            var reader = new FileReader();
            reader.onload = function() {
                var img = document.getElementById('card-fg-img');
                var blurBg = document.getElementById('card-blur-bg');
                if (img) img.src = reader.result; 
                if (blurBg) blurBg.src = reader.result;
                resetCardTransforms();
            };
            reader.readAsDataURL(e.target.files[0]);
        }

        function downloadPhotoCard() {
            var card = document.getElementById('photocard');
            if (!card) return;

            var h2c = (typeof html2canvasPro !== 'undefined') ? html2canvasPro : ((typeof html2canvas !== 'undefined') ? html2canvas : null);

            if (h2c) {
                h2c(card, { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    width: card.offsetWidth,
                    height: card.offsetHeight
                }).then(function(canvas) {
                    saveCanvasImage(canvas, 'Purbadhala_PhotoCard_');
                }).catch(function(err) {
                    console.error('html2canvas failed:', err);
                    alert('ছবি ডাউনলোড করতে সমস্যা হয়েছে।');
                });
            } else {
                alert('html2canvas লাইব্রেরি লোড হয়নি।');
            }
        }

        /* 🎬 YouTube Thumbnail Sync */
        function syncYt() {
            var titleInp = document.getElementById('yt-title-input');
            var headlineText = titleInp ? titleInp.value : '';

            var hlInp = document.getElementById('yt-highlight-input');
            var highlightWord = hlInp ? hlInp.value.trim() : '';

            var hlBgInp = document.getElementById('yt-highlight-bg');
            var highlightBg = hlBgInp ? hlBgInp.value : '#facc15';

            var badgeInp = document.getElementById('yt-badge-input');
            var badgeText = badgeInp ? badgeInp.value : '';

            var badgeBgInp = document.getElementById('yt-badge-bg');
            var badgeBg = badgeBgInp ? badgeBgInp.value : '#dc2626';

            var subInp = document.getElementById('yt-subtitle-input');
            var subtitleText = subInp ? subInp.value : '';

            var fontInp = document.getElementById('ytFontSize');
            var fontDisp = document.getElementById('ytFontDisplay');

            var handleInp = document.getElementById('yt-handle-input');
            var handleText = handleInp ? handleInp.value : '';

            var headlineContainer = document.getElementById('yt-headline-display');
            if (headlineContainer) {
                if (fontInp) {
                    headlineContainer.style.fontSize = fontInp.value + 'px';
                    if (fontDisp) fontDisp.innerText = fontInp.value + 'px';
                }

                if (!highlightWord) {
                    headlineContainer.innerText = headlineText;
                } else {
                    var terms = highlightWord.split(/[,|\n]+/).map(function(s) { return s.trim(); }).filter(Boolean);
                    if (terms.length === 0) {
                        headlineContainer.innerText = headlineText;
                    } else {
                        var html = headlineText;
                        for (var t = 0; t < terms.length; t++) {
                            var term = terms[t];
                            if (term) {
                                var pill = '<span class="yt-highlight-pill" style="background-color: ' + highlightBg + '; color: #020617;">' + term + '</span>';
                                html = html.split(term).join(pill);
                            }
                        }
                        headlineContainer.innerHTML = html;
                    }
                }
            }

            var badgeDisplay = document.getElementById('yt-badge-display');
            if (badgeDisplay) {
                badgeDisplay.innerText = badgeText;
                badgeDisplay.style.backgroundColor = badgeBg;
            }

            var subPill = document.getElementById('yt-subtitle-pill');
            var subSpan = document.getElementById('yt-subtitle-text');
            if (subPill && subSpan) {
                if (subtitleText.trim()) {
                    subSpan.innerText = subtitleText;
                    subPill.style.display = 'inline-flex';
                } else {
                    subPill.style.display = 'none';
                }
            }

            var handleDisplay = document.getElementById('yt-handle-display');
            if (handleDisplay) {
                handleDisplay.innerText = handleText;
            }

            var aspectSel = document.getElementById('yt-aspect-select');
            var aspectVal = aspectSel ? aspectSel.value : '16:9';
            var ytCard = document.getElementById('ytcard');
            if (ytCard) {
                if (aspectVal === '9:16') {
                    ytCard.style.width = '360px';
                    ytCard.style.height = '640px';
                } else {
                    ytCard.style.width = '640px';
                    ytCard.style.height = '360px';
                }
            }

            var platformSel = document.getElementById('yt-platform-select');
            var platformVal = platformSel ? platformSel.value : 'youtube';
            var platformIcon = document.getElementById('yt-platform-icon');
            if (platformIcon) {
                if (platformVal === 'facebook') {
                    platformIcon.style.background = '#1877f2';
                    platformIcon.innerHTML = '<i class="fab fa-facebook-f"></i>';
                } else if (platformVal === 'tiktok') {
                    platformIcon.style.background = '#0f172a';
                    platformIcon.style.border = '1px solid #fe2c55';
                    platformIcon.innerHTML = '<i class="fab fa-tiktok" style="color:#25f4ee;"></i>';
                } else if (platformVal === 'all') {
                    platformIcon.style.background = 'linear-gradient(135deg, #1877f2, #dc2626, #fe2c55)';
                    platformIcon.style.border = 'none';
                    platformIcon.innerHTML = '<i class="fab fa-youtube"></i> <i class="fab fa-facebook-f"></i> <i class="fab fa-tiktok"></i>';
                } else {
                    platformIcon.style.background = '#dc2626';
                    platformIcon.style.border = 'none';
                    platformIcon.innerHTML = '▶';
                }
            }
        }

        function updateYtImgTransform() {
            var zoomEl = document.getElementById('ytZoom');
            var posEl = document.getElementById('ytPosY');
            var zoomVal = zoomEl ? zoomEl.value : 1;
            var posVal = posEl ? posEl.value : 0;
            var img = document.getElementById('yt-fg-img');
            if (img) {
                img.style.transform = 'translateY(' + posVal + 'px) scale(' + zoomVal + ')';
            }
            var zoomDisp = document.getElementById('ytZoomDisplay');
            if (zoomDisp) zoomDisp.innerText = Math.round(zoomVal * 100) + '%';
            var posDisp = document.getElementById('ytPosYDisplay');
            if (posDisp) posDisp.innerText = posVal + 'px';
        }

        function resetYtTransforms() {
            var z = document.getElementById('ytZoom'); if (z) z.value = 1;
            var py = document.getElementById('ytPosY'); if (py) py.value = 0;
            updateYtImgTransform();
        }

        function applyYtPreset(presetType) {
            var titleInp = document.getElementById('yt-title-input');
            var hlInp = document.getElementById('yt-highlight-input');
            var badgeInp = document.getElementById('yt-badge-input');
            var subInp = document.getElementById('yt-subtitle-input');

            if (presetType === 'live') {
                if (titleInp) titleInp.value = 'পূর্বধলায় ভয়াবহ ঝড় ও নদীভাঙন পরিস্থিতি সরাসরি দেখুন';
                if (hlInp) hlInp.value = 'সরাসরি দেখুন';
                if (badgeInp) badgeInp.value = '🔴 সরাসরি';
                if (subInp) subInp.value = 'বিশেষ বুলেটিন';
            } else if (presetType === 'talkshow') {
                if (titleInp) titleInp.value = 'উপজেলা নির্বাচনের সর্বশেষ সমীকরণ ও নিরপেক্ষ মতামত';
                if (hlInp) hlInp.value = 'সর্বশেষ সমীকরণ';
                if (badgeInp) badgeInp.value = '🎙️ বিশেষ টকশো';
                if (subInp) subInp.value = 'সোজা কথা';
            } else if (presetType === 'investigation') {
                if (titleInp) titleInp.value = 'কী ঘটছে পূর্বধলায়? চাঞ্চল্যকর তথ্যের বিশেষ বিশেষ সাক্ষাৎকার';
                if (hlInp) hlInp.value = 'বিশেষ সাক্ষাৎকার';
                if (badgeInp) badgeInp.value = '🔍 অনুসদ্ধানী প্রতিবেদন';
                if (subInp) subInp.value = 'বিশেষ নজর';
            } else if (presetType === 'sports') {
                if (titleInp) titleInp.value = 'ঐতিহাসিক টুর্নামেন্টে চ্যাম্পিয়ন হলো পূর্বধলা একাদশ';
                if (hlInp) hlInp.value = 'চ্যাম্পিয়ন';
                if (badgeInp) badgeInp.value = '🏆 খেলাধুলার খবর';
                if (subInp) subInp.value = 'ফাইনাল ম্যাচ';
            }
            syncYt();
        }

        function loadYtImg(e) {
            if (!e.target || !e.target.files || !e.target.files[0]) return;
            var reader = new FileReader();
            reader.onload = function() {
                var img = document.getElementById('yt-fg-img');
                if (img) img.src = reader.result;
                resetYtTransforms();
            };
            reader.readAsDataURL(e.target.files[0]);
        }

        function downloadYouTubeThumbnail() {
            var card = document.getElementById('ytcard');
            if (!card) return;

            var h2c = (typeof html2canvasPro !== 'undefined') ? html2canvasPro : ((typeof html2canvas !== 'undefined') ? html2canvas : null);

            if (h2c) {
                h2c(card, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    width: card.offsetWidth,
                    height: card.offsetHeight
                }).then(function(canvas) {
                    saveCanvasImage(canvas, 'Purbadhala_YT_Thumbnail_');
                }).catch(function(err) {
                    console.error('Download error:', err);
                    alert('ছবি ডাউনলোড করতে সমস্যা হয়েছে।');
                });
            } else {
                alert('html2canvas লাইব্রেরি লোড হয়নি।');
            }
        }

        function saveCanvasImage(canvas, prefix) {
            var link = document.createElement('a');
            link.download = prefix + Date.now() + '.png';
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        }
    </script>
</body>
</html>`;
}
