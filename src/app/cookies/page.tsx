import React from 'react';
import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { cookiesContent } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Política de Cookies y Guía de Consentimiento · Clínica Dental Volta',
  description:
    'Información técnica sobre cookies propias, analíticas con Consent Mode v2 y gestión de preferencias conforme a la LSSI-CE.',
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title={cookiesContent.title}
      lawSubtitle={cookiesContent.law}
      sections={cookiesContent.sections}
      activeRoute="/cookies"
    />
  );
}
