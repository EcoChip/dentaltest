import { clinicConfig } from '@/config/clinic.config';
import { brandConfig } from '@/config/brand';

export interface TreatmentProcessStep {
  step: string;
  title: string;
  description: string;
  estimatedTime: string;
}

export interface TreatmentFaqItem {
  q: string;
  a: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  diagnosis: string;
  resolution: string;
  duration: string;
  placeholderLabel: string;
  aspectRatio: string;
}

export interface RelatedTreatment {
  slug: string;
  title: string;
  shortDesc: string;
  href: string;
  tag: string;
}

export interface TreatmentDetail {
  slug: string;
  title: string;
  heroBadge: string;
  heroSubtitle: string;
  heroDescription: string;
  durationEstimated: string;
  priceNotice: string;
  procedureType: string;
  category: string;
  whatIs: {
    title: string;
    paragraphs: string[];
    keyPoints: string[];
  };
  whoIsItFor: {
    title: string;
    indications: string[];
    contraindicationsNotice: string;
  };
  processSteps: TreatmentProcessStep[];
  clinicalCases: ClinicalCase[];
  faq: TreatmentFaqItem[];
  relatedTreatments: RelatedTreatment[];
  metaTitle: string;
  metaDescription: string;
}

export const TREATMENTS_DATA: Record<string, TreatmentDetail> = {
  'carillas-de-porcelana': {
    slug: 'carillas-de-porcelana',
    title: 'Carillas de Porcelana Feldespática',
    heroBadge: 'Estética Dental Biomimética',
    category: 'Estética Dental de Mínima Invasión',
    heroSubtitle:
      'Láminas cerámicas ultrafinas (0,2 a 0,4 mm) elaboradas artesanalmente para transformar la anatomía, el color y la simetría de la sonrisa con mínima preparación del esmalte.',
    heroDescription:
      'Tratamiento de alta precisión adhesiva que preserva intacta la estructura biológica dental bajo magnificación óptica. Reproduce la translucidez, textura y opalescencia del esmalte dental natural.',
    durationEstimated: '2–3 citas clínicas (10–14 días de confección en laboratorio)',
    priceNotice:
      'Presupuesto cerrado sin costes ocultos tras el encerado diagnóstico y la prueba de simulación estética en boca.',
    procedureType: 'https://health-lifesci.schema.org/Prosthodontics',
    metaTitle: `Carillas de Porcelana en Madrid · Estética Biomimética de 0,2 mm | ${brandConfig.shortName}`,
    metaDescription:
      'Carillas cerámicas feldespáticas ultrafinas en el Barrio de Salamanca, Madrid. Preparación microscópica no-prep, prueba mock-up y estética natural garantizada.',
    whatIs: {
      title: 'Preservación dental y biomimética adhesiva',
      paragraphs: [
        'A diferencia de las fundas o coronas convencionales que exigen desgastar gran parte del volumen dental sano, las carillas de porcelana feldespática estratificada actúan como una fina lente de contacto sobre la superficie frontal del diente, con un espesor de entre 0,2 y 0,4 milímetros.',
        'La adhesión micromecánica con resinas estéticas bajo aislamiento absoluto de dique de goma fusiona la cerámica al esmalte dental a nivel molecular, alcanzando fuerzas de unión comparables a la unión dentina-esmalte natural y garantizando una integración duradera.',
      ],
      keyPoints: [
        'Espesor ultrafino de 0,2–0,4 mm con técnica de mínima invasión o sin tallado (no-prep).',
        'Estratificación individualizada por maestro ceramista con polvos feldespáticos de alta luminosidad.',
        'Superficie vítrea sin porosidad: inalterable frente a manchas de café, vino o tabaco.',
        'Prueba estética previa (mock-up) para validar longitud, fonética y expresión antes de fabricar las definitivas.',
      ],
    },
    whoIsItFor: {
      title: 'Indicaciones clínicas y criterios de selección',
      indications: [
        'Dientes con discromías profundas, fluorosis o tinciones por tetraciclinas resistentes al blanqueamiento químico.',
        'Desgastes del borde incisal o pequeñas fracturas debidas a atrición o bruxismo estabilizado.',
        'Anomalías de forma dentaria, dientes conoides o cierre estético de diastemas interdentales.',
        'Asimetrías leves de volumen en el corredor bucal para armonizar la línea de sonrisa.',
      ],
      contraindicationsNotice:
        'Contraindicado en bruxismo severo no controlado sin férula, ausencia de soporte posterior o pérdida acusada de esmalte vestibular que comprometa la adhesión.',
    },
    processSteps: [
      {
        step: '01',
        title: 'Estudio Fotográfico & Escaneado 3D',
        description:
          'Fotografía facial y dental de alta definición, registro intraoral tridimensional y análisis cinemático de labios para el diseño computarizado de la sonrisa.',
        estimatedTime: '60 min',
      },
      {
        step: '02',
        title: 'Encerado Diagnóstico & Prueba Mock-up',
        description:
          'Transferencia de resina provisional en boca sin tallar ningún diente. El paciente visualiza el resultado exacto y evalúa fonética y proporción antes de avanzar.',
        estimatedTime: '45 min',
      },
      {
        step: '03',
        title: 'Microacondicionamiento del Esmalte',
        description:
          'Preparación microscópica selectiva del esmalte si la anatomía lo requiere, seguida de escaneado óptico de alta precisión para el laboratorio protésico.',
        estimatedTime: '90 min',
      },
      {
        step: '04',
        title: 'Cementación Adhesiva Bajo Dique de Goma',
        description:
          'Aislamiento absoluto, tratamiento silánico de la porcelana y polimerización controlada con cementos fotosensibles de alta estabilidad cromática.',
        estimatedTime: '120 min',
      },
    ],
    clinicalCases: [
      {
        id: 'caso-carillas-1',
        title: 'Frente anterior superior con 6 carillas feldespáticas',
        diagnosis:
          'Desgaste incisal por atrición y tinción secundaria con asimetría en los ejes de los incisivos centrales.',
        resolution:
          'Aumento de 1,2 mm en longitud incisal respetando la guía canina y selección de color A1 con borde incisal translúcido.',
        duration: '3 citas clínicas en 14 días',
        placeholderLabel:
          '[IMAGEN REAL: Caso clínico de 6 carillas de porcelana antes/después con fotografía macro]',
        aspectRatio: 'aspect-[4/3]',
      },
      {
        id: 'caso-carillas-2',
        title: 'Cierre de diastemas y corrección de incisivos conoides',
        diagnosis:
          'Microdoncia de incisivos laterales bilaterales con presencia de espacios interdentales en sector anterior.',
        resolution:
          'Técnica no-prep (sin tallado) sobre esmalte intacto devolviendo la proporción áurea al sector anterior.',
        duration: '2 citas clínicas en 10 días',
        placeholderLabel:
          '[IMAGEN REAL: Detalle de integración gingival y cierre de diastema lateral sin tallado]',
        aspectRatio: 'aspect-[4/3]',
      },
    ],
    faq: [
      {
        q: '¿Es necesario limar o desgastar los dientes para colocar carillas?',
        a: 'En nuestro gabinete priorizamos el enfoque de mínima invasión biológica. Gracias al espesor ultrafino de 0,2 a 0,4 mm y a la planificación digital, en muchos casos no se realiza tallado o este se limita a una microtexturización del esmalte sin tocar dentina, conservando la vitalidad de la pieza intacta.',
      },
      {
        q: '¿Cuánto tiempo duran las carillas de porcelana?',
        a: 'La literatura científica internacional y nuestro seguimiento clínico demuestran una tasa de supervivencia superior al 95% a los 10–15 años cuando se adhieren sobre esmalte y el paciente mantiene una higiene adecuada y revisiones anuales con pulido marginal.',
      },
      {
        q: '¿Pueden teñirse con café, vino tinto o tabaco?',
        a: 'No. La porcelana feldespática vitrificada carece por completo de porosidad superficial, por lo que su color permanece inalterable frente a pigmentos alimentarios a lo largo de los años, a diferencia de los composites.',
      },
      {
        q: '¿Qué diferencia hay entre carillas de porcelana y de composite?',
        a: 'Las carillas de porcelana ofrecen una resistencia mecánica y estabilidad óptica muy superior a largo plazo sin perder brillo. El composite es una excelente alternativa directa pero requiere pulidos periódicos cada 12–18 meses para mantener su lustre.',
      },
    ],
    relatedTreatments: [
      {
        slug: 'blanqueamiento-dental',
        title: 'Blanqueamiento Dental Combinado',
        shortDesc: 'Aclaramiento previo de la dentina para unificar el fondo cromático antes de colocar carillas.',
        href: '/tratamientos/blanqueamiento-dental',
        tag: 'Complementario previo',
      },
      {
        slug: 'invisalign',
        title: 'Ortodoncia Invisible Invisalign®',
        shortDesc: 'Alineación dental previa para minimizar el tallado y colocar carillas ultrafinas conservadoras.',
        href: '/invisalign',
        tag: 'Alineación preparatoria',
      },
      {
        slug: 'cirugia-periodontal',
        title: 'Cirugía Plástica Periodontal',
        shortDesc: 'Armonización del festón gingival para conseguir márgenes simétricos en el frente estético.',
        href: '/tratamientos/cirugia-periodontal',
        tag: 'Estética rosa',
      },
    ],
  },

  'implantes-dentales': {
    slug: 'implantes-dentales',
    title: 'Implantología Guiada por Ordenador',
    heroBadge: 'Cirugía Oral Guiada por TAC 3D',
    category: 'Implantología y Cirugía Oral',
    heroSubtitle:
      'Restitución fija de piezas dentarias ausentes mediante fijaciones de titanio grado médico planificadas milimétricamente con tomografía computarizada CBCT.',
    heroDescription:
      'Cirugía mínimamente invasiva asistida por férula estereolitográfica 3D. Máxima previsibilidad biológica, menor inflamación tisular y opción de prótesis provisional fija inmediata en casos seleccionados.',
    durationEstimated: '1 sesión quirúrgica (osteointegración de 8–12 semanas para corona definitiva)',
    priceNotice:
      'Presupuesto personalizado con desglose técnico detallado tras estudio radiológico tridimensional en consulta.',
    procedureType: 'https://health-lifesci.schema.org/SurgicalProcedure',
    metaTitle: `Implantes Dentales en Madrid · Cirugía Guiada por TAC 3D | ${brandConfig.shortName}`,
    metaDescription:
      'Implantología guiada por ordenador en Madrid, Barrio de Salamanca. Colocación precisa sin suturas extensas, prótesis inmediata y titanio de alta biocompatibilidad.',
    whatIs: {
      title: 'Planificación tridimensional reversa y cirugía de mínima incisión',
      paragraphs: [
        'La implantología guiada digital combina la tomografía volumétrica de haz cónico (CBCT) con el escáner intraoral 3D. Diseñamos en un software especializado la posición tridimensional exacta de cada implante en función de la corona protésica ideal antes de la intervención quirúrgica.',
        'Mediante una férula de guiado quirúrgico estereolitográfica impresa en 3D, transferimos la posición planificada a la boca con precisión submilimétrica, reduciendo las incisiones extensas y minimizando el postoperatorio.',
      ],
      keyPoints: [
        'Titanio grado médico de máxima pureza con tratamiento de superficie para acelerar la osteointegración.',
        'Planificación protésicamente guiada: primero se diseña el diente y luego se ubica el implante en su eje idóneo.',
        'Técnica flapless (sin despegamiento de colgajo) en anatomías con volumen óseo adecuado: mínimo dolor postoperatorio.',
        'Protocolo de carga inmediata con prótesis provisional fija el mismo día cuando el torque primario lo avala.',
      ],
    },
    whoIsItFor: {
      title: 'Indicaciones clínicas y valoración anatómica',
      indications: [
        'Pérdida unitaria de una pieza dental por fractura radicular, traumatismo o caries no restaurable.',
        'Ausencia de múltiples dientes en sectores posteriores que merma la eficacia masticatoria y sobrecarga la articulación.',
        'Pacientes portadores de prótesis removibles inestables que desean una solución fija y confortable.',
        'Reposición en el mismo acto quirúrgico tras una extracción dental conservadora (implante postextracción).',
      ],
      contraindicationsNotice:
        'Se requiere evaluación radiológica previa en pacientes con diabetes no controlada, osteoporosis tratada con bifosfonatos intravenosos o tabaquismo severo (>20 cig/día).',
    },
    processSteps: [
      {
        step: '01',
        title: 'Diagnóstico 3D CBCT & Escaneado Óptico',
        description:
          'Tomografía volumétrica de haz cónico y escaneado intraoral para registrar la densidad ósea y las estructuras anatómicas críticas.',
        estimatedTime: '45 min',
      },
      {
        step: '02',
        title: 'Planificación Virtual & Férula Estereolitográfica',
        description:
          'Modelado computarizado de la posición axial del implante e impresión tridimensional de la guía quirúrgica personalizada.',
        estimatedTime: 'Fase digital',
      },
      {
        step: '03',
        title: 'Intervención Guiada & Diente Provisional',
        description:
          'Colocación del implante con anestesia local de alta eficacia a través de la férula. Carga provisional inmediata si existe estabilidad oclusal.',
        estimatedTime: '60 min',
      },
      {
        step: '04',
        title: 'Corona Definitiva Atornillada de Zirconio',
        description:
          'Tras la fase de osteointegración biológica, fijación de la corona definitiva sobre aditamento mecanizado de titanio.',
        estimatedTime: '45 min',
      },
    ],
    clinicalCases: [
      {
        id: 'caso-implantes-1',
        title: 'Implante unitario inmediato en incisivo central superior',
        diagnosis:
          'Fractura coronal no restaurable por traumatismo en pieza 2.1 con hueso alveolar vestibular preservado.',
        resolution:
          'Exodoncia mínimamente traumática, implante inmediato con injerto de biomaterial y corona provisional libre de contacto.',
        duration: 'Diente provisional el mismo día; corona definitiva a las 10 semanas',
        placeholderLabel:
          '[IMAGEN REAL: Radiografía y corona definitiva sobre implante en sector estético]',
        aspectRatio: 'aspect-[4/3]',
      },
      {
        id: 'caso-implantes-2',
        title: 'Rehabilitación de sector posterior mandibular bimolar',
        diagnosis:
          'Ausencia de primer y segundo molar inferior derecho con pérdida de dimensión vertical posterior.',
        resolution:
          'Dos implantes guiados por férula CBCT con regeneración ósea localizada y coronas atornilladas individuales.',
        duration: 'Osteointegración completa en 12 semanas',
        placeholderLabel:
          '[IMAGEN REAL: Detalle de emergencia de pilares transepiteliales y prótesis de zirconio]',
        aspectRatio: 'aspect-[4/3]',
      },
    ],
    faq: [
      {
        q: '¿Duele la colocación de un implante dental?',
        a: 'No. La intervención se realiza bajo anestesia local potente y controlada en un entorno relajado. Al emplear cirugía guiada por ordenador con incisiones mínimas, la gran mayoría de los pacientes refieren un postoperatorio con menos molestias que el de una extracción convencional.',
      },
      {
        q: '¿Puedo llevar un diente provisional el mismo día de la cirugía?',
        a: 'Sí, siempre que el anclaje inicial del implante en el hueso (torque primario) supere los 35 Ncm y no exista una infección aguda activa. Se coloca una corona provisional fija que restablece la estética desde el primer momento.',
      },
      {
        q: '¿Existe riesgo de que el cuerpo rechace el implante?',
        a: 'El titanio es un material inerte con una biocompatibilidad excelente y una tasa de éxito superior al 98%. No existe rechazo alérgico tisular; los raros casos de fracaso suelen vincularse a dificultades de osteointegración por contaminación bacteriana o tabaquismo severo.',
      },
      {
        q: '¿Cuánto tiempo dura un implante en la boca?',
        a: 'Con revisiones de control anuales, profilaxis profesional periódica y una correcta higiene interproximal, los implantes dentales están diseñados para acompañar al paciente durante décadas o toda la vida.',
      },
    ],
    relatedTreatments: [
      {
        slug: 'cirugia-periodontal',
        title: 'Cirugía Plástica Periodontal',
        shortDesc: 'Acondicionamiento y engrosamiento de la encía periimplantaria para máxima estabilidad.',
        href: '/tratamientos/cirugia-periodontal',
        tag: 'Soporte gingival',
      },
      {
        slug: 'odontologia-conservadora',
        title: 'Odontología Conservadora & GBT',
        shortDesc: 'Mantenimiento del lecho bucal y profilaxis guiada para prevenir periimplantitis.',
        href: '/tratamientos/odontologia-conservadora',
        tag: 'Mantenimiento',
      },
      {
        slug: 'carillas-de-porcelana',
        title: 'Carillas de Porcelana',
        shortDesc: 'Integración estética del frente anterior para completar rehabilitaciones complejas.',
        href: '/tratamientos/carillas-de-porcelana',
        tag: 'Estética facial',
      },
    ],
  },

  'blanqueamiento-dental': {
    slug: 'blanqueamiento-dental',
    title: 'Blanqueamiento Dental Combinado',
    heroBadge: 'Estética y Luminosidad Dental',
    category: 'Estética Dental No Invasiva',
    heroSubtitle:
      'Protocolo clínico doble: sesión en clínica mediante activación por luz fría de peróxidos controlados y refuerzo ambulatorio nocturno con férulas a medida.',
    heroDescription:
      'Aclaramiento seguro y profundo de la dentina respetando la pulpa y la estructura del esmalte. Formulación enriquecida con nitrato potásico y fosfatos para neutralizar la hipersensibilidad.',
    durationEstimated: '1 sesión clínica intensiva + 2–3 semanas de tratamiento domiciliario',
    priceNotice:
      'Presupuesto cerrado que incluye kit ambulatorio completo, férulas a medida personalizadas y geles desensibilizantes.',
    procedureType: 'https://health-lifesci.schema.org/NoninvasiveProcedure',
    metaTitle: `Blanqueamiento Dental en Madrid · Protocolo Dual en Clínica y Domicilio | ${brandConfig.shortName}`,
    metaDescription:
      'Blanqueamiento dental combinado en el Barrio de Salamanca, Madrid. Activación por luz fría, férulas a medida y máxima seguridad biológica sin dañar el esmalte.',
    whatIs: {
      title: 'La química controlada del aclaramiento dentinario',
      paragraphs: [
        'El color de los dientes radica en la dentina, visible a través de la capa translúcida del esmalte. Factores alimentarios (café, té, vino), el tabaco y el paso del tiempo depositan macromoléculas cromógenas oscuras en los canalículos dentinarios.',
        'El protocolo combinado descompone estas cadenas cromóforas mediante radicales de oxígeno activos liberados por peróxidos de formulación clínica regulada, devolviendo la luminosidad natural sin erosionar ni debilitar el esmalte.',
      ],
      keyPoints: [
        'Fase clínica con gel de alta pureza y aislamiento gingival con resina protectora fotopolimerizable.',
        'Fase ambulatoria con férulas blandas termoformadas que mantienen el gel en contacto íntimo durante la noche.',
        'Fórmula estabilizada con pH neutro para preservar la microdureza superficial del diente.',
        'Medición fotográfica objetiva del antes y después con guía colorimétrica Vita 3D-Master®.',
      ],
    },
    whoIsItFor: {
      title: 'Indicaciones y expectativas de resultado',
      indications: [
        'Dientes con tono amarillento o apagado generalizado debido al envejecimiento fisiológico de la dentina.',
        'Manchas profundas debidas a hábitos cromógenos (café, té, frutos rojos, vino tinto o refrescos oscuros).',
        'Paso preparatorio esencial antes de confeccionar carillas de porcelana o coronas anteriores.',
        'Pacientes que finalizan su ortodoncia invisible y desean iluminar y homogeneizar el color de su sonrisa.',
      ],
      contraindicationsNotice:
        'Requiere encías previamente sanas y ausencia de caries activas o restauraciones filtradas. No apto durante el embarazo o lactancia.',
    },
    processSteps: [
      {
        step: '01',
        title: 'Higiene Profiláctica & Registro de Tono',
        description:
          'Limpieza ultrasónica previa, eliminación de tinciones extrínsecas y calibración del color base con escala espectral Vita.',
        estimatedTime: '45 min',
      },
      {
        step: '02',
        title: 'Sesión en Clínica con Luz Fría',
        description:
          'Aislamiento estricto de la encía y tres ciclos sucesivos de activación de gel para abrir los canalículos cromóforos.',
        estimatedTime: '60 min',
      },
      {
        step: '03',
        title: 'Entrega de Férulas Ambulatorias',
        description:
          'Entrega de férulas a medida y jeringas de peróxido de carbamida con pautas de aplicación nocturna en el hogar.',
        estimatedTime: '30 min',
      },
      {
        step: '04',
        title: 'Revisión Final y Medición de Contraste',
        description:
          'Evaluación comparativa a los 21 días, registro de los tonos ganados y aplicación de barniz remineralizante de sellado.',
        estimatedTime: '30 min',
      },
    ],
    clinicalCases: [
      {
        id: 'caso-blanqueamiento-1',
        title: 'Aclaramiento de 5 tonos en paciente fumador con tinciones por café',
        diagnosis:
          'Saturación cromática severa grado A3.5 en sector anterior con pérdida notable de reflectividad.',
        resolution:
          'Protocolo combinado de sesión clínica seguida de 18 noches de uso domiciliario con gel desensibilizante.',
        duration: '21 días de tratamiento protocolizado',
        placeholderLabel:
          '[IMAGEN REAL: Comparativa fotográfica de escala de color antes (A3.5) y después (B1)]',
        aspectRatio: 'aspect-[4/3]',
      },
      {
        id: 'caso-blanqueamiento-2',
        title: 'Homogeneización de tono previa a rehabilitación estética',
        diagnosis:
          'Descompensación de tono entre caninos saturados y frente incisal anterior.',
        resolution:
          'Aclaramiento ambulatorio selectivo con carga dosificada hasta igualar el sustrato dental en tono luminoso B1.',
        duration: '14 días de aplicación ambulatoria',
        placeholderLabel:
          '[IMAGEN REAL: Registro de estabilidad cromática tras 6 meses postblanqueamiento]',
        aspectRatio: 'aspect-[4/3]',
      },
    ],
    faq: [
      {
        q: '¿El blanqueamiento dental estropea o desgasta el esmalte?',
        a: 'No. Los estudios científicos independientes y nuestra práctica médica certifican que los geles con pH neutro regulado no disuelven el esmalte ni reducen su dureza mineral. Su acción es exclusivamente oxidativa sobre las partículas de tinción acumuladas en los poros.',
      },
      {
        q: '¿Provoca mucha sensibilidad dental?',
        a: 'Nuestras formulaciones integran nitrato potásico y fluoruro sódico, agentes desensibilizantes que calman las terminaciones nerviosas de los túbulos dentinarios. Si aparece alguna molestia con bebidas muy frías, suele ser leve y remite por completo al concluir el tratamiento.',
      },
      {
        q: '¿Cuánto tiempo dura el color conseguido?',
        a: 'El resultado suele mantenerse estable entre 2 y 4 años en función de los hábitos higiénicos y dietéticos. Para prolongarlo de forma indefinida, basta con realizar un pequeño recordatorio domiciliario de 3 o 4 noches al año tras la profilaxis habitual.',
      },
      {
        q: '¿Blanquea empastes, fundas o carillas que ya llevo?',
        a: 'No. El producto blanqueador solo actúa sobre la dentina natural biológica. Si tienes restauraciones antiguas en dientes anteriores, se programará su recambio estético una vez estabilizado el nuevo tono final.',
      },
    ],
    relatedTreatments: [
      {
        slug: 'carillas-de-porcelana',
        title: 'Carillas de Porcelana',
        shortDesc: 'Transformación de forma y brillo sobre una base cromática previamente aclarada.',
        href: '/tratamientos/carillas-de-porcelana',
        tag: 'Estética integral',
      },
      {
        slug: 'invisalign',
        title: 'Ortodoncia Invisible Invisalign®',
        shortDesc: 'Alineación de piezas previa al aclaramiento para unificar la exposición a la luz.',
        href: '/invisalign',
        tag: 'Ortodoncia estética',
      },
      {
        slug: 'odontologia-conservadora',
        title: 'Odontología Conservadora & Profilaxis',
        shortDesc: 'Limpieza guiada por biopelícula GBT previa para maximizar la penetración del gel.',
        href: '/tratamientos/odontologia-conservadora',
        tag: 'Preparación clínica',
      },
    ],
  },

  'cirugia-periodontal': {
    slug: 'cirugia-periodontal',
    title: 'Cirugía Plástica Periodontal y Gingival',
    heroBadge: 'Periodoncia & Estética Rosa',
    category: 'Periodoncia y Microcirugía Gingival',
    heroSubtitle:
      'Tratamiento de recesiones gingivales, protección del soporte óseo dental y armonización del margen de la encía mediante microinjertos y técnicas de mínima incisión.',
    heroDescription:
      'Microcirugía periodontal realizada bajo magnificación microscópica con instrumental de alta precisión. Devuelve la simetría al festón gingival y elimina la hipersensibilidad radicular cubriendo raíces expuestas.',
    durationEstimated: '1–2 sesiones microquirúrgicas (maduración biológica tisular de 4–8 semanas)',
    priceNotice:
      'Presupuesto personalizado según la extensión del sextante o número de piezas afectadas tras sondaje periodontal digital.',
    procedureType: 'https://health-lifesci.schema.org/SurgicalProcedure',
    metaTitle: `Periodoncia y Cirugía Gingival en Madrid · Injertos y Estética Rosa | ${brandConfig.shortName}`,
    metaDescription:
      'Microcirugía plástica periodontal en el Barrio de Salamanca, Madrid. Recubrimiento de raíces expuestas, corrección de sonrisa gingival e injertos de tejido conectivo.',
    whatIs: {
      title: 'El equilibrio biológico entre la estética blanca y la estética rosa',
      paragraphs: [
        'La armonía de la sonrisa reside en la interacción entre la corona dental (estética blanca) y el festón gingival que la rodea (estética rosa). Procesos como la periodontitis, el cepillado traumático o la tracción muscular provocan retracción de la encía, dejando al descubierto la raíz dental y provocando hipersensibilidad y riesgo de caries radicular.',
        'La microcirugía periodontal emplea técnicas de tunelización e injertos de tejido conectivo autólogo de grosor milimétrico para engrosar biotipos finos y recubrir de manera predecible las zonas expuestas sin cicatrices visibles.',
      ],
      keyPoints: [
        'Uso de lupas quirúrgicas de alta magnificación e instrumental microquirúrgico específico.',
        'Técnicas de túnel que evitan incisiones verticales en la encía anterior para no dejar cicatriz.',
        'Recubrimiento radicular predecible en recesiones tipo Cairo RT1 y RT2.',
        'Alargamiento coronario estético guiado para corregir sonrisas gingivales y dientes aparentemente cortos.',
      ],
    },
    whoIsItFor: {
      title: 'Indicaciones clínicas y signos de alerta',
      indications: [
        'Recesión de la encía que deja la raíz dental al descubierto con sensibilidad al frío o al cepillado.',
        'Sonrisa gingival provocada por erupción pasiva alterada donde se muestra un exceso de encía al sonreír.',
        'Márgenes gingivales asimétricos o desalineados entre dientes homólogos del frente estético.',
        'Falta de encía queratinizada insertada alrededor de implantes dentales o tras movimientos ortodóncicos.',
      ],
      contraindicationsNotice:
        'Requiere un control previo absoluto de la placa bacteriana y ausencia de infección periodontal activa no tratada.',
    },
    processSteps: [
      {
        step: '01',
        title: 'Sondaje Periodontal & Mapeo Digital',
        description:
          'Medición de profundidad de sondaje en 6 puntos por pieza, calibración del biotipo gingival y fotografía macro.',
        estimatedTime: '45 min',
      },
      {
        step: '02',
        title: 'Desinfección Básica Guiada',
        description:
          'Eliminación minuciosa de depósitos subgingivales y descontaminación de la raíz mediante ultrasonidos de microfrecuencia.',
        estimatedTime: '60 min',
      },
      {
        step: '03',
        title: 'Microcirugía con Injerto Tisular',
        description:
          'Técnica de tunelización o colgajo coronal con colocación de microinjerto conectivo y suturas monofilamento de 6-0/7-0.',
        estimatedTime: '75 min',
      },
      {
        step: '04',
        title: 'Retirada de Microsuturas y Maduración',
        description:
          'Control a los 10–14 días, retirada atraumática de suturas y supervisión de la integración tisular a largo plazo.',
        estimatedTime: '30 min',
      },
    ],
    clinicalCases: [
      {
        id: 'caso-periodontal-1',
        title: 'Recubrimiento radicular en canino y premolar con técnica de túnel',
        diagnosis:
          'Recesión gingival de 3,5 mm con biotipo delgado y marcada hipersensibilidad al contacto térmico.',
        resolution:
          'Túnel subperióstico mínimamente invasivo con microinjerto de conectivo palatino y cobertura radicular del 100%.',
        duration: 'Cicatrización primaria a los 14 días; maduración completa a los 3 meses',
        placeholderLabel:
          '[IMAGEN REAL: Fotografía microscópica de recubrimiento radicular completo en canino]',
        aspectRatio: 'aspect-[4/3]',
      },
      {
        id: 'caso-periodontal-2',
        title: 'Gingivoplastia estética para corrección de sonrisa gingival',
        diagnosis:
          'Erupción pasiva alterada con sobreexposición de 4 mm de margen gingival y coronas clínicas cuadradas.',
        resolution:
          'Remodelado de encía y microosteoplastia para restablecer las proporciones anatómicas naturales de los dientes.',
        duration: '1 sesión clínica de 60 min',
        placeholderLabel:
          '[IMAGEN REAL: Resultado estético antes/después de proporciones dentales tras gingivoplastia]',
        aspectRatio: 'aspect-[4/3]',
      },
    ],
    faq: [
      {
        q: '¿Es dolorosa la toma del injerto en el paladar?',
        a: 'Utilizamos técnicas de microincisión y colocamos protectores de colágeno o férulas palatinas termoformadas que aíslan la zona por completo. Las molestias son similares a una pequeña rozadura alimentaria y ceden habitualmente en las primeras 48 a 72 horas.',
      },
      {
        q: '¿Por qué se retrae la encía en dientes sanos?',
        a: 'Las causas más habituales son la presencia de un biotipo de encía genéticamente muy delgado, un cepillado dental con fuerza excesiva o filamentos duros, la inflamación bacteriana periodontal o sobrecargas por bruxismo.',
      },
      {
        q: '¿Cuánto tiempo tarda en madurar la nueva encía?',
        a: 'La unión epitelial inicial se consolida entre los 10 y 14 días. La maduración profunda del colágeno gingival y la homogeneización del color y grosor se completan de manera definitiva entre las 6 y 10 semanas.',
      },
      {
        q: '¿Qué cuidados debo seguir tras la microcirugía?',
        a: 'Se prescribe dieta blanda templada durante 3–4 días, evitar cepillar directamente la zona tratada (sustituyéndolo por colutorios antisépticos específicos) y prescindir de actividad física intensa durante las primeras 72 horas.',
      },
    ],
    relatedTreatments: [
      {
        slug: 'implantes-dentales',
        title: 'Implantes Dentales Guiados',
        shortDesc: 'Acondicionamiento de encía queratinizada para proteger la fijación ósea del implante.',
        href: '/tratamientos/implantes-dentales',
        tag: 'Estabilidad periimplantaria',
      },
      {
        slug: 'carillas-de-porcelana',
        title: 'Carillas de Porcelana',
        shortDesc: 'Armonización del festón gingival antes de la cementación de láminas cerámicas anteriores.',
        href: '/tratamientos/carillas-de-porcelana',
        tag: 'Simetría marginal',
      },
      {
        slug: 'odontologia-conservadora',
        title: 'Odontología Conservadora & GBT',
        shortDesc: 'Profilaxis guiada de mantenimiento periódico para prevenir la recidiva periodontal.',
        href: '/tratamientos/odontologia-conservadora',
        tag: 'Terapia preventiva',
      },
    ],
  },

  'odontologia-conservadora': {
    slug: 'odontologia-conservadora',
    title: 'Odontología Conservadora y Prevención',
    heroBadge: 'Mínima Invasión Biológica',
    category: 'Prevención y Restauración Conservadora',
    heroSubtitle:
      'Preservación del tejido dental sano mediante terapia guiada por biopelícula (GBT), obturaciones biomiméticas de composite y revisiones digitales preventivas.',
    heroDescription:
      'Enfoque odontológico de mínima invasión centrado en anticiparse a las patologías orales. Conserva hasta la última micra de esmalte y dentina sana mediante diagnóstico microscópico precoz y tecnología de flujo aéreo suave.',
    durationEstimated: 'Revisiones recomendadas cada 6–12 meses (sesiones de 45–60 min)',
    priceNotice:
      'Tarifas médicas transparentes por acto clínico y protocolos de mantenimiento estructurados.',
    procedureType: 'https://health-lifesci.schema.org/Dentistry',
    metaTitle: `Odontología Conservadora en Madrid · Profilaxis GBT y Prevención | ${brandConfig.shortName}`,
    metaDescription:
      'Odontología de mínima invasión en Madrid, Barrio de Salamanca. Terapia guiada por biopelícula GBT, empastes estéticos de resina y preservación biológica.',
    whatIs: {
      title: 'El valor irreemplazable de la estructura dental biológica',
      paragraphs: [
        'Ningún biomaterial artificial supera las cualidades biomecánicas, elásticas y propioceptivas del diente natural. La odontología conservadora prioriza mantener las piezas intactas a lo largo de la vida, detectando microlesiones de caries antes de que afecten a la pulpa dental.',
        'Implementamos el protocolo suizo Guided Biofilm Therapy (GBT): tinción biológica de la placa bacteriana para visibilizarla y eliminación exhaustiva indolora mediante spray de agua templada y polvo de eritritol de solo 14 micras, protegiendo esmalte, encías y restauraciones.',
      ],
      keyPoints: [
        'Terapia GBT de EMS®: sin ruidos molestos, sin curetas agresivas y con temperatura termorregulada.',
        'Restauraciones biomiméticas con composites microhíbridos que imitan la estratificación óptica del diente.',
        'Diagnóstico radiológico digital de muy baja dosis para visualizar caries interproximales ocultas.',
        'Manejo del desgaste oclusal nocturno mediante férulas de descarga tipo Michigan ajustadas milimétricamente.',
      ],
    },
    whoIsItFor: {
      title: 'Indicaciones y frecuencia de mantenimiento',
      indications: [
        'Pacientes que desean mantener sus piezas dentales sanas y funcionales durante toda la vida.',
        'Presencia de restauraciones antiguas de amalgama o empastes desajustados con filtraciones bacterianas.',
        'Desgastes del borde incisal o fisuras oclusales por estrés masticatorio o bruxismo no tratado.',
        'Mantenimiento higiénico periódico para pacientes portadores de alineadores Invisalign® o implantes.',
      ],
      contraindicationsNotice:
        'Piezas con fracturas verticales radiculares o destrucciones subgingivales masivas que requieran abordajes protésicos o quirúrgicos.',
    },
    processSteps: [
      {
        step: '01',
        title: 'Exploración con Magnificación Óptica',
        description:
          'Inspección microscópica con luz polarizada y revisión oclusal para descartar microfracturas y desgastes incipientes.',
        estimatedTime: '30 min',
      },
      {
        step: '02',
        title: 'Revelado de Placa & Terapia GBT',
        description:
          'Aplicación de revelador orgánico de biofilm y limpieza suave con spray de eritritol y ultrasonidos piezoeléctricos.',
        estimatedTime: '40 min',
      },
      {
        step: '03',
        title: 'Restauración Adhesiva o Sellado',
        description:
          'Eliminación selectiva de tejido cariado bajo dique de goma y reconstrucción con capas estratificadas de composite.',
        estimatedTime: '45 min',
      },
      {
        step: '04',
        title: 'Plan Personalizado de Mantenimiento',
        description:
          'Asignación del calendario preventivo individual (6 o 12 meses) y recomendaciones personalizadas de higiene interdental.',
        estimatedTime: '15 min',
      },
    ],
    clinicalCases: [
      {
        id: 'caso-conservadora-1',
        title: 'Sustitución de amalgamas filtradas por restauraciones biomiméticas',
        diagnosis:
          'Filtración marginal con caries secundaria oculta bajo empastes de amalgama metálica en molares inferiores.',
        resolution:
          'Aislamiento con dique de goma, retirada cuidadosa y reconstrucción anatómica con composite microhíbrido pulido.',
        duration: '1 sesión clínica de 60 min',
        placeholderLabel:
          '[IMAGEN REAL: Reconstrucción oclusal anatómica con composite biomimético]',
        aspectRatio: 'aspect-[4/3]',
      },
      {
        id: 'caso-conservadora-2',
        title: 'Terapia GBT en paciente con inflamación gingival recurrente',
        diagnosis:
          'Gingivitis marginal por acumulación de biofilm subgingival resistente a la higiene domiciliaria estándar.',
        resolution:
          'Sesión completa de terapia guiada por biopelícula GBT con eritritol e instrucción de cepillado individualizada.',
        duration: 'Sesión única de 45 min con revisión a los 15 días',
        placeholderLabel:
          '[IMAGEN REAL: Revelado de biofilm antes y encías rosadas desinflamadas tras GBT]',
        aspectRatio: 'aspect-[4/3]',
      },
    ],
    faq: [
      {
        q: '¿En qué se diferencia la profilaxis GBT de una limpieza convencional?',
        a: 'La limpieza dental tradicional utiliza curetas metálicas y pastas abrasivas que pueden causar molestias y rayar el esmalte o los márgenes de las carillas. El protocolo suizo GBT emplea primero un revelador que tiñe las bacterias y luego un flujo templado de agua y polvo micrométrico de eritritol que desorganiza el biofilm con total suavidad y sin dolor.',
      },
      {
        q: '¿Cada cuánto tiempo conviene realizar una revisión dental?',
        a: 'En pacientes con salud gingival estable recomendamos una revisión con profilaxis cada 12 meses. En personas con tendencia a la gingivitis, periodontitis previa o portadores de ortodoncia, el intervalo óptimo suele ser cada 6 meses.',
      },
      {
        q: '¿Es obligatorio retirar los empastes antiguos oscuros de amalgama?',
        a: 'No necesariamente. Solo está indicado sustituirlos si presentan filtraciones bacterianas marginales, caries bajo el empaste, fisuras en la cúspide dental o por solicitud estética del paciente para homogeneizar el color de su boca.',
      },
      {
        q: '¿Qué es una férula de descarga tipo Michigan y para qué sirve?',
        a: 'Es un dispositivo rígido transparente elaborado a medida que se usa por la noche. Protege las piezas dentarias del desgaste involuntario por bruxismo y desprograma la musculatura masticatoria, aliviando tensiones en la articulación temporomandibular (ATM) y cefaleas tensionales.',
      },
    ],
    relatedTreatments: [
      {
        slug: 'blanqueamiento-dental',
        title: 'Blanqueamiento Dental Combinado',
        shortDesc: 'Aclaramiento dental seguro tras una profilaxis completa que elimine el biofilm.',
        href: '/tratamientos/blanqueamiento-dental',
        tag: 'Estética preventiva',
      },
      {
        slug: 'cirugia-periodontal',
        title: 'Cirugía Plástica Periodontal',
        shortDesc: 'Tratamiento avanzado cuando la inflamación gingival ha provocado pérdida de soporte.',
        href: '/tratamientos/cirugia-periodontal',
        tag: 'Salud de encías',
      },
      {
        slug: 'invisalign',
        title: 'Ortodoncia Invisible Invisalign®',
        shortDesc: 'Corrección de apiñamientos para facilitar la higiene interdental y prevenir caries futuras.',
        href: '/invisalign',
        tag: 'Prevención oclusal',
      },
    ],
  },
};

export const TREATMENT_SLUGS = Object.keys(TREATMENTS_DATA);

export function getTreatmentBySlug(slug: string): TreatmentDetail | undefined {
  return TREATMENTS_DATA[slug];
}

export const HASH_REDIRECT_MAP: Record<string, string> = {
  '#carillas': '/tratamientos/carillas-de-porcelana',
  '#carillas-porcelana': '/tratamientos/carillas-de-porcelana',
  '#carillas-de-porcelana': '/tratamientos/carillas-de-porcelana',
  '#implantes': '/tratamientos/implantes-dentales',
  '#implantes-guiados': '/tratamientos/implantes-dentales',
  '#implantes-dentales': '/tratamientos/implantes-dentales',
  '#blanqueamiento': '/tratamientos/blanqueamiento-dental',
  '#blanqueamiento-combinado': '/tratamientos/blanqueamiento-dental',
  '#blanqueamiento-dental': '/tratamientos/blanqueamiento-dental',
  '#periodoncia': '/tratamientos/cirugia-periodontal',
  '#estetica-gingival': '/tratamientos/cirugia-periodontal',
  '#cirugia-periodontal': '/tratamientos/cirugia-periodontal',
  '#odontologia-conservadora': '/tratamientos/odontologia-conservadora',
  '#conservadora': '/tratamientos/odontologia-conservadora',
  '#invisalign': '/invisalign',
};
