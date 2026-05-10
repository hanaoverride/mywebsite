import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Developer portfolio',
};

export default async function PortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <NextIntlClientProvider locale={locale}>
      <div className="min-h-screen bg-gray-950">{children}</div>
    </NextIntlClientProvider>
  );
}
