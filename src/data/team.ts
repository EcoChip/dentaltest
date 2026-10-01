export interface Doctor {
  id: string;
  name: string;
  role: string;
  collegiate: string;
  specialties: string[];
  education: string[];
  bio: string;
  isPlaceholder?: boolean;
}

export const medicalTeam: Doctor[] = [
  {
    id: "dr-volta",
    name: "Dr. Alejandro Volta Morales",
    role: "Director Médico · Especialista en Ortodoncia Digital y Biomecánica",
    collegiate: "Col. Odontólogos de Madrid Nº 28004921",
    specialties: [
      "Ortodoncia Invisible (Invisalign® Diamond Apex Provider)",
      "Planificación Digital Tridimensional ClinCheck®",
      "Rehabilitación Oclusal Compleja"
    ],
    education: [
      "Licenciado en Odontología por la Universidad Complutense de Madrid (UCM)",
      "Máster Oficial en Ortodoncia y Ortopedia Dentofacial (3 años)",
      "Miembro Diplomado de la Sociedad Española de Ortodoncia (SEDO)",
      "Certificación Internacional Invisalign Diamond Apex (Top 1% Europa)"
    ],
    bio: "Más de 18 años dedicados en exclusiva al estudio del movimiento dentario y la estética facial. Pionero en España en el empleo de escáneres intraorales de alta velocidad y biomecánica sin aparatología fija. Su enfoque combina la máxima precisión técnica con una conservación estricta de la estructura biológica.",
    isPlaceholder: true
  },
  {
    id: "dra-navarro",
    name: "Dra. Beatriz Navarro Gómez",
    role: "Especialista en Estética Dental Biomimética y Prótesis Fija",
    collegiate: "Col. Odontólogos de Madrid Nº 28006114",
    specialties: [
      "Carillas Cerámicas Feldespáticas de Mínima Preparación",
      "Mockup y Diseño Digital de Sonrisa (DSD)",
      "Odontología Adhesiva Restauradora"
    ],
    education: [
      "Licenciada en Odontología por la Universidad de Barcelona (UB)",
      "Máster en Odontología Restauradora y Estética Dental (UCM)",
      "Miembro Activo de la Sociedad Española de Prótesis Estomatológica y Estética (SEPES)"
    ],
    bio: "Especializada en microestética dental y estratificación cerámica. Trabaja en estrecha coordinación con laboratorios maestros para reproducir la translucidez, textura y fluorescencia natural del esmalte dental sin tallados invasivos.",
    isPlaceholder: true
  },
  {
    id: "dr-alvarez",
    name: "Dr. Marcos Álvarez Serrano",
    role: "Cirujano Oral · Implantología Guiada y Periodoncia",
    collegiate: "Col. Odontólogos de Madrid Nº 28005390",
    specialties: [
      "Implantología Inmediata y Regeneración Tisular",
      "Cirugía Guiada Estereolitográfica por Ordenador",
      "Microcirugía Plástica Periodontal y Gingival"
    ],
    education: [
      "Licenciado en Odontología por la Universidad Complutense de Madrid",
      "Especialista en Cirugía Bucal e Implantes (Hospital Clínico San Carlos)",
      "Miembro de la Sociedad Española de Periodoncia y Osteointegración (SEPA)"
    ],
    bio: "Dedicado a la rehabilitación funcional mediante implantes osteointegrados y el tratamiento de patologías periodontales. Su protocolo clínico prioriza incisiones mínimas y tiempos quirúrgicos breves para un postoperatorio confortable.",
    isPlaceholder: true
  }
];
