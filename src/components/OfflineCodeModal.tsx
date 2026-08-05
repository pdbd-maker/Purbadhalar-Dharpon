import React, { useState } from 'react';
import { X, Copy, Download, Check, FileCode, ShieldCheck } from 'lucide-react';
import { PhotoCardData, YouTubeThumbnailData } from '../types';
import { generateOfflineHtml } from '../utils/generateOfflineHtml';

interface OfflineCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: PhotoCardData;
  ytData: YouTubeThumbnailData;
  appMode: 'photocard' | 'youtube';
}

export const OfflineCodeModal: React.FC<OfflineCodeModalProps> = ({
  isOpen,
  onClose,
  cardData,
  ytData,
  appMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullCode = generateOfflineHtml({
    cardData,
    ytData,
    activeMode: appMode,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHtmlFile = () => {
    const blob = new Blob([fullCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Purbadhalar_Dhorpon_Offline_PhotoCard_Maker.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020617]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 bg-[#020617] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                পূর্বধলার দর্পণ - অফলাইন HTML কোড
                <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ১০০% অফলাইন প্রস্তুত
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                এই কোডটি কম্পিউটার বা মোবাইলে সেভ করে ডাবল-ক্লিক করলেই ব্রাউজারে সম্পূর্ণ অফলাইনে চলবে।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-4 py-3 bg-[#0f172a] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-400">
            ফাইলের ধরণ: <strong className="text-amber-400">Standalone Single-File HTML</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#020617] hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">কপি করা হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>কোড কপি করুন</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadHtmlFile}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>HTML ফাইল ডাউনলোড (.html)</span>
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="p-4 bg-[#020617] flex-1 overflow-auto font-mono text-xs text-slate-300 leading-relaxed selection:bg-amber-500 selection:text-slate-950">
          <pre className="whitespace-pre-wrap break-all">{fullCode}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#020617] border-t border-slate-800 text-center text-xs text-slate-500">
          টিপস: ডাউনলোড করা HTML ফাইলটিতে ডাবল ক্লিক করলেই আপনার পিসি বা মোবাইলে ইন্টারনেট ছাড়াই চলবে!
        </div>
      </div>
    </div>
  );
};
