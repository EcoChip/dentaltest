import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/validation/bookingSchema';
import { siteContent } from '@/content/site';
import { brandConfig } from '@/config/brand';

// Almacén en memoria para límite de peticiones por IP (Rate Limiting)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 10 * 60 * 1000; // Ventana de 10 minutos
const MAX_REQUESTS_PER_WINDOW = 5; // Máximo 5 solicitudes por IP en 10 minutos

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Límite superado
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 0. Protección contra CSRF: Validación de cabecera Origin
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        // Comparación estricta de host y puerto
        if (originUrl.host !== host) {
          console.warn(`[CSRF Blocked] Origen no autorizado: ${origin} !== ${host}`);
          return NextResponse.json(
            { error: 'Origen de solicitud no autorizado.' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Cabecera Origin no válida.' },
          { status: 400 }
        );
      }
    }

    const clientIp = getClientIp(req);

    // 1. Control de tasa de peticiones por IP
    const allowed = checkRateLimit(clientIp);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            `Ha alcanzado el límite de solicitudes de cita en un periodo corto. Por favor, llame directamente al ${brandConfig.contact.phone} para atención inmediata.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Trampa Honeypot: si el campo oculto contiene datos, descartar silenciosamente
    if (body.honeypot && String(body.honeypot).trim() !== '') {
      console.warn(`[Anti-Bot Honeypot] Solicitud descartada desde IP: ${clientIp}`);
      // Respuesta ficticia de éxito para no alertar al bot
      return NextResponse.json({
        success: true,
        message: 'Solicitud tramitada correctamente.',
      });
    }

    // 3. Validación estricta en servidor con Zod
    const validationResult = bookingSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: 'Existen errores de validación en los datos proporcionados.',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 4. Envío a proveedor de correo (Resend / SMTP corporativo vía variables de entorno)
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail =
      process.env.CLINIC_NOTIFICATION_EMAIL || brandConfig.emails.appointments;

    if (resendApiKey) {
      // Envío real a través de API de Resend
      const emailPayload = {
        from: `${brandConfig.shortName} Citas <${brandConfig.emails.appointments}>`,
        to: [notificationEmail],
        reply_to: data.email || undefined,
        subject: `Nueva solicitud de primera visita: ${data.name} (${data.motive.toUpperCase()})`,
        text: `Nueva Solicitud de Cita - ${brandConfig.name}\n\nNombre: ${data.name}\nTeléfono: ${data.phone}\nEmail: ${data.email || 'No indicado'}\nMotivo: ${data.motive}\nObservaciones: ${data.message || 'Sin observaciones'}\nIP: ${clientIp}\nFecha: ${new Date().toISOString()}`,
      };

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      if (!resendResponse.ok) {
        console.error(
          '[Resend Error]',
          resendResponse.status,
          await resendResponse.text()
        );
        // Fallback controlado
      }
    } else {
      // Entorno de pruebas / desarrollo sin claves externas expuestas
      console.info('[Entorno de Pruebas: Notificación de Cita Generada]', {
        paciente: data.name,
        telefono: data.phone,
        email: data.email || '(sin email)',
        motivo: data.motive,
        mensaje: data.message,
        consentimientoRGPD: data.rgpdConsent,
        ip: clientIp,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud de primera visita registrada correctamente.',
      referenceId: `CALA-${Date.now().toString().slice(-6)}`,
      responseTime: siteContent.form.responseTime,
    });
  } catch (error) {
    console.error('[API Cita Server Error]', error);
    return NextResponse.json(
      {
        error:
          `Se ha producido un error interno al registrar la solicitud. Por favor, reintente o llame al ${brandConfig.contact.phone}.`,
      },
      { status: 500 }
    );
  }
}
