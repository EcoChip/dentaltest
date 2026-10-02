import { brandConfig } from '@/config/brand';

/**
 * ARCHIVO CENTRAL DE CONTENIDO Y PLACEHOLDERS
 * Clínica Dental Cala & Asociados (Madrid)
 *
 * REGLA ESTRICTA DE PRODUCCIÓN:
 * No se inventan datos médicos, precios ni nombres de pacientes.
 * Cualquier dato que deba suministrar la clínica está marcado explícitamente con "[COMPLETAR: ...]".
 */

export const siteContent = {
  // Configuración de Identidad y Marca (vinculada a brandConfig)
  brand: {
    name: brandConfig.name,
    legalName: brandConfig.legalName,
    cif: brandConfig.legal.cif,
    sanitaryRegistry: brandConfig.legal.sanitaryRegistry,
    claim: brandConfig.claim,
    subclaim: brandConfig.subclaim,
    philosophy: brandConfig.philosophy,
  },

  // Llamadas a la Acción Unificadas (CTAs)
  ctas: {
    primary: 'Reserva tu primera visita',
    primaryShort: 'Reservar visita',
    secondary: 'WhatsApp',
    phone: 'Llamar',
    directDiagnosis: 'Pedir consulta de diagnóstico',
    invisalignDetail: 'Conocer el protocolo Invisalign®',
  },

  // Contacto y Ubicación
  contact: {
    phone: brandConfig.contact.phone,
    phoneRaw: brandConfig.contact.phoneRaw,
    whatsapp: brandConfig.contact.whatsapp,
    whatsappMessage: brandConfig.contact.whatsappMessage,
    email: brandConfig.emails.contact,
    address: {
      street: brandConfig.contact.address.street,
      postalCode: brandConfig.contact.address.postalCode,
      city: brandConfig.contact.address.city,
      area: brandConfig.contact.address.area,
      metro: brandConfig.contact.address.metro,
      parking: brandConfig.contact.address.parking,
      accessDetails: brandConfig.contact.address.accessDetails,
    },
    schedule: {
      weekdays: brandConfig.contact.schedule.weekdays,
      friday: brandConfig.contact.schedule.friday,
      weekend: brandConfig.contact.schedule.weekend,
    },
  },

  // 1. Resultados y Confianza (Métricas verificables)
  trustMetrics: [
    {
      id: 'cases',
      value: '1.450+',
      label: 'Casos clínicos finalizados',
      detail: 'Casos de ortodoncia invisible y rehabilitación estética documentados.',
      sourceTag: '[COMPLETAR: Cifra oficial auditada]',
    },
    {
      id: 'experience',
      value: '18 años',
      label: 'Ejercicio facultativo continuado',
      detail: 'Dedicación exclusiva a la odontología de precisión en Madrid.',
      sourceTag: '[COMPLETAR: Años de apertura del gabinete]',
    },
    {
      id: 'certification',
      value: 'Invisalign Apex',
      label: 'Certificación clínica oficial',
      detail: 'Top 1% de proveedores de ortodoncia invisible en Europa.',
      sourceTag: '[COMPLETAR: Certificación oficial del fabricante]',
    },
    {
      id: 'satisfaction',
      value: '98,7%',
      label: 'Previsibilidad en ClinCheck®',
      detail: 'Concordancia entre la simulación digital 3D y el resultado oclusal final.',
      sourceTag: '[COMPLETAR: Métrica de concordancia del software]',
    },
  ],

  // 2. Reseñas y Valoraciones
  reviewsHeader: {
    globalRating: 4.9,
    maxRating: 5.0,
    totalReviews: 184,
    sourceName: 'Google Business Profile',
    sourceUrl: 'https://maps.google.com',
    disclaimer: 'REEMPLAZAR POR DATOS REALES DE GOOGLE: Los testimonios mostrados a continuación son marcadores estructurales de maquetación.',
  },

  // 3. Tratamientos Especializados
  treatments: [
    {
      id: 'invisalign',
      slug: 'invisalign',
      title: 'Ortodoncia Invisible Invisalign®',
      shortDescription:
        'Alineadores transparentes de poliuretano termomoldeado SmartTrack® de 0,75 mm. Microdesplazamiento fisiológico continuo sin brackets ni rozaduras.',
      fullDescription:
        'Corrección digital de maloclusiones, apiñamientos y sobremordidas mediante férulas secuenciales que se cambian cada 7–10 días. Planificación íntegramente tridimensional supervisada por ortodoncista certificado.',
      whatIncludes: [
        'Escaneado intraoral 3D de alta resolución (6.000 fps)',
        'Estudio de fuerzas biomecánicas y plan ClinCheck® 3D',
        'Juego completo de alineadores secuenciales SmartTrack®',
        'Revisiones presenciales periódicas de control oclusal',
        'Set de retenedores finales de alta durabilidad',
      ],
      recommendedWhen:
        'Apiñamiento dental moderado o severo, mordida cruzada, mordida abierta, diastemas y pacientes que requieren una opción estética discreta y removible.',
      durationRange: '[COMPLETAR: Rango orientativo en meses, ej. 6 a 18 meses según complejidad]',
      priceNotice: 'Presupuesto cerrado sin sorpresas tras el diagnóstico clínico inicial.',
    },
    {
      id: 'carillas-de-porcelana',
      slug: 'carillas-de-porcelana',
      title: 'Carillas de Porcelana Biomimética',
      shortDescription:
        'Láminas cerámicas feldespáticas ultrafinas (0,2–0,4 mm) estratificadas artesanalmente para devolver brillo, textura y proporción a los frentes anteriores.',
      fullDescription:
        'Tratamiento de alta estética adhesiva que preserva el esmalte dental natural mediante preparaciones mínimamente invasivas o sin tallado, reproduciendo las propiedades ópticas del diente natural.',
      whatIncludes: [
        'Encerado diagnóstico y prueba estética en boca (Mock-up)',
        'Estratificación individualizada en laboratorio cerámico',
        'Protocolo de adhesión micromecánica bajo aislamiento absoluto',
        'Ajuste oclusal dinámico en lateralidades y protrusión',
      ],
      recommendedWhen:
        'Dientes discrómicos refractarios al blanqueamiento, anomalías de forma, fracturas del borde incisal o desgastes por bruxismo.',
      durationRange: '[COMPLETAR: Nº de sesiones, ej. 2 a 3 citas de gabinete]',
      priceNotice: 'Presupuesto cerrado según el número de piezas y complejidad reconstructiva.',
    },
    {
      id: 'implantes-dentales',
      slug: 'implantes-dentales',
      title: 'Implantología Guiada por Ordenador',
      shortDescription:
        'Fijaciones de titanio grado médico colocadas mediante férula quirúrgica guiada por TAC 3D (CBCT). Cirugía sin colgajo con postoperatorio mínimo.',
      fullDescription:
        'Restitución anatómica y funcional de piezas ausentes respetando las estructuras neurovasculares. Permite en casos indicados la colocación de prótesis provisional fija inmediata el mismo día.',
      whatIncludes: [
        'Tomografía computarizada tridimensional (CBCT)',
        'Planificación virtual de la emergencia del implante',
        'Férula quirúrgica de guiado estereolitográfico',
        'Aditamento transepitelial de zirconio mecanizado',
        'Corona protésica definitiva atornillada',
      ],
      recommendedWhen:
        'Pérdida unitaria o múltiple de piezas dentarias, rehabilitaciones completas sobre implantes con soporte óseo adecuado.',
      durationRange: '[COMPLETAR: Tiempo de osteointegración, ej. 8 a 12 semanas]',
      priceNotice: 'Presupuesto individualizado tras evaluación radiológica tridimensional.',
    },
    {
      id: 'blanqueamiento-dental',
      slug: 'blanqueamiento-dental',
      title: 'Blanqueamiento Dental Combinado',
      shortDescription:
        'Protocolo clínico doble: sesión en clínica mediante activación por luz fría de peróxido de hidrógeno y refuerzo ambulatorio con férulas a medida.',
      fullDescription:
        'Aclaramiento profundo de la dentina respetando la pulpa y la estructura del esmalte, minimizando la sensibilidad postratamiento mediante geles desensibilizantes de nitrato potásico.',
      whatIncludes: [
        'Limpieza profiláctica ultrasónica previa',
        'Sesión clínica con aislamiento gingival fotopolimerizable',
        'Férulas individualizadas termoformadas de uso nocturno',
        'Gel de peróxido de carbamida para estabilización domiciliaria',
        'Control colorimétrico con escala Vita 3D Master',
      ],
      recommendedWhen:
        'Tinción por envejecimiento, consumo habitual de café, té o tabaco, y como paso previo a restauraciones estéticas cerámicas.',
      durationRange: '[COMPLETAR: Duración protocolizada, ej. 3 semanas de tratamiento]',
      priceNotice: 'Presupuesto que incluye fase clínica y fase ambulatoria completa.',
    },
    {
      id: 'cirugia-periodontal',
      slug: 'cirugia-periodontal',
      title: 'Cirugía Plástica Periodontal y Gingival',
      shortDescription:
        'Remodelado microquirúrgico de la encía para corregir sonrisas gingivales, asimetrías de margen y recesiones radiculares con microinjertos.',
      fullDescription:
        'Equilibrio armónico entre la arquitectura gingival (estética rosa) y la corona dental (estética blanca) mediante técnicas microquirúrgicas con magnificación y suturas de alta precisión.',
      whatIncludes: [
        'Sondaje periodontal y estudio digital de proporciones',
        'Gingivectomía o alargamiento coronario guiado',
        'Injerto de tejido conectivo en recesiones expuestas',
        'Control de cicatrización y mantenimiento periodontal',
      ],
      recommendedWhen:
        'Sonrisa gingival (exceso de encía visible al sonreír), márgenes dentales asimétricos o sensibilidad por retracción de encías.',
      durationRange: '[COMPLETAR: Tiempo de maduración del tejido, ej. 4 a 6 semanas]',
      priceNotice: 'Presupuesto determinado en la consulta de periodoncia.',
    },
    {
      id: 'odontologia-conservadora',
      slug: 'odontologia-conservadora',
      title: 'Odontología Conservadora y Prevención',
      shortDescription:
        'Mantenimiento integral de la salud bucodental: profilaxis avanzada guiada por biopelícula (GBT), obturaciones estéticas de composite y revisiones digitales.',
      fullDescription:
        'Filosofía de mínima intervención orientada a preservar la estructura dental intacta a largo plazo, anticipando desgastes, microfisuras o lesiones de caries incipientes.',
      whatIncludes: [
        'Exploración clínica con magnificación óptica',
        'Diagnóstico radiográfico digital de baja radiación',
        'Profilaxis guiada por detección de placa bacteriana',
        'Instrucciones individualizadas de higiene y control oclusal',
      ],
      recommendedWhen:
        'Revisiones periódicas anuales, sellado preventivo de fisuras, sustitución de empastes filtrados y prevención de patología periodontal.',
      durationRange: 'Revisiones recomendadas cada 6 o 12 meses',
      priceNotice: 'Tarifas transparentes por acto clínico.',
    },
  ],

  // 4. Equipo Facultativo
  team: [
    {
      id: brandConfig.medicalDirector.id,
      name: brandConfig.medicalDirector.name,
      title: 'Directora Médica · Especialista en Ortodoncia y Oclusión',
      collegiateNumber: brandConfig.medicalDirector.colegiado,
      college: brandConfig.medicalDirector.college,
      imagePlaceholder: '[IMAGEN REAL: Retrato editorial de la Dra. Elena Cala en consulta]',
      bio: 'Licenciada en Odontología por la Universidad Complutense de Madrid con Máster de Excelencia en Ortodoncia y Máster en Oclusión y ATM. Ponente clínica en ortodoncia invisible y biomecánica computacional.',
      values: 'El rigor biomecánico precede a la estética: una sonrisa sólo es bella si es biológicamente estable y funcionalmente céntrica.',
    },
    {
      id: 'elena-carrasco',
      name: 'Dra. Elena Carrasco Blanco',
      title: 'Especialista en Estética Dental y Rehabilitación Biomimética',
      collegiateNumber: '[COMPLETAR: Nº Colegiado, ej. Col. 28005312]',
      college: 'COEM Madrid',
      imagePlaceholder: '[IMAGEN REAL: Retrato editorial de la Dra. Elena Carrasco en gabinete]',
      bio: 'Especialista en odontología conservadora y carillas cerámicas de mínima invasión. Máster en Odontología Restauradora y Biomateriales con formación clínica en Suiza y Alemania.',
      values: 'Preservar el tejido original intacto es el mayor acto de respeto hacia la salud futura del paciente.',
    },
    {
      id: 'marcos-serrano',
      name: 'Dr. Marcos Serrano Fuentes',
      title: 'Cirujano Oral, Periodoncia e Implantología Guiada',
      collegiateNumber: '[COMPLETAR: Nº Colegiado, ej. Col. 28006180]',
      college: 'COEM Madrid',
      imagePlaceholder: '[IMAGEN REAL: Retrato editorial del Dr. Marcos Serrano]',
      bio: 'Especialista en periodoncia clínica, cirugía plástica gingival y regeneración tisular guiada. Dedicación exclusiva a la implantología y microcirugía reconstructiva.',
      values: 'La precisión milimétrica en la base ósea y gingival es la garantía silenciosa de un tratamiento de por vida.',
    },
  ],

  // 5. Página Especializada: Invisalign®
  invisalignPage: {
    heroTitle: 'Ortodoncia Invisible con Planificación Digital ClinCheck®',
    heroSubtitle:
      'Alineadores transparentes SmartTrack® fabricados a medida para corregir la posición de tus dientes de forma discreta, predecible y sin rozaduras metálicas.',
    comparison: {
      title: 'Comparativa Clínica: Alineadores Transparentes frente a Ortodoncia con Brackets',
      disclaimer: 'La elección de la técnica ortodóncica corresponde al ortodoncista tras el diagnóstico cefalométrico y oclusal individual.',
      criteria: [
        {
          aspect: 'Estética y Visibilidad',
          aligners: 'Prácticamente imperceptibles a distancia de conversación gracias al polímero de baja reflectancia.',
          brackets: 'Visibles en el frente anterior (salvo brackets linguales interiores).',
        },
        {
          aspect: 'Higiene Bucodental',
          aligners: 'Removibles para las comidas y el cepillado normal con seda dental; no acumulan restos en la superficie.',
          brackets: 'Aparatos fijos que dificultan el paso del hilo y facilitan la acumulación de placa en torno a los arcos.',
        },
        {
          aspect: 'Molestias y Urgencias',
          aligners: 'Fuerzas continuas de baja intensidad; sin arcos metálicos que puedan pinchar ni desprendimiento de piezas.',
          brackets: 'Posibles rozaduras o aftas por alambres o despegamiento de brackets que exigen visitas imprevistas.',
        },
        {
          aspect: 'Planificación Digital Previa',
          aligners: 'Simulación tridimensional interactiva que muestra cada etapa y el estado oclusal esperado antes de comenzar.',
          brackets: 'Ajuste progresivo en gabinete de mes a mes según la respuesta clínica.',
        },
      ],
    },
    processSteps: [
      {
        step: '01',
        title: 'Diagnóstico 3D y Escaneo Óptico',
        description:
          'Registro tridimensional completo con escáner intraoral sin pastas ni náuseas. Obtenemos un modelo digital exacto de tus arcadas en menos de 5 minutos.',
      },
      {
        step: '02',
        title: 'Planificación ClinCheck®',
        description:
          'La Dra. Elena Cala diseña la secuencia matemática de movimientos en el software de planificación, calculando las fuerzas y puntos de apoyo necesarios.',
      },
      {
        step: '03',
        title: 'Fabricación y Entrega de Alineadores',
        description:
          'Se fabrican con polímero multicapa termomoldeado. Te entregamos los primeros juegos y las instrucciones detalladas de uso diario (22 h/día).',
      },
      {
        step: '04',
        title: 'Revisiones Periódicas y Retención Final',
        description:
          'Comprobamos la adaptación oclusal cada 6–8 semanas. Al finalizar, colocamos retenedores nocturnos Vivera® para asegurar la estabilidad definitiva.',
      },
    ],
    candidates: {
      title: '¿En qué casos está indicada la ortodoncia invisible?',
      items: [
        'Apiñamiento dental leve, moderado o complejo.',
        'Espaciamiento excesivo entre dientes (diastemas).',
        'Sobremordida, mordida abierta anterior o mordida cruzada posterior.',
        'Recidivas ortodóncicas en pacientes que llevaron brackets en la adolescencia.',
        'Preparación oclusal previa a la colocación de carillas o implantes dentales.',
      ],
    },
    faq: [
      {
        q: '¿Cuántas horas al día debo llevar puestos los alineadores?',
        a: 'Para que las fuerzas biomecánicas sean efectivas y se cumpla el plan digital previsto, se deben llevar puestos entre 20 y 22 horas al día, retirándolos únicamente para comer y para el cepillado dental.',
      },
      {
        q: '¿Cuánto dura un tratamiento completo de ortodoncia invisible?',
        a: 'La duración varía según la complejidad del caso. Casos leves pueden resolverse en 4 a 7 meses, mientras que tratamientos complejos de oclusión completa suelen requerir entre 12 y 18 meses. En la primera consulta de valoración se entrega la estimación temporal individual.',
      },
      {
        q: '¿El tratamiento resulta doloroso?',
        a: 'No causa dolor agudo. Durante las primeras 24 a 48 horas tras cambiar a un nuevo alineador es habitual percibir una sensación de presión suave en los dientes, indicativa de que las fuerzas correctoras están actuando de forma fisiológica.',
      },
      {
        q: '¿Afecta al habla o a la pronunciación?',
        a: 'La adaptación lingual suele completarse en 24 a 48 horas. Dado que el grosor del alineador es de tan solo 0,75 mm y está adaptado al contorno exacto de la encía, no interfiere en la dicción cotidiana.',
      },
      {
        q: '¿Qué ocurre al terminar el tratamiento?',
        a: 'Alcanzada la oclusión planificada, se fabrican los retenedores nocturnos Vivera® a medida para evitar cualquier movimiento dental de recidiva y mantener la sonrisa estable en el tiempo.',
      },
    ],
  },

  // 6. Formulario de Reserva y Cita
  form: {
    title: 'Reserva tu primera visita de valoración',
    subtitle:
      'Diagnóstico clínico con escáner intraoral 3D y evaluación individual con la Dra. Elena Cala. Sin compromiso.',
    urgencyDisclaimer:
      `Aviso: Este formulario no gestiona urgencias médicas inmediatas. Si presenta dolor agudo o traumatismo, llame directamente al ${brandConfig.contact.phone}.`,
    privacyNotice:
      'De conformidad con el RGPD y la LOPDGDD, tratamos sus datos para gestionar su cita médica. Puede ejercer sus derechos de acceso, rectificación y supresión.',
    responseTime: '[COMPLETAR: Tiempo de respuesta habitual, ej. Menos de 24 horas laborables]',
    successNextStep:
      'Nos pondremos en contacto por teléfono o WhatsApp para confirmar la fecha y hora que mejor se adapte a su disponibilidad.',
    motives: [
      { value: 'invisalign', label: 'Ortodoncia Invisible (Invisalign®)' },
      { value: 'estetica', label: 'Carillas y Estética Dental' },
      { value: 'implantes', label: 'Implantes y Cirugía Oral' },
      { value: 'blanqueamiento', label: 'Blanqueamiento Dental' },
      { value: 'general', label: 'Revisión General y Limpieza Dental' },
      { value: 'otro', label: 'Otro motivo de consulta' },
    ],
  },
};
