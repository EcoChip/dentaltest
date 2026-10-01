import { brandConfig } from '@/config/brand';

/**
 * CONTENIDO LEGAL CENTRALIZADO (RGPD, LOPDGDD, LSSI-CE)
 * Clínica Dental Cala & Asociados
 * 
 * BORRADOR LEGAL: Todos los campos pendientes de confirmación societaria
 * están marcados inequívocamente como [COMPLETAR: ...].
 * Debe ser revisado y validado por el asesor jurídico / DPO de la clínica antes del paso a producción.
 */

export const legalConfig = {
  lastUpdated: '1 de octubre de 2026',
  warningNotice: 'BORRADOR: REVISAR POR ASESOR LEGAL ANTES DE PUBLICAR',

  // Identificación societaria y sanitaria
  identification: {
    companyName: brandConfig.legalName,
    tradeName: brandConfig.tradeName,
    cif: brandConfig.legal.cif,
    registeredAddress: `${brandConfig.contact.address.street}, ${brandConfig.contact.address.postalCode} ${brandConfig.contact.address.city}, España`,
    contactEmail: brandConfig.emails.contact,
    contactPhone: brandConfig.contact.phoneFormatted,
    dpoEmail: brandConfig.emails.dpo,
    mercantileRegistry: '[COMPLETAR: Datos de inscripción en el Registro Mercantil de Madrid: Tomo, Libro, Folio, Sección, Hoja]',
    sanitaryRegistryCode: brandConfig.legal.sanitaryRegistry,
    competentAuthority: brandConfig.legal.regulatoryAuthority,
  },

  // Cuadro Facultativo y Colegiación
  medicalGovernance: {
    medicalDirector: brandConfig.medicalDirector.name,
    officialTitle: 'Licenciada en Odontología por la Universidad Complutense de Madrid',
    collegiateNumber: brandConfig.medicalDirector.colegiado,
    professionalCollege: brandConfig.medicalDirector.college,
    deontologicalCode: 'Código Deontológico del Consejo General de Colegios Oficiales de Odontólogos y Estomatólogos de España',
  },

  // Encargados del tratamiento de datos (Proveedores)
  dataProcessors: [
    {
      role: 'Proveedor de Alojamiento Web y Servidores',
      entity: '[COMPLETAR: Nombre del proveedor de hosting con servidores en la Unión Europea, ej. Vercel Inc. / Hetzner Online GmbH]',
      location: 'Unión Europea (Cláusulas Contractuales Tipo / RGPD)',
      purpose: 'Infraestructura tecnológica, entrega de contenido y seguridad perimetral.',
    },
    {
      role: 'Proveedor de Comunicaciones y Mensajería Transaccional',
      entity: '[COMPLETAR: Proveedor de correo transaccional de avisos de cita, ej. Resend Inc. / Google Workspace]',
      location: 'Unión Europea / Data Privacy Framework',
      purpose: 'Notificación cifrada de solicitudes de cita médica a la recepción de la clínica.',
    },
  ],

  // Plazos de conservación de datos
  retentionPeriods: {
    bookingRequests: '12 meses desde la formalización o desistimiento de la solicitud de cita previa, salvo que el usuario inicie relación clínico-asistencial.',
    clinicalRecords: '[COMPLETAR: Plazo legal de conservación de historia clínica, mínimo 5 años desde la última visita asistencial conforme al Art. 21 de la Ley 41/2002 básica reguladora de la autonomía del paciente]',
    webAccessLogs: '30 días con fines estrictos de seguridad de redes y prevención de ataques de denegación de servicio.',
    cookieConsent: '12 meses desde la aceptación o configuración de las preferencias de cookies.',
  },
};

export const avisoLegalContent = {
  title: 'Aviso Legal e Información Societaria',
  law: 'Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE)',
  sections: [
    {
      id: 'datos-identificativos',
      title: '1. Datos Identificativos de la Sociedad Titular',
      paragraphs: [
        `En cumplimiento de lo preceptuado en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se hace constar que el presente sitio web es titularidad de ${legalConfig.identification.companyName}, con NIF ${legalConfig.identification.cif}, y domicilio social en ${legalConfig.identification.registeredAddress}.`,
        `Datos de inscripción registral: ${legalConfig.identification.mercantileRegistry}.`,
        `Para cualquier comunicación directa y efectiva, ponemos a disposición de los usuarios la dirección de correo electrónico ${legalConfig.identification.contactEmail} y la línea telefónica ${legalConfig.identification.contactPhone}.`,
      ],
    },
    {
      id: 'autorizacion-sanitaria',
      title: '2. Autorización Sanitaria y Ejercicio Profesional',
      paragraphs: [
        `La clínica cuenta con la preceptiva autorización sanitaria de funcionamiento: ${legalConfig.identification.sanitaryRegistryCode}, otorgada por ${legalConfig.identification.competentAuthority}.`,
        `La Dirección Médica y la supervisión asistencial corresponden a la ${legalConfig.medicalGovernance.medicalDirector}, con número de colegiación ${legalConfig.medicalGovernance.collegiateNumber} adscrita al ${legalConfig.medicalGovernance.professionalCollege}. Titulación: ${legalConfig.medicalGovernance.officialTitle}.`,
        `El ejercicio profesional de todo el cuadro facultativo se rige escrupulosamente por el ${legalConfig.medicalGovernance.deontologicalCode}.`,
      ],
    },
    {
      id: 'objeto-y-condiciones',
      title: '3. Objeto y Exención de Asesoramiento Médico Presencial',
      paragraphs: [
        'El contenido publicado en este portal web tiene carácter meramente orientativo, divulgativo e informativo sobre las técnicas de ortodoncia invisible digital, biomecánica computacional y odontología estética practicadas en el centro.',
        'Bajo ninguna circunstancia la información contenida en esta web constituye diagnóstico médico, dictamen terapéutico ni sustituye la consulta médica presencial. La prescripción de un plan de tratamiento ortodóncico u odontológico requiere ineludiblemente una exploración clínica directa, escaneado intraoral tridimensional y estudio radiográfico individualizado realizado por un odontólogo colegiado.',
      ],
    },
    {
      id: 'propiedad-intelectual',
      title: '4. Propiedad Intelectual e Industrial',
      paragraphs: [
        `Todos los elementos de este sitio web —incluyendo código fuente, representaciones gráficas WebGL, shaders tridimensionales, logotipos, elementos tipográficos, fotografías e ilustraciones CAD— son propiedad exclusiva de ${legalConfig.identification.companyName} o de licenciantes autorizados.`,
        'Queda terminantemente prohibida su reproducción total o parcial, comunicación pública, transformación o distribución sin la previa y expresa autorización por escrito de la sociedad titular.',
      ],
    },
    {
      id: 'jurisdiccion',
      title: '5. Ley Aplicable y Fuero Jurisdiccional',
      paragraphs: [
        'Para la resolución de cualquier controversia judicial o litigio derivado del acceso o uso del presente sitio web, será de exclusiva aplicación la legislación española, sometiéndose las partes a la jurisdicción de los Juzgados y Tribunales de la ciudad de Madrid.',
      ],
    },
  ],
};

export const privacidadContent = {
  title: 'Política de Privacidad y Protección de Datos',
  law: 'Reglamento General de Protección de Datos (RGPD UE 2016/679) y Ley Orgánica 3/2018 (LOPDGDD)',
  sections: [
    {
      id: 'responsable',
      title: '1. Responsable del Tratamiento',
      paragraphs: [
        `El responsable del tratamiento de los datos personales recabados a través de esta plataforma web es ${legalConfig.identification.companyName}, con NIF ${legalConfig.identification.cif} y domicilio en ${legalConfig.identification.registeredAddress}.`,
        `Contacto de la Delegación de Protección de Datos: ${legalConfig.identification.dpoEmail}.`,
      ],
    },
    {
      id: 'advertencia-salud',
      title: '2. Advertencia Sanitaria Crucial: Ausencia de Datos de Salud en la Web',
      paragraphs: [
        'EL FORMULARIO DE CONTACTO Y CITA PREVIA NO ESTÁ DISEÑADO NI DEBE UTILIZARSE PARA EL ENVÍO DE DATOS DE SALUD, HISTORIALES MÉDICOS, RADIOGRAFÍAS O INFORMACIÓN CLÍNICA CONFIDENCIAL.',
        'El formulario web tiene la finalidad exclusiva de concertar la fecha y hora de la primera visita diagnóstica presencial y recabar los datos de contacto imprescindibles (nombre, teléfono y observaciones horarias). La recopilación de antecedentes médicos y datos de salud de categoría especial (Art. 9 RGPD) se efectúa de forma rigurosamente presencial en el gabinete clínico, bajo firma del consentimiento informado sanitario y sujeción al secreto médico legal.',
      ],
    },
    {
      id: 'finalidad-base',
      title: '3. Finalidad del Tratamiento y Base Jurídica',
      paragraphs: [
        'Finalidad: Gestión de la solicitud de cita de valoración previa, confirmación de disponibilidad horaria y respuesta a consultas informativas sobre nuestros protocolos clínicos.',
        'Base jurídica: El consentimiento explícito otorgado libremente por el usuario mediante la marcación afirmativa e informada de la casilla de aceptación de la política de privacidad (Artículo 6.1.a del RGPD).',
      ],
    },
    {
      id: 'destinatarios',
      title: '4. Destinatarios y Transferencias Internacionales',
      paragraphs: [
        'Los datos personales no serán cedidos a terceras entidades comerciales en ningún caso, salvo imperativo legal o requerimiento de la autoridad judicial.',
        'Tienen acceso a los datos únicamente los encargados del tratamiento estrictamente vinculados a la operatividad técnica de la clínica:',
        ...legalConfig.dataProcessors.map((p) => `• ${p.role}: ${p.entity} (${p.location}). Finalidad: ${p.purpose}`),
        'No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo sin las garantías adecuadas de seguridad (Cláusulas Contractuales Tipo o Data Privacy Framework UE-EE.UU.).',
      ],
    },
    {
      id: 'conservacion',
      title: '5. Plazos de Conservación de la Información',
      paragraphs: [
        `• Solicitudes web de cita previa: ${legalConfig.retentionPeriods.bookingRequests}`,
        `• Registros de seguridad y logs técnicos: ${legalConfig.retentionPeriods.webAccessLogs}`,
        `• Historias clínicas de pacientes: ${legalConfig.retentionPeriods.clinicalRecords}`,
      ],
    },
    {
      id: 'derechos',
      title: '6. Ejercicio de Derechos y Reclamación ante la AEPD',
      paragraphs: [
        'El usuario puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión (derecho al olvido), limitación del tratamiento, portabilidad y oposición (derechos ARSULPO), así como revocar el consentimiento prestado, remitiendo una solicitud escrita acompañada de copia de su documento de identidad a:',
        `• Correo electrónico de protección de datos: ${legalConfig.identification.dpoEmail}`,
        `• Dirección postal: ${legalConfig.identification.registeredAddress}`,
        'Si el usuario considera que el tratamiento de sus datos infringe la normativa europea o estatal, tiene el derecho inalienable a presentar una reclamación formal ante la Agencia Española de Protección de Datos (AEPD) a través de su sede electrónica: https://www.aepd.es o en su sede de Calle Jorge Juan, 6, 28001 Madrid.',
      ],
    },
  ],
};

export const cookiesContent = {
  title: 'Política de Cookies y Guía de Consentimiento',
  law: 'Directiva 2002/58/CE (ePrivacy), Artículo 22.2 LSSI-CE y Guía de Cookies AEPD',
  sections: [
    {
      id: 'que-son-cookies',
      title: '1. ¿Qué son las Cookies y qué Tecnologías Utilizamos?',
      paragraphs: [
        'Las cookies y los elementos de almacenamiento local (Local Storage) son pequeños archivos de texto que se descargan en el navegador del usuario al acceder a determinadas plataformas web con la finalidad de recordar sus preferencias de navegación y garantizar la seguridad técnica de la sesión.',
        'Este sitio web no utiliza técnicas invasivas ni rastreadores publicitarios entre sitios (cross-site tracking). Toda la información recogida por herramientas de medición agregada se procesa conforme a las directrices de minimización de datos.',
      ],
    },
    {
      id: 'tipologias',
      title: '2. Clasificación de Cookies por Finalidad',
      paragraphs: [
        'a) Cookies Técnicas y Estrictamente Necesarias (Exentas de consentimiento): Imprescindibles para la comunicación entre el equipo del usuario y la red, recordar la elección de consentimiento de cookies y garantizar la carga asíncrona de recursos 3D y fuentes tipográficas. No pueden desactivarse.',
        'b) Cookies Analíticas y de Rendimiento (Requieren consentimiento explícito): Permiten contabilizar el número de visitantes únicos, medir el rendimiento del renderizado WebGL e identificar posibles cuellos de botella en la navegación. Sólo se activan si el usuario pulsa expresamente "Aceptar todas" o las autoriza en el panel de configuración.',
        'c) Cookies de Contenido Externo e Incrustaciones (Mapas y vídeos): El plano interactivo de situación de la clínica utiliza un mapa vectorial SVG estático que no transfiere datos a terceros. Sólo si el usuario pulsa voluntariamente el botón "Cargar Google Maps interactivo", se transfieren datos a Google LLC.',
      ],
    },
    {
      id: 'inventario-cookies',
      title: '3. Inventario Detallado de Tecnologías de Almacenamiento',
      cookiesTable: [
        {
          name: brandConfig.cookieConsentKey,
          provider: `Propio (${brandConfig.shortName})`,
          purpose: 'Almacena las preferencias de consentimiento del usuario (técnicas, analíticas).',
          duration: '12 meses',
          type: 'Técnica / Necesaria',
        },
        {
          name: '_ga / _ga_* (Google Analytics 4)',
          provider: 'Google LLC (EE.UU. / UE)',
          purpose: 'Métricas agregadas y anonimizadas de navegación mediante Consent Mode v2.',
          duration: '14 meses (según configuración)',
          type: 'Analítica (Opcional, requiere consentimiento)',
        },
      ],
    },
    {
      id: 'revocacion-y-control',
      title: '4. Cómo Configurar o Revocar el Consentimiento en Cualquier Momento',
      paragraphs: [
        'El usuario puede modificar o revocar su consentimiento en cualquier momento haciendo clic en el enlace permanente "Configurar cookies" situado en el pie de página (footer) de este sitio web.',
        'Asimismo, puede bloquear o eliminar las cookies instaladas en su equipo mediante las opciones de configuración de su navegador web habitual (Chrome, Safari, Firefox, Edge).',
      ],
    },
  ],
};
