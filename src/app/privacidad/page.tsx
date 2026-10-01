import React from 'react';
import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { privacidadContent } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Protección de Datos (RGPD) · Clínica Dental Volta',
  description:
    'Información sobre el tratamiento de datos de contacto y advertencia sanitaria conforme al RGPD y LOPDGDD.',
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title={privacidadContent.title}
      lawSubtitle={privacidadContent.law}
      sections={privacidadContent.sections}
      activeRoute="/privacidad"
    />
  );
}
