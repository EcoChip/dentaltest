export interface Treatment {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  duration: string;
  idealFor: string[];
  protocol: string[];
  technology: string[];
}

export const treatmentsData: Treatment[] = [
  {
    slug: "invisalign",
    title: "Ortodoncia Invisible (Invisalign® & Spark™)",
    subtitle: "Alineación biomecánica milimétrica sin aparatología metálica",
    category: "Ortodoncia Digital",
    description: "Tratamiento mediante férulas transparentes de polímero SmartTrack®, termoformadas a medida y sustituidas de forma secuencial. Corrige apiñamientos, mordidas abiertas, sobremordidas y diastemas con fuerzas ligeras y continuas que respetan el ligamento periodontal.",
    duration: "De 6 a 18 meses (según complejidad diagnóstica)",
    idealFor: [
      "Apiñamiento leve, moderado y severo",
      "Mordida cruzada y sobremordida",
      "Diastemas y cierres de espacios",
      "Recidivas ortodóncicas post-brackets"
    ],
    protocol: [
      "Escaneado óptico 3D intraoral iTero Lumina",
      "Planificación virtual biomecánica ClinCheck®",
      "Colocación de ataches de composite estético",
      "Revisiones de control y monitorización digital",
      "Fase de retención estabilizadora Vivera®"
    ],
    technology: ["iTero Lumina HD", "ClinCheck Pro 6.0", "SmartTrack Material"]
  },
  {
    slug: "carillas-porcelana",
    title: "Carillas de Porcelana & Mockup Digital",
    subtitle: "Restauración biomimética de alta fidelidad óptica",
    category: "Estética Dental",
    description: "Láminas cerámicas ultrafinas (0,3 a 0,5 mm) de disilicato de litio o porcelana feldespática adheridas a la superficie vestibular. Se diseñan previo test estético intraoral (mockup directo), permitiendo evaluar forma, textura y tono antes de cualquier preparación mínima.",
    duration: "2 a 3 sesiones clínicas",
    idealFor: [
      "Alteraciones severas del color o esmalte",
      "Microdoncias y asimetrías de forma",
      "Fracturas incisales y desgaste por bruxismo",
      "Optimización de la línea de la sonrisa"
    ],
    protocol: [
      "Estudio fotográfico y escaneado facial",
      "Encerado diagnóstico digital (DSD)",
      "Prueba estética intraoral (Mockup directo)",
      "Adhesión micrométrica bajo aislamiento absoluto"
    ],
    technology: ["Microscopio Clínico Zeiss", "Disilicato E.max", "Fotografía Polarizada"]
  },
  {
    slug: "implantes-guiados",
    title: "Implantología Guiada por Ordenador",
    subtitle: "Reposición osteointegrada sin incisiones innecesarias",
    category: "Cirugía y Regeneración",
    description: "Planificación tridimensional fusionando el escaneado intraoral y la tomografía CBCT. La inserción del implante de titanio grado médico se ejecuta a través de una férula quirúrgica guiada por ordenador, reduciendo el trauma tisular y el tiempo de recuperación.",
    duration: "Cirugía en 1 sesión + periodo de osteointegración (8-12 semanas)",
    idealFor: [
      "Ausencia de una o múltiples piezas dentales",
      "Pérdida de molares posteriores con pérdida de soporte",
      "Rehabilitaciones completas sobre implantes"
    ],
    protocol: [
      "Tomografía volumétrica CBCT de haz cónico",
      "Planificación quirúrgica tridimensional",
      "Cirugía guiada mínimamente invasiva",
      "Carga inmediata provisional (cuando esté indicada)",
      "Colocación de corona definitiva de circonio monolítico"
    ],
    technology: ["CBCT Morita 3D", "Férula Quirúrgica Estereolitográfica", "Circonio Multicapa"]
  },
  {
    slug: "blanqueamiento-enzimatico",
    title: "Blanqueamiento Dental Combinado",
    subtitle: "Aclaramiento cromático controlado sin agresión del esmalte",
    category: "Estética y Profilaxis",
    description: "Protocolo dual que combina una sesión clínica con lámpara de longitud de onda fría y tratamiento domiciliario con férulas individualizadas de peróxido de carbamida a baja concentración. Protege la pulpa dental y previene la sensibilidad postoperatoria.",
    duration: "1 sesión en clínica (45 min) + 15 noches en domicilio",
    idealFor: [
      "Tinciones intrínsecas por envejecimiento dental",
      "Pigmentaciones por café, té o tabaco",
      "Homogeneización tonal post-ortodoncia"
    ],
    protocol: [
      "Profilaxis previa con aeropulidor de glicina",
      "Toma de colorímetro digital espectrofotométrico",
      "Sesión clínica con barrera gingival fotopolimerizable",
      "Pauta domiciliaria y remineralización con hidroxiapatita"
    ],
    technology: ["Espectrofotómetro Vita Easyshade", "Lámpara LED Philips Zoom", "Gel Desensibilizante CPP-ACP"]
  },
  {
    slug: "periodoncia-avanzada",
    title: "Periodoncia & Medicina Gingival",
    subtitle: "Salud del soporte biológico y arquitectura del tejido blando",
    category: "Salud Periodontal",
    description: "Diagnóstico microbiológico y tratamiento conservador de gingivitis y periodontitis mediante raspado y alisado radicular con ultrasonidos guiados. Incluye microcirugía plástica periodontal para cobertura de recesiones gingivales y nivelación del margen estético.",
    duration: "Evaluación por fases y mantenimiento cada 4 a 6 meses",
    idealFor: [
      "Sangrado gingival espontáneo o al cepillado",
      "Recesión de encías y cuellos dentales expuestos",
      "Movilidad dentaria incipiente",
      "Sonrisa gingival por erupción pasiva alterada"
    ],
    protocol: [
      "Sondaje periodontal informatizado",
      "Descontaminación con ultrasonidos piezoeléctricos",
      "Instrucción personalizada en higiene interproximal",
      "Reevaluación a las 6 semanas y mantenimiento"
    ],
    technology: ["Sonda Periodontal Florida", "Piezoeléctrico EMS No Pain", "Microcirugía de Tejido Conectivo"]
  }
];
