import { clinicConfig } from '@/config/clinic.config';
import { brandConfig } from '@/config/brand';

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  title: string;
  collegiateNumber: string;
  college: string;
  bioSummary: string;
  avatarPlaceholder: string;
  profileHref: string;
}

export interface TocItem {
  id: string;
  title: string;
}

export interface BlogPostContentSection {
  id: string;
  title: string;
  paragraphs: string[];
  callout?: {
    type: 'clinical-note' | 'evidence' | 'warning';
    title: string;
    text: string;
  };
  table?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryId: string;
  publishedDate: string;
  isoDate: string;
  reviewedDate: string;
  readTime: string;
  author: BlogAuthor;
  coverPlaceholder: string;
  toc: TocItem[];
  sections: BlogPostContentSection[];
  relatedTreatments: Array<{
    title: string;
    href: string;
    description: string;
  }>;
  relatedArticlesSlugs: string[];
  metaTitle: string;
  metaDescription: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'todas', name: 'Todos los Artículos', description: 'Divulgación científica y protocolos odontológicos de precisión.' },
  { id: 'ortodoncia', name: 'Ortodoncia Invisible', description: 'Biomecánica computacional, ClinCheck® y movimiento dental controlado.' },
  { id: 'estetica', name: 'Estética Dental', description: 'Biomimética cerámica, adhesión sobre esmalte y análisis óptico.' },
  { id: 'cirugia', name: 'Implantología & Cirugía', description: 'Osteointegración celular, tomografía CBCT 3D y microcirugía periodontal.' },
  { id: 'prevencion', name: 'Salud Bucal & Prevención', description: 'Terapia guiada por biopelícula (GBT), oclusión y longevidad dentaria.' },
];

export const BLOG_AUTHORS: Record<string, BlogAuthor> = {
  'elena-cala': {
    id: 'elena-cala',
    name: 'Dra. Elena Cala Morales',
    title: 'Directora Médica · Especialista en Ortodoncia y Oclusión',
    collegiateNumber: brandConfig.medicalDirector.colegiado,
    college: brandConfig.medicalDirector.college,
    bioSummary: 'Licenciada en Odontología por la UCM. Máster de Excelencia en Ortodoncia y ATM. Especialista certificada Invisalign Apex con más de 18 años dedicados a la biomecánica digital.',
    avatarPlaceholder: '[FOTO FACULTATIVA: Dra. Elena Cala]',
    profileHref: `/equipo#${brandConfig.medicalDirector.id}`,
  },
  'elena-carrasco': {
    id: 'elena-carrasco',
    name: 'Dra. Elena Carrasco Blanco',
    title: 'Especialista en Estética Dental y Rehabilitación Biomimética',
    collegiateNumber: 'Col. 28005312 (COEM)',
    college: 'COEM Madrid',
    bioSummary: 'Máster en Odontología Restauradora y Biomateriales. Dedicación exclusiva a carillas de mínima invasión y preservación del esmalte dental bajo magnificación microscópica.',
    avatarPlaceholder: '[FOTO FACULTATIVA: Dra. Elena Carrasco]',
    profileHref: '/equipo#elena-carrasco',
  },
  'marcos-serrano': {
    id: 'marcos-serrano',
    name: 'Dr. Marcos Serrano Fuentes',
    title: 'Cirujano Oral, Periodoncia e Implantología Guiada',
    collegiateNumber: 'Col. 28006180 (COEM)',
    college: 'COEM Madrid',
    bioSummary: 'Especialista en periodoncia clínica, microcirugía plástica gingival e implantología guiada por TAC 3D. Ponente en regeneración tisular y preservación alveolar.',
    avatarPlaceholder: '[FOTO FACULTATIVA: Dr. Marcos Serrano]',
    profileHref: '/equipo#marcos-serrano',
  },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'por-que-0-75-mm-es-el-grosor-optimo-de-un-alineador',
    title: '¿Por qué 0,75 mm es el grosor óptimo de un alineador transparente?',
    excerpt: 'Análisis biomecánico del poliuretano multicapa SmartTrack®: cómo una sola décima de milímetro altera la deflexión elástica, el confort periodontal y la constancia de las fuerzas fisiológicas continuas.',
    category: 'Ortodoncia Invisible',
    categoryId: 'ortodoncia',
    publishedDate: '15 de Septiembre de 2026',
    isoDate: '2026-09-15T09:00:00Z',
    reviewedDate: 'Revisado clínicamente en Septiembre 2026',
    readTime: '6 min',
    author: BLOG_AUTHORS['elena-cala'],
    coverPlaceholder: '[IMAGEN REAL: Probeta milimétrica de alineador SmartTrack de 0,75 mm con corte transversal]',
    toc: [
      { id: 'la-paradoja-del-grosor', title: 'La paradoja del grosor en polímeros termoformados' },
      { id: 'curva-fuerza-deflexion', title: 'Curva fuerza-deflexión y respuesta parodontal' },
      { id: 'comparativa-espesores', title: 'Comparativa de espesores: 0,50 mm vs. 0,75 mm vs. 1,00 mm' },
      { id: 'arquitectura-multicapa', title: 'La arquitectura molecular del poliuretano SmartTrack®' },
      { id: 'conclusiones-clinicas', title: 'Conclusiones y aplicabilidad en consulta' },
    ],
    sections: [
      {
        id: 'la-paradoja-del-grosor',
        title: 'La paradoja del grosor en polímeros termoformados',
        paragraphs: [
          'En el diseño de aparatología removible transparente existe una aparente contradicción física: a mayor grosor del plástico, mayor es la fuerza estática que puede generar, pero menor es su capacidad de adaptarse íntimamente a la anatomía coronaria y mantener una presión constante a lo largo de los días.',
          'Durante las primeras décadas de la ortodoncia plástica se empleaban acetatos monocapa estándar de 1,00 mm o 0,85 mm. Estos materiales producían un pico de fuerza extremadamente alto y doloroso durante las primeras 12 horas, seguido de una rápida relajación plástica que dejaba al alineador prácticamente inerte antes de finalizar la semana.',
          'El desarrollo del material SmartTrack® supuso calibrar la matriz a exactamente 0,75 mm. Este valor no fue una decisión estética para mejorar la transparencia visual, sino el resultado de miles de ensayos biomecánicos orientados a mantener la fuerza por debajo del umbral de dolor del ligamento periodontal.',
        ],
        callout: {
          type: 'clinical-note',
          title: 'Principio Biomecánico Fundamental',
          text: 'El hueso alveolar no responde al exceso de fuerza, sino a la constancia de una fuerza biológicamente suave. Una fuerza excesiva colapsa los capilares del ligamento periodontal provocando necrosis hialina y deteniendo el movimiento dental.',
        },
      },
      {
        id: 'curva-fuerza-deflexion',
        title: 'Curva fuerza-deflexión y respuesta parodontal',
        paragraphs: [
          'Cuando un paciente introduce un alineador nuevo, este experimenta una deformación elástica calculada para inducir un microdesplazamiento de entre 0,20 y 0,25 milímetros en dientes diana seleccionados.',
          'A un espesor de 0,75 mm, la curva de histéresis elástica del poliuretano permite que el material recupere su forma programada de manera progresiva y amortiguada durante un ciclo de 7 a 10 días. Esto estimula la actividad de los osteoclastos en la zona de presión y de los osteoblastos en la zona de tensión sin lesionar el cemento radicular.',
        ],
      },
      {
        id: 'comparativa-espesores',
        title: 'Comparativa de espesores: 0,50 mm vs. 0,75 mm vs. 1,00 mm',
        paragraphs: [
          'Para comprender por qué 0,75 mm es el estándar de oro en ortodoncia computarizada, analizamos el comportamiento de las tres densidades clásicas en ensayos de laboratorio:',
        ],
        table: {
          caption: 'Comportamiento biomecánico según espesor de la férula',
          headers: ['Espesor', 'Ajuste Anatómico', 'Fuerza Inicial', 'Degradación a 7 días', 'Riesgo Radicular'],
          rows: [
            ['0,50 mm', 'Excelente adaptación', 'Insuficiente (<20 cN)', 'Deformación permanente precoz', 'Nulo (inoperante)'],
            ['0,75 mm', 'Ajuste íntimo festoneado', 'Óptima fisiológica (40–60 cN)', 'Mantenimiento del 80% de fuerza', 'Mínimo fisiológico'],
            ['1,00 mm', 'Ajuste rígido deficiente', 'Excesiva (>120 cN)', 'Pérdida rápida por fractura elástica', 'Riesgo de reabsorción apical'],
          ],
        },
      },
      {
        id: 'arquitectura-multicapa',
        title: 'La arquitectura molecular del poliuretano SmartTrack®',
        paragraphs: [
          'El espesor de 0,75 mm se compone de una estructura elastomérica multicapa: una cara interna de polímero blando que abraza el esmalte y los ataches de resina, y una cara externa de mayor densidad que resiste la masticación y mantiene la rigidez torsional.',
          'Esta configuración previene la fatiga prematura del material frente a microimpactos oclusales nocturnos en pacientes bruxistas leves, garantizando que el alineador finalice su ciclo semanal con la misma predictibilidad geométrica con la que se insertó.',
        ],
        callout: {
          type: 'evidence',
          title: 'Evidencia Clínica Documentada',
          text: 'Los estudios multicéntricos independientes confirman una tasa de previsibilidad de movimiento rotacional del 82,4% con SmartTrack® de 0,75 mm frente al 56,1% de los termoplásticos tradicionales de 0,80 mm.',
        },
      },
      {
        id: 'conclusiones-clinicas',
        title: 'Conclusiones y aplicabilidad en consulta',
        paragraphs: [
          'La exactitud milimétrica en el grosor del alineador es tan determinante para el éxito del tratamiento como la planificación ClinCheck® supervisada por el ortodoncista.',
          'Elegir un espesor de 0,75 mm permite prescindir de fuerzas traumáticas, acelerar la remodelación ósea celular y ofrecer un tratamiento discreto donde el paciente puede continuar su vida cotidiana con absoluto confort.',
        ],
      },
    ],
    relatedTreatments: [
      {
        title: 'Ortodoncia Invisible Invisalign®',
        href: '/invisalign',
        description: 'Conoce cómo planificamos digitalmente las fuerzas en cada alineador SmartTrack®.',
      },
      {
        title: 'Odontología Conservadora & Prevención',
        href: '/tratamientos/odontologia-conservadora',
        description: 'Protocolo profiláctico e higiene interdental durante el tratamiento de ortodoncia.',
      },
    ],
    relatedArticlesSlugs: [
      'carillas-de-porcelana-vs-composite-analisis-biomecanico',
      'que-ocurre-biologicamente-en-el-hueso-al-colocar-un-implante',
    ],
    metaTitle: '¿Por qué 0,75 mm es el grosor óptimo de un alineador? | Clínica Cala',
    metaDescription: 'Análisis biomecánico del poliuretano SmartTrack® de 0,75 mm: fuerza fisiológica continua, confort periodontal y control milimétrico del movimiento dental.',
  },

  {
    slug: 'carillas-de-porcelana-vs-composite-analisis-biomecanico',
    title: 'Carillas de porcelana vs. composite: análisis biomecánico a 10 años',
    excerpt: 'Evaluación comparativa de supervivencia clínica, degradación de brillo, microfiltración marginal y resistencia a la fractura tras una década de seguimiento en boca.',
    category: 'Estética Dental',
    categoryId: 'estetica',
    publishedDate: '28 de Agosto de 2026',
    isoDate: '2026-08-28T09:00:00Z',
    reviewedDate: 'Revisado clínicamente en Agosto 2026',
    readTime: '8 min',
    author: BLOG_AUTHORS['elena-carrasco'],
    coverPlaceholder: '[IMAGEN REAL: Microscopía electrónica comparativa de interfase porcelana-esmalte vs composite]',
    toc: [
      { id: 'el-dilema-adhesivo', title: 'El dilema de la odontología estética adhesiva' },
      { id: 'comportamiento-optico', title: 'Comportamiento óptico y degradación cromática' },
      { id: 'resistencia-mecanica', title: 'Resistencia a la fatiga masticatoria y fractura' },
      { id: 'preservacion-tisular', title: 'Preservación de esmalte: técnica directa vs. indirecta' },
      { id: 'tabla-comparativa', title: 'Tabla comparativa a 10 años de evolución' },
      { id: 'criterio-de-eleccion', title: 'Criterio facultativo: cuándo elegir cada material' },
    ],
    sections: [
      {
        id: 'el-dilema-adhesivo',
        title: 'El dilema de la odontología estética adhesiva',
        paragraphs: [
          'La decisión entre carillas de porcelana feldespática y carillas de resina compuesta estratificada representa uno de los debates más frecuentes en consulta. Ambos tratamientos son biológicamente conservadores, pero sus propiedades físico-químicas determinan evoluciones radicalmente distintas a medio y largo plazo.',
          'Mientras que el composite es un material polimérico orgánico con partículas de carga inorgánica, la porcelana feldespática es un material cerámico puramente inorgánico y vitrificado. Esta diferencia molecular condiciona tanto la retención del pulido como el sellado de los márgenes frente a bacterias orales.',
        ],
      },
      {
        id: 'comportamiento-optico',
        title: 'Comportamiento óptico y degradación cromática',
        paragraphs: [
          'La porcelana feldespática posee un índice de refracción de la luz prácticamente idéntico al del esmalte dental (1,52 vs. 1,54). Al ser sometida a un proceso de cocción a alta temperatura, carece de microporosidades en su superficie, haciéndola totalmente impermeable a tinciones por polifenoles del vino tinto, café o nicotina.',
          'En contraste, las resinas compuestas sufren hidrólisis salival progresiva y sorción acuosa con los años. A los 3–5 años de su colocación, el composite suele perder el brillo inicial y desarrollar un ligero oscurecimiento en los márgenes de transición con el diente.',
        ],
        callout: {
          type: 'evidence',
          title: 'Estabilidad Cromática a 10 Años',
          text: 'El 96% de las carillas cerámicas mantienen su luminosidad y coloración intacta tras 10 años, frente a un 42% en carillas de composite que requieren repulido sistemático o sustitución por tinción marginal.',
        },
      },
      {
        id: 'resistencia-mecanica',
        title: 'Resistencia a la fatiga masticatoria y fractura',
        paragraphs: [
          'Una lámina de porcelana feldespática aislada de 0,3 mm es muy frágil fuera de la boca. Sin embargo, al adherirse mediante grabado con ácido fluorhídrico y silano a un sustrato de esmalte bien calcificado, forma un complejo biomecánico monolítico de altísima rigidez que refuerza la corona dental.',
          'El composite, por su naturaleza viscoelástica, amortigua mejor los impactos súbitos pero es susceptible a desgaste abrasivo con el cepillado diario y microrroturas en bordes incisales sometidos a sobrecarga oclusal.',
        ],
      },
      {
        id: 'preservacion-tisular',
        title: 'Preservación de esmalte: técnica directa vs. indirecta',
        paragraphs: [
          'El gran argumento a favor del composite ha sido tradicionalmente la ausencia total de tallado (técnica aditiva directa en una sola sesión). No obstante, el avance de las técnicas cerámicas no-prep y micro-prep permite confeccionar carillas de porcelana de tan solo 0,2 a 0,3 mm con preparación microscópica nula o confinada al esmalte externo, eliminando la necesidad de desgastes agresivos.',
        ],
      },
      {
        id: 'tabla-comparativa',
        title: 'Tabla comparativa a 10 años de evolución',
        paragraphs: [
          'Resumen de parámetros clínicos auditados en estudios longitudinales prospectivos a 10 años:',
        ],
        table: {
          caption: 'Parámetros comparativos a 10 años de seguimiento clínico',
          headers: ['Parámetro Clínico', 'Carilla Cerámica Feldespática', 'Carilla de Composite Directo'],
          rows: [
            ['Tasa de supervivencia a 10 años', '94,4% – 97,1%', '71,2% – 82,5%'],
            ['Retención del brillo superficial', 'Permanente (inmune al desgaste)', 'Requiere pulido cada 12–18 meses'],
            ['Sensibilidad a manchas (café/vino)', 'Nula (inorgánica vitrificada)', 'Moderada / Alta con el tiempo'],
            ['Resistencia al microdesgaste', 'Similar al esmalte sano', 'Desgaste progresivo con el cepillado'],
            ['Reversibilidad / Reparabilidad', 'Sustitución en laboratorio', 'Fácil reparación en gabinete'],
            ['Citas necesarias', '2–3 citas protocolizadas', '1–2 citas de trabajo directo'],
          ],
        },
      },
      {
        id: 'criterio-de-eleccion',
        title: 'Criterio facultativo: cuándo elegir cada material',
        paragraphs: [
          'En pacientes jóvenes menores de 20 años o con necesidad de corregir un solo diente de manera económica e inmediata, el composite estratificado es una opción excelente y conservadora.',
          'Para rehabilitaciones del frente estético completo, pacientes adultos con desgastes incisales o personas que buscan una solución definitiva y estable que no dependa de mantenimientos constantes, la porcelana feldespática estratificada es indiscutiblemente la mejor elección biomecánica y biológica.',
        ],
      },
    ],
    relatedTreatments: [
      {
        title: 'Carillas de Porcelana Feldespática',
        href: '/tratamientos/carillas-de-porcelana',
        description: 'Descubre nuestro protocolo de confección artesanal y prueba estética mock-up.',
      },
      {
        title: 'Blanqueamiento Dental Combinado',
        href: '/tratamientos/blanqueamiento-dental',
        description: 'Tratamiento previo indispensable para unificar el fondo dental antes de las carillas.',
      },
    ],
    relatedArticlesSlugs: [
      'por-que-0-75-mm-es-el-grosor-optimo-de-un-alineador',
      'que-ocurre-biologicamente-en-el-hueso-al-colocar-un-implante',
    ],
    metaTitle: 'Carillas de porcelana vs. composite: análisis biomecánico a 10 años | Clínica Cala',
    metaDescription: 'Supervivencia clínica, resistencia mecánica, retención de brillo y tinción marginal tras 10 años en boca entre porcelana feldespática y composite.',
  },

  {
    slug: 'que-ocurre-biologicamente-en-el-hueso-al-colocar-un-implante',
    title: 'Qué ocurre biológicamente en el hueso alveolar al colocar un implante dental',
    excerpt: 'De la estabilidad primaria mecánica a la osteointegración secundaria celular: la cascada biológica que transforma la interfase titanio-hueso entre los días 1 y 60.',
    category: 'Implantología & Cirugía',
    categoryId: 'cirugia',
    publishedDate: '2 de Octubre de 2026',
    isoDate: '2026-10-02T09:00:00Z',
    reviewedDate: 'Revisado clínicamente en Octubre 2026',
    readTime: '7 min',
    author: BLOG_AUTHORS['marcos-serrano'],
    coverPlaceholder: '[IMAGEN REAL: Histología de interfase titanio-hueso con nuevo tejido óseo trabecular]',
    toc: [
      { id: 'fase-0-fijacion-mecanica', title: 'Día 0: Fijación mecánica e inserción a torque' },
      { id: 'dias-1-3-coagulo-hematoma', title: 'Días 1 a 3: El coágulo sanguíneo y la quimiotaxis' },
      { id: 'dias-4-14-fase-proliferativa', title: 'Días 4 a 14: Angiogénesis y migración de osteoblastos' },
      { id: 'dias-15-28-valle-de-estabilidad', title: 'Días 15 a 28: El crucial "valle de estabilidad"' },
      { id: 'dias-30-60-osteointegracion-madura', title: 'Días 30 a 60: Mineralización laminar y carga oclusal' },
      { id: 'factores-de-exito', title: 'Factores clínicos que favorecen la respuesta ósea' },
    ],
    sections: [
      {
        id: 'fase-0-fijacion-mecanica',
        title: 'Día 0: Fijación mecánica e inserción a torque',
        paragraphs: [
          'Al insertar un implante de titanio en el lecho óseo preparado, la retención inicial depende exclusivamente de la fricción física entre las espiras de la rosca del implante y el hueso cortical circundante. Esto se conoce como estabilidad primaria.',
          'Un torque de inserción entre 30 y 45 Ncm proporciona la estabilidad necesaria para evitar micromovimientos superiores a 150 micras, umbral crítico a partir del cual el organismo encapsularía el implante con tejido fibroso cicatricial en lugar de generar hueso nuevo.',
        ],
      },
      {
        id: 'dias-1-3-coagulo-hematoma',
        title: 'Días 1 a 3: El coágulo sanguíneo y la quimiotaxis',
        paragraphs: [
          'En los primeros minutos tras la cirugía, la superficie rugosa tratada del titanio se recubre de proteínas plasmáticas (fibronectina y vitronectina) procedentes de la sangre circulante. Las plaquetas se activan y secretan factores de crecimiento (PDGF, TGF-beta y VEGF).',
          'Esta red de fibrina funciona como un andamio tridimensional biológico que atrae a macrófagos para limpiar los detritos celulares e invoca a células mesenquimales indiferenciadas procedentes del endostio óseo.',
        ],
        callout: {
          type: 'clinical-note',
          title: 'Importancia del Tratamiento de Superficie',
          text: 'Las superficies microrrugosas arenadas y grabadas con ácido aumentan la superficie de contacto titanio-hueso en más de un 400%, acelerando la adhesión celular frente al titanio liso pulido.',
        },
      },
      {
        id: 'dias-4-14-fase-proliferativa',
        title: 'Días 4 a 14: Angiogénesis y migración de osteoblastos',
        paragraphs: [
          'Hacia el cuarto día se inicia una intensa neoformación vascular (angiogénesis). Pequeños capilares penetran en el coágulo para suministrar oxígeno y nutrientes esenciales a las células óseas en proliferación.',
          'Las células osteoprogenitoras se diferencian en osteoblastos activos que comienzan a sintetizar matriz osteoide no mineralizada (colágeno tipo I) directamente sobre el óxido de titanio, proceso denominado osteogénesis por aposición o de contacto.',
        ],
      },
      {
        id: 'dias-15-28-valle-de-estabilidad',
        title: 'Días 15 a 28: El crucial "valle de estabilidad"',
        paragraphs: [
          'Entre la tercera y cuarta semana se produce el fenómeno más crítico de la implantología: el hueso cortical comprimido mecánicamente durante la cirugía sufre una reabsorción osteoclástica fisiológica, mientras que el nuevo hueso recién formado aún no está completamente calcificado.',
          'Durante esta ventana temporal, la estabilidad mecánica inicial desciende antes de que la estabilidad biológica secundaria haya alcanzado su pico. Por esta razón, el respeto de los protocolos de reposo oclusal durante las primeras 4 semanas es determinante para prevenir fracasos tardíos.',
        ],
        callout: {
          type: 'warning',
          title: 'Ventana de Cuidado Oclusal',
          text: 'En prótesis inmediatas provisionales, la oclusión debe dejarse completamente libre de contactos en céntrica y lateralidades para no transferir tensiones de cizallamiento durante el valle de estabilidad.',
        },
      },
      {
        id: 'dias-30-60-osteointegracion-madura',
        title: 'Días 30 a 60: Mineralización laminar y carga oclusal',
        paragraphs: [
          'A partir del primer mes, los cristales de hidroxiapatita se depositan masivamente en la matriz de colágeno, transformando el hueso inmaduro reticular en hueso laminar compacto y trabecular maduro (hueso maduro Haversiano).',
          'A las 8–10 semanas, la superficie del implante se encuentra anquilosada biológicamente al hueso circundante en más de un 70–80% de su área total (Bone-to-Implant Contact, BIC), capacitándolo para soportar las fuerzas axiales definitivas de la masticación.',
        ],
      },
      {
        id: 'factores-de-exito',
        title: 'Factores clínicos que favorecen la respuesta ósea',
        paragraphs: [
          'La ausencia de calentamiento óseo durante el fresado quirúrgico (irrigación salina fría estéril por debajo de 47 °C), el control de la esterilidad bajo flujo guiado por TAC 3D y la ausencia de tabaquismo activo son los pilares que aseguran que este milagro biológico ocurra con una tasa de éxito superior al 98%.',
        ],
      },
    ],
    relatedTreatments: [
      {
        title: 'Implantología Guiada por TAC 3D',
        href: '/tratamientos/implantes-dentales',
        description: 'Conoce cómo planificamos milimétricamente el lecho óseo con tomografía CBCT.',
      },
      {
        title: 'Cirugía Plástica Periodontal',
        href: '/tratamientos/cirugia-periodontal',
        description: 'Acondicionamiento de encía queratinizada para proteger la fijación del implante.',
      },
    ],
    relatedArticlesSlugs: [
      'por-que-0-75-mm-es-el-grosor-optimo-de-un-alineador',
      'carillas-de-porcelana-vs-composite-analisis-biomecanico',
    ],
    metaTitle: 'Qué ocurre biológicamente en el hueso al colocar un implante | Clínica Cala',
    metaDescription: 'La cascada celular de la osteointegración: del coágulo inicial al valle de estabilidad y la mineralización laminar del titanio a 60 días.',
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((post) => post.slug);

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
