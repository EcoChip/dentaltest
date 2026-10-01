import { z } from 'zod';

// Expresión regular robusta para teléfonos en España (admite prefijo +34, 0034, o sin prefijo, iniciando en 6, 7, 8 o 9)
const spanishPhoneRegex =
  /^(?:(?:\+|00)34[\s.-]?)?(?:[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|[6789]\d{1}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}|[6789]\d{8})$/;

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'El nombre y apellidos deben tener al menos 3 caracteres.' })
    .max(80, { message: 'El nombre no puede superar los 80 caracteres.' }),

  phone: z
    .string()
    .trim()
    .min(9, { message: 'El teléfono debe contener al menos 9 dígitos.' })
    .max(20, { message: 'El número de teléfono es excesivamente largo.' })
    .refine((val) => spanishPhoneRegex.test(val.replace(/[\s\-\(\)\.]/g, '')), {
      message: 'Introduce un teléfono de contacto válido (ej. 600 123 456 o +34 919 00 12 34).',
    }),

  email: z
    .string()
    .trim()
    .email({ message: 'Indica una dirección de correo electrónico válida.' })
    .or(z.literal(''))
    .optional(),

  motive: z.enum(
    ['invisalign', 'estetica', 'implantes', 'blanqueamiento', 'general', 'otro'],
    {
      message: 'Por favor, selecciona un motivo de consulta.',
    }
  ),

  message: z
    .string()
    .max(500, { message: 'El mensaje no puede superar los 500 caracteres.' })
    .optional(),

  rgpdConsent: z.literal(true, {
    message: 'Debes aceptar la política de privacidad para tramitar tu solicitud médica.',
  }),

  // Campo trampa invisible para bots (debe estar vacío)
  honeypot: z.string().max(0, { message: 'Detección automática de spam.' }).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
