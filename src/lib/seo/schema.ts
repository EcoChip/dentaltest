import { clinicConfig } from '@/config/clinic.config';
import { siteContent } from '@/content/site';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clinicavolta.es';

/**
 * Esquema Schema.org para la entidad local de la clínica dental.
 * Tipo: Dentist + MedicalBusiness.
 *
 * REGLA ESTRICTA DE GOOGLE SEARCH CENTRAL:
 * No se incluye 'aggregateRating' ni 'Review' de forma autorreferencial,
 * ya que Google penaliza los rich snippets con reviews internas no sindicadas.
 * Los testimonios permanecen exclusivamente en el HTML visible.
 */
export function getClinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'MedicalBusiness'],
    '@id': `${siteUrl}/#clinic`,
    name: clinicConfig.name,
    legalName: clinicConfig.legal.companyName,
    alternateName: clinicConfig.shortName,
    url: siteUrl,
    logo: `${siteUrl}/apple-icon`,
    image: `${siteUrl}/opengraph-image`,
    description: clinicConfig.claim,
    telephone: clinicConfig.contact.phone,
    email: clinicConfig.contact.email,
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinicConfig.contact.address.street,
      addressLocality: clinicConfig.contact.address.city,
      addressRegion: clinicConfig.contact.address.province,
      postalCode: clinicConfig.contact.address.postalCode,
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.4266184,
      longitude: -3.6894318,
    },
    hasMap: 'https://maps.google.com/?q=Calle+de+Serrano+42+Madrid',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:30',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday'],
        opens: '09:30',
        closes: '18:00',
      },
    ],
    medicalSpecialty: [
      'https://health-lifesci.schema.org/Dentistry',
      'https://health-lifesci.schema.org/Orthodontics',
      'https://health-lifesci.schema.org/Periodontics',
      'https://health-lifesci.schema.org/Prosthodontics',
    ],
    founder: {
      '@type': 'Physician',
      '@id': `${siteUrl}/equipo#alejandro-volta`,
      name: clinicConfig.medicalDirector.name,
      jobTitle: clinicConfig.medicalDirector.title,
      medicalSpecialty: 'https://health-lifesci.schema.org/Orthodontics',
    },
  };
}

/**
 * Esquema Schema.org para el sitio web corporativo (WebSite).
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: clinicConfig.name,
    alternateName: clinicConfig.shortName,
    inLanguage: 'es-ES',
    publisher: {
      '@id': `${siteUrl}/#clinic`,
    },
  };
}

/**
 * Esquema Schema.org para migas de pan jerárquicas (BreadcrumbList).
 * @param items Array de elementos con título visible y ruta relativa o absoluta.
 */
export function getBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: siteUrl,
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.name,
        item: item.path.startsWith('http') ? item.path : `${siteUrl}${item.path}`,
      })),
    ],
  };
}

/**
 * Esquema Schema.org para preguntas frecuentes (FAQPage).
 * Coincide exactamente con el texto expuesto en los acordeones de la página.
 */
export function getFaqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/**
 * Esquema Schema.org para el cuadro facultativo de especialistas (Physician / Person).
 */
export function getDoctorsSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': siteContent.team.map((member) => ({
      '@type': 'Physician',
      '@id': `${siteUrl}/equipo#${member.id}`,
      name: member.name,
      jobTitle: member.title,
      description: member.bio,
      worksFor: {
        '@id': `${siteUrl}/#clinic`,
      },
      memberOf: {
        '@type': 'MedicalOrganization',
        name: member.college,
      },
    })),
  };
}
