import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import DesktopShell from '@/components/desktop/DesktopShell';
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
    <NextIntlClientProvider locale={locale}>
      <DesktopShell panel={<div />} dock={<div />}>
        {children}
      </DesktopShell>
    </NextIntlClientProvider>
  );
}
