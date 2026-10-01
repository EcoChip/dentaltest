/**
 * ARCHIVO CENTRAL DE IDENTIDAD Y MARCA (SINGLE SOURCE OF TRUTH)
 * Clínica Dental Cala & Asociados (Madrid)
 *
 * Todos los nombres comerciales, razón social, dominio, direcciones de correo,
 * datos de contacto, dirección médica y registros legales se definen aquí.
 * Modificar la marca en el futuro solo requiere editar este archivo.
 */

export const brandConfig = {
  // Identidad comercial
  name: 'Clínica Dental Cala',
  shortName: 'Clínica Cala',
  brandWord: 'Cala',
  legalName: 'Clínica Dental Cala S.L.P.',
  tradeName: 'Clínica Dental Cala & Asociados',

  // Lemas institucionales
  claim: 'Odontología de Precisión y Ortodoncia Invisible',
  subclaim: 'La odontología estética no transforma tu sonrisa. Revela su armonía natural.',
  tagline: 'Odontología de Precisión · Madrid',
  philosophy:
    'Planificación digital computacional de fuerzas biomecánicas y mínima intervención tisular. Cada tratamiento se diseña a medida bajo supervisión facultativa continuada.',

  // Dominio y URLs
  domain: 'clinicacala.es',
  url: 'https://clinicacala.es',

  // Claves técnicas
  cookieConsentKey: 'cala_cookie_consent_v1',

  // Canales de contacto digital
  emails: {
    contact: 'contacto@clinicacala.es',
    appointments: 'citas@clinicacala.es',
    dpo: 'privacidad@clinicacala.es',
  },

  // Teléfonos y mensajería
  contact: {
    phone: '919 00 12 34',
    phoneFormatted: '+34 919 00 12 34',
    phoneRaw: '+34919001234',
    whatsapp: '+34600123456',
    whatsappMessage: 'Hola, deseo solicitar una primera visita de valoración para ortodoncia invisible.',
    address: {
      street: 'Calle de Serrano, 42, 1º Dcha.',
      postalCode: '28001',
      city: 'Madrid',
      area: 'Barrio de Salamanca',
      metro: 'Serrano (L4) · Velázquez (L4) · Colón (L4)',
      parking: 'Parking público Plaza de Colón (a 120 metros de la clínica)',
      accessDetails: 'Portal adaptado con rampa y ascensor accesible para personas con movilidad reducida.',
      googleMapsUrl: 'https://maps.google.com/?q=Calle+Serrano+42+Madrid',
    },
    schedule: {
      weekdays: 'Lunes a Jueves: 09:30 – 20:00 h',
      friday: 'Viernes: 09:30 – 18:00 h',
      weekend: 'Sábados y Domingos: Cerrado (atención de urgencias concertadas previa llamada)',
    },
  },

  // Dirección Médica
  medicalDirector: {
    id: 'elena-cala',
    name: 'Dra. Elena Cala Morales',
    shortName: 'Dra. Elena Cala',
    title: 'Directora Médica · Especialista en Ortodoncia y Oclusión',
    role: 'Directora Médica & Especialista en Ortodoncia Invisible',
    colegiado: '[COMPLETAR: Nº Colegiado COEM]',
    specialty: 'Ortodoncia Invisible & Oclusión Biomecánica',
    college: 'Ilustre Colegio Oficial de Odontólogos y Estomatólogos de la 1ª Región (COEM)',
  },

  // Datos Fiscales y Registro Sanitario
  legal: {
    cif: '[COMPLETAR: CIF de la sociedad sanitaria]',
    sanitaryRegistry: '[COMPLETAR: Nº de Registro Sanitario de la CAM, ej. CS14299/CAM]',
    dpoContact: '[COMPLETAR: Delegado de Protección de Datos (DPO), dpo@clinicacala.es]',
    regulatoryAuthority:
      'Consejería de Sanidad de la Comunidad de Madrid / Colegio Oficial de Odontólogos y Estomatólogos de la 1ª Región (COEM)',
  },

  // Redes Sociales
  social: {
    instagram: 'https://instagram.com/clinicacala',
    linkedin: 'https://linkedin.com/company/clinica-cala',
    twitter: '@clinicacala',
  },
} as const;

export const brand = {
  ...brandConfig,
  phoneFormatted: brandConfig.contact.phoneFormatted,
  fullAddress: `${brandConfig.contact.address.street}, ${brandConfig.contact.address.postalCode} ${brandConfig.contact.address.city}`,
  legalCompany: brandConfig.legalName,
};

export type BrandConfig = typeof brandConfig;
