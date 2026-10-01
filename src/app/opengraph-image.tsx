import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Clínica Dental Volta & Asociados · Ortodoncia Invisible y Estética Dental en Madrid';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F8F6F1',
          padding: '64px 80px',
          border: '14px solid #1A1816',
          boxSizing: 'border-box',
        }}
      >
        {/* Cabecera Superior */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#1A1816',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5A059',
                fontSize: '26px',
                fontWeight: 700,
                fontFamily: 'serif',
              }}
            >
              V
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 600, color: '#1A1816', letterSpacing: '-0.02em', fontFamily: 'serif' }}>
                Clínica Dental Volta
              </span>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#1B4958', fontWeight: 600 }}>
                Odontología de Precisión · Madrid
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D5CEBF',
              borderRadius: '4px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#1B4958',
              fontWeight: 600,
            }}
          >
            Serrano 42 · Barrio de Salamanca
          </div>
        </div>

        {/* Titular Principal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '40px 0' }}>
          <span style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#8A532B', fontWeight: 700 }}>
            Tecnología Biomecánica & Mínima Intervención
          </span>
          <h1
            style={{
              fontSize: '56px',
              lineHeight: 1.15,
              fontWeight: 600,
              color: '#1A1816',
              margin: 0,
              letterSpacing: '-0.03em',
              fontFamily: 'serif',
            }}
          >
            La odontología estética no transforma tu sonrisa. Revela su armonía natural.
          </h1>
        </div>

        {/* Pie Inferior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #D5CEBF',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px', fontSize: '15px', color: '#4A4844' }}>
            <span>• Invisalign® Diamond Apex</span>
            <span>• Carillas de Porcelana</span>
            <span>• Implantología Guiada</span>
          </div>

          <span style={{ fontSize: '14px', color: '#1A1816', fontWeight: 600 }}>
            clinicavolta.es
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
