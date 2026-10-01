import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A1816',
          borderRadius: '36px',
        }}
      >
        <span
          style={{
            fontSize: '110px',
            color: '#C5A059',
            fontFamily: 'serif',
            fontWeight: 700,
            lineHeight: 1,
            marginTop: '-10px',
          }}
        >
          C
        </span>
      </div>
    ),
    { ...size }
  );
}
