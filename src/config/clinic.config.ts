import { brandConfig } from './brand';

export interface ClinicConfig {
  name: string;
  shortName: string;
  tagline: string;
  claim: string;
  medicalDirector: {
    name: string;
    title: string;
    collegiateNumber: string;
    specialty: string;
    college: string;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    whatsappMessage: string;
    email: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      province: string;
      country: string;
      metro: string;
      parking: string;
    };
    schedule: {
      weekdays: string;
      friday: string;
      weekend: string;
    };
  };
  social: {
    instagram: string;
    linkedin: string;
  };
  legal: {
    cif: string;
    registrySanitaryCode: string;
    companyName: string;
    dpoEmail: string;
  };
  stats: Array<{
    value: string;
    label: string;
    detail: string;
    isPlaceholder?: boolean;
  }>;
}

export const clinicConfig: ClinicConfig = {
  name: brandConfig.tradeName,
  shortName: brandConfig.shortName,
  tagline: brandConfig.tagline,
  claim: brandConfig.claim,
  medicalDirector: {
    name: brandConfig.medicalDirector.name,
    title: brandConfig.medicalDirector.role,
    collegiateNumber: brandConfig.medicalDirector.colegiado,
    specialty: brandConfig.medicalDirector.specialty,
    college: "Ilustre Colegio Oficial de Odontólogos y Estomatólogos de la 1ª Región (COEM)",
  },
  contact: {
    phone: brandConfig.contact.phoneRaw,
    phoneDisplay: brandConfig.contact.phone,
    whatsapp: brandConfig.contact.whatsapp,
    whatsappMessage: brandConfig.contact.whatsappMessage,
    email: brandConfig.emails.contact,
    address: {
      street: brandConfig.contact.address.street,
      city: brandConfig.contact.address.city,
      postalCode: brandConfig.contact.address.postalCode,
      province: "Madrid",
      country: "España",
      metro: brandConfig.contact.address.metro,
      parking: brandConfig.contact.address.parking,
    },
    schedule: {
      weekdays: brandConfig.contact.schedule.weekdays,
      friday: brandConfig.contact.schedule.friday,
      weekend: brandConfig.contact.schedule.weekend,
    },
  },
  social: {
    instagram: brandConfig.social.instagram,
    linkedin: brandConfig.social.linkedin,
  },
  legal: {
    cif: brandConfig.legal.cif,
    registrySanitaryCode: brandConfig.legal.sanitaryRegistry,
    companyName: brandConfig.legalName,
    dpoEmail: brandConfig.emails.dpo,
  },
  stats: [
    {
      value: "1.450+",
      label: "Casos ortodóncicos concluidos",
      detail: "Tratamientos documentados y estabilizados a largo plazo",
      isPlaceholder: true,
    },
    {
      value: "18",
      label: "Años de experiencia",
      detail: "Ejercicio profesional exclusivo en ortodoncia de alta gama",
      isPlaceholder: true,
    },
    {
      value: "Top 1%",
      label: "Invisalign Apex",
      detail: "Categoría de proveedor de máxima experiencia clínica oficial",
      isPlaceholder: true,
    },
    {
      value: "98,7%",
      label: "Predictibilidad",
      detail: "Alineación planificada vs. resultado anatómico final",
      isPlaceholder: true,
    },
  ],
};
