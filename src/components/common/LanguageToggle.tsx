'use client';

import { useDesktopStore } from '@/store/desktop';

export default function LanguageToggle() {
  const locale = useDesktopStore((s) => s.locale);

  const toggleLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    useDesktopStore.getState().setLocale(nextLocale);

    // Update browser URL without triggering Next.js route navigation.
    // This keeps the component tree intact (no re-mount) so stateful
    // children like the VideoPlayer iframe stay alive.
    const newPath = window.location.pathname.replace(/^\/(ko|en)/, `/${nextLocale}`);
    window.history.replaceState(null, '', newPath);

    // Update the HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLocale;
    }
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

