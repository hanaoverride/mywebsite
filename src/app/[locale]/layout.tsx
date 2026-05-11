import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ResponsiveShell from '@/components/common/ResponsiveShell';
import ClientLocaleProvider from '@/components/providers/ClientLocaleProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Linux Desktop',
  description: 'Linux desktop GUI portfolio website',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <ClientLocaleProvider initialLocale={locale as 'ko' | 'en'}>
      <ResponsiveShell>
        {children}
      </ResponsiveShell>
    </ClientLocaleProvider>
  );
}

