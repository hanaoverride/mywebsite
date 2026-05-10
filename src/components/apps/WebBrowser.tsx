'use client';

import { useDesktopStore } from '@/store/desktop';
import { Shield, Share2, Menu, Search, Bookmark, ArrowLeft, ArrowRight, RotateCw, Plus, X } from 'lucide-react';
import { ReactNode } from 'react';

export default function WebBrowser({ children }: { children?: ReactNode }) {
  const locale = useDesktopStore((s) => s.locale);
  const isKo = locale === 'ko';

  return (
    <div className="h-full flex flex-col" data-testid="web-browser">
      <div className="flex items-center bg-[#2b1a3d] px-2 py-1 gap-1">
        <div className="flex items-center gap-1.5 bg-[#3a2550] rounded-t-lg px-3 py-1.5 text-white text-xs min-w-[140px]">
          <span className="truncate">{isKo ? '하나의 포트폴리오' : "Hana's Portfolio"}</span>
          <button className="hover:bg-white/10 rounded p-0.5"><X size={12} /></button>
        </div>
        <button className="text-gray-400 hover:text-white p-1"><Plus size={14} /></button>
        <div className="flex-1" />
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2b1a3d] border-b border-[#3a2550]">
        <button className="text-gray-400 p-1"><Bookmark size={16} /></button>
        <div className="flex gap-0.5">
          <button className="text-gray-500 p-1"><ArrowLeft size={16} /></button>
          <button className="text-gray-500 p-1"><ArrowRight size={16} /></button>
        </div>
        <button className="text-gray-400 p-1"><RotateCw size={16} /></button>

        <div className="flex-1 flex items-center bg-[#3a2550] rounded-full px-3 py-1.5 gap-2 mx-2">
          <Search size={14} className="text-gray-400" />
          <span className="text-gray-400 text-xs flex-1 truncate">
            {children
              ? `https://portfolio.local/${locale}`
              : (isKo ? '사이트 주소 입력' : 'Type a URL')
            }
          </span>
        </div>

        <button className="text-gray-400 p-1"><Share2 size={16} /></button>
        <button className="text-purple-400 p-1"><Shield size={16} /></button>
        <button className="text-gray-400 p-1"><Menu size={16} /></button>
      </div>

      <div className="flex-1 bg-gradient-to-b from-[#2b1a3d] to-[#1a0f2e] overflow-auto" data-testid="browser-content">
        {children || (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            {isKo ? '콘텐츠가 여기에 표시됩니다' : 'Content will be displayed here'}
          </div>
        )}
      </div>
    </div>
  );
}
