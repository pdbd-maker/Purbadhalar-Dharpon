export type AppMode = 'photocard' | 'youtube_thumbnail';

export type AspectRatio = '1:1' | '4:5' | '16:9';

export type ThemeId = 'royal_blue' | 'breaking_red' | 'dark_navy' | 'emerald_green' | 'crimson_gold' | 'cyber_blue';

export type FontFamily = 'SolaimanLipi' | 'Hind Siliguri' | 'Anek Bangla' | 'Noto Serif Bengali';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  topBarGradient: string;
  topBarBorder: string;
  footerBg: string;
  footerTextColor: string;
  accentColor: string;
  titleBorderColor: string;
  defaultBadgeBg: string;
  detailTagBg: string;
  detailTagText: string;
}

export type PhotoCardType = 'news' | 'opinion';
export type OpinionStyle = 'split_editorial' | 'classic_overlay';

export interface PhotoCardData {
  cardType?: PhotoCardType; // 'news' (স্ট্যান্ডার্ড নিউজ) | 'opinion' (মতামত ও কলাম)
  opinionStyle?: OpinionStyle; // 'split_editorial' ('মত-দ্বিমত' স্প্লিট ব্যানার) | 'classic_overlay' (ক্লাসিক ওভারলে)
  showCategory?: boolean; // ক্যাটাগরি / ব্যাজ প্রদর্শন ঐচ্ছিক (true/false)
  // Opinion & Columnist specific fields
  authorName?: string;
  authorDesignation?: string;
  authorImgUrl?: string;
  showAuthorImg?: boolean;
  authorImgSize?: number; // কলামিস্টের ছবির সাইজ (px)
  opinionTopic?: string;
  logoUrl: string;
  logoText: string;
  showLogoText: boolean;
  mainImgUrl: string;
  zoom: number;
  posY: number;
  posX: number;
  rotation: number;
  category: string;
  customCategory: string;
  badgeBgColor: string;
  headline: string;
  fontSize: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  fontFamily: FontFamily;
  reporterName: string;
  showReporter: boolean;
  useCustomDate: boolean;
  customDay: string;
  customEngDate: string;
  customBngDate: string;
  customTime?: string;
  showTime?: boolean;
  selectedDateIso?: string;
  selectedTimeStr?: string;
  detailTag: string;
  showDetailTag: boolean;
  fbHandle: string;
  ytHandle: string;
  websiteUrl: string;
  aspectRatio: AspectRatio;
  imgFit?: 'contain' | 'cover' | 'fill';
  themeId: ThemeId;
  overlayOpacity: number;
  filterBrightness: number;
  filterContrast: number;
  filterSaturate?: number;
  autoEnhanced?: boolean;
}

export interface YouTubeThumbnailData {
  headline: string;
  subTitle: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  highlightWord: string;
  highlightBg: string;
  mainImgUrl: string;
  galleryImages: string[];
  collageStyle: 'auto' | 'split_2' | 'featured_3' | 'grid_4' | 'diagonal_2';
  zoom: number;
  posX: number;
  posY: number;
  rotation: number;
  themeId: ThemeId;
  fontFamily: FontFamily;
  fontSize: number;
  lineHeight: number;
  overlayOpacity: number;
  showPlayIcon: boolean;
  showLiveDot: boolean;
  showChannelLogo: boolean;
  logoUrl: string;
  channelName: string;
  ytHandle: string;
  targetPlatform?: 'youtube' | 'facebook' | 'tiktok' | 'all';
  aspectRatio?: '16:9' | '9:16';
  imgFit?: 'contain' | 'cover' | 'fill';
  layoutStyle: 'bottom_pill' | 'split_badge' | 'left_bar' | 'center_hero' | 'top_banner';
  filterBrightness: number;
  filterContrast: number;
  filterSaturate?: number;
  autoEnhanced?: boolean;
}

export interface NewsPreset {
  id: string;
  title: string;
  category: string;
  headline: string;
  reporterName?: string;
  detailTag?: string;
  sampleImgUrl: string;
  themeId: ThemeId;
  cardType?: PhotoCardType;
  opinionStyle?: OpinionStyle;
  opinionTopic?: string;
  authorName?: string;
  authorDesignation?: string;
  authorImgUrl?: string;
  showCategory?: boolean;
  aspectRatio?: AspectRatio;
  badgeBgColor?: string;
}

