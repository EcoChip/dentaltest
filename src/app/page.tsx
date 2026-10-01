import React from 'react';
import { HomeScrollytelling } from '@/components/home/HomeScrollytelling';
import { TrustMetricsSection } from '@/components/home/TrustMetricsSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { TreatmentsSummarySection } from '@/components/home/TreatmentsSummarySection';
import { DoctorSpotlightSection } from '@/components/home/DoctorSpotlightSection';
import { ContactCTASection } from '@/components/home/ContactCTASection';

export default function HomePage() {
  return (
    <>
      {/* 1. Experiencia Principal de Scrollytelling 3D */}
      <HomeScrollytelling />

      {/* 2. Resultados, Cifras y Garantías Clínicas */}
      <TrustMetricsSection />

      {/* 3. Reseñas y Valoración Global */}
      <ReviewsSection />

      {/* 4. Resumen de Tratamientos */}
      <TreatmentsSummarySection />

      {/* 5. Dirección Médica y Filosofía de Conservación */}
      <DoctorSpotlightSection />

      {/* 6. CTA Final con Formulario de Reserva Validado */}
      <ContactCTASection />
    </>
  );
}
