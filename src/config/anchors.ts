export interface AnnotationAnchor {
  id: string;
  orderNumber: number; // 1, 2, 3 para modo móvil
  badge: string;
  title: string;
  description: string;
  targetMesh: 'upper' | 'lower';
  // Coordenadas locales en el espacio de la arcada (metros)
  localPosition: [number, number, number];
  // Normal de la superficie local para culling de cara trasera
  normal: [number, number, number];
  // Lado preferido para el cartel en pantalla ('left' | 'right')
  preferredSide: 'left' | 'right';
  // Offset del codo de la línea guía SVG [dx, dy]
  lineOffset: [number, number];
}

export const CLINICAL_ANCHORS: AnnotationAnchor[] = [
  {
    id: 'gingival-margin',
    orderNumber: 1,
    badge: 'Ajuste Gingival',
    title: 'Borde recortado a medida',
    description: 'Ajuste milimétrico al festoneado de la encía sin presiones ni rozaduras.',
    targetMesh: 'upper',
    // Borde gingival superior (margen festoneado de la férula)
    localPosition: [0.18, 0.28, 0.44],
    normal: [0.22, 0.68, 0.70],
    preferredSide: 'right',
    lineOffset: [70, -45],
  },
  {
    id: 'vestibular-incisor',
    orderNumber: 2,
    badge: 'Transmisión Bioelástica',
    title: 'Fuerza suave y constante',
    description: 'Micro-desplazamiento fisiológico continuo de 0,2 mm por férula.',
    targetMesh: 'upper',
    // Cara vestibular incisivo superior
    localPosition: [-0.06, 0.08, 0.56],
    normal: [-0.08, 0.15, 0.98],
    preferredSide: 'left',
    lineOffset: [-75, -35],
  },
  {
    id: 'occlusal-plane',
    orderNumber: 3,
    badge: 'Guía Funcional',
    title: 'Encaje con tu mordida',
    description: 'Contacto oclusal equilibrado y preservación de la función masticatoria.',
    targetMesh: 'lower',
    // Cara oclusal de la arcada inferior
    localPosition: [0.38, 0.12, 0.15],
    normal: [0.18, 0.94, 0.28],
    preferredSide: 'right',
    lineOffset: [80, 40],
  },
];
