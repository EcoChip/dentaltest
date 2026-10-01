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
  name: "Clínica Dental Volta & Asociados",
  shortName: "Clínica Volta",
  tagline: "Odontología Estética de Precisión y Ortodoncia Invisible",
  claim: "La odontología estética no transforma tu sonrisa. Revela su armonía natural.",
  medicalDirector: {
    name: "Dr. Alejandro Volta Morales",
    title: "Director Médico y Especialista en Ortodoncia Digital",
    collegiateNumber: "Col. 28004921",
    specialty: "Ortodoncia Invisible y Rehabilitación Estética Biomimética",
    college: "Ilustre Colegio Oficial de Odontólogos y Estomatólogos de la 1ª Región (COEM)",
  },
  contact: {
    phone: "+34919001234",
    phoneDisplay: "919 00 12 34",
    whatsapp: "+34600123456",
    whatsappMessage: "Hola, deseo solicitar una primera consulta diagnóstica de ortodoncia invisible.",
    email: "consulta@clinicavolta.es",
    address: {
      street: "Calle de Serrano, 42, 1º Dcha.",
      city: "Madrid",
      postalCode: "28001",
      province: "Madrid",
      country: "España",
      metro: "Serrano (L4) / Velázquez (L4) / Colón (L4)",
      parking: "Aparcamiento público concertado en Plaza de Colón (2 h bonificadas)",
    },
    schedule: {
      weekdays: "Lunes a Jueves: 09:30 – 20:00",
      friday: "Viernes: 09:30 – 18:00",
      weekend: "Sábados y Domingos: Cerrado",
    },
  },
  social: {
    instagram: "https://instagram.com/clinicavolta",
    linkedin: "https://linkedin.com/company/clinica-volta",
  },
  legal: {
    cif: "B-88991122",
    registrySanitaryCode: "CS14299/CAM (Comunidad de Madrid)",
    companyName: "Clínica Dental Volta S.L.P.",
    dpoEmail: "privacidad@clinicavolta.es",
  },
  stats: [
    {
      value: "1.450+",
      label: "Casos ortodóncicos concluidos",
      detail: "Tratamientos documentados y estabilizados a largo plazo",
      isPlaceholder: true,
    },
    {
      value: "Diamond Apex",
      label: "Categoría Invisalign® Oficial",
      detail: "Pertenecientes al 1% de proveedores en Europa",
      isPlaceholder: true,
    },
    {
      value: "18 años",
      label: "Práctica clínica especializada",
      detail: "Dedicación exclusiva a ortodoncia y estética dental",
      isPlaceholder: true,
    },
    {
      value: "0,2 mm",
      label: "Tolerancia biomecánica",
      detail: "Ajuste milimétrico guiado por tecnología digital 3D",
    },
  ],
};
