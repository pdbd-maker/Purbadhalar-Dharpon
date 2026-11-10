import { PhotoCardData, YouTubeThumbnailData } from '../types';

export interface GenerateOfflineHtmlOptions {
  cardData: PhotoCardData;
  ytData?: YouTubeThumbnailData;
  activeMode?: 'photocard' | 'youtube';
}

export function generateOfflineHtml(
  input: GenerateOfflineHtmlOptions | PhotoCardData
): string {
  let cardData: PhotoCardData;

  if ('cardData' in input) {
    cardData = input.cardData;
  } else {
    cardData = input as PhotoCardData;
  }

  const isPortrait = cardData.aspectRatio === '4:5';
  const cardHeight = isPortrait ? '675px' : '540px';

  const defaultCardImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="100%" height="100%" fill="%230f172a"/><circle cx="540" cy="540" r="300" fill="%231e293b" opacity="0.6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="32" font-family="sans-serif">পূর্বধলার দর্পণ - ছবি নির্বাচন করুন</text></svg>';

  // Clean initial URLs to avoid broken local blob URLs when opened from file://
  const initialCardImg = (cardData.mainImgUrl && !cardData.mainImgUrl.startsWith('blob:')) ? cardData.mainImgUrl : defaultCardImg;
  const initialLogoImg = (cardData.logoUrl && !cardData.logoUrl.startsWith('blob:')) ? cardData.logoUrl : '';

  return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>পূর্বধলার দর্পণ - অফলাইন ফটোকার্ড জেনারেটর</title>
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
            max-width: 100%; 
            max-height: 100%; 
            width: auto; 
            height: auto; 
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
    </style>
</head>
<body>

    <div class="header-title">
        <h1>পূর্বধলার দর্পণ - অফলাইন ফটোকার্ড জেনারেটর</h1>
        <p>প্রেস কোয়ালিটি ফেসবুক সংবাদ ও মতামত ফটোকার্ড তৈরি করুন</p>
    </div>

    <!-- ============================================== -->
    <!-- 📰 PHOTO CARD SECTION                          -->
    <!-- ============================================== -->
    <div id="section-photocard" class="main-wrapper" style="display:flex;">
        <div class="controls">
            <div class="panel-title">
                <span><i class="fas fa-sliders-h"></i> ফটোকার্ড কাস্টমাইজেশন</span>
                <button class="btn-reset" id="btn-reset-card"><i class="fas fa-undo"></i> রিসেট</button>
            </div>

            <!-- Quick Presets (Exactly 2 Presets) -->
            <div class="preset-bar">
                <div class="preset-title"><i class="fas fa-bolt"></i> দ্রুত রেডিমেড টেমপ্লেট:</div>
                <div class="preset-btns" style="grid-template-columns:1fr 1fr;">
                    <button class="preset-btn" data-card-preset="general">📰 ১. সাধারণ সংবাদ</button>
                    <button class="preset-btn" data-card-preset="opinion">✍️ ১.১ মতামত ও কলাম</button>
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
                    <label>ছবি ডিসপ্লে মোড:</label>
                    <select id="card-img-fit">
                        <option value="contain" selected>🖼️ পুরো ছবি (অটো ক্রপ ছাড়া)</option>
                    </select>
                </div>
            </div>

            <!-- 🪄 MAGIC PHOTO LIGHT & CLARITY FIXER TOOL -->
            <div style="background:linear-gradient(135deg, rgba(245,158,11,0.15), rgba(16,185,129,0.15)); border:1.5px solid #f59e0b; border-radius:12px; padding:12px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:12px; font-weight:800; color:#fbbf24; display:flex; align-items:center; gap:6px;">
                        <i class="fas fa-wand-magic-sparkles"></i> ম্যাজিক ফটো ও আলো ফিক্সার টুল
                    </span>
                    <span id="magic-card-badge" style="font-size:9px; background:#10b981; color:#020617; font-weight:900; padding:2px 6px; border-radius:10px;">AUTO FIX</span>
                </div>
                <p style="font-size:10px; color:#cbd5e1; margin-bottom:8px; line-height:1.4;">
                    কোনো বিকৃতি ছাড়াই ছবির অন্ধকার আলো, কন্ট্রাস্ট ও স্পষ্টতা স্বয়ংক্রিয়ভাবে ঠিক করুন:
                </p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
                    <button type="button" id="btn-card-magic-light" style="background:#f59e0b; color:#020617; font-weight:800; border:none; border-radius:8px; padding:8px 6px; font-size:11px; cursor:pointer;">
                        <i class="fas fa-sun"></i> ১-ক্লিক আলো ফিক্স
                    </button>
                    <button type="button" id="btn-card-magic-hd" style="background:#10b981; color:#ffffff; font-weight:800; border:none; border-radius:8px; padding:8px 6px; font-size:11px; cursor:pointer;">
                        <i class="fas fa-sparkles"></i> এইচডি পিক্সেল ফিক্স
                    </button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:4px;">
                    <button type="button" class="btn-filter-preset" data-b="125" data-c="115" data-s="115" style="background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:6px; padding:4px 2px; font-size:9px; cursor:pointer; font-weight:bold;">🌑 ডার্ক ফিক্স</button>
                    <button type="button" class="btn-filter-preset" data-b="95" data-c="118" data-s="110" style="background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:6px; padding:4px 2px; font-size:9px; cursor:pointer; font-weight:bold;">☀️ ওভার-লাইট</button>
                    <button type="button" class="btn-filter-preset" data-b="110" data-c="114" data-s="125" style="background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:6px; padding:4px 2px; font-size:9px; cursor:pointer; font-weight:bold;">🎨 প্রাণবন্ত</button>
                    <button type="button" class="btn-filter-preset" data-b="100" data-c="100" data-s="100" style="background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:6px; padding:4px 2px; font-size:9px; cursor:pointer; font-weight:bold;">🔄 সাধারণ</button>
                </div>
                <div id="card-magic-status" style="display:none; margin-top:6px; font-size:10px; color:#fbbf24; background:rgba(15,23,42,0.8); padding:4px 8px; border-radius:4px;"></div>
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
                    <label>তারিখ নির্বাচন:</label>
                    <input type="date" id="card-date-input" style="color-scheme: dark; cursor:pointer;">
                </div>
                <div class="input-group">
                    <label>ফন্ট সাইজ:</label>
                    <input type="range" min="18" max="42" value="${cardData.fontSize || 26}" class="slider" id="cardFontSize">
                    <span id="cardFontDisplay" style="font-size:11px; color:#38bdf8; display:block; margin-top:2px;">${cardData.fontSize || 26}px</span>
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
                    <div class="date-box">
                        <div class="day-name" id="out-day">মঙ্গলবার</div>
                        <div id="out-eng" class="eng-date">০১ সেপ্টেম্বর ২০২৬</div>
                        <div id="out-bng" class="bng-date">১৭ ভাদ্র ১৪৩৩ বঙ্গাব্দ</div>
                    </div>
                </div>

                <div class="content-area">
                    <div class="title-wrapper" id="card-title-wrapper">
                        <div id="out-title">${cardData.headline || 'এখানে আপনার প্রধান আকর্ষণীয় শিরোনামটি লিখুন...'}</div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="detail-btn" id="out-tag">${cardData.detailTag || 'বিস্তারিত কমেন্টে'}</div>
                    </div>
                </div>

                <div class="footer-bar" id="card-footer-bar">
                    <div class="footer-item"><i class="fab fa-facebook"></i> <span id="out-fb">${cardData.fbHandle || '@purbadhala'}</span></div>
                    <div class="footer-item"><i class="fas fa-globe"></i> <span id="out-web">${cardData.websiteUrl || 'www.pdonline.com.bd'}</span></div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================== -->
    <!-- ⚙️ CLIENT JAVASCRIPT                           -->
    <!-- ============================================== -->

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
            bindEvent('card-date-input', 'change', syncCard);
            bindEvent('cardFontSize', 'input', syncCard);
            bindEvent('card-tag-input', 'change', syncCard);
            bindEvent('card-web-input', 'input', syncCard);

            bindEvent('btn-reset-card', 'click', resetCardTransforms);
            bindEvent('btn-download-card', 'click', downloadPhotoCard);

            // Magic light & clarity buttons
            bindEvent('btn-card-magic-light', 'click', analyzeAndFixCardLighting);
            bindEvent('btn-card-magic-hd', 'click', enhanceCardPixelLevel);

            var filterPresetBtns = document.querySelectorAll('.btn-filter-preset');
            for (var fp = 0; fp < filterPresetBtns.length; fp++) {
                filterPresetBtns[fp].addEventListener('click', function() {
                    var b = parseInt(this.getAttribute('data-b'), 10) || 100;
                    var c = parseInt(this.getAttribute('data-c'), 10) || 100;
                    var s = parseInt(this.getAttribute('data-s'), 10) || 100;
                    applyCardImageFilters(b, c, s);
                });
            }

            // Photocard preset buttons (General and Opinion)
            var cardPresets = document.querySelectorAll('[data-card-preset]');
            for (var i = 0; i < cardPresets.length; i++) {
                cardPresets[i].addEventListener('click', function() {
                    applyCardPreset(this.getAttribute('data-card-preset'));
                });
            }

            // Initial sync
            syncCard();
            checkSavedLogo();
        }

        function bindEvent(id, evt, fn) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener(evt, fn);
            }
        }

        /* Bengali Calendar Converter (Bangla Academy Revised Standard 2019) */
        function toBngNum(n) {
            return String(n).split('').map(function(d) {
                return "০১২৩৪৫৬৭৮৯"[d] || d;
            }).join('');
        }

        function isGregorianLeapYear(year) {
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }

        function getBengaliEraDate(gregorianDate) {
            var gYear = gregorianDate.getFullYear();
            var gMonth = gregorianDate.getMonth();
            var gDay = gregorianDate.getDate();

            var bMonthNames = [
                'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
                'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
            ];

            var isLeap = isGregorianLeapYear(gYear);
            var bMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeap ? 31 : 30, 30];

            var startYear = (gMonth < 3 || (gMonth === 3 && gDay < 14)) ? gYear - 1 : gYear;
            var startLeap = isGregorianLeapYear(startYear);
            var currentMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, startLeap ? 31 : 30, 30];

            var boishakh1 = new Date(startYear, 3, 14, 0, 0, 0);
            var currentTarget = new Date(gYear, gMonth, gDay, 0, 0, 0);
            var diffMs = currentTarget.getTime() - boishakh1.getTime();
            var dayOffset = Math.round(diffMs / (1000 * 60 * 60 * 24));

            var bYear = startYear - 593;
            var bMonthIdx = 0;
            var bDay = dayOffset + 1;

            for (var i = 0; i < 12; i++) {
                if (bDay <= currentMonthDays[i]) {
                    bMonthIdx = i;
                    break;
                }
                bDay -= currentMonthDays[i];
            }

            return toBngNum(bDay) + ' ' + bMonthNames[bMonthIdx] + ' ' + toBngNum(bYear) + ' বঙ্গাব্দ';
        }

        function getBengaliTime(d) {
            var hours = d.getHours();
            var minutes = d.getMinutes();
            var period = 'রাত';
            if (hours >= 4 && hours < 6) period = 'ভোর';
            else if (hours >= 6 && hours < 12) period = 'সকাল';
            else if (hours >= 12 && hours < 15) period = 'দুপুর';
            else if (hours >= 15 && hours < 18) period = 'বিকাল';
            else if (hours >= 18 && hours < 20) period = 'সন্ধ্যা';
            else period = 'রাত';

            var displayHours = hours % 12;
            if (displayHours === 0) displayHours = 12;
            var hourStr = displayHours < 10 ? '০' + displayHours : String(displayHours);
            var minStr = minutes < 10 ? '০' + minutes : String(minutes);

            return period + ' ' + toBngNum(hourStr) + ':' + toBngNum(minStr);
        }

        /* Date & Time Updater */
        function updateDate(customDateObj) {
            var today = customDateObj || new Date();
            var days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
            var dayEl = document.getElementById('out-day');
            if (dayEl) dayEl.innerText = days[today.getDay()];

            var months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
            var engEl = document.getElementById('out-eng');
            var dayNum = today.getDate();
            var dayStr = dayNum < 10 ? '০' + dayNum : String(dayNum);
            if (engEl) {
                engEl.innerText = toBngNum(dayStr) + ' ' + months[today.getMonth()] + ' ' + toBngNum(today.getFullYear());
            }

            var bngEl = document.getElementById('out-bng');
            if (bngEl) {
                bngEl.innerText = getBengaliEraDate(today);
            }

            var timeEl = document.getElementById('out-time');
            if (timeEl) {
                timeEl.innerText = '🕒 ' + getBengaliTime(today);
            }
        }

        /* 📰 PhotoCard Sync */
        function syncCard() {
            var dateInp = document.getElementById('card-date-input');
            var timeInp = document.getElementById('card-time-input');

            if (dateInp && dateInp.value) {
                var parts = dateInp.value.split('-');
                var curD = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
                if (timeInp && timeInp.value) {
                    var tParts = timeInp.value.split(':');
                    curD.setHours(parseInt(tParts[0], 10), parseInt(tParts[1], 10), 0);
                }
                updateDate(curD);
            }

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
            var themeSel = document.getElementById('card-theme');

            if (presetType === 'general') {
                if (titleInp) titleInp.value = 'পূর্বধলায় নতুন আধুনিক মডেল মসজিদ ও ইসলামিক সাংস্কৃতিক কেন্দ্র উদ্বোধন';
                if (themeSel) { themeSel.value = 'royal_blue'; changeCardTheme('royal_blue'); }
            } else if (presetType === 'opinion') {
                if (titleInp) titleInp.value = 'পূর্বধলার ইতিহাস, ঐতিহ্য ও আগামীর সম্ভাবনাময় উন্নয়ন চিত্র';
                if (themeSel) { themeSel.value = 'dark_navy'; changeCardTheme('dark_navy'); }
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
        
        var currentCardBrightness = 100;
        var currentCardContrast = 100;
        var currentCardSaturate = 100;

        function applyCardImageFilters(b, c, s, statusText) {
            currentCardBrightness = b;
            currentCardContrast = c;
            currentCardSaturate = s;

            var img = document.getElementById('card-fg-img');
            var blurBg = document.getElementById('card-blur-bg');
            var filterStr = 'brightness(' + b + '%) contrast(' + c + '%) saturate(' + s + '%)';

            if (img) img.style.filter = filterStr;
            if (blurBg) blurBg.style.filter = 'brightness(' + Math.round(b * 0.9) + '%) contrast(' + c + '%) blur(16px)';

            var statusEl = document.getElementById('card-magic-status');
            if (statusEl) {
                statusEl.style.display = 'block';
                statusEl.innerHTML = '<i class="fas fa-check-circle" style="color:#10b981;"></i> ' + (statusText || ('উজ্জ্বলতা ' + b + '%, কন্ট্রাস্ট ' + c + '%'));
                setTimeout(function() { statusEl.style.display = 'none'; }, 5000);
            }
        }

        function analyzeAndFixCardLighting() {
            var img = document.getElementById('card-fg-img');
            if (!img || !img.src) return;

            var tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            tempImg.onload = function() {
                try {
                    var canvas = document.createElement('canvas');
                    var sz = 100;
                    canvas.width = sz;
                    canvas.height = sz;
                    var ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.drawImage(tempImg, 0, 0, sz, sz);
                    var imgData = ctx.getImageData(0, 0, sz, sz);
                    var data = imgData.data;

                    var totalLum = 0;
                    var darkCount = 0;
                    var brightCount = 0;
                    var totalPixels = data.length / 4;

                    for (var i = 0; i < data.length; i += 4) {
                        var lum = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
                        totalLum += lum;
                        if (lum < 60) darkCount++;
                        if (lum > 200) brightCount++;
                    }

                    var avgLum = totalLum / totalPixels;
                    var b = 106, c = 112, s = 114;
                    var msg = 'ক্রিস্প এইচডি ও ব্যালেন্সড লাইটিং সেট করা হয়েছে';

                    if (avgLum < 90 || (darkCount / totalPixels) > 0.45) {
                        b = Math.min(135, Math.round(100 + (100 - avgLum) * 0.45));
                        c = 114;
                        s = 115;
                        msg = 'অন্ধকার ছবি উজ্জ্বল ও পরিষ্কার করা হয়েছে';
                    } else if (avgLum > 175 || (brightCount / totalPixels) > 0.4) {
                        b = Math.max(92, Math.round(100 - (avgLum - 160) * 0.3));
                        c = 118;
                        s = 110;
                        msg = 'অতিরিক্ত আলো কমিয়ে ডেপথ ও টেক্সচার বাড়ানো হয়েছে';
                    }

                    applyCardImageFilters(b, c, s, '✨ ' + msg);
                } catch(e) {
                    applyCardImageFilters(112, 112, 114, '✨ ম্যাজিক আলো ফিক্স কার্যকর হয়েছে');
                }
            };
            tempImg.src = img.src;
        }

        function enhanceCardPixelLevel() {
            var img = document.getElementById('card-fg-img');
            if (!img || !img.src) return;

            var statusEl = document.getElementById('card-magic-status');
            if (statusEl) {
                statusEl.style.display = 'block';
                statusEl.innerText = 'পিক্সেল-লেভেল লাইট ও শার্পনেস প্রসেসিং হচ্ছে...';
            }

            var tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            tempImg.onload = function() {
                try {
                    var canvas = document.createElement('canvas');
                    var maxDim = 1600;
                    var w = tempImg.naturalWidth || tempImg.width;
                    var h = tempImg.naturalHeight || tempImg.height;

                    if (w > maxDim || h > maxDim) {
                        if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
                        else { w = Math.round((w * maxDim) / h); h = maxDim; }
                    }

                    canvas.width = w;
                    canvas.height = h;
                    var ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.drawImage(tempImg, 0, 0, w, h);

                    var imgData = ctx.getImageData(0, 0, w, h);
                    var d = imgData.data;

                    for (var i = 0; i < d.length; i += 4) {
                        // S-curve and subtle contrast + saturation boost
                        var r = d[i], g = d[i+1], b = d[i+2];
                        var gray = 0.299 * r + 0.587 * g + 0.114 * b;
                        d[i] = Math.min(255, Math.max(0, Math.round(gray + 1.12 * (r - gray))));
                        d[i+1] = Math.min(255, Math.max(0, Math.round(gray + 1.12 * (g - gray))));
                        d[i+2] = Math.min(255, Math.max(0, Math.round(gray + 1.12 * (b - gray))));
                    }

                    ctx.putImageData(imgData, 0, 0);
                    var newUrl = canvas.toDataURL('image/jpeg', 0.94);
                    img.src = newUrl;
                    var blurBg = document.getElementById('card-blur-bg');
                    if (blurBg) blurBg.src = newUrl;
                    applyCardImageFilters(100, 100, 100, '🎉 নিখুঁত এইচডি পিক্সেলে রূপান্তরিত হয়েছে!');
                } catch(err) {
                    analyzeAndFixCardLighting();
                }
            };
            tempImg.src = img.src;
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
                // Auto trigger magic lighting fix when photo is uploaded
                setTimeout(analyzeAndFixCardLighting, 100);
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
