'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useDesktopStore } from '@/store/desktop';

import koMessages from '../../../messages/ko.json';
import enMessages from '../../../messages/en.json';

const allMessages: Record<'ko' | 'en', typeof koMessages> = {
  ko: koMessages,
  en: enMessages,
};

/**
 * Client-side locale provider that reacts to zustand store locale changes
 * WITHOUT triggering a Next.js route navigation.
 *
 * Both message bundles are statically imported so switching locale is instant
 * and the component tree is only RE-RENDERED (props change), never RE-MOUNTED
 * (no key change, no route change).  This keeps iframes and other stateful
 * children alive across language switches.
 */
export default function ClientLocaleProvider({ 
  children, 
  initialLocale 
}: { 
  children: ReactNode;
  initialLocale: 'ko' | 'en';
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    // Synchronize the store with the server-side locale on the first client-side render
    useDesktopStore.setState({ locale: initialLocale });
    // Initialize panel time with the correct locale
    const localeStr = initialLocale === 'ko' ? 'ko-KR' : 'en-US';
    useDesktopStore.setState({
      panelTime: new Date().toLocaleTimeString(localeStr, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    // Update the HTML lang attribute to match the locale
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initialLocale;
    }

    initialized.current = true;
  }, [initialLocale]);


  const locale = useDesktopStore((s) => s.locale);


  return (
    <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}

