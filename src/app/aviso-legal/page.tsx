import React from 'react';
import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { avisoLegalContent } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Aviso Legal e Información Societaria (LSSI-CE) · Clínica Dental Volta',
  description:
    'Aviso legal y condiciones generales de uso del sitio web conforme a la Ley 34/2002 (LSSI-CE) y normativa sanitaria de la Comunidad de Madrid.',
};

export default function LegalNoticePage() {
  return (
    <LegalPageLayout
      title={avisoLegalContent.title}
      lawSubtitle={avisoLegalContent.law}
      sections={avisoLegalContent.sections}
      activeRoute="/aviso-legal"
    />
  );
}
