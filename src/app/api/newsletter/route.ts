import { NextResponse } from 'next/server';

// Rate limiting simple en memoria (reseteable por instancia)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // 1. Detección de IP para Rate Limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Demasiadas solicitudes en poco tiempo. Por favor, inténtalo de nuevo en un minuto.',
        },
        { status: 429 }
      );
    }

    // 2. Parseo y Validación del Payload
    const body = await request.json();
    const { email, privacyAccepted } = body;

    // Validación de aceptación de privacidad legal
    if (!privacyAccepted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debes aceptar la política de privacidad para suscribirte al boletín clínico.',
        },
        { status: 400 }
      );
    }

    // Validación de formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Por favor, introduce una dirección de correo electrónico válida.',
        },
        { status: 400 }
      );
    }

    // 3. Simulación de suscripción correcta (en producción conectaría a CRM/Mailchimp/Brevo)
    // Aquí registramos la intención y devolvemos 200 limpio
    return NextResponse.json(
      {
        success: true,
        message:
          'Te has suscrito con éxito al boletín de divulgación clínica de Clínica Cala. Recibirás periódicamente análisis biomecánicos y criterios facultativos.',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Ocurrió un error inesperado al procesar tu solicitud. Inténtalo más tarde.',
      },
      { status: 500 }
    );
  }
}
