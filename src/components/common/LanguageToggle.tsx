'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useDesktopStore } from '@/store/desktop';

export default function LanguageToggle() {
  const locale = useDesktopStore((s) => s.locale);
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    useDesktopStore.getState().setLocale(nextLocale);
    const newPathname = pathname?.replace(/^\/(ko|en)/, `/${nextLocale}`) ?? `/${nextLocale}`;
    router.replace(newPathname);
  };

  return (
    <button
      data-testid="language-toggle"
      onClick={toggleLocale}
      className="px-2 py-0.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
      title={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      {locale === 'ko' ? 'KO' : 'EN'}
    </button>
  );
}
